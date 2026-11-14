import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { apiErrorMessage, createSession, listSupervisors, sendMessage } from '@/api';
import type { SupervisorListItem } from '@/api';
import { ApiError } from '@/api/errors';
import { toAiAnswer } from './adapter';
import { MAX_MESSAGE_LENGTH } from './constants';
import type { AiAnswer } from './types';

export type Turn = {
  id: number;
  question: string;
  status: 'loading' | 'done' | 'error';
  answer?: AiAnswer;
  error?: string;
};

// 상사 정보 상태: loading(처음 조회 중) / ready / empty(등록한 상사 없음) / error(조회 실패)
export type SupervisorState = 'loading' | 'ready' | 'empty' | 'error';

const isCode = (e: unknown, code: string) => e instanceof ApiError && e.code === code;

// AI 탭의 상태와 로직. 화면(ai.tsx)은 그리기만 한다.
// 세션 목록 API가 없어 세션 id 는 이 훅의 메모리에만 보관한다. (탭을 떠났다 와도 같은 화면이면 유지)
export function useAiChat() {
  const [supervisor, setSupervisor] = useState<SupervisorListItem | null>(null);
  const [supervisorState, setSupervisorState] = useState<SupervisorState>('loading');
  const [supervisorError, setSupervisorError] = useState<string | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);

  const mounted = useRef(true);
  const supervisorRef = useRef<SupervisorListItem | null>(null);
  const sessionRef = useRef<{ id: string; supervisorId: string } | null>(null);
  const nextId = useRef(0);
  // 상태 반영 전의 연타(칩/전송 버튼)를 막는 동기 잠금
  const busy = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // 기본 상사를 고른다. 기본 상사가 바뀌었으면(id 가 다르면) 세션을 초기화한다
  const loadSupervisor = useCallback(async () => {
    setSupervisorError(null);
    try {
      const list = await listSupervisors();
      if (!mounted.current) return;
      const chosen = list.find((item) => item.isDefault) ?? list[0] ?? null;
      supervisorRef.current = chosen;
      setSupervisor(chosen);
      if (sessionRef.current && sessionRef.current.supervisorId !== chosen?.id) sessionRef.current = null;
      setSupervisorState(chosen ? 'ready' : 'empty');
    } catch (e) {
      if (!mounted.current) return;
      // 이미 상사를 알고 있으면 그대로 쓴다. 처음 조회 실패일 때만 에러 화면
      if (!supervisorRef.current) {
        setSupervisorError(apiErrorMessage(e));
        setSupervisorState('error');
      }
    }
  }, []);

  // 화면이 포커스될 때마다 다시 조회한다 (상사 등록/기본 상사 변경 반영)
  useFocusEffect(
    useCallback(() => {
      void loadSupervisor();
    }, [loadSupervisor]),
  );

  const retryLoadSupervisor = useCallback(() => {
    setSupervisorState('loading');
    void loadSupervisor();
  }, [loadSupervisor]);

  const ensureSession = useCallback(async (target: SupervisorListItem): Promise<string> => {
    if (sessionRef.current) return sessionRef.current.id;
    const created = await createSession(target.id);
    sessionRef.current = { id: created.session.id, supervisorId: target.id };
    return created.session.id;
  }, []);

  const ask = useCallback(
    async (question: string): Promise<AiAnswer> => {
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
      return toAiAnswer(payload, target);
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

      let id = retryId;
      if (id === undefined) {
        id = nextId.current++;
        const turnId = id;
        setTurns((prev) => [...prev, { id: turnId, question, status: 'loading' }]);
      } else {
        patchTurn(id, { status: 'loading', error: undefined });
      }

      try {
        const answer = await ask(question);
        if (mounted.current) patchTurn(id, { status: 'done', answer });
      } catch (e) {
        if (isCode(e, 'SUPERVISOR_NOT_FOUND')) {
          // 상사가 삭제/변경된 경우: 세션을 버리고 목록을 다시 확인한다
          sessionRef.current = null;
          void loadSupervisor();
        }
        if (mounted.current) patchTurn(id, { status: 'error', error: apiErrorMessage(e) });
      } finally {
        busy.current = false;
      }
    },
    [ask, patchTurn, loadSupervisor],
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

  const last = turns[turns.length - 1];
  const loading = last?.status === 'loading';

  return {
    supervisor,
    supervisorState,
    supervisorError,
    retryLoadSupervisor,
    turns,
    loading,
    send,
    retry,
  };
}
