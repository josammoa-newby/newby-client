import { request } from './client';
import type { PersonaAxis } from './persona';

export type FeedbackInput = {
  helpful: boolean;
  // 👎 일 때 실제 상사 반응 (최대 500자). 👍 이면 서버가 무시한다.
  actualReaction?: string;
};

// dir 은 해당 축 점수가 이동해야 하는(이동한) 방향
export type AxisHint = {
  axis: PersonaAxis;
  dir: 1 | -1;
};

export type FeedbackResult = {
  id: string;
  helpful: boolean;
  // 학습 메모에 추가된 문장. 없으면 null
  newNote: string | null;
  axisHint: AxisHint | null;
  // 이번 피드백으로 점수가 보정되었으면 { axis, dir }
  scoreAdjusted: AxisHint | null;
};

// 답변 카드(AI 메시지) 하나에 피드백은 한 번만 남길 수 있다.
export function sendFeedback(messageId: string, input: FeedbackInput): Promise<FeedbackResult> {
  return request<FeedbackResult>(`/api/messages/${encodeURIComponent(messageId)}/feedback`, {
    method: 'POST',
    body: input,
    auth: true,
  });
}
