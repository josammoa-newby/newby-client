import { useLocalSearchParams } from 'expo-router';

import { DiaryScreen } from '@/features/diary/DiaryScreen';
import type { DiaryTabKey } from '@/features/diary/DiaryTabSwitch';

function toDiaryTab(value: string | undefined): DiaryTabKey | undefined {
  return value === 'calendar' || value === 'mission' ? value : undefined;
}

export default function Diary() {
  // 홈 바로가기에서 ?tab=calendar|mission 으로 특정 탭 지정 가능
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  return <DiaryScreen initialTab={toDiaryTab(tab)} />;
}
