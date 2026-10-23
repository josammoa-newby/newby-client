import { useCallback, useState } from 'react';

import { createDiaryEntry, getDiaryCalendar } from './service';
import { useAsyncData } from './useAsyncData';

export function useDiaryCalendar() {
  const loader = useCallback(() => getDiaryCalendar(), []);
  const { data, loading, error, retry, setData } = useAsyncData(loader);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // 일기 작성 화면이 아직 없어 서버가 알려준 "오늘"의 기록을 바로 남긴다
  const addTodayEntry = useCallback(async () => {
    if (!data || saving) return;
    if (data.entries.some((entry) => entry.date === data.today)) return;
    setSaving(true);
    setSaveError(false);
    try {
      const entry = await createDiaryEntry({ date: data.today });
      setData((prev) =>
        prev
          ? { ...prev, entries: [...prev.entries, entry], recordCount: prev.recordCount + 1 }
          : prev,
      );
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }, [data, saving, setData]);

  return { data, loading, error, retry, saving, saveError, addTodayEntry };
}
