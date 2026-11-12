import { useCallback, useEffect, useRef, useState } from 'react';

import { apiErrorMessage } from '@/api';
import type { Stats } from '@/api';
import { generateTodayMissions, getTodayMissions, toggleMission } from './service';
import type { Mission } from './types';

type MissionData = { missions: Mission[]; stats: Stats };

export function useMissions() {
  const [data, setData] = useState<MissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const mounted = useRef(true);
  const pending = useRef(new Set<string>());
  const dataRef = useRef<MissionData | null>(null);
  dataRef.current = data;

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
      const { day, stats } = await getTodayMissions();
      let missions = day.missions;
      if (!day.generated) {
        if (mounted.current) setGenerating(true);
        missions = (await generateTodayMissions()).missions;
      }
      if (mounted.current) setData({ missions, stats });
    } catch (e) {
      if (mounted.current) setError(apiErrorMessage(e));
    } finally {
      if (mounted.current) {
        setGenerating(false);
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patchMission = useCallback((id: string, patch: Partial<Mission>) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            missions: prev.missions.map((m) => (m.id === id ? { ...m, ...patch } : m)),
          }
        : prev,
    );
  }, []);

  // 낙관적 업데이트: 먼저 체크 상태를 바꾸고 실패하면 되돌린다. 같은 미션은 요청이 끝나기 전에 다시 누를 수 없다
  const toggle = useCallback(
    async (id: string) => {
      const target = dataRef.current?.missions.find((m) => m.id === id);
      if (!target || pending.current.has(id)) return;
      pending.current.add(id);

      const done = !target.done;
      setSaveError(null);
      patchMission(id, { done });
      try {
        const result = await toggleMission(id, done);
        if (!mounted.current) return;
        patchMission(id, result.mission);
        const { stats } = result;
        if (stats) setData((prev) => (prev ? { ...prev, stats } : prev));
      } catch (e) {
        if (mounted.current) {
          patchMission(id, { done: target.done });
          setSaveError(apiErrorMessage(e));
        }
      } finally {
        pending.current.delete(id);
      }
    },
    [patchMission],
  );

  return { data, loading, generating, error, retry: load, saveError, toggle };
}
