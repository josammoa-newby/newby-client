// 패키지 루트에서 import 하면 쓰지 않는 굵기(100~900)까지 번들에 포함되므로 굵기별 경로에서 가져온다.
import { NotoSansKR_400Regular } from '@expo-google-fonts/noto-sans-kr/400Regular';
import { NotoSansKR_500Medium } from '@expo-google-fonts/noto-sans-kr/500Medium';
import { NotoSansKR_600SemiBold } from '@expo-google-fonts/noto-sans-kr/600SemiBold';
import { NotoSansKR_700Bold } from '@expo-google-fonts/noto-sans-kr/700Bold';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { setUnauthorizedHandler } from '@/api/client';

export default function RootLayout() {
  const [loaded, fontError] = useFonts({
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

  // 로드되기 전에는 렌더링하지 않는다. 로드에 실패하면 시스템 폰트로 계속 진행한다.
  if (!loaded && !fontError) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
