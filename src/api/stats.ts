import { request } from './client';

// 경험치 · 직급 · 연속 기록 (서버 statsService 기준)
export type Stats = {
  xp: number;
  level: number;
  // 직급 이름. 예: 신입, 사원, 주임, 대리, 과장, 차장, 부장
  title: string;
  // 현재 직급이 시작되는 경험치 / 다음 직급 경험치 (최고 직급이면 null)
  currentLevelXp: number;
  nextLevelXp: number | null;
  // 다음 직급까지 진행률 0~100 (최고 직급이면 100)
  progress: number;
  streak: number;
  // 마지막으로 활동한 날 'YYYY-MM-DD'
  lastActiveDate: string | null;
};

// 일기 작성, 미션 완료 등으로 경험치가 바뀐 결과
export type AwardResult = {
  stats: Stats;
  gainedXp: number;
  leveledUp: boolean;
};

export function getMyStats(): Promise<Stats> {
  return request<Stats>('/api/me/stats', { auth: true });
}
