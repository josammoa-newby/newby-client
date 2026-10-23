import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, size, spacing, typography } from '@/theme';

type Props = {
  hasUnreadNotification: boolean;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
};

// Figma 디자인 없음 — 임시 구현. 알림 점 색은 theme에 경고/빨강 토큰이 없어 primary로 대체
export function HomeHeader({ hasUnreadNotification, onSearchPress, onNotificationPress }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Newby</Text>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel="검색" onPress={onSearchPress}>
          <Image source={require('../../../assets/home/search.svg')} style={styles.icon} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="알림"
          onPress={onNotificationPress}
          style={styles.bellWrap}
        >
          <Image source={require('../../../assets/home/bell.svg')} style={styles.icon} />
          {hasUnreadNotification && <View style={styles.dot} />}
        </Pressable>
      </View>
    </View>
  );
}

const DOT_SIZE = 8;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
  },
  logo: {
    ...typography.header,
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  bellWrap: {
    width: size.icon,
    height: size.icon,
  },
  icon: {
    width: size.icon,
    height: size.icon,
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});
