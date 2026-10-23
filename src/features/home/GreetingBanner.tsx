import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, spacing } from '@/theme';
import { homeLayout } from './constants';
import { MiniCalendar } from './MiniCalendar';

type Props = {
  nickname: string;
};

// Figma: banner 4:156 (361x159, radius 18, 그라데이션 143.6deg #f9a02e → #ffcc53)
export function GreetingBanner({ nickname }: Props) {
  return (
    <LinearGradient
      colors={[colors.accent, colors.primaryLight]}
      locations={[0.1902, 0.77545]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View>
        <Text style={styles.greeting}>{`${nickname}님, `}</Text>
        <Text style={[styles.greeting, styles.greetingBold]}>좋은 하루에요</Text>
      </View>
      <MiniCalendar date={new Date()} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: homeLayout.bannerHeight,
    marginHorizontal: spacing.screenPadding,
    paddingTop: homeLayout.bannerPaddingTop,
    paddingLeft: homeLayout.bannerPaddingLeft,
    paddingRight: homeLayout.bannerPaddingRight,
    borderRadius: homeLayout.bannerRadius,
    overflow: 'hidden',
  },
  greeting: {
    fontFamily: fontFamily.regular,
    fontSize: 24,
    lineHeight: 35,
    color: colors.white,
  },
  greetingBold: {
    fontFamily: fontFamily.bold,
  },
});
