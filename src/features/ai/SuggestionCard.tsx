import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, size, spacing, typography } from '@/theme';

type Props = {
  title: string;
  description: string;
  onPress: () => void;
};

// Figma: 예시 질문 카드 (1:399, 1:402)
export function SuggestionCard({ title, description, onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      <Text numberOfLines={1} style={styles.description}>
        {description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: size.suggestionCardWidth,
    gap: spacing.xs,
    paddingHorizontal: spacing.cardPaddingY,
    // 테두리 1px 를 안쪽에 포함하므로 15 - 1
    paddingVertical: spacing.inputPaddingY,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.chip,
  },
  title: {
    ...typography.suggestionTitle,
    color: colors.textPrimary,
  },
  description: {
    ...typography.suggestionBody,
    color: colors.textMuted,
  },
});
