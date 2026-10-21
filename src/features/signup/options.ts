// Figma STEP2 (1:258) 직무, STEP3 (1:274, 1:293) 선택지

export const JOBS = [
  { value: 'dev', emoji: '💻', label: '개발' },
  { value: 'design', emoji: '🎨', label: '디자인' },
  { value: 'planning', emoji: '💡', label: '기획' },
  { value: 'marketing', emoji: '📢', label: '홍보 · 마케팅' },
  { value: 'finance', emoji: '💵', label: '금융' },
  { value: 'hr', emoji: '👥', label: '인사 · 총무' },
] as const;

export const WORK_STYLES = [
  { value: 'asks-a-lot', label: '질문을 많이 하는 편' },
  { value: 'solves-first', label: '혼자 먼저 해결해보는 편' },
  { value: 'meticulous', label: '꼼꼼하게 확인하는 편' },
  { value: 'fast', label: '빠르게 처리하는 편' },
] as const;

export const BOSS_STYLES = [
  { value: 'direct', label: '🗣️  직설적으로 말하는 편' },
  { value: 'meticulous', label: '🔍  꼼꼼하게 확인하는 편' },
  { value: 'fast', label: '⏱️  빠른 업무 처리를 선호하는 편' },
  { value: 'friendly', label: '🙂  편하게 소통하는 편' },
] as const;
