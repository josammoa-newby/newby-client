import { request } from './client';
import type { AwardResult } from './stats';

// 서버 missionService 의 응답. date 는 'YYYY-MM-DD'
export type ServerMission = {
  id: string;
  date: string;
  title: string;
  done: boolean;
  xp: number;
  createdAt: string;
};

export type MissionDay = {
  date: string;
  missions: ServerMission[];
  doneCount: number;
  total: number;
};

export type CreateMissionInput = {
  // 1~100자
  title: string;
  // 1~100 정수, 기본 10
  xp?: number;
  // 'YYYY-MM-DD'. 없으면 KST 오늘
  date?: string;
};

export type MissionDoneResult = {
  mission: ServerMission;
  // done 값이 실제로 바뀌었는지. 바뀌지 않았으면 reward 는 null
  changed: boolean;
  // 체크하면 +xp, 해제하면 -xp 가 반영된 결과
  reward: AwardResult | null;
};

const missionPath = (id: string) => `/api/missions/${encodeURIComponent(id)}`;

// 날짜별 미션. date 가 없으면 KST 오늘이고, 오늘 미션이 없으면 서버가 기본 미션을 만들어 준다.
export function getMissionDay(date?: string): Promise<MissionDay> {
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  return request<MissionDay>(`/api/missions${query}`, { auth: true });
}

export function createMission(input: CreateMissionInput): Promise<ServerMission> {
  return request<ServerMission>('/api/missions', { method: 'POST', body: input, auth: true });
}

// 완료 체크 / 해제
export function setMissionDone(id: string, done: boolean): Promise<MissionDoneResult> {
  return request<MissionDoneResult>(missionPath(id), { method: 'PATCH', body: { done }, auth: true });
}

export function deleteMission(id: string): Promise<{ id: string }> {
  return request<{ id: string }>(missionPath(id), { method: 'DELETE', auth: true });
}
