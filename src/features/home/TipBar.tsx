import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  text: string;
  onPress: () => void;
};

// Figma 디자인 없음 — 임시 구현
export function TipBar({ text, onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.badge}>TIP</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
      <Text style={styles.chevron}>{'›'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.screenPadding,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.chip,
    backgroundColor: colors.surfaceSelected,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
  badge: {
    ...typography.badge,
    color: colors.primary,
  },
  text: {
    ...typography.caption,
    color: colors.textLabel,
    flexShrink: 1,
  },
  chevron: {
    ...typography.body,
    color: colors.placeholder,
  },
});
