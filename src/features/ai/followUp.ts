import { MAX_MESSAGE_LENGTH } from './constants';

const ANSWER_PREFIX = '답: ';

// 후속 질문 칩을 누르면 입력창에 채울 값. 질문을 함께 보내야 AI가 무슨 질문에 대한 답인지 안다.
// 입력창이 비어 있으면 `질문\n답: `, 사용자가 쓰던 내용이 있으면 지우지 않고 그 뒤에 줄바꿈으로 이어 붙인다.
export function buildFollowUpInput(current: string, question: string): string {
  const block = `${question}\n${ANSWER_PREFIX}`;
  const next = current.trim().length === 0 ? block : `${current.replace(/\s+$/, '')}\n${block}`;
  return next.slice(0, MAX_MESSAGE_LENGTH);
}

// 칩 질문만 채워져 있고 "답:" 뒤가 비어 있으면(마지막 줄이 '답:') 전송할 수 없다
export function hasEmptyAnswer(text: string): boolean {
  const lines = text.trimEnd().split('\n');
  return lines[lines.length - 1].trim() === '답:';
}
