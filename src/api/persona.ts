import { request } from './client';

export type PersonaMode = 'quick' | 'full';

// 서버의 성향 축 이름
export type PersonaAxis = 'directness' | 'control' | 'reporting' | 'warmth' | 'speed' | 'stability';

export type PersonaQuestionOption = {
  key: string;
  text: string;
};

export type LikertQuestion = { id: string; text: string };
export type SituationQuestion = { id: string; text: string; options: PersonaQuestionOption[] };

// 리커트 문항은 { id, text }, 상황형 문항은 options 가 있다. (채점 정보는 서버가 내려주지 않는다)
export type PersonaQuestion = LikertQuestion | SituationQuestion;

// 리커트는 1~5 정수, 상황형은 보기 key('a'~'d')
export type PersonaAnswer = number | string;

export function isSituationQuestion(question: PersonaQuestion): question is SituationQuestion {
  return 'options' in question && Array.isArray(question.options);
}

// 상사 성향 질문지. quick 12문항, full 28문항
export function getPersonaQuestions(mode: PersonaMode): Promise<PersonaQuestion[]> {
  return request<PersonaQuestion[]>(`/api/persona/questions?mode=${encodeURIComponent(mode)}`, {
    auth: true,
  });
}
