import { useLocalSearchParams } from 'expo-router';

import { ResultScreen } from '@/features/vote/ResultScreen';

// 오늘의 투표 결과 (Figma 17:1475)
export default function VoteResultRoute() {
  const { voteId } = useLocalSearchParams<{ voteId?: string }>();
  return <ResultScreen voteId={voteId ?? ''} />;
}
