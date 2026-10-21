import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  text: string;
  onPress: () => void;
};

// Figma: 후속 질문 칩 (1:449)
export function FollowUpChip({ text, onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.chip}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    marginLeft: spacing.lg,
    // 테두리 1px 를 안쪽에 포함하므로 14 - 1, 10 - 1
    paddingHorizontal: spacing.answerInset - 1,
    paddingVertical: spacing.md - 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.circle,
    backgroundColor: colors.white,
  },
  text: {
    ...typography.body,
    color: colors.textLabel,
  },
});
