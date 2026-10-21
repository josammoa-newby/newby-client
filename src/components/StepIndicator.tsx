import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, signupLayout, size, typography } from '@/theme';

type Props = {
  current: number;
  total: number;
};

// Figma: STEP3 질문 진행 표시 "1 / 2" (1:288, 1:307)
export function StepIndicator({ current, total }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.bar, { backgroundColor: i < current ? colors.primary : colors.line }]}
        />
      ))}
      <Text style={styles.text}>{`${current} / ${total}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: signupLayout.indicatorGap,
  },
  bar: {
    width: size.indicatorBarWidth,
    height: size.indicatorBarHeight,
    borderRadius: radius.indicator,
  },
  text: {
    ...typography.caption,
    color: colors.placeholder,
  },
});
