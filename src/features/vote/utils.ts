// 숫자·날짜 표시 포맷 유틸

// 60432 -> "60,432"
export function formatCount(count: number): string {
  return count.toLocaleString('ko-KR');
}

// (40290, 60432) -> "66.7%"
export function formatPercent(count: number, total: number): string {
  return `${percentOf(count, total).toFixed(1)}%`;
}

export function percentOf(count: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((count / total) * 1000) / 10;
}

// "2026-09-27" -> "9월 27일" (문자열로 직접 파싱해 시간대 영향을 받지 않음)
export function formatMonthDay(date: string): string {
  const [, month, day] = date.split('-').map(Number);
  return `${month}월 ${day}일`;
}

// ISO -> "방금 전" / "N분 전" / "N시간 전" / "N일 전"
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const diffMinutes = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 60000));
  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

// 긴 댓글을 미리보기 길이로 자름. 잘리지 않았으면 truncated 가 false
export function previewText(text: string, maxLength: number): { text: string; truncated: boolean } {
  if (text.length <= maxLength) return { text, truncated: false };
  return { text: text.slice(0, maxLength), truncated: true };
}

// ("미미미누", 57) -> "미미미누님 외 56명"
export function formatReactors(name: string, total: number): string {
  return total > 1 ? `${name}님 외 ${total - 1}명` : `${name}님`;
}
