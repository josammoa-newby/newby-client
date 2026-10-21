import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, size, spacing, typography } from '@/theme';

type Props = {
  label: string;
  selected: boolean;
  onPress?: () => void;
};

// Figma: STEP3 선택지 (1:280, 1:297) — 선택 상태는 Figma에 없어 SelectCard 선택 배경을 임시 적용
export function OptionButton({ label, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.option, selected && styles.optionSelected]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    height: size.optionHeight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.card,
  },
  optionSelected: {
    backgroundColor: colors.surfaceSelected,
  },
  label: {
    ...typography.option,
    color: colors.textLabel,
  },
});
