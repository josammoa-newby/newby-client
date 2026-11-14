import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { apiErrorMessage, listSupervisors } from '@/api';
import type { SupervisorListItem } from '@/api';

// 내 상사 목록. 등록 화면에서 돌아올 때마다(포커스) 다시 불러온다
export function useSupervisors() {
  const [data, setData] = useState<SupervisorListItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listSupervisors();
      if (mounted.current) setData(list);
    } catch (e) {
      if (mounted.current) setError(apiErrorMessage(e));
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return { data, loading, error, retry: load };
}
