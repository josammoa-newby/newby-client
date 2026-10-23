import { request } from './client';

export type PersonaMode = 'quick' | 'full';

// 서버의 성향 축 이름
export type PersonaAxis = 'directness' | 'control' | 'reporting' | 'warmth' | 'speed' | 'stability';

export type PersonaQuestionOption = {
  key: string;
  text: string;
};

// 리커트 문항은 { id, text }, 상황형 문항은 options 가 있다. (채점 정보는 서버가 내려주지 않는다)
export type PersonaQuestion = {
  id: string;
  text: string;
  options?: PersonaQuestionOption[];
};

export type LikertQuestion = { id: string; text: string };
export type SituationQuestion = { id: string; text: string; options: PersonaQuestionOption[] };

// 상사 성향 질문지. quick 12문항, full 28문항
export function getPersonaQuestions(mode: PersonaMode): Promise<PersonaQuestion[]> {
  return request<PersonaQuestion[]>(`/api/persona/questions?mode=${encodeURIComponent(mode)}`, {
    auth: true,
  });
}
