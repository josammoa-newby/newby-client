// Figma 확정 섹션(1:173) 로그인(1:174)·Tab_bar(1:406)·회원가입(1:213~1:312)에서 추출한 값
export const colors = {
  primary: '#ff9f1c', // Main_Color
  primaryDark: '#ea972d', // Tab_bar AI 아이콘 하이라이트
  primaryDeep: '#c07413', // 스플래시 닫힌 입 선 (Figma 1:322)
  primaryLight: '#ffcc53', // 회원가입 진행 막대 (Figma 1:29)
  surface: '#f6f7f9', // 직무 선택 카드 배경 (Figma btn_step2)
  surfaceSelected: '#fff8ed', // 직무 선택 카드 선택 상태 (Figma 1:269)
  white: '#ffffff',
  black: '#000000', // 스플래시 마스코트 눈 (Figma 1:326)
  line: '#eceef2', // line_Color
  accent: '#f9a02e', // AI 마스코트·부제 (Figma ai 1:372). primary(#ff9f1c)와 미세하게 다름
  accentLight: '#ffe500', // AI 마스코트 그라데이션 끝
  starGold: '#ffc93c', // AI 결과 카드 별 아이콘 (Figma 1:421)
  chatField: '#f3f3f3', // 채팅 입력창 배경 (Figma 1:383)
  chatPlaceholder: '#949393', // 채팅 입력창 placeholder (Figma 1:384)
  bubble: '#eff3f5', // 사용자 질문 말풍선 (Figma 1:451)
  shadow: 'rgba(23, 23, 28, 0.06)', // AI 결과 카드 그림자 (Figma 1:419)
  textPrimary: '#17171c',
  textBody: '#262626',
  textLabel: '#4b5563',
  textMuted: '#8a909a',
  placeholder: '#b4b9c1',
} as const;

// 왼쪽 → 오른쪽(Figma bg-gradient-to-r) 그라데이션
export const gradients = {
  mascot: [colors.accent, colors.accentLight], // AI 마스코트 빵 (Figma 1:374, 1:375)
} as const;
