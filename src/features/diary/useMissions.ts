import { useCallback, useState } from 'react';

import { getMissions, toggleMission } from './service';
import { useAsyncData } from './useAsyncData';

export function useMissions() {
  const { data, loading, error, retry, setData } = useAsyncData(getMissions);
  const [saveError, setSaveError] = useState(false);

  // 낙관적 업데이트: 먼저 체크 상태를 바꾸고, 실패하면 되돌린다. 경험치는 서버 응답으로 맞춘다
  const toggle = useCallback(
    async (id: string) => {
      const target = data?.missions.find((mission) => mission.id === id);
      if (!target) return;
      const completed = !target.completed;
      const setCompleted = (value: boolean) =>
        setData((prev) =>
          prev
            ? {
                ...prev,
                missions: prev.missions.map((mission) =>
                  mission.id === id ? { ...mission, completed: value } : mission,
                ),
              }
            : prev,
        );

      setSaveError(false);
      setCompleted(completed);
      try {
        const result = await toggleMission({ id, completed });
        setData((prev) =>
          prev
            ? {
                ...prev,
                level: result.level,
                missions: prev.missions.map((mission) =>
                  mission.id === id ? result.mission : mission,
                ),
              }
            : prev,
        );
      } catch {
        setCompleted(target.completed);
        setSaveError(true);
      }
    },
    [data, setData],
  );

  return { data, loading, error, retry, saveError, toggle };
}
