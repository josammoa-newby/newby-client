import {
  NotoSansKR_400Regular,
  NotoSansKR_500Medium,
  NotoSansKR_600SemiBold,
  NotoSansKR_700Bold,
  useFonts,
} from '@expo-google-fonts/noto-sans-kr';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { setUnauthorizedHandler } from '@/api/client';

export default function RootLayout() {
  const [loaded] = useFonts({
    NotoSansKR_400Regular,
    NotoSansKR_500Medium,
    NotoSansKR_600SemiBold,
    NotoSansKR_700Bold,
  });

  // 세션이 완전히 만료되면(refresh 실패) 로그인 화면으로 보낸다. 등록은 여기 한 곳에서만 한다.
  useEffect(() => {
    setUnauthorizedHandler(() => router.replace('/login'));
    return () => setUnauthorizedHandler(null);
  }, []);

  if (!loaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
