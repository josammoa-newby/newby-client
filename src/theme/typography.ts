import type { TextStyle } from 'react-native';

// Figma: Noto Sans KR (SF Pro는 상태바 시간 전용)
export const fontFamily = {
  regular: 'NotoSansKR_400Regular',
  medium: 'NotoSansKR_500Medium',
  semiBold: 'NotoSansKR_600SemiBold',
  bold: 'NotoSansKR_700Bold',
} as const;

export const typography = {
  tabLabel: { fontFamily: fontFamily.regular, fontSize: 10 },
  tabLabelActive: { fontFamily: fontFamily.semiBold, fontSize: 10 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 18 },
  label: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 18 },
  link: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 14 },
  checkLabel: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 19.5 },
  body: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 21 },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    letterSpacing: -0.32,
  },
  button: { fontFamily: fontFamily.bold, fontSize: 16, lineHeight: 24 },
  statusTime: { fontWeight: '600', fontSize: 17, lineHeight: 22 },
} as const satisfies Record<string, TextStyle>;
