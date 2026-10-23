import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { homeColors } from '@/features/home/constants';
import { size, spacing } from '@/theme';
import { diaryLayout } from './constants';

type Props = {
  hasUnreadNotification: boolean;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
};

// Figma: 일기 7:418 > 헤더 (로고 + 검색·알림). 알림 빨간 점은 안 읽은 알림이 있을 때만 표시
export function DiaryHeader({ hasUnreadNotification, onSearchPress, onNotificationPress }: Props) {
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: diaryLayout.headerTop,
    paddingBottom: diaryLayout.headerBottom,
  },
  logo: {
    width: 85.4815,
    height: 25.5001,
  },
  actions: {
    flexDirection: 'row',
    gap: diaryLayout.headerIconGap,
    marginTop: 1,
  },
  icon: {
    width: size.icon,
    height: size.icon,
  },
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
