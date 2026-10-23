import { spacing } from '@/theme';

// 홈 화면(Figma main 4:155)에서만 쓰는 값. theme에 같은 값이 없어 이 폴더 안에서만 정의함 (공유 theme은 수정하지 않음)
export const homeLayout = {
  headerTop: 20, // 상태바 하단 ~ 로고 상단
  headerBottom: 25.5, // 로고 하단 ~ 배너 상단 (Figma 17.5 + 요청으로 8 추가)
  bannerHeight: 159,
  bannerRadius: 18,
  bannerPaddingLeft: 30,
  bannerPaddingTop: 36,
  bannerPaddingRight: 27,
  shortcutTop: 24, // 배너 ~ "바로가기" 제목
  shortcutTitleToTiles: 19,
  tile: 73,
  tileRadius: 18,
  tileIcon: 40,
  tileLabelGap: 12,
  tileLabelLineHeight: 20,
  tipTop: 21, // 바로가기 타일 라벨 ~ TIP
  tipHeight: 42,
  voteTop: 50, // TIP ~ 오늘의 투표
  voteRowGap: 15,
  voteCardRadius: 18,
  voteChoiceWidth: 154,
  voteChoiceHeight: 121,
  popularTop: 40, // 오늘의 투표 ~ 인기글
  popularTitleGap: 24,
  postWidth: 263,
  postGap: 15,
  postThumbHeight: 148,
  postThumbRadius: 5,
  postGapInner: 7,
  postIcon: 12,
  gutter: spacing.gutter,
} as const;

// theme에 없는 홈 화면 전용 색
export const homeColors = {
  voteCount: '#22c55e', // "N명이 투표했어요!" (Figma 4:287)
  unreadDot: '#ef4444', // 알림 아이콘 빨간 점 (Figma bell 의 Ellipse 1)
} as const;
