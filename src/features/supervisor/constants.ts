// 상사 설정 화면은 Figma 디자인이 없는 임시 UI. 서버 규칙(docs/api.md)을 따른다.
export const NICKNAME_MAX_LENGTH = 20;
export const POSITION_MAX_LENGTH = 50;

export const LIKERT_VALUES = [1, 2, 3, 4, 5] as const;
export const LIKERT_MIN_LABEL = '전혀 아니다';
export const LIKERT_MAX_LABEL = '매우 그렇다';

export const supervisorLayout = {
  likertButton: 52,
  sectionGap: 20,
} as const;
