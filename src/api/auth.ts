import { request } from './client';
import * as tokenStorage from './tokenStorage';
import type { AuthTokens, AuthUser } from './types';

export type LoginParams = {
  id: string;
  password: string;
};

export type SignupParams = {
  name: string;
  id: string;
  password: string;
  email: string;
  marketingAgreed: boolean;
  job: string;
  workStyle: string;
  bossStyle: string;
};

export type AuthResult = {
  token: string;
  user: AuthUser;
};

export type SignupResult = {
  user: AuthUser;
  // 가입 직후 자동 로그인 성공 여부. 실패해도 가입은 완료된 상태다.
  loggedIn: boolean;
};

// 서버는 아이디를 소문자로만 저장하므로 호출 전에 trim + 소문자로 맞춘다.
function toUsername(id: string): string {
  return id.trim().toLowerCase();
}

export async function login(params: LoginParams): Promise<AuthResult> {
  const tokens = await request<AuthTokens>('/api/auth/login', {
    method: 'POST',
    body: { username: toUsername(params.id), password: params.password },
  });
  await tokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
  return { token: tokens.accessToken, user: tokens.user };
}

export async function signup(params: SignupParams): Promise<SignupResult> {
  const username = toUsername(params.id);
  const { user } = await request<{ user: AuthUser }>('/api/auth/signup', {
    method: 'POST',
    body: {
      name: params.name.trim(),
      username,
      email: params.email.trim(),
      password: params.password,
      marketingAgreed: params.marketingAgreed,
      // 선택하지 않은 항목은 빈 문자열 대신 null 로 보낸다.
      job: params.job || null,
      workStyle: params.workStyle || null,
      bossStyle: params.bossStyle || null,
    },
  });

  // 서버 가입 응답에는 토큰이 없어 같은 정보로 로그인해 세션을 만든다.
  try {
    await login({ id: username, password: params.password });
    return { user, loggedIn: true };
  } catch {
    return { user, loggedIn: false };
  }
}

// 아이디 중복확인
export async function checkIdAvailable(id: string): Promise<{ available: boolean }> {
  return request<{ available: boolean }>(
    `/api/auth/check-username?username=${encodeURIComponent(toUsername(id))}`,
  );
}
