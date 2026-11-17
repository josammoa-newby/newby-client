import { analyzeDiary } from '@/api';
import type { DiaryAnalysis } from '@/api';
import { ApiError } from '@/api/errors';

// 분석 중 일기가 수정되면(409) 한 번만 자동으로 다시 요청한다
export async function analyzeWithRetry(id: string, force?: boolean): Promise<DiaryAnalysis> {
  try {
    return (await analyzeDiary(id, { force })).analysis;
  } catch (e) {
    if (e instanceof ApiError && e.code === 'DIARY_CHANGED') return (await analyzeDiary(id, { force })).analysis;
    throw e;
  }
}
