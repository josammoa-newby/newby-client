// Figma 로그인(1:174) 및 공용 컴포넌트에서 추출한 간격·크기·radius
export const spacing = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 16,
  xl: 24,
  screenPadding: 16,
  inputPaddingY: 15,
  buttonPaddingY: 16,
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
} as const;
