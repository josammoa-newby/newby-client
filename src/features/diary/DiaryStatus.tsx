import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components';
import { colors, spacing, typography } from '@/theme';

// 로딩 / 에러(재시도) 공용 화면. 빈 데이터 상태는 각 탭에서 직접 그린다
export function DiaryLoading() {
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

export function DiaryError({ message, onRetry }: ErrorProps) {
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
