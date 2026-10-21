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

export const radius = {
  button: 8,
  input: 14,
  checkbox: 10,
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
} as const;
