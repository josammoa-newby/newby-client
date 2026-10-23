// 서버(DB) 응답과 같다고 가정한 타입. 날짜는 ISO 문자열.

export type VoteChoice = 'O' | 'X';

export type VoteOption = {
  id: string;
  choice: VoteChoice;
  label: string;
};

export type Vote = {
  id: string;
  question: string;
  voteDate: string; // 질문 날짜 (YYYY-MM-DD)
  options: VoteOption[];
  totalCount: number;
  myChoice: VoteChoice | null;
  createdAt: string;
};

export type VoteOptionResult = {
  choice: VoteChoice;
  label: string;
  count: number;
};

export type ReactionType = 'laugh' | 'sad' | 'angry';

export type VoteComment = {
  id: string;
  voteId: string;
  author: { id: string; nickname: string; choice: VoteChoice };
  content: string;
  reactionTypes: ReactionType[]; // 많이 달린 순
  topReactorName: string;
  reactionCount: number;
  replyCount: number;
  createdAt: string;
};

export type TodayVoteResponse = { vote: Vote };

export type SubmitVoteResponse = { vote: Vote };

export type VoteResultResponse = {
  vote: Vote;
  results: VoteOptionResult[];
  comments: VoteComment[];
};
