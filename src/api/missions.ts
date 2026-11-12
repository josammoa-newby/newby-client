import { request } from './client';
import type { AwardResult } from './stats';

// 서버 missionService 의 응답. date 는 'YYYY-MM-DD'
export type MissionSource = 'ai' | 'default' | 'manual';
export type MissionDifficulty = 'easy' | 'medium' | 'hard';

export type ServerMission = {
  id: string;
  date: string;
  title: string;
  done: boolean;
  xp: number;
  // ai: 일기 분석으로 생성 / default: 기본 미션 / manual: 직접 만듦
  source: MissionSource;
  // 왜 이 미션인지 (60자 이내). ai 미션만 값이 있다
  reason: string | null;
  // 직접 만든 미션은 null
  difficulty: MissionDifficulty | null;
  createdAt: string;
};

export type MissionDay = {
  date: string;
  missions: ServerMission[];
  doneCount: number;
  total: number;
  // 그 날의 자동 생성 미션(ai/default)이 이미 있는지. false 면 generateMissions 를 한 번 호출한다.
  generated: boolean;
};

// AI 때문에 최대 약 30초 걸릴 수 있다
const GENERATE_TIMEOUT_MS = 35000;

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

// KST 오늘의 미션. 조회만 하며 만들지 않는다. generated 가 false 면 generateMissions 를 부른다.
export function getMissionDay(): Promise<MissionDay> {
  return request<MissionDay>('/api/missions', { auth: true });
}

// 오늘 자동 미션 생성. 멱등(이미 있으면 200, 새로 만들면 201). AI 실패 시에도 기본 미션으로 채워 성공한다.
export function generateMissions(): Promise<MissionDay> {
  return request<MissionDay>('/api/missions/generate', {
    method: 'POST',
    auth: true,
    timeoutMs: GENERATE_TIMEOUT_MS,
  });
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
