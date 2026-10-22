import { mockResponse } from './client';

export type AskAIParams = {
  question: string;
};

// 서버 연동 시 이 응답 형태에 맞춘다. (Figma AI 결과 1:408 구성)
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
};

const MOCK_ASK_DELAY_MS = 1000;

// TODO: 서버 연동 시 내부를 실제 요청으로 교체
export async function askAI(_params: AskAIParams): Promise<AiAnswer> {
  return mockResponse(
    {
      badge: '꼼꼼형 상사 반영',
      interpretation:
        '“괜찮다”가 아니라 “근거가 부족하다”는 신호일 가능성이 높아요. 결론은 나쁘지 않지만 데이터와 대안이 더 필요하다는 뜻으로 읽힙니다.',
      actions: [
        '어떤 부분을 보완하면 좋을지 먼저 여쭤보기',
        '수치·근거 2가지를 추가해 재보고 일정 제안하기',
        '수정본은 변경점만 요약해서 전달하기',
      ],
      suggestedPhrase:
        '“말씀하신 부분 중 근거가 약한 곳을 보완해보겠습니다. 내일 오전까지 수정본 공유드려도 될까요?”',
      followUps: ['수정본 보낼 때 메일 문장 써줘'],
    },
    MOCK_ASK_DELAY_MS,
  );
}
