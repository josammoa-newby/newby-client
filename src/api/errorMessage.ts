import { ApiError } from './errors';

// 서버 에러 코드별 한국어 문구. VALIDATION_ERROR 는 서버 message 를 그대로 보여준다.
const MESSAGES: Record<string, string> = {
  USERNAME_TAKEN: '이미 사용 중인 아이디예요',
  EMAIL_TAKEN: '이미 가입된 이메일이에요',
  INVALID_CREDENTIALS: '아이디 또는 비밀번호가 올바르지 않아요',
  NETWORK_ERROR: '네트워크 연결을 확인해주세요',
  SUPERVISOR_NOT_FOUND: '상사 정보를 찾을 수 없어요',
  SESSION_NOT_FOUND: '대화를 찾을 수 없어요',
  MESSAGE_NOT_FOUND: '메시지를 찾을 수 없어요',
  FEEDBACK_ALREADY_EXISTS: '이미 피드백을 남겼어요',
  AI_UNAVAILABLE: 'AI가 답변하지 못했어요. 다시 시도해 주세요',
  AI_RESPONSE_INVALID: 'AI가 답변하지 못했어요. 다시 시도해 주세요',
  AI_NOT_CONFIGURED: 'AI 설정이 아직 안 되어 있어요',
  RATE_LIMITED: '잠시 후 다시 시도해 주세요',
  DIARY_NOT_FOUND: '일기를 찾을 수 없어요',
  DIARY_TOO_SHORT: '20자 이상 쓰면 AI 분석을 받을 수 있어요',
  DIARY_CHANGED: '분석하는 동안 일기가 수정됐어요. 다시 시도해줘',
  MISSION_NOT_FOUND: '미션을 찾을 수 없어요',
};
const FALLBACK_MESSAGE = '잠시 후 다시 시도해주세요';

export function apiErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return FALLBACK_MESSAGE;
  if (error.code === 'VALIDATION_ERROR') return error.message || FALLBACK_MESSAGE;
  return MESSAGES[error.code] ?? FALLBACK_MESSAGE;
}
