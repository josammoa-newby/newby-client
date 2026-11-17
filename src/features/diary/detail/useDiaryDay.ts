import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { apiErrorMessage, listDiaries } from '@/api';
import type { Diary, DiaryAnalysis } from '@/api';

// 하루 최대 조회 수 (서버 limit 최대값)
const DAY_LIMIT = 100;

// 한 날짜의 일기 목록 (작성순). 화면에 다시 포커스되면 조용히 다시 불러온다 (수정 후 복귀 반영)
export function useDiaryDay(date: string) {
  const [diaries, setDiaries] = useState<Diary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  // 가장 최근 요청만 반영한다
  const seq = useRef(0);
  const loadedRef = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(
    async (silent: boolean) => {
      const mine = ++seq.current;
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const list = await listDiaries({ from: date, to: date, limit: DAY_LIMIT });
        if (!mounted.current || mine !== seq.current) return;
        // 서버는 최신순으로 주므로 작성순(오래된 것 먼저)으로 뒤집는다
        setDiaries([...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
        loadedRef.current = true;
        setError(null);
      } catch (e) {
        if (!mounted.current || mine !== seq.current) return;
        // 조용한 재조회 실패는 기존 목록을 그대로 둔다
        if (!silent || !loadedRef.current) setError(apiErrorMessage(e));
      } finally {
        if (mounted.current && mine === seq.current) setLoading(false);
      }
    },
    [date],
  );

  const firstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      const first = firstFocus.current;
      firstFocus.current = false;
      void load(!first);
    }, [load]),
  );

  const retry = useCallback(() => {
    void load(false);
  }, [load]);

  // 분석 결과를 해당 일기에만 반영한다
  const setAnalysis = useCallback((id: string, analysis: DiaryAnalysis) => {
    setDiaries((prev) => prev?.map((item) => (item.id === id ? { ...item, analysis } : item)) ?? prev);
  }, []);

  const removeLocal = useCallback((id: string) => {
    // 진행 중인 재조회가 지운 일기를 되살리지 않게 한다
    seq.current += 1;
    setDiaries((prev) => prev?.filter((item) => item.id !== id) ?? prev);
  }, []);

  return { diaries, loading, error, retry, setAnalysis, removeLocal };
}
