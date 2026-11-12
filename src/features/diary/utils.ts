import type { Stats } from '@/api';
import type { Mission } from './types';

// '26년 9월'
export function formatMonthTitle(year: number, month: number): string {
  return `${String(year).slice(-2)}년 ${month}월`;
}

export function formatRecordMessage(count: number): string {
  return count > 0 ? `이번달 ${count}개의 기록을 남기셨어요!` : '이번달 첫 기록을 남겨보세요!';
}

// '+40 XP'
export function formatXp(xp: number): string {
  return `+${xp} XP`;
}

// 'Lv.4 사원'
export function formatLevelTitle(stats: Stats): string {
  return `Lv.${stats.level} ${stats.title}`;
}

// 'Lv.5까지 180 XP'. 최고 레벨이면 '최고 레벨'
export function formatRemainingXp(stats: Stats): string {
  if (stats.nextLevelXp === null) return '최고 레벨';
  return `Lv.${stats.level + 1}까지 ${Math.max(0, stats.nextLevelXp - stats.xp)} XP`;
}

// 0~1. 서버 progress(0~100) 사용, 최고 레벨이면 가득
export function getLevelProgress(stats: Stats): number {
  if (stats.nextLevelXp === null) return 1;
  return Math.min(1, Math.max(0, stats.progress / 100));
}

// '2/4'
export function formatMissionProgress(missions: Mission[]): string {
  return `${missions.filter((mission) => mission.done).length}/${missions.length}`;
}

export function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// 일요일 시작 달력. 해당 월이 아닌 칸은 null
export function buildMonthGrid(year: number, month: number): (number | null)[][] {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const lastDay = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: lastDay }, (_, index) => index + 1),
  ];
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7);
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}
