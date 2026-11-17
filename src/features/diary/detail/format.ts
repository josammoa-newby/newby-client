const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const pad = (n: number) => String(n).padStart(2, '0');

// '2026-11-16' -> '2026년 11월 16일 (월)'
export function formatDiaryDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return date;
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

// 서버 createdAt(타임스탬프 문자열) -> 한국 시간 'HH:mm'. 해석할 수 없으면 빈 문자열
export function formatKstTime(createdAt: string): string {
  const time = new Date(createdAt).getTime();
  if (Number.isNaN(time)) return '';
  const kst = new Date(time + KST_OFFSET_MS);
  return `${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}`;
}
