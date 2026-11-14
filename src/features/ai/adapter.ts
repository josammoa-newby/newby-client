import type { AiAnswerPayload, SupervisorListItem } from '@/api';
import type { AiAnswer } from './types';

// 서버 AI 답변(snake_case) -> AI 탭 카드 모양 변환. 서버 필드와 화면 필드의 변환은 이 파일에서만 한다.
export function toAiAnswer(
  payload: AiAnswerPayload,
  supervisor: Pick<SupervisorListItem, 'typeName' | 'nickname'>,
): AiAnswer {
  return {
    badge: `${supervisor.typeName ?? supervisor.nickname} 반영`,
    interpretation: payload.intent,
    actions: [payload.recommended_action],
    suggestedPhrase: payload.suggested_message,
    followUps: payload.follow_up_question ? [payload.follow_up_question] : [],
    avoid: payload.avoid,
    confidence: payload.confidence,
    safetyFlag: payload.safety_flag,
  };
}
