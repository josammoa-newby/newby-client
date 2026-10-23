import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

export type AsyncData<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
  setData: Dispatch<SetStateAction<T | null>>;
};

// service 함수를 호출해 loading / error / data / retry 를 돌려주는 훅. loader 는 참조가 바뀌지 않아야 한다
export function useAsyncData<T>(loader: () => Promise<T>): AsyncData<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
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
      const result = await loader();
      if (mounted.current) setData(result);
    } catch (e) {
      if (mounted.current) setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, retry: load, setData };
}
