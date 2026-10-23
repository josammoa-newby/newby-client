import { API_URL } from './config';
import { ApiError } from './errors';
import * as tokenStorage from './tokenStorage';
import type { AuthTokens } from './types';

// 서버가 준비되기 전까지 mock 응답을 돌려주기 위한 공통 헬퍼.
// 서버 연동 시 각 API 함수 내부만 실제 요청으로 교체한다.
const MOCK_DELAY_MS = 300;

export async function mockResponse<T>(data: T, delayMs: number = MOCK_DELAY_MS): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return data;
}

// ---- 실제 서버 호출 ----
const REQUEST_TIMEOUT_MS = 15000;
const NETWORK_ERROR_MESSAGE = '네트워크 연결을 확인해주세요';
const UNAUTHORIZED_MESSAGE = '로그인이 필요해요';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  // true 이면 Authorization: Bearer <accessToken> 을 붙인다.
  auth?: boolean;
  // 호출별 타임아웃(ms). 없으면 기본 15초. (AI 응답처럼 느린 호출에 쓴다)
  timeoutMs?: number;
};

type ApiEnvelope<T> = {
  success: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
};

let onUnauthorized: (() => void) | null = null;

// 세션이 완전히 만료됐을 때(refresh 실패) 호출된다. 화면 쪽에서 /login 이동 로직을 등록한다.
export function setUnauthorizedHandler(fn: (() => void) | null): void {
  onUnauthorized = fn;
}

async function send<T>(
  path: string,
  method: HttpMethod,
  body: unknown,
  accessToken: string | null,
  timeoutMs: number = REQUEST_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    let envelope: ApiEnvelope<T> | null = null;
    try {
      envelope = (await res.json()) as ApiEnvelope<T>;
    } catch {
      // JSON 이 아닌 응답(프록시 에러 페이지 등)
    }

    if (envelope?.success) return envelope.data as T;
    if (envelope?.error) throw new ApiError(envelope.error.code, envelope.error.message, res.status);
    throw new ApiError('SERVER_ERROR', '서버 응답을 처리하지 못했어요', res.status);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('NETWORK_ERROR', NETWORK_ERROR_MESSAGE);
  } finally {
    clearTimeout(timer);
  }
}

// 동시에 여러 요청이 401 이어도 refresh 는 한 번만 실행한다. (single-flight)
let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const tokens = await send<AuthTokens>('/api/auth/refresh', 'POST', { refreshToken }, null);
    // Supabase 는 refresh token 을 회전시키므로 둘 다 교체 저장한다.
    await tokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
    return tokens.accessToken;
  } catch (err) {
    // 네트워크 문제는 세션 만료가 아니므로 토큰을 지우지 않는다.
    if (err instanceof ApiError && err.code === 'NETWORK_ERROR') throw err;
    return null;
  }
}

function refreshOnce(): Promise<string | null> {
  refreshInFlight ??= refreshAccessToken().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false, timeoutMs } = options;

  let accessToken: string | null = null;
  if (auth) {
    accessToken = await tokenStorage.getAccessToken();
    if (!accessToken) throw new ApiError('UNAUTHORIZED', UNAUTHORIZED_MESSAGE, 401);
  }

  try {
    return await send<T>(path, method, body, accessToken, timeoutMs);
  } catch (err) {
    if (!auth || !(err instanceof ApiError) || err.code !== 'UNAUTHORIZED') throw err;

    const newAccessToken = await refreshOnce();
    if (newAccessToken) return send<T>(path, method, body, newAccessToken, timeoutMs);

    await tokenStorage.clearTokens();
    onUnauthorized?.();
    throw err;
  }
}
