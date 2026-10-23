import { useCallback } from 'react';

import { getVoteResult } from './service';
import { useAsyncData } from './useAsyncData';

export function useVoteResult(voteId: string) {
  const loader = useCallback(() => getVoteResult(voteId), [voteId]);
  const { data, loading, error, retry } = useAsyncData(loader);
  return { result: data, loading, error, retry };
}
