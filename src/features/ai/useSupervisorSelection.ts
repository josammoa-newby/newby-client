import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { apiErrorMessage, listSupervisors } from '@/api';
import type { SupervisorListItem } from '@/api';
import { loadSelectedSupervisorId, saveSelectedSupervisorId } from './selectedSupervisor';

// 상사 정보 상태: loading(처음 조회 중) / ready / empty(등록한 상사 없음) / error(조회 실패)
export type SupervisorState = 'loading' | 'ready' | 'empty' | 'error';

// 상사 목록과 "지금 대화할 상사" 선택. 선택은 기기에 저장하고 서버의 isDefault 는 바꾸지 않는다.
// 선택 우선순위: 이번 실행에서 고른 상사 > 저장된 상사 > 서버 기본 상사 > 목록 첫 번째
export function useSupervisorSelection() {
  const [supervisors, setSupervisors] = useState<SupervisorListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [state, setState] = useState<SupervisorState>('loading');
  const [error, setError] = useState<string | null>(null);

  const mounted = useRef(true);
  const selectedRef = useRef<string | null>(null);
  // undefined: 아직 저장소를 읽지 않음
  const storedRef = useRef<string | null | undefined>(undefined);
  const knownRef = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setError(null);
    try {
      const list = await listSupervisors();
      if (storedRef.current === undefined) storedRef.current = await loadSelectedSupervisorId();
      if (!mounted.current) return;
      const preferred = selectedRef.current ?? storedRef.current;
      // 저장된 id 가 목록에 없으면(삭제/다른 계정) 기본 상사로 폴백
      const chosen =
        list.find((item) => item.id === preferred) ?? list.find((item) => item.isDefault) ?? list[0] ?? null;
      selectedRef.current = chosen?.id ?? null;
      knownRef.current = true;
      setSupervisors(list);
      setSelectedId(chosen?.id ?? null);
      setState(chosen ? 'ready' : 'empty');
    } catch (e) {
      if (!mounted.current) return;
      // 이미 상사를 알고 있으면 그대로 쓴다. 처음 조회 실패일 때만 에러 화면
      if (!knownRef.current) {
        setError(apiErrorMessage(e));
        setState('error');
      }
    }
  }, []);

  // 화면이 포커스될 때마다 다시 조회한다 (상사 등록/삭제 반영)
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const retry = useCallback(() => {
    setState('loading');
    void load();
  }, [load]);

  const select = useCallback(
    (id: string) => {
      if (!supervisors.some((item) => item.id === id)) return;
      selectedRef.current = id;
      setSelectedId(id);
      void saveSelectedSupervisorId(id);
    },
    [supervisors],
  );

  const supervisor = useMemo(
    () => supervisors.find((item) => item.id === selectedId) ?? null,
    [supervisors, selectedId],
  );

  return { supervisors, supervisor, state, error, select, reload: load, retry };
}
