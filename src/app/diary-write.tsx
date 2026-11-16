import { useLocalSearchParams } from 'expo-router';

import { DiaryWriteScreen } from '@/features/diary/write/DiaryWriteScreen';

// 일기 캘린더 > + 버튼 > 일기 쓰기. ?id=<일기 id> 가 있으면 수정 모드 (Figma 디자인 없음, 임시 UI)
export default function DiaryWriteRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <DiaryWriteScreen editId={id || undefined} />;
}
