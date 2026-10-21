import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, signupLayout, size, typography } from '@/theme';

type Props = {
  title: string;
  // 0 ~ 1
  progress: number;
  onBack?: () => void;
};

// Figma: Sign Up Bar (1:24 / 1:30 / 1:36) — 뒤로가기 + 제목 + 진행 막대
export function StepHeader({ title, progress, onBack }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
          hitSlop={16}
          onPress={onBack}
          style={styles.back}
        >
          <Image
            source={require('../../assets/signup/back-arrow.svg')}
            style={styles.arrow}
          />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: signupLayout.headerGap,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    left: 0,
  },
  arrow: {
    width: size.backArrowWidth,
    height: size.backArrowHeight,
  },
  title: {
    ...typography.header,
    color: colors.textBody,
  },
  track: {
    height: size.progressTrack,
    borderRadius: radius.circle,
    backgroundColor: colors.line,
  },
  fill: {
    height: size.progressTrack,
    borderRadius: radius.circle,
    backgroundColor: colors.primaryLight,
  },
});
