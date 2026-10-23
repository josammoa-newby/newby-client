import { Stack } from 'expo-router';

import { SupervisorProvider } from '@/features/supervisor/SupervisorContext';

export default function SupervisorLayout() {
  return (
    <SupervisorProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 제출 후에는 스와이프로 질문지로 돌아가지 못하게 함 */}
        <Stack.Screen name="result" options={{ gestureEnabled: false }} />
      </Stack>
    </SupervisorProvider>
  );
}
