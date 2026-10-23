import type { Mission, MissionLevel } from './types';

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

// 'Lv.4 적응 단계'
export function formatLevelTitle(level: MissionLevel): string {
  return `Lv.${level.level} ${level.name}`;
}

// 'Lv. 5까지 180 XP'
export function formatRemainingXp(level: MissionLevel): string {
  return `Lv. ${level.level + 1}까지 ${Math.max(0, level.nextLevelXp - level.currentXp)} XP`;
}

// 0~1
export function getLevelProgress(level: MissionLevel): number {
  if (level.nextLevelXp <= 0) return 0;
  return Math.min(1, Math.max(0, level.currentXp / level.nextLevelXp));
}

// '2/4'
export function formatMissionProgress(missions: Mission[]): string {
  return `${missions.filter((mission) => mission.completed).length}/${missions.length}`;
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
