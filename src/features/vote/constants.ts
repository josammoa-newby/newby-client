// 오늘의 투표 화면(Figma 17:1420 / 17:1447 / 17:1475)에서만 쓰는 값.
// theme에 같은 값이 없어 이 폴더 안에서만 정의함 (공유 theme은 수정하지 않음)

export const voteColors = {
  yesBg: '#e8f6ff', // 그렇다(O) 카드 배경
  yesFill: '#bae4ff', // 결과 카드 O 채움
  yesText: '#0099ff', // O 라벨·퍼센트
  noBg: '#feeeee', // 아니다(X) 카드 배경
  noFill: '#ffbaba', // 결과 카드 X 채움
  noText: '#ef4444', // X 라벨·퍼센트
  count: '#22c55e', // "N명이 투표했어요!"
  unreadDot: '#ef4444', // 알림 아이콘 빨간 점
  selectedOverlay: 'rgba(0, 0, 0, 0.2)', // 선택된 카드를 덮는 어두운 막
} as const;

export const voteLayout = {
  headerTop: 17, // 상태바 하단 ~ 헤더 아이콘 (Figma 54 → 71)
  titleTop: 50, // 헤더 하단 ~ 오늘의 투표 타이틀 (95 → 145)
  titleToDate: 49, // 타이틀 하단 ~ 날짜 (172 → 221)
  dateToQuestion: 7, // 날짜 하단 ~ 질문 (날짜 줄높이 26 기준 247 → 254)
  questionToCards: 43, // 질문 하단 ~ 선택 카드 (326 → 369)
  cardWidth: 174,
  cardHeight: 245,
  cardGap: 13,
  cardRadius: 18,
  cardIconSize: 37,
  cardIconOffset: 15, // 아이콘 중심이 카드 세로 중심보다 위로 올라간 만큼
  cardLabelTop: 132,
  stampSize: 149,
  stampLeft: 12,
  stampTop: 48,
  footerBottom: 50, // 다음 버튼 하단 여백 (802 ~ 852)
  footerTop: 24,
  selectedLabelOpacity: 0.2,
  // 결과 화면
  resultCardGap: 24,
  resultCardRadius: 18,
  resultCardPadding: 20,
  resultCardInnerGap: 16,
  resultBarWidth: 154,
  resultBarHeight: 185,
  resultBarGap: 12,
  commentTitleTop: 40, // 결과 카드 ~ "다른 사람 의견 보기"
  commentTitleToList: 23,
  commentGap: 20,
  commentPadding: 20,
  commentRadius: 16,
  avatar: 54,
  badge: 25.263,
  reactionSize: 24,
  reactionOverlap: 13, // 리액션 이모지 간 가로 간격 (24 크기, 겹침 11)
  reactionSheetScale: 5.6396, // 스프라이트 시트를 이모지 크기의 몇 배로 그렸는지
  previewLength: 17, // 댓글 미리보기 글자 수
} as const;

// 리액션 스프라이트(assets/vote/reactions.png)에서 각 이모지가 있는 위치 (Figma 17:1524~1526 의 left/top, 이모지 크기 대비 %)
export const reactionSprite = {
  laugh: { left: -17.59, top: -118.9 },
  sad: { left: -126.97, top: -226.63 },
  angry: { left: -235.7, top: -444.98 },
} as const;

// 타이틀 아이콘 (Figma 17:1438). 홈의 투표 아이콘(20/24 에셋)을 25.263 기준으로 키운 값
export const titleIcon = {
  width: 48.003, // 22.74 + 25.263
  height: 34.773,
  boxSize: 25.263,
  boxLeft: 22.74,
  boxTop: 1.26,
  markSize: 30.316, // 24 에셋 * (25.263 / 20)
  markShiftX: 1.263,
  markRotate: '-31.73deg',
} as const;
