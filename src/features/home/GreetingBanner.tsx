import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { colors, gradients, radius, spacing, typography } from '@/theme';
import { MiniCalendar } from './MiniCalendar';

type Props = {
  nickname: string;
};

// Figma 디자인 없음 — 임시 구현. 그라데이션은 AiMascot과 같은 토큰(gradients.mascot) 재사용
export function GreetingBanner({ nickname }: Props) {
  return (
    <LinearGradient
      colors={gradients.mascot}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.greeting}>{`${nickname}님,\n좋은 하루에요`}</Text>
      <MiniCalendar date={new Date()} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: spacing.screenPadding,
    marginTop: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.aiCard,
  },
  greeting: {
    ...typography.header,
    color: colors.white,
    flexShrink: 1,
  },
});
