import type { DiaryHeaderResponse } from './types';

// 서버가 준비되기 전까지 types.ts 의 응답을 그대로 돌려주는 임시 데이터/함수.
// 화면은 이 파일을 직접 import 하지 않고 service.ts 만 거친다.

const MIN_DELAY_MS = 300;
const MAX_DELAY_MS = 600;

function delay<T>(data: T): Promise<T> {
  const ms = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

const USER = { id: 'user-1', nickname: '미림' };

export async function mockGetDiaryHeader(): Promise<DiaryHeaderResponse> {
  return delay({ userId: USER.id, hasUnreadNotification: true });
}
