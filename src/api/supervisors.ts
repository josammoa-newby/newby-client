import { request } from './client';
import type { PersonaAxis, PersonaMode } from './persona';

export type SupervisorChannel = 'messenger' | 'face' | 'email';

export type SupervisorExample = {
  said: string;
  meant: string;
};

export type CreateSupervisorInput = {
  nickname: string;
  position?: string;
  channel?: SupervisorChannel;
  mode?: PersonaMode;
  // 문항 id -> 값. 리커트는 1~5 정수, 상황형은 'a'~'d'
  answers: Record<string, unknown>;
  catchphrases?: string[];
  angerSignals?: string;
  happySignals?: string;
  dislikes?: string;
  valuesText?: string;
  examples?: SupervisorExample[];
};

// 보낸 필드만 수정된다. 선택 항목은 null 로 보내면 비워진다. answers 는 문항 id 단위로 병합되고,
// mode 는 quick -> full 승격만 가능하다.
export type UpdateSupervisorInput = {
  nickname?: string;
  position?: string | null;
  channel?: SupervisorChannel;
  mode?: PersonaMode;
  answers?: Record<string, unknown>;
  catchphrases?: string[];
  angerSignals?: string | null;
  happySignals?: string | null;
  dislikes?: string | null;
  valuesText?: string | null;
  examples?: SupervisorExample[];
};

export type AxisScore = {
  score: number;
  letter: string;
  strength: 'strong' | 'mild' | 'neutral';
  consistency: number;
};

// 피드백으로 점수가 보정된 기록. dir 은 점수가 이동한 방향
export type SupervisorAdjustment = {
  axis: PersonaAxis;
  dir: 1 | -1;
  createdAt: string;
};

export type Supervisor = {
  id: string;
  nickname: string;
  position: string | null;
  channel: SupervisorChannel;
  mode: PersonaMode;
  code: string;
  typeName: string | null;
  // 측정되지 않은 축(빠른 모드의 speed, stability)은 null
  scores: Record<PersonaAxis, AxisScore | null>;
  // 응답이 엇갈려 확인이 필요한 축 이름
  needsCheck: string[];
  topRules: string[];
  catchphrases: string[];
  angerSignals: string | null;
  happySignals: string | null;
  dislikes: string | null;
  valuesText: string | null;
  examples: SupervisorExample[];
  learnedNotes: string[];
  isDefault: boolean;
  recentAdjustments: SupervisorAdjustment[];
  createdAt: string;
  updatedAt: string;
};

export type SupervisorListItem = {
  id: string;
  nickname: string;
  position: string | null;
  channel: SupervisorChannel;
  code: string;
  typeName: string | null;
  isDefault: boolean;
  createdAt: string;
};

const supervisorPath = (id: string) => `/api/supervisors/${encodeURIComponent(id)}`;

export function createSupervisor(input: CreateSupervisorInput): Promise<Supervisor> {
  return request<Supervisor>('/api/supervisors', { method: 'POST', body: input, auth: true });
}

// 내 상사 목록 (최신순)
export function listSupervisors(): Promise<SupervisorListItem[]> {
  return request<SupervisorListItem[]>('/api/supervisors', { auth: true });
}

export function getSupervisor(id: string): Promise<Supervisor> {
  return request<Supervisor>(supervisorPath(id), { auth: true });
}

export function updateSupervisor(id: string, patch: UpdateSupervisorInput): Promise<Supervisor> {
  return request<Supervisor>(supervisorPath(id), { method: 'PATCH', body: patch, auth: true });
}
