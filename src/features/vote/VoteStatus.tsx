import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components';
import { colors, spacing, typography } from '@/theme';

// 로딩 중 화면 (스켈레톤 대신 ActivityIndicator)
export function VoteLoading() {
  return (
    <View style={styles.centered}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

type ErrorProps = {
  message: string;
  onRetry: () => void;
};

// 에러 화면: 메시지 + 다시 시도 버튼
export function VoteError({ message, onRetry }: ErrorProps) {
  return (
    <View style={styles.centered}>
      <Text style={styles.message}>{message}</Text>
      <Button title="다시 시도" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
  },
});
