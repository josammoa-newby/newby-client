import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  title: string;
  onPress?: () => void;
  // 로딩 중에는 라벨 대신 인디케이터를 보여주고 눌러도 동작하지 않음
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Figma: Sign Up Bar/btn_main (1:206) — 로딩 상태는 Figma에 없는 임시 디자인
export function Button({ title, onPress, loading = false, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: loading, busy: loading }}
      disabled={loading}
      onPress={onPress}
      style={[styles.button, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} style={styles.indicator} />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
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
  // 버튼 높이(라벨 줄높이 24)가 변하지 않도록 고정
  indicator: {
    height: typography.button.lineHeight,
  },
});
