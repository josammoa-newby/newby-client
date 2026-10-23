import { useCallback, useRef, useState } from 'react';

import { getTodayVote, submitVote } from './service';
import type { Vote, VoteChoice } from './types';
import { useAsyncData } from './useAsyncData';

async function loadTodayVote(): Promise<Vote> {
  const { vote } = await getTodayVote();
  return vote;
}

export function useTodayVote() {
  const { data, loading, error, retry, setData } = useAsyncData(loadTodayVote);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const inFlight = useRef(false);

  // 성공하면 갱신된 투표를 돌려주고, 실패하거나 이미 투표했으면 null. 제출 중 중복 호출은 무시한다
  const submit = useCallback(
    async (choice: VoteChoice): Promise<Vote | null> => {
      if (!data || data.myChoice || inFlight.current) return null;
      inFlight.current = true;
      setSubmitting(true);
      setSubmitError(null);
      try {
        const { vote } = await submitVote(data.id, choice);
        setData(vote);
        return vote;
      } catch (e) {
        setSubmitError(e instanceof Error ? e : new Error(String(e)));
        return null;
      } finally {
        inFlight.current = false;
        setSubmitting(false);
      }
    },
    [data, setData],
  );

  return { vote: data, loading, error, retry, submit, submitting, submitError };
}
