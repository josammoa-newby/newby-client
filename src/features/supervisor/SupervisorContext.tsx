import { createContext, useContext, useState, type ReactNode } from 'react';

import type { QuestionMode, QuestionSet, Supervisor, WrittenAnswers } from './mock';

export type SupervisorForm = {
  nickname: string;
  position: string;
  channel: string;
  mode: QuestionMode | '';
  questions: QuestionSet | null;
  likertAnswers: Record<string, number>;
  scenarioAnswers: Record<string, string>;
  written: WrittenAnswers;
  result: Supervisor | null;
};

const INITIAL_WRITTEN: WrittenAnswers = {
  catchphrases: [],
  angerSignals: '',
  happySignals: '',
  dislikes: '',
  values: '',
  examples: [],
};

const INITIAL_FORM: SupervisorForm = {
  nickname: '',
  position: '',
  channel: '',
  mode: '',
  questions: null,
  likertAnswers: {},
  scenarioAnswers: {},
  written: INITIAL_WRITTEN,
  result: null,
};

type SupervisorContextValue = {
  form: SupervisorForm;
  update: (patch: Partial<SupervisorForm>) => void;
  reset: () => void;
};

const SupervisorContext = createContext<SupervisorContextValue | null>(null);

// 상사 성향 질문지 단계 간 입력값 공유 (supervisor 라우트 전용)
export function SupervisorProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<SupervisorForm>(INITIAL_FORM);

  const value: SupervisorContextValue = {
    form,
    update: (patch) => setForm((prev) => ({ ...prev, ...patch })),
    reset: () => setForm(INITIAL_FORM),
  };

  return <SupervisorContext.Provider value={value}>{children}</SupervisorContext.Provider>;
}

export function useSupervisor() {
  const context = useContext(SupervisorContext);
  if (!context) throw new Error('useSupervisor 는 SupervisorProvider 안에서만 사용할 수 있어요');
  return context;
}
