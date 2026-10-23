// 서버 규칙(newby-server docs/api.md)과 같게 맞춘다.
const USERNAME_PATTERN = /^[a-z0-9_]{4,20}$/;

export const USERNAME_RULE_MESSAGE = '아이디는 영문 소문자, 숫자, 밑줄(_) 4~20자로 입력해주세요';
export const MAX_PASSWORD_LENGTH = 72;

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidUsername(value: string): boolean {
  return USERNAME_PATTERN.test(value);
}
