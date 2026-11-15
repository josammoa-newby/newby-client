import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// 선택한 상사 id 를 기기에 저장한다. 저장 방식은 api/tokenStorage.ts 와 같다
// (웹은 localStorage, 네이티브는 expo-secure-store). 실패해도 앱이 죽지 않게 모두 삼킨다.
const KEY = 'newby.selectedSupervisorId';

export async function loadSelectedSupervisorId(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') return globalThis.localStorage?.getItem(KEY) ?? null;
    return await SecureStore.getItemAsync(KEY);
  } catch {
    return null;
  }
}

export async function saveSelectedSupervisorId(id: string): Promise<void> {
  try {
    if (Platform.OS === 'web') globalThis.localStorage?.setItem(KEY, id);
    else await SecureStore.setItemAsync(KEY, id);
  } catch {
    // 저장 실패 시 다음 실행에서 기본 상사로 시작한다
  }
}
