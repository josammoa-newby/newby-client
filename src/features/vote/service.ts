// 오늘의 투표 화면이 호출하는 유일한 진입점.
// 실서버 연동 시 이 파일의 내부만 src/api 클라이언트 호출로 교체한다. 함수 시그니처와 반환 타입은 바꾸지 않는다.
import { mockGetTodayVote, mockGetVoteResult, mockSubmitVote } from './mock';
import type {
  SubmitVoteResponse,
  TodayVoteResponse,
  VoteChoice,
  VoteResultResponse,
} from './types';

export function getTodayVote(): Promise<TodayVoteResponse> {
  return mockGetTodayVote();
}

export function submitVote(voteId: string, choice: VoteChoice): Promise<SubmitVoteResponse> {
  return mockSubmitVote(voteId, choice);
}

export function getVoteResult(voteId: string): Promise<VoteResultResponse> {
  return mockGetVoteResult(voteId);
}
