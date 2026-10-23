import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { size, spacing } from '@/theme';
import { homeColors, homeLayout } from './constants';

type Props = {
  hasUnreadNotification: boolean;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
};

// Figma: main 4:155 > 헤더 4:293. 스크롤되지 않도록 화면에서 ScrollView 밖에 둔다. 알림 빨간 점은 안 읽은 알림이 있을 때만 표시
export function HomeHeader({ hasUnreadNotification, onSearchPress, onNotificationPress }: Props) {
  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/home/logo-newby.svg')} style={styles.logo} />
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel="검색" onPress={onSearchPress}>
          <Image source={require('../../../assets/home/search.svg')} style={styles.icon} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="알림" onPress={onNotificationPress}>
          <Image source={require('../../../assets/home/bell.svg')} style={styles.icon} />
          {hasUnreadNotification && <View style={styles.dot} />}
        </Pressable>
      </View>
    </View>
  );
}

const ICON_GAP = 12; // 검색·알림 아이콘 사이 (Figma 317+24 ~ 353)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: homeLayout.headerTop,
    paddingBottom: homeLayout.headerBottom,
  },
  logo: {
    width: 85.4815,
    height: 25.5001,
  },
  actions: {
    flexDirection: 'row',
    gap: ICON_GAP,
    marginTop: 1,
  },
  icon: {
    width: size.icon,
    height: size.icon,
  },
  // Figma bell 아이콘의 점: 24x24 안에서 우상단 4x4 (cx22 cy2 r2)
  dot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: homeColors.unreadDot,
  },
});
