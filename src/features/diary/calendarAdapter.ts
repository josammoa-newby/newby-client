import { getMyProfile, listDiaries } from '@/api';
import type { Diary, MyProfile } from '@/api';
import type { DiaryCalendarResponse, DiaryEntry } from './types';

// 서버 일기 목록 -> 일기 달력 화면 모양 변환. 서버 필드와 화면 필드의 변환은 이 파일에서만 한다.
// 서버 날짜 형식: 일기 date 는 'YYYY-MM-DD', createdAt 은 DB 타임스탬프(ISO 8601) 문자열 그대로 쓴다.

// 서버 limit 최대값. 한 달에 일기가 이보다 많으면 월 초 쪽이 잘릴 수 있다.
const MONTH_LIMIT = 100;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// 한국 시간 기준 오늘 'YYYY-MM-DD'
export function todayKst(now: Date = new Date()): string {
  return new Date(now.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

const pad = (n: number) => String(n).padStart(2, '0');

// 해당 월의 첫날~마지막날 'YYYY-MM-DD'
export function monthRange(year: number, month: number): { from: string; to: string } {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return { from: `${year}-${pad(month)}-01`, to: `${year}-${pad(month)}-${pad(lastDay)}` };
}

// 화면의 entries 는 "기록이 있는 날" 하나당 하나다. 같은 날 일기가 여러 개면 가장 먼저 쓴 것을 쓴다.
export function toEntries(diaries: Diary[], userId: string): DiaryEntry[] {
  const firstOfDate = new Map<string, Diary>();
  for (const diary of diaries) {
    const current = firstOfDate.get(diary.date);
    if (!current || diary.createdAt < current.createdAt) firstOfDate.set(diary.date, diary);
  }
  return [...firstOfDate.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((diary) => ({ id: diary.id, userId, date: diary.date, createdAt: diary.createdAt }));
}

export function toDiaryCalendar(input: {
  profile: Pick<MyProfile, 'id' | 'name'>;
  diaries: Diary[];
  year: number;
  month: number;
  today: string;
}): DiaryCalendarResponse {
  const entries = toEntries(input.diaries, input.profile.id);
  return {
    // 서버 프로필에는 별도 닉네임이 없어 이름(name)을 쓴다.
    user: { id: input.profile.id, nickname: input.profile.name },
    year: input.year,
    month: input.month,
    today: input.today,
    recordCount: entries.length,
    entries,
  };
}

// params 를 생략하면 KST 기준 이번 달
export async function fetchDiaryCalendar(params?: { year: number; month: number }): Promise<DiaryCalendarResponse> {
  const today = todayKst();
  const year = params?.year ?? Number(today.slice(0, 4));
  const month = params?.month ?? Number(today.slice(5, 7));
  const { from, to } = monthRange(year, month);

  const [profile, diaries] = await Promise.all([getMyProfile(), listDiaries({ from, to, limit: MONTH_LIMIT })]);
  return toDiaryCalendar({ profile, diaries, year, month, today });
}
