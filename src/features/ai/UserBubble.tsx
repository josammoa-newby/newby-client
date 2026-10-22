import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, size, spacing, typography } from '@/theme';

// Figma: 사용자 질문 말풍선 (1:451)
export function UserBubble({ text }: { text: string }) {
  return (
    <View style={styles.bubble}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-end',
    maxWidth: size.bubbleMaxWidth,
    marginRight: spacing.gutter,
    paddingHorizontal: spacing.cardPaddingY,
    paddingVertical: spacing.md,
    borderTopLeftRadius: radius.bubble,
    borderTopRightRadius: radius.bubble,
    borderBottomLeftRadius: radius.bubble,
    borderBottomRightRadius: radius.bubbleCorner,
    backgroundColor: colors.bubble,
  },
  text: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
