// Figma AI 결과 카드(1:408 / 1:419) 구성. 서버 응답(AiAnswerPayload)은 adapter.ts 에서 이 모양으로 바꾼다.
export type AiAnswer = {
  // 분석에 반영된 상사 유형 배지. 예: "꼼꼼형 상사 반영"
  badge: string;
  // 상황 해석
  interpretation: string;
  // 이렇게 해보세요 (번호 목록, 순서대로)
  actions: string[];
  // 추천 말투
  suggestedPhrase: string;
  // 후속 질문 추천 칩
  followUps: string[];
  // 이런 말은 피하세요. 없거나 빈 문자열이면 보여주지 않는다
  avoid?: string;
  confidence?: 'high' | 'medium' | 'low';
  // true 이면 카드 위에 안전 안내를 보여준다
  safetyFlag?: boolean;
};
