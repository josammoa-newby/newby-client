// 서버 응답 타입 (docs/api.md 기준)
export type AuthUser = {
  id: string;
  username: string;
  name: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};
