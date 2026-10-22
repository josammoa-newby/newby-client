import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { colors, radius, size, spacing } from '@/theme';

// 햄버거 아이콘은 Figma 에서 도형 3개로 구성됨 (1:391)
const MENU_BARS = { width: 17, height: 2.048, left: 3, tops: [5, 10.7, 16.41] } as const;
const STAR_SIZE = 20.2369;

function MenuIcon() {
  return (
    <View style={styles.icon}>
      {MENU_BARS.tops.map((top) => (
        <View key={top} style={[styles.bar, { top }]} />
      ))}
    </View>
  );
}

// Figma: AI 헤더 (1:389). 아이콘은 표시만 하고 동작은 Figma에 정의되어 있지 않음
export function AiHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <MenuIcon />
        <View style={styles.icon}>
          <Image source={require('../../../assets/ai/header-star.svg')} style={styles.star} />
        </View>
      </View>
      <Image source={require('../../../assets/ai/settings.svg')} style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.chatGap,
  },
  icon: {
    width: size.icon,
    height: size.icon,
  },
  bar: {
    position: 'absolute',
    left: MENU_BARS.left,
    width: MENU_BARS.width,
    height: MENU_BARS.height,
    borderRadius: radius.circle,
    backgroundColor: colors.textPrimary,
  },
  star: {
    position: 'absolute',
    left: (size.icon - STAR_SIZE) / 2,
    top: (size.icon - STAR_SIZE) / 2,
    width: STAR_SIZE,
    height: STAR_SIZE,
  },
});
