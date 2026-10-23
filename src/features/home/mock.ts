import type { ImageSource } from 'expo-image';

// 서버가 준비되기 전까지 mock 응답을 돌려주는 홈 화면 API.
// 서버 연동 시 각 함수 내부만 실제 요청으로 교체한다.

function delay<T>(data: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export type VoteChoice = 'O' | 'X';

export type HomeVote = {
  id: string;
  question: string;
  totalCount: number;
  myChoice: VoteChoice | null;
};

export type PopularPost = {
  id: string;
  thumbnail: ImageSource | null; // 서버 연동 시 { uri } 로 교체
  authorName: string;
  title: string;
  likeCount: number;
  commentCount: number;
};

export type HomeData = {
  user: { nickname: string };
  hasUnreadNotification: boolean;
  tip: { text: string };
  vote: HomeVote;
  popularPosts: PopularPost[];
};

// 세션 동안 투표 상태를 유지하기 위한 mock 서버 상태 (실제 서버에서는 DB가 담당)
let hasUnreadNotification = true;

let voteState: HomeVote = {
  id: 'vote-1',
  question: '퇴근 직전 받은 업무,\n야근해서라도 우선 끝내야 한다?',
  totalCount: 60432,
  myChoice: null,
};

const POPULAR_POSTS: PopularPost[] = [
  {
    id: 'post-1',
    thumbnail: require('../../../assets/home/post-thumb-1.jpg'),
    authorName: '김사원',
    title: '카카오 처럼 포트폴리오 만드는 방법',
    likeCount: 1500,
    commentCount: 95,
  },
  {
    id: 'post-2',
    thumbnail: require('../../../assets/home/post-thumb-2.jpg'),
    authorName: '김신입',
    title: '상사에게 부당한 지시를 받았을 때',
    likeCount: 1200,
    commentCount: 154,
  },
  {
    id: 'post-3',
    thumbnail: null,
    authorName: '이주임',
    title: '첫 보고서, 퇴짜만 세 번 맞은 이야기',
    likeCount: 980,
    commentCount: 61,
  },
  {
    id: 'post-4',
    thumbnail: null,
    authorName: '박사원',
    title: '점심시간에 혼자 밥 먹어도 괜찮을까요',
    likeCount: 742,
    commentCount: 48,
  },
  {
    id: 'post-5',
    thumbnail: null,
    authorName: '최대리',
    title: '신입 때 알았더라면 좋았을 엑셀 단축키 모음',
    likeCount: 2100,
    commentCount: 133,
  },
];

const MOCK_DELAY_MS = 400;

// TODO: 서버 연동 시 내부를 실제 요청으로 교체
export async function getHome(): Promise<HomeData> {
  return delay(
    {
      user: { nickname: '미림' },
      hasUnreadNotification,
      tip: { text: '다른 신입들은 어떻게 질문할까?' },
      vote: voteState,
      popularPosts: POPULAR_POSTS,
    },
    MOCK_DELAY_MS,
  );
}

const MOCK_VOTE_DELAY_MS = 300;

// TODO: 서버 연동 시 내부를 실제 요청으로 교체
export async function submitVote(
  voteId: string,
  choice: VoteChoice,
): Promise<{ vote: HomeVote }> {
  voteState = {
    ...voteState,
    totalCount: voteState.totalCount + (voteState.myChoice ? 0 : 1),
    myChoice: choice,
  };
  return delay({ vote: voteState }, MOCK_VOTE_DELAY_MS);
}

// TODO: 서버 연동 시 내부를 실제 요청으로 교체
export async function markNotificationsRead(): Promise<void> {
  hasUnreadNotification = false;
  return delay(undefined, MOCK_VOTE_DELAY_MS);
}
