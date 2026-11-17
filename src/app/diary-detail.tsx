import { useLocalSearchParams } from 'expo-router';

import { DiaryDetailScreen } from '@/features/diary/detail/DiaryDetailScreen';

// 일기 캘린더 > 날짜 > 일기 상세. ?date=YYYY-MM-DD (Figma 디자인 없음, 임시 UI)
export default function DiaryDetailRoute() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  return <DiaryDetailScreen date={date ?? ''} />;
}
