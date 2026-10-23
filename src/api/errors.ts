export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'INVALID_CREDENTIALS'
  | 'USERNAME_TAKEN'
  | 'EMAIL_TAKEN'
  | 'VALIDATION_ERROR'
  | 'PROFILE_NOT_FOUND'
  | 'RATE_LIMITED'
  | 'SUPERVISOR_NOT_FOUND'
  | 'SESSION_NOT_FOUND'
  | 'MESSAGE_NOT_FOUND'
  | 'FEEDBACK_ALREADY_EXISTS'
  | 'AI_UNAVAILABLE'
  | 'AI_RESPONSE_INVALID'
  | 'AI_NOT_CONFIGURED'
  | 'DIARY_NOT_FOUND'
  | 'MISSION_NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  // 서버가 새로 추가하는 코드도 문자열로 받을 수 있게 열어 둔다.
  | (string & {});

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  // 네트워크 실패처럼 HTTP 응답이 없으면 0
  readonly status: number;

  constructor(code: ApiErrorCode, message: string, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}
