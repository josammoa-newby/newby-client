import { request } from './client';
import type { AwardResult } from './stats';

export type DiarySource = 'manual' | 'ai_message';

// 서버 diaryService 의 응답. date 는 'YYYY-MM-DD', createdAt/updatedAt 은 DB 타임스탬프 문자열
export type Diary = {
  id: string;
  date: string;
  content: string;
  mood: string | null;
  source: DiarySource;
  messageId: string | null;
  createdAt: string;
  updatedAt: string;
};

// 작성 응답: 그날 첫 일기면 경험치 지급 결과(reward), 아니면 null
export type DiaryCreated = Diary & {
  reward: AwardResult | null;
};

export type CreateDiaryInput = {
  // 'YYYY-MM-DD'. 없으면 서버가 KST 오늘로 정한다.
  date?: string;
  // 필수, 앞뒤 공백 제거 후 1~2000자
  content: string;
  // 최대 20자
  mood?: string | null;
  source?: DiarySource;
  // source 가 'ai_message' 일 때 필수 (uuid)
  messageId?: string | null;
};

// 보낸 필드만 수정되고, 최소 1개는 있어야 한다.
export type UpdateDiaryInput = {
  date?: string;
  content?: string;
  mood?: string | null;
};

export type ListDiariesParams = {
  // 'YYYY-MM-DD' (포함)
  from?: string;
  to?: string;
  // 1~100, 기본 30. 날짜 내림차순(같은 날은 최신 작성 순)
  limit?: number;
};

const diaryPath = (id: string) => `/api/diaries/${encodeURIComponent(id)}`;

export function createDiary(input: CreateDiaryInput): Promise<DiaryCreated> {
  return request<DiaryCreated>('/api/diaries', { method: 'POST', body: input, auth: true });
}

export function listDiaries(params: ListDiariesParams = {}): Promise<Diary[]> {
  const query: string[] = [];
  if (params.from) query.push(`from=${encodeURIComponent(params.from)}`);
  if (params.to) query.push(`to=${encodeURIComponent(params.to)}`);
  if (params.limit !== undefined) query.push(`limit=${params.limit}`);
  return request<Diary[]>(`/api/diaries${query.length > 0 ? `?${query.join('&')}` : ''}`, { auth: true });
}

export function getDiary(id: string): Promise<Diary> {
  return request<Diary>(diaryPath(id), { auth: true });
}

export function updateDiary(id: string, patch: UpdateDiaryInput): Promise<Diary> {
  return request<Diary>(diaryPath(id), { method: 'PATCH', body: patch, auth: true });
}

// 삭제하면 그날 일기가 하나도 안 남을 때 첫 일기 경험치가 되돌려진다.
export function deleteDiary(id: string): Promise<{ id: string }> {
  return request<{ id: string }>(diaryPath(id), { method: 'DELETE', auth: true });
}
