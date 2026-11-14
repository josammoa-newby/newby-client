import { useLocalSearchParams } from 'expo-router';

import { SupervisorSetupScreen } from '@/features/supervisor/SupervisorSetupScreen';

// 상사 등록 플로우 (Figma 디자인 없음, 임시 UI). ?mode=full 이면 28문항, 기본은 quick(12문항)
export default function SupervisorSetupRoute() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  return <SupervisorSetupScreen mode={mode === 'full' ? 'full' : 'quick'} />;
}
