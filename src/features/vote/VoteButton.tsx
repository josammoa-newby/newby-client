import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  title: string;
  // 선택 전에는 회색 비활성 버튼
  enabled: boolean;
  loading?: boolean;
  onPress: () => void;
};

// 공용 Button 은 색을 바꿀 수 없어서(공유 파일) 투표 화면 전용으로 만듦.
// 활성: Sign Up Bar/btn_main 과 같은 주황, 비활성: 회색 (요청받은 디자인)
export function VoteButton({ title, enabled, loading = false, onPress }: Props) {
  const disabled = !enabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !enabled, busy: loading }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, enabled ? styles.enabled : styles.disabled]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} style={styles.indicator} />
      ) : (
        <Text style={[styles.title, { color: enabled ? colors.white : colors.textMuted }]}>
          {title}
        </Text>
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
  },
  enabled: {
    backgroundColor: colors.primary,
  },
  disabled: {
    backgroundColor: colors.line,
  },
  title: {
    ...typography.button,
  },
  // 버튼 높이(라벨 줄높이 24)가 변하지 않도록 고정
  indicator: {
    height: typography.button.lineHeight,
  },
});
