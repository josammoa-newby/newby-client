import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';
import { CalendarTab } from './CalendarTab';
import { DiaryHeader } from './DiaryHeader';
import { DiaryTabSwitch, type DiaryTabKey } from './DiaryTabSwitch';
import { MissionTab } from './MissionTab';
import { useDiaryHeader } from './useDiaryHeader';

function toDiaryTab(value: string | undefined): DiaryTabKey | undefined {
  return value === 'calendar' || value === 'mission' ? value : undefined;
}

// Figma: newby 파일 일기 캘린더(7:418) · 미션(7:678). 하단 탭바는 (tabs)/_layout.tsx 가 그린다
export function DiaryScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<DiaryTabKey>('calendar');
  const { data: header } = useDiaryHeader();

  // 홈 바로가기 등에서 ?tab=calendar|mission 으로 들어올 때 반영.
  // 탭 네비게이터는 화면을 계속 마운트해둔 채로 전환하기 때문에(언마운트/리마운트가 아님),
  // 단순 prop/파라미터 변화로는 재렌더가 안 될 수 있어 포커스될 때마다 다시 확인한다.
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  useFocusEffect(
    useCallback(() => {
      const next = toDiaryTab(tabParam);
      if (next) setTab(next);
    }, [tabParam]),
  );

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
