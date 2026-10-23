import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';
import { CalendarTab } from './CalendarTab';
import { DiaryHeader } from './DiaryHeader';
import { DiaryTabSwitch, type DiaryTabKey } from './DiaryTabSwitch';
import { MissionTab } from './MissionTab';
import { useDiaryHeader } from './useDiaryHeader';

type Props = {
  // 홈 바로가기 등 외부에서 특정 탭으로 바로 진입할 때 사용. 생략하면 기존처럼 캘린더부터 보여줌
  initialTab?: DiaryTabKey;
};

// Figma: newby 파일 일기 캘린더(7:418) · 미션(7:678). 하단 탭바는 (tabs)/_layout.tsx 가 그린다
export function DiaryScreen({ initialTab }: Props = {}) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<DiaryTabKey>(initialTab ?? 'calendar');
  const { data: header } = useDiaryHeader();

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
