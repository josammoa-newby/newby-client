// 일기 화면이 호출하는 유일한 진입점.
// 실서버 연동 시 이 파일의 내부만 src/api 클라이언트 호출로 교체한다. 함수 시그니처와 반환 타입은 바꾸지 않는다.
import {
  mockCreateDiaryEntry,
  mockGetDiaryCalendar,
  mockGetDiaryHeader,
  mockGetMissions,
  mockToggleMission,
} from './mock';
import type {
  CreateDiaryEntryInput,
  DiaryCalendarResponse,
  DiaryEntry,
  DiaryHeaderResponse,
  MissionsResponse,
  ToggleMissionInput,
  ToggleMissionResponse,
} from './types';

export function getDiaryHeader(): Promise<DiaryHeaderResponse> {
  return mockGetDiaryHeader();
}

// params 를 생략하면 서버가 정한 "이번 달"을 돌려준다
export function getDiaryCalendar(params?: {
  year: number;
  month: number;
}): Promise<DiaryCalendarResponse> {
  return mockGetDiaryCalendar(params);
}

export function createDiaryEntry(input: CreateDiaryEntryInput): Promise<DiaryEntry> {
  return mockCreateDiaryEntry(input);
}

export function getMissions(): Promise<MissionsResponse> {
  return mockGetMissions();
}

export function toggleMission(input: ToggleMissionInput): Promise<ToggleMissionResponse> {
  return mockToggleMission(input);
}
