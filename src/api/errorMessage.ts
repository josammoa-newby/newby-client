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
  AI_UNAVAILABLE: 'AI가 잠시 응답하지 못했어요. 잠시 후 다시 시도해줘',
  AI_RESPONSE_INVALID: 'AI 응답을 이해하지 못했어요. 다시 시도해줘',
  AI_NOT_CONFIGURED: 'AI 설정이 아직 준비되지 않았어요',
  RATE_LIMITED: '요청이 너무 많아요. 잠시 후 다시 시도해줘',
};
const FALLBACK_MESSAGE = '잠시 후 다시 시도해주세요';

export function apiErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return FALLBACK_MESSAGE;
  if (error.code === 'VALIDATION_ERROR') return error.message || FALLBACK_MESSAGE;
  return MESSAGES[error.code] ?? FALLBACK_MESSAGE;
}
