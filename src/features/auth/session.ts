import { request } from '@/api/client';
import { ApiError } from '@/api/errors';
import * as tokenStorage from '@/api/tokenStorage';

export type InitialRoute = '/home' | '/login';

// 앱 시작 시 저장된 토큰으로 로그인 상태를 확인해 첫 화면을 정한다.
export async function resolveInitialRoute(): Promise<InitialRoute> {
  if (!(await tokenStorage.getAccessToken())) return '/login';

  try {
    // 401 이면 request 가 refresh 를 한 번 시도하고, 실패하면 토큰을 지운다.
    await request('/api/auth/me', { auth: true });
    return '/home';
  } catch (err) {
    if (err instanceof ApiError && err.code === 'UNAUTHORIZED') {
      await tokenStorage.clearTokens();
    }
    // 네트워크 오류 등은 토큰을 지우지 않고 로그인 화면으로 보낸다.
    return '/login';
  }
}
