// 숫자 표시 포맷 유틸 (Figma 기준: 좋아요·댓글은 "1.5K", 투표수는 천 단위 콤마)

// 1500 -> "1.5K", 950 -> "950"
export function formatCompactCount(count: number): string {
  if (count < 1000) return String(count);
  const value = Math.round((count / 1000) * 10) / 10;
  return `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)}K`;
}

// 60432 -> "60,432"
export function formatVoteCount(count: number): string {
  return count.toLocaleString('ko-KR');
}
