import { apiErrorMessage } from '@/api';
import type { ChatMessage, SupervisorListItem } from '@/api';
import { ApiError } from '@/api/errors';
import { toAiAnswer } from './adapter';
import type { Turn } from './types';

// 서버 세션 메시지(createdAt 오름차순) -> 화면 턴 목록 변환 (순수 함수).
// - 첫 인사(payload 가 null 인 ai 메시지)는 화면에 보여주지 않는다
// - user 메시지 바로 뒤에 payload 가 있는 ai 메시지가 오면 한 턴(done)
// - 그 뒤에 ai 답변이 없는 user 메시지(AI 실패로 남은 고아 메시지)는 에러 턴. 다시 시도할 수 있다
export function restoreTurns(
  messages: ChatMessage[],
  supervisor: Pick<SupervisorListItem, 'typeName' | 'nickname'>,
  firstId: number,
): Turn[] {
  const orphanError = apiErrorMessage(new ApiError('AI_UNAVAILABLE', ''));
  const turns: Turn[] = [];
  let id = firstId;

  for (let i = 0; i < messages.length; i += 1) {
    const message = messages[i];
    if (message.role !== 'user') continue;

    const question = message.text ?? '';
    const next = messages[i + 1];
    if (next && next.role === 'ai' && next.payload) {
      turns.push({
        id: id++,
        question,
        status: 'done',
        answer: toAiAnswer(next.payload, supervisor),
        aiMessageId: next.id,
      });
      i += 1;
    } else {
      turns.push({ id: id++, question, status: 'error', error: orphanError });
    }
  }
  return turns;
}
