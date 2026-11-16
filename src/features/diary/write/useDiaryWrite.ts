import { useCallback, useEffect, useRef, useState } from 'react';

import { apiErrorMessage, createDiary, getDiary, updateDiary } from '@/api';
import type { AwardResult, DiaryAnalysis, UpdateDiaryInput } from '@/api';
import { ApiError } from '@/api/errors';
import { analyzeWithRetry } from './analyze';
import { MIN_ANALYZE_LENGTH } from './constants';

// write: 작성 중(저장 실패 포함) / saving / analyzing: 저장은 끝남 / result / analyzeFailed: 저장은 됐고 분석만 실패 / tooShort: 저장됨, 분석 안 함
export type WritePhase = 'write' | 'saving' | 'analyzing' | 'result' | 'analyzeFailed' | 'tooShort';

// 수정 모드에서 기존 일기를 불러오는 상태. 새로 쓰기는 항상 ready
export type LoadState = 'ready' | 'loading' | 'error';

// save 결과: 'unchanged' 면 바뀐 게 없어 요청 없이 끝난 것 (화면이 닫는다)
export type SaveOutcome = 'unchanged' | 'submitted';

// editId 가 있으면 그 일기를 불러와 수정하는 모드, 없으면 새로 쓰기
export function useDiaryWrite(editId?: string) {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [phase, setPhase] = useState<WritePhase>('write');
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DiaryAnalysis | null>(null);
  const [reward, setReward] = useState<AwardResult | null>(null);
  const [loadState, setLoadState] = useState<LoadState>(editId ? 'loading' : 'ready');
  const [loadError, setLoadError] = useState<string | null>(null);
  const diaryId = useRef<string | null>(null);
  // 수정 모드: 불러온 원본 (변경 여부 비교용)
  const original = useRef<{ content: string; mood: string | null } | null>(null);
  // 상태 반영 전의 연타를 막기 위한 동기 잠금
  const busy = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadOriginal = useCallback(async () => {
    if (!editId) return;
    setLoadState('loading');
    setLoadError(null);
    try {
      const diary = await getDiary(editId);
      if (!mounted.current) return;
      original.current = { content: diary.content.trim(), mood: diary.mood };
      setContent(diary.content);
      setMood(diary.mood);
      setLoadState('ready');
    } catch (e) {
      if (!mounted.current) return;
      setLoadError(apiErrorMessage(e));
      setLoadState('error');
    }
  }, [editId]);

  useEffect(() => {
    void loadOriginal();
  }, [loadOriginal]);

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

  // 저장 성공 후: 20자 이상이면 분석, 아니면 완료 처리
  const afterSaved = useCallback(
    (text: string) => {
      if (!mounted.current) return;
      if (text.length < MIN_ANALYZE_LENGTH) setPhase('tooShort');
      else void analyze();
    },
    [analyze],
  );

  const saveNew = useCallback(async () => {
    const text = content.trim();
    if (text.length === 0 || busy.current || diaryId.current) return;
    busy.current = true;
    setError(null);
    setPhase('saving');
    try {
      const saved = await createDiary({ content: text, mood: mood ?? undefined });
      diaryId.current = saved.id;
      // 그날 첫 일기에만 경험치가 지급된다. 없으면(null) 아무것도 보여주지 않는다
      if (saved.reward && saved.reward.gainedXp > 0 && mounted.current) setReward(saved.reward);
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
    afterSaved(text);
  }, [content, mood, afterSaved]);

  const saveEdit = useCallback(async (): Promise<SaveOutcome | undefined> => {
    const base = original.current;
    const text = content.trim();
    if (!editId || !base || text.length === 0 || busy.current || diaryId.current) return;

    const nextMood = mood ?? null;
    const patch: UpdateDiaryInput = {};
    if (text !== base.content) patch.content = text;
    if (nextMood !== base.mood) {
      // 기분 해제는 서버 규칙에 맞춰 빈 문자열로 보낸다 (서버가 null 로 저장)
      patch.mood = nextMood ?? '';
    }
    if (Object.keys(patch).length === 0) return 'unchanged';

    busy.current = true;
    setError(null);
    setPhase('saving');
    try {
      await updateDiary(editId, patch);
      diaryId.current = editId;
    } catch (e) {
      busy.current = false;
      if (mounted.current) {
        setError(apiErrorMessage(e));
        setPhase('write');
      }
      return 'submitted';
    }
    busy.current = false;
    // content/mood 가 바뀌면 서버가 기존 분석을 비우므로 다시 분석한다
    afterSaved(text);
    return 'submitted';
  }, [editId, content, mood, afterSaved]);

  const save = useCallback(
    async (): Promise<SaveOutcome | undefined> => (editId ? saveEdit() : saveNew().then(() => 'submitted')),
    [editId, saveEdit, saveNew],
  );

  return {
    isEdit: Boolean(editId),
    loadState,
    loadError,
    reloadOriginal: loadOriginal,
    content,
    setContent,
    mood,
    setMood,
    phase,
    error,
    analysis,
    reward,
    trimmedLength,
    save,
    retryAnalyze: analyze,
  };
}
