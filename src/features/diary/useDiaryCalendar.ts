import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

import { getDiaryCalendar } from './service';
import { useAsyncData } from './useAsyncData';

export function useDiaryCalendar() {
  const loader = useCallback(() => getDiaryCalendar(), []);
  const { data, loading, error, retry } = useAsyncData(loader);

  // 일기 작성 화면에서 돌아오면 새 일기가 반영되도록 다시 불러온다. 첫 진입은 useAsyncData 가 이미 불러온다
  const firstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }
      retry();
    }, [retry]),
  );

  return { data, loading, error, retry };
}
