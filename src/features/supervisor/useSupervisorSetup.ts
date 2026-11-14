import { useCallback, useEffect, useRef, useState } from 'react';

import {
  apiErrorMessage,
  createSupervisor,
  getPersonaQuestions,
  isSituationQuestion,
} from '@/api';
import type { PersonaAnswer, PersonaMode, PersonaQuestion, Supervisor } from '@/api';
import { LIKERT_VALUES, NICKNAME_MAX_LENGTH, POSITION_MAX_LENGTH } from './constants';

export type SetupStage = 'loading' | 'loadError' | 'profile' | 'question' | 'result';

type Options = { mode: PersonaMode };

// 문항 하나의 답이 서버 규칙에 맞는지 (리커트 1~5 정수 / 상황형 보기 key)
export function isValidAnswer(question: PersonaQuestion, value: PersonaAnswer | undefined): boolean {
  if (value === undefined) return false;
  if (isSituationQuestion(question)) {
    return typeof value === 'string' && question.options.some((option) => option.key === value);
  }
  return typeof value === 'number' && (LIKERT_VALUES as readonly number[]).includes(value);
}

// 상사 등록 플로우의 상태와 로직. 화면(UI)을 전혀 모르므로 화면을 통째로 바꿔도 이 훅은 그대로 쓴다.
// 문항 수·진행도·검증은 모두 서버가 준 질문 배열 길이 기준이라 mode 가 full(28문항)이어도 코드 수정이 필요 없다.
export function useSupervisorSetup({ mode }: Options) {
  const [questions, setQuestions] = useState<PersonaQuestion[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [position, setPosition] = useState('');
  // 0: 닉네임/직급, 1..total: 문항
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, PersonaAnswer>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<Supervisor | null>(null);
  const mounted = useRef(true);
  // 상태 반영 전의 연타를 막는 동기 잠금
  const submitLock = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadQuestions = useCallback(async () => {
    setLoadError(null);
    setQuestions(null);
    try {
      const list = await getPersonaQuestions(mode);
      if (mounted.current) setQuestions(list);
    } catch (e) {
      if (mounted.current) setLoadError(apiErrorMessage(e));
    }
  }, [mode]);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  const total = questions?.length ?? 0;
  const trimmedNickname = nickname.trim();
  const nicknameValid = trimmedNickname.length >= 1 && trimmedNickname.length <= NICKNAME_MAX_LENGTH;
  const positionValid = position.trim().length <= POSITION_MAX_LENGTH;
  const current = questions && step >= 1 ? (questions[step - 1] ?? null) : null;
  const allAnswered = questions !== null && questions.every((q) => isValidAnswer(q, answers[q.id]));

  let stage: SetupStage;
  if (result) stage = 'result';
  else if (loadError) stage = 'loadError';
  else if (!questions) stage = 'loading';
  else stage = step === 0 ? 'profile' : 'question';

  const isLast = total > 0 && step === total;
  const canNext =
    stage === 'profile'
      ? nicknameValid && positionValid
      : current !== null && isValidAnswer(current, answers[current.id]) && (!isLast || allAnswered);

  const setAnswer = useCallback((id: string, value: PersonaAnswer) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setSubmitError(null);
  }, []);

  const submit = useCallback(async () => {
    if (!questions || submitLock.current || !nicknameValid || !positionValid) return;
    if (!questions.every((q) => isValidAnswer(q, answers[q.id]))) return;
    submitLock.current = true;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const body: Record<string, PersonaAnswer> = {};
      for (const q of questions) body[q.id] = answers[q.id] as PersonaAnswer;
      const trimmedPosition = position.trim();
      const created = await createSupervisor({
        nickname: trimmedNickname,
        // 빈 문자열은 보내지 않는다
        ...(trimmedPosition ? { position: trimmedPosition } : {}),
        mode,
        answers: body,
      });
      if (mounted.current) setResult(created);
    } catch (e) {
      // 답은 그대로 둔 채 에러만 보여준다
      if (mounted.current) setSubmitError(apiErrorMessage(e));
    } finally {
      submitLock.current = false;
      if (mounted.current) setSubmitting(false);
    }
  }, [questions, answers, nicknameValid, positionValid, trimmedNickname, position, mode]);

  const next = useCallback(() => {
    if (!canNext || submitting) return;
    if (isLast) void submit();
    else setStep((prev) => prev + 1);
  }, [canNext, submitting, isLast, submit]);

  const prev = useCallback(() => {
    if (submitting) return;
    setSubmitError(null);
    setStep((value) => Math.max(0, value - 1));
  }, [submitting]);

  return {
    stage,
    mode,
    questions,
    total,
    // 문항 단계에서 1..total, 그 외 0
    progress: stage === 'question' ? step : 0,
    current,
    isLast,
    nickname,
    setNickname,
    position,
    setPosition,
    nicknameValid,
    answers,
    setAnswer,
    canNext,
    next,
    prev,
    submitting,
    submitError,
    loadError,
    reload: loadQuestions,
    result,
  };
}
