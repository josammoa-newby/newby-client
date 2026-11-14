import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { SupervisorListItem } from '@/api';
import { Button } from '@/components';
import { colors, radius, spacing, typography } from '@/theme';
import { ErrorView, LoadingView, Scaffold } from './Scaffold';
import { useSupervisors } from './useSupervisors';

const addSupervisor = () => router.push('/supervisor-setup');

function SupervisorRow({ item }: { item: SupervisorListItem }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowTop}>
        <Text style={styles.nickname}>{item.nickname}</Text>
        {item.isDefault && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>기본</Text>
          </View>
        )}
      </View>
      {item.position && <Text style={styles.caption}>{item.position}</Text>}
      <Text style={styles.type}>{item.typeName ?? item.code}</Text>
    </View>
  );
}

// 내 상사 목록 (임시 UI). 삭제 API가 없어 삭제 UI는 두지 않는다
export function SupervisorListScreen() {
  const { data, loading, error, retry } = useSupervisors();

  let body: React.ReactNode;
  if (!data && loading) body = <LoadingView />;
  else if (!data) body = <ErrorView message={error ?? ''} onRetry={retry} />;
  else if (data.length === 0) {
    body = (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>아직 등록한 상사가 없어요</Text>
        <Text style={styles.caption}>상사를 등록하면 상사 성향에 맞춰 대화를 연습할 수 있어요</Text>
        <Button title="상사 등록하기" onPress={addSupervisor} />
      </View>
    );
  } else {
    body = (
      <>
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {data.map((item) => (
            <SupervisorRow key={item.id} item={item} />
          ))}
          {error && <Text style={styles.caption}>{error}</Text>}
        </ScrollView>
        <View style={styles.footer}>
          <Button title="상사 추가" onPress={addSupervisor} />
        </View>
      </>
    );
  }

  return <Scaffold title="내 상사">{body}</Scaffold>;
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  row: {
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.cardPaddingY,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nickname: {
    ...typography.title,
    color: colors.textPrimary,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.badgePaddingY,
    borderRadius: radius.circle,
    backgroundColor: colors.surfaceSelected,
  },
  badgeText: {
    ...typography.badge,
    color: colors.primaryDark,
  },
  type: {
    ...typography.body,
    color: colors.textBody,
  },
  caption: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textMuted,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
  },
  emptyTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  footer: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
  },
});
