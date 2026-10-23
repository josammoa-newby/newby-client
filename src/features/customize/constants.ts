import { colors } from '@/theme';

// 꾸미기 화면(Figma 커스터마이징 20:1646 / 20:1689 / 20:1743)에서만 쓰는 값. 공유 theme은 수정하지 않고 이 폴더 안에서만 정의함
export const customizeLayout = {
  stageHeight: 306, // 상태바(54) 아래 ~ 패널 상단(360)까지
  buttonTop: 13, // 상태바 ~ 뒤로가기/완료 (Figma 67)
  backButton: 48,
  doneWidth: 90,
  resetBottom: 16, // 초기화 버튼 하단 여백 (Figma 296 + 48 = 344, 패널 360)
  tabPaddingY: 16,
  tabUnderline: 3,
  chipSize: 40,
  chipGap: 8,
  chipsTop: 22, // 탭 하단 ~ 칩 (Figma 84)
  chipsBottom: 29, // 칩 하단 ~ 타일 (Figma 124 -> 153)
  gridTopNoChips: 22, // 칩이 없는 악세서리 탭에서 탭 하단 ~ 타일
  tile: 115,
  tileGap: 8,
  tileRadius: 24,
  tileBorder: 2,
  previewDuck: 277, // 미리보기에 확대해서 보여주는 오리 이미지 한 변
  previewBeakScale: 2.05,
  previewBackground: 470, // Figma image 4
  previewCenterShift: 36, // 오리 머리 중심이 화면 중앙보다 오른쪽 (Figma 233 vs 196.5)
  previewDuckTop: 81, // 상태바 하단 기준 오리 이미지 상단 (Figma 135 - 54)
  previewBackgroundTop: -14, // 상태바 하단 기준 배경 이미지 상단 (Figma 40 - 54)
} as const;

export const customizeColors = {
  chipOverlay: 'rgba(0, 0, 0, 0.2)', // 선택된 칩 위에 덮는 어두운 막 (Figma 20:1663)
  stage: '#f5f5f5', // 미리보기 영역 배경 (Figma 20:1646)
  backButton: 'rgba(255, 255, 255, 0.5)',
} as const;

// Figma 칩 11개 (20:1663) — 첫 칩은 오리 기본색
export const CHIP_COLORS = [
  colors.surfaceSelected,
  '#ef4444',
  '#ffb74c',
  '#ffed49',
  '#a9ed60',
  '#37d28f',
  '#63d0ff',
  '#476dea',
  '#8847ea',
  '#f986ff',
  colors.textBody,
] as const;
