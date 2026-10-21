import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, size, spacing, typography } from '@/theme';

type Props = {
  emoji: string;
  label: string;
  selected: boolean;
  onPress?: () => void;
};

// Figma: btn_step2 (1:266 등) — 선택 상태 배경은 1:269
export function SelectCard({ emoji, label, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: size.selectCardHeight,
    gap: spacing.cardInnerGap,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.cardPaddingY,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  cardSelected: {
    backgroundColor: colors.surfaceSelected,
  },
  emoji: {
    ...typography.cardEmoji,
    color: colors.black,
  },
  label: {
    ...typography.cardLabel,
    color: colors.textLabel,
  },
});
