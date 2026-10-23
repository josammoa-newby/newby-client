import type {
  CreateDiaryEntryInput,
  DiaryCalendarResponse,
  DiaryEntry,
  DiaryHeaderResponse,
  Mission,
  MissionLevel,
  MissionsResponse,
  ToggleMissionInput,
  ToggleMissionResponse,
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

let level: MissionLevel = { level: 4, name: '적응 단계', currentXp: 720, nextLevelXp: 900 };

let missions: Mission[] = [
  { id: 'mission-1', title: '회의 내용 3줄로 요약해 남기기', xp: 40, completed: false, completedAt: null, createdAt: '2026-09-27T00:00:00.000Z' },
  { id: 'mission-2', title: '퇴근 전 내일 할 일 정리하기', xp: 20, completed: false, completedAt: null, createdAt: '2026-09-27T00:00:00.000Z' },
  { id: 'mission-3', title: '모르는 업무는 질문하기', xp: 30, completed: true, completedAt: '2026-09-27T01:00:00.000Z', createdAt: '2026-09-27T00:00:00.000Z' },
  { id: 'mission-4', title: '보고할 때 결론부터 말하기', xp: 30, completed: true, completedAt: '2026-09-27T02:00:00.000Z', createdAt: '2026-09-27T00:00:00.000Z' },
];

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

export async function mockGetMissions(): Promise<MissionsResponse> {
  return delay({
    banner: { title: '오늘의 습관을 만들어보세요.', subtitle: '하나씩 클리어해봐요.' },
    level,
    missions,
  });
}

export async function mockToggleMission(input: ToggleMissionInput): Promise<ToggleMissionResponse> {
  const target = missions.find((mission) => mission.id === input.id);
  if (!target) throw new Error('mission not found');

  const mission: Mission = {
    ...target,
    completed: input.completed,
    completedAt: input.completed ? new Date().toISOString() : null,
  };
  missions = missions.map((item) => (item.id === mission.id ? mission : item));

  if (target.completed !== input.completed) {
    const delta = input.completed ? target.xp : -target.xp;
    level = {
      ...level,
      currentXp: Math.min(level.nextLevelXp, Math.max(0, level.currentXp + delta)),
    };
  }
  return delay({ mission, level });
}
