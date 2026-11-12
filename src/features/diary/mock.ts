import type {
  CreateDiaryEntryInput,
  DiaryCalendarResponse,
  DiaryEntry,
  DiaryHeaderResponse,
} from './types';

// 서버가 준비되기 전까지 types.ts 의 응답을 그대로 돌려주는 임시 데이터/함수.
// 화면은 이 파일을 직접 import 하지 않고 service.ts 만 거친다.

const MIN_DELAY_MS = 300;
const MAX_DELAY_MS = 600;

function delay<T>(data: T): Promise<T> {
  const ms = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

const USER = { id: 'user-1', nickname: '미림' };

// 세션 동안 상태를 유지하기 위한 mock 서버 상태 (실제 서버에서는 DB가 담당)
const MOCK_YEAR = 2026;
const MOCK_MONTH = 9;
const MOCK_TODAY = '2026-09-27';

let entries: DiaryEntry[] = [3, 9, 10, 11, 14, 15, 16, 17].map((day) => ({
  id: `entry-${day}`,
  userId: USER.id,
  date: `2026-09-${String(day).padStart(2, '0')}`,
  createdAt: `2026-09-${String(day).padStart(2, '0')}T21:00:00.000Z`,
}));

export async function mockGetDiaryHeader(): Promise<DiaryHeaderResponse> {
  return delay({ userId: USER.id, hasUnreadNotification: true });
}

export async function mockGetDiaryCalendar(params?: {
  year: number;
  month: number;
}): Promise<DiaryCalendarResponse> {
  const year = params?.year ?? MOCK_YEAR;
  const month = params?.month ?? MOCK_MONTH;
  const prefix = `${year}-${String(month).padStart(2, '0')}-`;
  const monthEntries = entries.filter((entry) => entry.date.startsWith(prefix));
  return delay({
    user: USER,
    year,
    month,
    today: MOCK_TODAY,
    recordCount: monthEntries.length,
    entries: monthEntries,
  });
}

export async function mockCreateDiaryEntry(input: CreateDiaryEntryInput): Promise<DiaryEntry> {
  const existing = entries.find((entry) => entry.date === input.date);
  if (existing) return delay(existing);
  const entry: DiaryEntry = {
    id: `entry-${Date.now()}`,
    userId: USER.id,
    date: input.date,
    createdAt: new Date().toISOString(),
  };
  entries = [...entries, entry];
  return delay(entry);
}
