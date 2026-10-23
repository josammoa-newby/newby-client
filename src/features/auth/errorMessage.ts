import { ApiError } from '@/api/errors';

const MESSAGES: Record<string, string> = {
  USERNAME_TAKEN: '이미 사용 중인 아이디예요',
  EMAIL_TAKEN: '이미 가입된 이메일이에요',
  INVALID_CREDENTIALS: '아이디 또는 비밀번호가 올바르지 않아요',
  NETWORK_ERROR: '네트워크 연결을 확인해주세요',
};
const FALLBACK_MESSAGE = '잠시 후 다시 시도해주세요';

export function authErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return MESSAGES[error.code] ?? FALLBACK_MESSAGE;
  return FALLBACK_MESSAGE;
}
