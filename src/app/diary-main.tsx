import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBar, type TabKey } from '@/components';
import { CalendarTab } from '@/features/diary/CalendarTab';
import { DiaryHeader } from '@/features/diary/DiaryHeader';
import { DiaryTabSwitch, type DiaryTabKey } from '@/features/diary/DiaryTabSwitch';
import { MissionTab } from '@/features/diary/MissionTab';
import { useDiaryHeader } from '@/features/diary/useDiaryHeader';
import { colors } from '@/theme';

// Figma: newby 파일 일기 캘린더(7:418) · 미션(7:678)
// 기존 (tabs)/diary.tsx 는 건드리지 않고 별도 라우트(/diary-main)로 만든다. 탭 연결은 diary.tsx 교체 시 함께 처리
export default function DiaryMain() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<DiaryTabKey>('calendar');
  const { data: header } = useDiaryHeader();

  const handleTabBar = (key: TabKey) => {
    if (key === 'home') router.replace('/home');
    else if (key === 'ai') router.replace('/ai');
    else if (key === 'profile') router.replace('/profile');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <DiaryHeader
        hasUnreadNotification={header?.hasUnreadNotification ?? false}
        onSearchPress={() => {}}
        onNotificationPress={() => {
          // TODO: 검색·알림 화면이 아직 없음 — 화면 생기면 연결
        }}
      />
      <DiaryTabSwitch active={tab} onChange={setTab} />
      <View style={styles.body}>{tab === 'calendar' ? <CalendarTab /> : <MissionTab />}</View>
      <TabBar active="diary" onChange={handleTabBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  body: {
    flex: 1,
  },
});
