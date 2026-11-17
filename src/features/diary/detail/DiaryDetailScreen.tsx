import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, size, spacing, typography } from '@/theme';
import { DiaryError, DiaryLoading } from '../DiaryStatus';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { DiaryCard } from './DiaryCard';
import { formatDiaryDate } from './format';
import { useDiaryActions } from './useDiaryActions';
import { useDiaryDay } from './useDiaryDay';

const close = () => {
  if (router.canGoBack()) router.back();
  else router.replace('/diary');
};

// 일기 상세: 선택한 날짜의 일기들을 작성순으로 보여준다 (Figma 디자인 없음, 임시 UI)
export function DiaryDetailScreen({ date }: { date: string }) {
  const insets = useSafeAreaInsets();
  const day = useDiaryDay(date);
  const actions = useDiaryActions({
    diaries: day.diaries,
    setAnalysis: day.setAnalysis,
    removeLocal: day.removeLocal,
  });

  // 모든 일기가 삭제돼 목록이 비면 이전 화면(캘린더)으로 돌아간다
  const emptied = day.diaries !== null && day.diaries.length === 0;
  useEffect(() => {
    if (emptied) close();
  }, [emptied]);

  let body: React.ReactNode;
  if (day.loading && !day.diaries) {
    body = <DiaryLoading />;
  } else if (day.error && !day.diaries) {
    body = <DiaryError message={day.error} onRetry={day.retry} />;
  } else if (!day.diaries || day.diaries.length === 0) {
    body = <DiaryLoading />;
  } else {
    body = (
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {day.diaries.map((diary) => (
          <DiaryCard
            key={diary.id}
            diary={diary}
            analyzing={actions.analyzingIds.has(diary.id)}
            analyzeError={actions.analyzeErrors[diary.id]}
            onEdit={() => router.push({ pathname: '/diary-write', params: { id: diary.id } })}
            onDelete={() => actions.askDelete(diary.id)}
            onAnalyze={(force) => void actions.analyze(diary.id, force)}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="뒤로가기" hitSlop={16} onPress={close}>
          <Image source={require('../../../../assets/signup/back-arrow.svg')} style={styles.back} />
        </Pressable>
        <Text style={styles.title}>{formatDiaryDate(date)}</Text>
      </View>
      {body}
      <DeleteConfirmModal
        visible={actions.deleteTarget !== null}
        revokesXp={actions.deleteIsLastOfDay}
        deleting={actions.deleting}
        error={actions.deleteError}
        onCancel={actions.cancelDelete}
        onConfirm={() => void actions.confirmDelete()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.lg,
  },
  back: {
    width: size.backArrowWidth,
    height: size.backArrowHeight,
  },
  title: {
    ...typography.header,
    color: colors.textPrimary,
  },
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
});
