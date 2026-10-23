import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily } from '@/theme';
import { homeLayout } from './constants';
import { MiniCalendar } from './MiniCalendar';

type Props = {
  // 이름을 못 가져왔으면 null — 이름 없이 인사말만 보여줌
  name: string | null;
};

// Figma: banner 12:1222 (393x174, #ff9f1c 단색, 화면 가장자리까지 꽉 채움 — 라운드/그라데이션 없음)
export function GreetingBanner({ name }: Props) {
  return (
    <View style={styles.container}>
      <View>
        {name ? <Text style={styles.greeting}>{`${name}님, `}</Text> : null}
        <Text style={[styles.greeting, styles.greetingBold]}>좋은 하루에요</Text>
      </View>
      <MiniCalendar date={new Date()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: homeLayout.bannerHeight,
    gap: homeLayout.bannerGreetingToCalendar,
    paddingTop: homeLayout.bannerPaddingTop,
    paddingHorizontal: homeLayout.bannerPaddingHorizontal,
    backgroundColor: colors.primary,
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
