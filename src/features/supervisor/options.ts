// 상사 추가 화면 선택지 (Figma 디자인 없음 — 회원가입 선택지 스타일을 따른 임시 구성)

export const POSITIONS = [
  { value: 'staff', label: '사원' },
  { value: 'senior-staff', label: '주임' },
  { value: 'assistant-manager', label: '대리' },
  { value: 'manager', label: '과장' },
  { value: 'senior-manager', label: '차장' },
  { value: 'director', label: '부장' },
  { value: 'team-lead', label: '팀장' },
] as const;

export const CHANNELS = [
  { value: 'messenger', label: '💬  메신저로 주로 소통' },
  { value: 'face', label: '🗣️  대면으로 주로 소통' },
  { value: 'email', label: '📧  이메일로 주로 소통' },
] as const;

export const MODES = [
  { value: 'quick', emoji: '⚡', label: '빠르게\n약 2분 · 12문항' },
  { value: 'full', emoji: '🎯', label: '정확하게\n약 5분 · 28문항' },
] as const;

export const LIKERT_SCALE = [
  { value: 1, label: '전혀 아니다' },
  { value: 2, label: '아니다' },
  { value: 3, label: '보통이다' },
  { value: 4, label: '그렇다' },
  { value: 5, label: '매우 그렇다' },
] as const;
