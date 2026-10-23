import { router } from 'expo-router';

import * as tokenStorage from './tokenStorage';

// 저장된 토큰을 모두 지우고 로그인 화면으로 보낸다. 서버에 로그아웃 API 가 없어 서버 호출은 하지 않는다.
// 이미 로그아웃된 상태에서 호출해도 에러가 나지 않는다. (tokenStorage 는 실패해도 던지지 않는다)
export async function logout(): Promise<void> {
  await tokenStorage.clearTokens();
  router.replace('/login');
}
