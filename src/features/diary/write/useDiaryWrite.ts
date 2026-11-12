import { useCallback, useEffect, useRef, useState } from 'react';

import { analyzeDiary, apiErrorMessage, createDiary } from '@/api';
import type { DiaryAnalysis } from '@/api';
import { ApiError } from '@/api/errors';
import { MIN_ANALYZE_LENGTH, type Mood } from './constants';

// write: 작성 중(저장 실패 포함) / saving / analyzing: 저장은 끝남 / result / analyzeFailed: 저장은 됐고 분석만 실패 / tooShort: 저장됨, 분석 안 함
export type WritePhase = 'write' | 'saving' | 'analyzing' | 'result' | 'analyzeFailed' | 'tooShort';

// 분석 중 일기가 수정되면(409) 한 번만 자동으로 다시 요청한다
async function analyzeWithRetry(id: string): Promise<DiaryAnalysis> {
  try {
    return (await analyzeDiary(id)).analysis;
  } catch (e) {
    if (e instanceof ApiError && e.code === 'DIARY_CHANGED') return (await analyzeDiary(id)).analysis;
    throw e;
  }
}

export function useDiaryWrite() {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [phase, setPhase] = useState<WritePhase>('write');
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DiaryAnalysis | null>(null);
  const diaryId = useRef<string | null>(null);
  // 상태 반영 전의 연타를 막기 위한 동기 잠금
  const busy = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const trimmedLength = content.trim().length;

  const analyze = useCallback(async () => {
    const id = diaryId.current;
    if (!id || busy.current) return;
    busy.current = true;
    setError(null);
    setPhase('analyzing');
    try {
      const result = await analyzeWithRetry(id);
      if (!mounted.current) return;
      setAnalysis(result);
      setPhase('result');
    } catch (e) {
      if (!mounted.current) return;
      // 일기는 이미 저장됐으므로 되돌리지 않는다
      if (e instanceof ApiError && e.code === 'DIARY_TOO_SHORT') {
        setPhase('tooShort');
      } else {
        setError(apiErrorMessage(e));
        setPhase('analyzeFailed');
      }
    } finally {
      busy.current = false;
    }
  }, []);

  const save = useCallback(async () => {
    const text = content.trim();
    if (text.length === 0 || busy.current || diaryId.current) return;
    busy.current = true;
    setError(null);
    setPhase('saving');
    try {
      // reward(첫 일기 경험치)는 이번엔 화면에 쓰지 않는다
      const saved = await createDiary({ content: text, mood: mood ?? undefined });
      diaryId.current = saved.id;
    } catch (e) {
      busy.current = false;
      if (mounted.current) {
        // 입력 내용은 그대로 유지한다
        setError(apiErrorMessage(e));
        setPhase('write');
      }
      return;
    }
    busy.current = false;
    if (!mounted.current) return;
    if (text.length < MIN_ANALYZE_LENGTH) setPhase('tooShort');
    else void analyze();
  }, [content, mood, analyze]);

  return {
    content,
    setContent,
    mood,
    setMood,
    phase,
    error,
    analysis,
    trimmedLength,
    save,
    retryAnalyze: analyze,
  };
}
