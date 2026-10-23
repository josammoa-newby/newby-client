import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components';
import { useSupervisor } from '@/features/supervisor/SupervisorContext';
import { colors, spacing, typography } from '@/theme';

// 임시 화면 — 결과 카드는 feature/supervisor-result 브랜치에서 교체
export default function SupervisorResult() {
  const insets = useSafeAreaInsets();
  const { form, reset } = useSupervisor();
  const supervisor = form.result;

  const handleDone = () => {
    reset();
    router.replace('/home');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
      <Text style={styles.title}>상사 등록 완료</Text>
      {/* 서버 연동 전 mock 화면임을 알리는 임시 배지 — feature/supervisor-result 브랜치에서 실제 결과 카드로 교체 */}
      <Text style={styles.mockBadge}>Mock 화면 · 결과 카드는 다음 브랜치에서 교체 예정</Text>
      <Text style={styles.code}>{supervisor?.code ?? '-'}</Text>
      <Text style={styles.nickname}>{supervisor?.nickname ?? ''}</Text>
      <View style={styles.footer}>
        <Button title="확인" onPress={handleDone} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: colors.white,
  },
  title: {
    ...typography.stepTitle,
    color: colors.textPrimary,
  },
  mockBadge: {
    ...typography.caption,
    color: colors.accent,
    marginTop: spacing.sm,
  },
  code: {
    ...typography.header,
    color: colors.primary,
    marginTop: spacing.xl,
  },
  nickname: {
    ...typography.body,
    color: colors.textLabel,
    marginTop: spacing.sm,
  },
  footer: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
  },
});
