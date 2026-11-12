// 일기 작성 화면은 Figma 디자인이 없는 임시 UI. 값은 서버 규칙(docs/api.md)을 따른다.
export const MAX_CONTENT_LENGTH = 2000;
// 서버 MIN_ANALYZE_LENGTH. 앞뒤 공백을 뺀 길이가 이보다 짧으면 분석할 수 없다
export const MIN_ANALYZE_LENGTH = 20;

// 서버 mood 는 20자 이하 문자열이라 라벨을 그대로 보낸다
export const MOODS = ['뿌듯', '평온', '보통', '불안', '힘듦'] as const;
export type Mood = (typeof MOODS)[number];

export const writeLayout = {
  inputMinHeight: 220,
  sectionGap: 20,
} as const;
