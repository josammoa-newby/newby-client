import { useCallback, useEffect, useRef, useState } from 'react';

import { apiErrorMessage, deleteDiary } from '@/api';
import type { Diary, DiaryAnalysis } from '@/api';
import { analyzeWithRetry } from '../write/analyze';

type Options = {
  diaries: Diary[] | null;
  setAnalysis: (id: string, analysis: DiaryAnalysis) => void;
  removeLocal: (id: string) => void;
};

// 일기 상세의 분석/삭제 동작. 화면은 상태만 받아 그린다
export function useDiaryActions({ diaries, setAnalysis, removeLocal }: Options) {
  const [analyzingIds, setAnalyzingIds] = useState<ReadonlySet<string>>(new Set());
  const [analyzeErrors, setAnalyzeErrors] = useState<Readonly<Record<string, string>>>({});
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const mounted = useRef(true);
  // 상태 반영 전의 연타를 막는 동기 잠금
  const analyzeBusy = useRef(new Set<string>());
  const deleteBusy = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const analyze = useCallback(
    async (id: string, force: boolean) => {
      if (analyzeBusy.current.has(id)) return;
      analyzeBusy.current.add(id);
      setAnalyzingIds((prev) => new Set(prev).add(id));
      setAnalyzeErrors(({ [id]: _removed, ...rest }) => rest);
      try {
        const analysis = await analyzeWithRetry(id, force ? true : undefined);
        if (mounted.current) setAnalysis(id, analysis);
      } catch (e) {
        if (mounted.current) setAnalyzeErrors((prev) => ({ ...prev, [id]: apiErrorMessage(e) }));
      } finally {
        analyzeBusy.current.delete(id);
        if (mounted.current) {
          setAnalyzingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }
      }
    },
    [setAnalysis],
  );

  const askDelete = useCallback((id: string) => {
    if (deleteBusy.current) return;
    setDeleteError(null);
    setDeleteTarget(id);
  }, []);

  const cancelDelete = useCallback(() => {
    if (deleteBusy.current) return;
    setDeleteTarget(null);
    setDeleteError(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    const id = deleteTarget;
    if (!id || deleteBusy.current) return;
    deleteBusy.current = true;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteDiary(id);
      if (!mounted.current) return;
      setDeleteTarget(null);
      removeLocal(id);
    } catch (e) {
      if (mounted.current) setDeleteError(apiErrorMessage(e));
    } finally {
      deleteBusy.current = false;
      if (mounted.current) setDeleting(false);
    }
  }, [deleteTarget, removeLocal]);

  // 그날 일기가 이 하나뿐이면 삭제 시 첫 일기 경험치가 회수된다
  const deleteIsLastOfDay = deleteTarget !== null && (diaries?.length ?? 0) <= 1;

  return {
    analyzingIds,
    analyzeErrors,
    analyze,
    deleteTarget,
    deleting,
    deleteError,
    deleteIsLastOfDay,
    askDelete,
    cancelDelete,
    confirmDelete,
  };
}
