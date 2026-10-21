import { createContext, useContext, useState, type ReactNode } from 'react';

export type SignupForm = {
  name: string;
  id: string;
  // 중복확인을 통과한 아이디. id 와 다르면 다시 확인해야 함
  verifiedId: string;
  password: string;
  passwordConfirm: string;
  email: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
  job: string;
  workStyle: string;
  bossStyle: string;
};

const INITIAL_FORM: SignupForm = {
  name: '',
  id: '',
  verifiedId: '',
  password: '',
  passwordConfirm: '',
  email: '',
  agreeTerms: false,
  agreePrivacy: false,
  agreeMarketing: false,
  job: '',
  workStyle: '',
  bossStyle: '',
};

type SignupContextValue = {
  form: SignupForm;
  update: (patch: Partial<SignupForm>) => void;
  reset: () => void;
};

const SignupContext = createContext<SignupContextValue | null>(null);

// 회원가입 단계 간 입력값 공유 (signup 라우트 전용)
export function SignupProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<SignupForm>(INITIAL_FORM);

  const value: SignupContextValue = {
    form,
    update: (patch) => setForm((prev) => ({ ...prev, ...patch })),
    reset: () => setForm(INITIAL_FORM),
  };

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignup() {
  const context = useContext(SignupContext);
  if (!context) throw new Error('useSignup 은 SignupProvider 안에서만 사용할 수 있어요');
  return context;
}
