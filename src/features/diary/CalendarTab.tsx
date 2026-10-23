import { Image } from 'expo-image';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { apiErrorMessage } from '@/api';
import { ApiError } from '@/api/errors';
import { colors, radius, spacing, typography } from '@/theme';
import { CalendarGrid } from './CalendarGrid';
import { diaryLayout, diaryText } from './constants';
import { DiaryError, DiaryLoading } from './DiaryStatus';
import { useDiaryCalendar } from './useDiaryCalendar';
import { formatMonthTitle, formatRecordMessage } from './utils';

// Figma: 일기 > 캘린더 (7:418)
export function CalendarTab() {
  const { data, loading, error, retry, saving, saveError, addTodayEntry } = useDiaryCalendar();
  const recordedDates = useMemo(
    () => new Set(data?.entries.map((entry) => entry.date) ?? []),
    [data],
  );

  if (loading && !data) return <DiaryLoading />;
  if (error || !data) {
    const message = error instanceof ApiError ? apiErrorMessage(error) : '일기 정보를 불러오지 못했어요';
    return <DiaryError message={message} onRetry={retry} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Image
            source={require('../../../assets/diary/banner-mascot-calendar.png')}
            style={styles.bannerMascot}
            contentFit="cover"
          />
          <View style={styles.bannerText}>
            <Text style={styles.bannerName}>{`${data.user.nickname}님`}</Text>
            <Text style={styles.bannerMessage}>{formatRecordMessage(data.recordCount)}</Text>
          </View>
        </View>

        <Text style={styles.month}>{formatMonthTitle(data.year, data.month)}</Text>
        <CalendarGrid year={data.year} month={data.month} recordedDates={recordedDates} />
        {saveError && <Text style={styles.saveError}>일기를 저장하지 못했어요. 다시 시도해 주세요</Text>}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="일기 쓰기"
        accessibilityState={{ busy: saving }}
        disabled={saving}
        onPress={addTodayEntry}
        style={styles.fab}
      >
        <Image source={require('../../../assets/diary/plus.svg')} style={styles.fabIcon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: diaryLayout.tabToBanner,
    // 마지막 줄이 + 버튼과 탭바에 가려지지 않게 한다
    paddingBottom: diaryLayout.fab + spacing.lg * 2,
  },
  banner: {
    height: diaryLayout.bannerHeight,
    marginHorizontal: spacing.screenPadding,
    borderRadius: diaryLayout.bannerRadius,
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  bannerMascot: {
    position: 'absolute',
    left: diaryLayout.calendarMascotOffset,
    top: diaryLayout.calendarMascotOffset,
    width: diaryLayout.calendarMascot,
    height: diaryLayout.calendarMascot,
  },
  bannerText: {
    position: 'absolute',
    left: diaryLayout.calendarTextLeft,
    top: diaryLayout.calendarTextTop,
    right: spacing.lg,
    gap: spacing.xs,
  },
  bannerName: {
    ...diaryText.bannerName,
    color: colors.white,
  },
  bannerMessage: {
    ...diaryText.bannerMessage,
    color: colors.white,
  },
  month: {
    ...diaryText.month,
    marginTop: diaryLayout.monthTop,
    marginBottom: diaryLayout.monthToWeekdays,
    marginLeft: diaryLayout.monthLeft,
    color: colors.textPrimary,
  },
  saveError: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textMuted,
  },
  fab: {
    position: 'absolute',
    right: spacing.screenPadding,
    bottom: spacing.lg,
    width: diaryLayout.fab,
    height: diaryLayout.fab,
    borderRadius: radius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: diaryLayout.fabShadowRadius,
    elevation: 6,
  },
  fabIcon: {
    width: diaryLayout.fabIcon,
    height: diaryLayout.fabIcon,
  },
});
