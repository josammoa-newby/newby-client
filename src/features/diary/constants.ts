import { fontFamily } from '@/theme';

// 일기 화면(Figma 7:418, 7:548, 7:678)에서만 쓰는 값. theme에 같은 값이 없어 이 폴더 안에서만 정의함 (공유 theme은 수정하지 않음)
export const diaryColors = {
  chipBackground: '#fff0d6', // Sub_Color3: 완료한 미션 카드·진행 칩 배경
} as const;

export const diaryLayout = {
  headerTop: 16, // 상태바 하단 ~ 로고 상단
  headerBottom: 17.5, // 로고 하단 ~ 탭 상단
  tabBorder: 2,
  tabToBanner: 12,
  bannerHeight: 90,
  bannerRadius: 12,
  // 캘린더 배너: 마스코트 182x182 가 (-37, -37) 에서 시작
  calendarMascot: 182,
  calendarMascotOffset: -37,
  calendarTextLeft: 107,
  calendarTextTop: 24,
  // 미션 배너: 마스코트 140x140 이 (220, -8) 에서 시작
  missionMascot: 140,
  missionMascotLeft: 220,
  missionMascotTop: -8,
  missionTextLeft: 20,
  missionTextTop: 22,
  headerIconGap: 12, // 검색·알림 아이콘 사이
  monthLeft: 27, // 월 제목 왼쪽 여백
  monthTop: 24, // 배너 ~ 월 제목
  monthToWeekdays: 17,
  weekdaysToGrid: 16,
  cellWidth: 36,
  cellGap: 17,
  cellNumberGap: 4,
  cellIcon: 30,
  rowGap: 16,
  fab: 80,
  fabIcon: 36,
  fabShadowRadius: 20,
  levelTop: 24, // 배너 ~ 레벨 문구
  levelRowGap: 12,
  levelBarHeight: 26,
  levelLabelLeft: 12,
  missionTitleTop: 41, // 레벨 바 ~ 오늘의 미션
  missionTitleToList: 17,
  chipPaddingY: 4,
  missionCheckbox: 24,
  missionCheckIcon: 19,
} as const;

// theme.typography 에 같은 굵기·크기 조합이 없는 일기 화면 전용 글자 스타일
export const diaryText = {
  tab: { fontFamily: fontFamily.medium, fontSize: 18, lineHeight: 24.84 },
  month: { fontFamily: fontFamily.medium, fontSize: 20, lineHeight: 28 },
  weekday: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20 },
  dayNumber: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 25.2 },
  bannerName: { fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 26 },
  bannerMessage: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20 },
  missionBannerTitle: { fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 28.8 },
  missionBannerSubtitle: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 22.4 },
  levelTitle: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 23 },
  levelRemaining: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 17 },
  levelBadge: { fontFamily: fontFamily.bold, fontSize: 14, lineHeight: 20 },
  missionHeading: { fontFamily: fontFamily.medium, fontSize: 20, lineHeight: 28 },
  chip: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20 },
  missionTitle: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 21 },
  missionTitleDone: { fontFamily: fontFamily.semiBold, fontSize: 14, lineHeight: 21 },
  missionXp: { fontFamily: fontFamily.bold, fontSize: 12, lineHeight: 18 },
} as const;

export const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;
