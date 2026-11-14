import { useCallback, useEffect, useRef, useState } from 'react';

import { apiErrorMessage, sendFeedback } from '@/api';
import { ApiError } from '@/api/errors';

// idle: 아직 안 남김 / inputting: 👎 를 눌러 사유 입력 중 / sending / done / error: 전송 실패(재시도 가능)
export type FeedbackStatus = 'idle' | 'inputting' | 'sending' | 'done' | 'error';

export type FeedbackResultView = {
  helpful: boolean;
  // 서버가 학습 메모를 만들었으면 그 문장
  newNote: string | null;
  // 서버가 상사 성향 점수를 보정했는지 (scoreAdjusted 가 null 이 아니면 true)
  scoreAdjusted: boolean;
  // 이미 피드백이 있어서(409) done 으로 처리한 경우
  alreadyExists: boolean;
};

export type FeedbackState = {
  status: FeedbackStatus;
  // 마지막으로 시도한 선택. 실패했을 때 어떤 재시도 UI를 보일지 정한다
  helpful: boolean | null;
  // 👎 사유 입력값. 실패해도 유지한다
  reason: string;
  error: string | null;
  result: FeedbackResultView | null;
};

export const IDLE_FEEDBACK: FeedbackState = {
  status: 'idle',
  helpful: null,
  reason: '',
  error: null,
  result: null,
};

// 답변(AI 메시지) 단위 피드백 상태. 대화 전송(useAiChat)과 독립이라 피드백 실패가 대화를 막지 않는다
export function useAiFeedback() {
  const [states, setStates] = useState<Record<string, FeedbackState>>({});
  // 상태 반영 전의 연타를 막는 동기 잠금 (메시지 id 단위)
  const sending = useRef(new Set<string>());
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const get = useCallback((messageId: string): FeedbackState => states[messageId] ?? IDLE_FEEDBACK, [states]);

  const patch = useCallback((messageId: string, next: Partial<FeedbackState>) => {
    if (!mounted.current) return;
    setStates((prev) => ({ ...prev, [messageId]: { ...(prev[messageId] ?? IDLE_FEEDBACK), ...next } }));
  }, []);

  // 👎: 사유 입력 칸을 연다
  const openReason = useCallback(
    (messageId: string) => patch(messageId, { status: 'inputting', helpful: false, error: null }),
    [patch],
  );

  const setReason = useCallback((messageId: string, reason: string) => patch(messageId, { reason }), [patch]);

  const submit = useCallback(
    async (messageId: string, helpful: boolean, reason: string = '') => {
      if (sending.current.has(messageId)) return;
      sending.current.add(messageId);
      patch(messageId, { status: 'sending', helpful, error: null });
      try {
        const actualReaction = reason.trim();
        const result = await sendFeedback(
          messageId,
          helpful ? { helpful: true } : { helpful: false, ...(actualReaction ? { actualReaction } : {}) },
        );
        patch(messageId, {
          status: 'done',
          result: {
            helpful,
            newNote: result.newNote,
            scoreAdjusted: result.scoreAdjusted !== null,
            alreadyExists: false,
          },
        });
      } catch (e) {
        if (e instanceof ApiError && e.code === 'FEEDBACK_ALREADY_EXISTS') {
          // 이미 남긴 피드백은 에러가 아니라 완료로 본다
          patch(messageId, {
            status: 'done',
            result: { helpful, newNote: null, scoreAdjusted: false, alreadyExists: true },
          });
        } else {
          patch(messageId, { status: 'error', error: apiErrorMessage(e) });
        }
      } finally {
        sending.current.delete(messageId);
      }
    },
    [patch],
  );

  return { get, openReason, setReason, submit };
}
