import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'newby.accessToken';
const REFRESH_TOKEN_KEY = 'newby.refreshToken';

// 저장소 접근 실패(권한, 용량, 비공개 모드 등)로 앱이 죽지 않게 모두 삼킨다.
async function getItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') return globalThis.localStorage?.getItem(key) ?? null;
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function setItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === 'web') globalThis.localStorage?.setItem(key, value);
    else await SecureStore.setItemAsync(key, value);
  } catch {
    // 저장 실패 시 다음 실행에서 다시 로그인하게 된다.
  }
}

async function removeItem(key: string): Promise<void> {
  try {
    if (Platform.OS === 'web') globalThis.localStorage?.removeItem(key);
    else await SecureStore.deleteItemAsync(key);
  } catch {
    // 삭제 실패는 무시
  }
}

export const getAccessToken = () => getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => getItem(REFRESH_TOKEN_KEY);

export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  await Promise.all([setItem(ACCESS_TOKEN_KEY, accessToken), setItem(REFRESH_TOKEN_KEY, refreshToken)]);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([removeItem(ACCESS_TOKEN_KEY), removeItem(REFRESH_TOKEN_KEY)]);
}
