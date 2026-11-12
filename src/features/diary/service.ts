// 일기 화면이 호출하는 유일한 진입점.
// 미션·달력은 실서버, 헤더·일기 작성은 아직 mock.
import { fetchDiaryCalendar } from './calendarAdapter';
import { generateMissions, getMissionDay, getMyStats, setMissionDone } from '@/api';
import type { MissionDay, Stats } from '@/api';
import { mockCreateDiaryEntry, mockGetDiaryHeader } from './mock';
import type {
  CreateDiaryEntryInput,
  DiaryCalendarResponse,
  DiaryEntry,
  DiaryHeaderResponse,
  Mission,
} from './types';

export function getDiaryHeader(): Promise<DiaryHeaderResponse> {
  return mockGetDiaryHeader();
}

// params 를 생략하면 서버가 정한 "이번 달"을 돌려준다
export function getDiaryCalendar(params?: {
  year: number;
  month: number;
}): Promise<DiaryCalendarResponse> {
  // 서버 GET /api/diaries 로 월 범위를 조회해 화면 모양으로 변환한다. (변환은 calendarAdapter.ts)
  return fetchDiaryCalendar(params);
}

export function createDiaryEntry(input: CreateDiaryEntryInput): Promise<DiaryEntry> {
  return mockCreateDiaryEntry(input);
}

// 진행 중인 generate 가 있으면 같은 Promise 를 공유한다. (탭을 빠르게 오가도 한 번만 호출)
let generateInFlight: Promise<MissionDay> | null = null;

export function generateTodayMissions(): Promise<MissionDay> {
  generateInFlight ??= generateMissions().finally(() => {
    generateInFlight = null;
  });
  return generateInFlight;
}

// 오늘 미션(조회만)과 stats 를 병렬 조회. generated 가 false 면 호출한 쪽이 generateTodayMissions 를 부른다
export async function getTodayMissions(): Promise<{ day: MissionDay; stats: Stats }> {
  const [day, stats] = await Promise.all([getMissionDay(), getMyStats()]);
  return { day, stats };
}

// 미션 체크/해제. stats 는 응답의 reward.stats 를 쓰고, 없으면 다시 조회한다. 조회에 실패하면 null (체크는 유지)
export async function toggleMission(
  id: string,
  done: boolean,
): Promise<{ mission: Mission; stats: Stats | null }> {
  const result = await setMissionDone(id, done);
  if (result.reward) return { mission: result.mission, stats: result.reward.stats };
  try {
    return { mission: result.mission, stats: await getMyStats() };
  } catch {
    return { mission: result.mission, stats: null };
  }
}
