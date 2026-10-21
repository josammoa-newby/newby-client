// Figma 로그인(1:174) 및 공용 컴포넌트에서 추출한 간격·크기·radius
export const spacing = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 16,
  xl: 24,
  screenPadding: 16,
  // Figma 입력창 높이 51/54는 테두리(1px)를 안쪽에 포함하므로 RN에서는 15 - 1 = 14
  inputPaddingY: 14,
  buttonPaddingY: 16,
  cardPaddingY: 20,
  cardInnerGap: 12,
} as const;

// Figma 로그인(1:174) 요소 사이 세로 간격 (절대 좌표에서 계산)
export const layout = {
  logoTop: 40, // 상태바(54) 하단 ~ 로고 상단 (94)
  logoToTitle: 20,
  titleToForm: 40,
  fieldGap: 30,
  fieldToOptions: 10,
  optionsToButton: 53,
  buttonToLinks: 14,
  linksToDivider: 33,
  dividerToSocial: 24,
  linkGap: 13,
  socialGap: 22,
} as const;

// Figma 회원가입(1:213, 1:258, 1:274, 1:293, 1:312) 세로 간격 (절대 좌표에서 계산)
export const signupLayout = {
  headerTop: 16, // 상태바(54) 하단 ~ 헤더 상단 (70)
  headerGap: 23, // 화살표/제목 줄 ~ 진행 막대
  headerToTitle: 32,
  titleToForm: 32, // STEP1: 타이틀 ~ 첫 입력창
  titleToQuestion: 24, // STEP2
  titleToIndicator: 8, // STEP3
  indicatorToQuestion: 25,
  questionToCards: 24, // STEP2
  questionToOptions: 32, // STEP3
  formGap: 16, // STEP1 입력창 사이
  formToChecks: 16,
  checkGap: 10,
  cardGap: 11,
  optionGap: 10,
  indicatorGap: 6,
  footerBottom: 50, // 다음 버튼 하단 여백 (802 ~ 852)
  completeTop: 79, // 완료: 상태바 하단 ~ 타이틀 (133)
  completeTitleToBody: 19,
  completeBodyToMascot: 120,
} as const;

export const radius = {
  button: 8,
  input: 14,
  checkbox: 10,
  card: 16,
  indicator: 3,
  circle: 100,
} as const;

export const size = {
  icon: 24,
  checkbox: 18,
  statusBarHeight: 54,
  tabBarHeight: 85,
  tabItemWidth: 60,
  logoWidth: 95,
  logoHeight: 28.34,
  linkSeparatorHeight: 17,
  socialButton: 55,
  progressTrack: 7,
  backArrowWidth: 9.616,
  backArrowHeight: 16.625,
  actionButtonWidth: 70,
  selectCardHeight: 107,
  optionHeight: 68,
  indicatorBarWidth: 28,
  indicatorBarHeight: 5,
  mascot: 250,
} as const;
