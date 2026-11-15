import { useCallback, useEffect, useRef, useState } from 'react';

import { apiErrorMessage, createSession, getSession, listSessions, sendMessage } from '@/api';
import type { SupervisorListItem } from '@/api';
import { ApiError } from '@/api/errors';
import { toAiAnswer } from './adapter';
import { MAX_MESSAGE_LENGTH } from './constants';
import { restoreTurns } from './restore';
import type { AiAnswer, Turn } from './types';

export type { Turn } from './types';

// 대화 복원 상태: idle(복원할 게 없거나 끝남) / loading / error
export type RestoreState = 'idle' | 'loading' | 'error';

const isCode = (e: unknown, code: string) => e instanceof ApiError && e.code === code;

type Options = {
  // 지금 대화할 상사 (useSupervisorSelection). null 이면 대화할 수 없다
  supervisor: SupervisorListItem | null;
  // 서버가 상사를 찾지 못했다고 하면 목록을 다시 확인하게 알린다
  onSupervisorMissing: () => void;
};

// AI 탭의 대화 상태와 로직. 화면(ai.tsx)은 그리기만 한다.
// 상사가 바뀌면 화면/세션을 비우고 그 상사의 가장 최근 세션을 복원한다. 세션 id 는 이 훅의 메모리에 둔다.
export function useAiChat({ supervisor, onSupervisorMissing }: Options) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [restoreState, setRestoreState] = useState<RestoreState>('idle');
  const [restoreError, setRestoreError] = useState<string | null>(null);

  const mounted = useRef(true);
  const supervisorRef = useRef<SupervisorListItem | null>(supervisor);
  supervisorRef.current = supervisor;
  const onMissingRef = useRef(onSupervisorMissing);
  onMissingRef.current = onSupervisorMissing;
  const sessionRef = useRef<{ id: string; supervisorId: string } | null>(null);
  const nextId = useRef(0);
  // 상태 반영 전의 연타를 막는 동기 잠금
  const busy = useRef(false);
  // 가장 최근 복원 요청만 화면에 반영한다 (빠르게 상사를 바꿔도 이전 응답이 덮어쓰지 않게)
  const restoreSeq = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // 가장 최근 세션을 불러와 턴으로 복원한다. 세션이 없으면 빈 상태로 둔다
  const restore = useCallback(async () => {
    const target = supervisorRef.current;
    const seq = ++restoreSeq.current;
    sessionRef.current = null;
    setTurns([]);
    setRestoreError(null);
    if (!target) {
      setRestoreState('idle');
      return;
    }
    setRestoreState('loading');
    try {
      const [latest] = await listSessions({ supervisorId: target.id, limit: 1 });
      if (!latest) {
        if (mounted.current && seq === restoreSeq.current) setRestoreState('idle');
        return;
      }
      const full = await getSession(latest.id);
      if (!mounted.current || seq !== restoreSeq.current) return;
      const restored = restoreTurns(full.messages, target, nextId.current);
      nextId.current += restored.length;
      sessionRef.current = { id: full.session.id, supervisorId: target.id };
      setTurns(restored);
      setRestoreState('idle');
    } catch (e) {
      if (!mounted.current || seq !== restoreSeq.current) return;
      // 복원에 실패해도 입력은 열어 두고 세션 없는 새 대화로 시작할 수 있다
      setRestoreError(apiErrorMessage(e));
      setRestoreState('error');
    }
  }, []);

  const supervisorId = supervisor?.id ?? null;
  useEffect(() => {
    void restore();
  }, [supervisorId, restore]);

  const ensureSession = useCallback(async (target: SupervisorListItem): Promise<string> => {
    if (sessionRef.current?.supervisorId === target.id) return sessionRef.current.id;
    const created = await createSession(target.id);
    sessionRef.current = { id: created.session.id, supervisorId: target.id };
    return created.session.id;
  }, []);

  const ask = useCallback(
    async (question: string): Promise<{ answer: AiAnswer; aiMessageId: string }> => {
      const target = supervisorRef.current;
      if (!target) throw new ApiError('SUPERVISOR_NOT_FOUND', '상사 정보를 찾을 수 없어요');

      let result;
      try {
        result = await sendMessage(await ensureSession(target), question);
      } catch (e) {
        if (!isCode(e, 'SESSION_NOT_FOUND')) throw e;
        // 세션이 없어졌으면 한 번만 새로 만들어 다시 보낸다
        sessionRef.current = null;
        result = await sendMessage(await ensureSession(target), question);
      }

      const payload = result.aiMessage.payload;
      if (!payload) throw new ApiError('AI_RESPONSE_INVALID', 'AI 답변 형식이 올바르지 않아요');
      return { answer: toAiAnswer(payload, target), aiMessageId: result.aiMessage.id };
    },
    [ensureSession],
  );

  const patchTurn = useCallback((id: number, patch: Partial<Turn>) => {
    setTurns((prev) => prev.map((turn) => (turn.id === id ? { ...turn, ...patch } : turn)));
  }, []);

  // retryId 가 있으면 새 턴을 만들지 않고 그 턴의 질문을 같은 세션으로 다시 보낸다
  const run = useCallback(
    async (question: string, retryId?: number) => {
      if (busy.current || !supervisorRef.current) return;
      busy.current = true;
      // 복원 실패 안내는 새 대화를 시작하면 더 이상 필요 없다
      setRestoreError(null);

      let id = retryId;
      if (id === undefined) {
        id = nextId.current++;
        const turnId = id;
        setTurns((prev) => [...prev, { id: turnId, question, status: 'loading' }]);
      } else {
        patchTurn(id, { status: 'loading', error: undefined });
      }

      try {
        const { answer, aiMessageId } = await ask(question);
        if (mounted.current) patchTurn(id, { status: 'done', answer, aiMessageId });
      } catch (e) {
        if (isCode(e, 'SUPERVISOR_NOT_FOUND')) {
          // 상사가 삭제된 경우: 세션을 버리고 목록을 다시 확인한다
          sessionRef.current = null;
          onMissingRef.current();
        }
        if (mounted.current) patchTurn(id, { status: 'error', error: apiErrorMessage(e) });
      } finally {
        busy.current = false;
      }
    },
    [ask, patchTurn],
  );

  const send = useCallback(
    (text: string) => {
      const question = text.trim();
      if (question.length === 0 || question.length > MAX_MESSAGE_LENGTH) return;
      void run(question);
    },
    [run],
  );

  // 실패한 마지막 턴의 질문을 같은 세션으로 다시 보낸다
  const retry = useCallback(
    (turnId: number) => {
      const turn = turns.find((item) => item.id === turnId);
      if (turn?.status === 'error') void run(turn.question, turnId);
    },
    [turns, run],
  );

  // 새 대화: 화면의 대화와 세션 id 를 비운다. 세션은 첫 질문을 보낼 때 새로 만든다
  const startNew = useCallback(() => {
    if (busy.current) return;
    restoreSeq.current += 1; // 진행 중인 복원 응답은 버린다
    sessionRef.current = null;
    setTurns([]);
    setRestoreError(null);
    setRestoreState('idle');
  }, []);

  const last = turns[turns.length - 1];
  const loading = last?.status === 'loading';

  return {
    turns,
    loading,
    restoreState,
    restoreError,
    reload: restore,
    send,
    retry,
    startNew,
  };
}
