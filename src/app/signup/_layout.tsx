import { Stack } from 'expo-router';

import { SignupProvider } from '@/features/signup/SignupContext';

export default function SignupLayout() {
  return (
    <SignupProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 가입 완료 후에는 스와이프로 이전 단계로 돌아가지 못하게 함 */}
        <Stack.Screen name="complete" options={{ gestureEnabled: false }} />
      </Stack>
    </SignupProvider>
  );
}
