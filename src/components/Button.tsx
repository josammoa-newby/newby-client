import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

// Figma: Sign Up Bar/btn_main (1:206)
export function Button({ title, onPress, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.button, style]}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.buttonPaddingY,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
  },
  title: {
    ...typography.button,
    color: colors.white,
  },
});
