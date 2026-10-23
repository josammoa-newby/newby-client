import type {
  SubmitVoteResponse,
  TodayVoteResponse,
  Vote,
  VoteChoice,
  VoteComment,
  VoteResultResponse,
} from './types';

// 서버가 준비되기 전까지 types.ts 의 응답을 그대로 돌려주는 임시 데이터/함수.
// 화면은 이 파일을 직접 import 하지 않고 service.ts 만 거친다.

const MIN_DELAY_MS = 300;
const MAX_DELAY_MS = 600;

function delay<T>(data: T): Promise<T> {
  const ms = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// 세션 동안 투표 상태를 유지하기 위한 mock 서버 상태 (실제 서버에서는 DB가 담당)
const VOTE_ID = 'vote-1';
const counts: Record<VoteChoice, number> = { O: 40290, X: 20142 };
let myChoice: VoteChoice | null = null;

function buildVote(): Vote {
  return {
    id: VOTE_ID,
    question: '퇴근 직전 받은 업무,\n야근해서라도 우선 끝내야 한다?',
    voteDate: '2026-09-27',
    options: [
      { id: 'vote-1-o', choice: 'O', label: '그렇다' },
      { id: 'vote-1-x', choice: 'X', label: '아니다' },
    ],
    totalCount: counts.O + counts.X,
    myChoice,
    createdAt: '2026-09-27T00:00:00.000Z',
  };
}

const HOUR_MS = 60 * 60 * 1000;

function buildComments(): VoteComment[] {
  const createdAt = new Date(Date.now() - 2 * HOUR_MS).toISOString();
  const content = '당연히 상사가 시켰으면 해야하는 거 아닌가요? 저는 일단 끝내고 퇴근하는 편이에요.';
  return [
    {
      id: 'comment-1',
      voteId: VOTE_ID,
      author: { id: 'user-2', nickname: '꼰희', choice: 'O' },
      content,
      reactionTypes: ['laugh', 'sad', 'angry'],
      topReactorName: '미미미누',
      reactionCount: 57,
      replyCount: 4,
      createdAt,
    },
    {
      id: 'comment-2',
      voteId: VOTE_ID,
      author: { id: 'user-3', nickname: '미커톤', choice: 'O' },
      content,
      reactionTypes: ['laugh', 'sad', 'angry'],
      topReactorName: '미미미누',
      reactionCount: 57,
      replyCount: 4,
      createdAt,
    },
  ];
}

export async function mockGetTodayVote(): Promise<TodayVoteResponse> {
  return delay({ vote: buildVote() });
}

export async function mockSubmitVote(
  voteId: string,
  choice: VoteChoice,
): Promise<SubmitVoteResponse> {
  if (voteId !== VOTE_ID) throw new Error('존재하지 않는 투표예요');
  if (myChoice) throw new Error('이미 투표했어요');
  counts[choice] += 1;
  myChoice = choice;
  return delay({ vote: buildVote() });
}

export async function mockGetVoteResult(voteId: string): Promise<VoteResultResponse> {
  if (voteId !== VOTE_ID) throw new Error('존재하지 않는 투표예요');
  if (!myChoice) throw new Error('투표 후에 결과를 볼 수 있어요');
  const vote = buildVote();
  return delay({
    vote,
    results: vote.options.map(({ choice, label }) => ({ choice, label, count: counts[choice] })),
    comments: buildComments(),
  });
}
