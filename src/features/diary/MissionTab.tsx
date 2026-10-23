import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import { diaryColors, diaryLayout, diaryText } from './constants';
import { DiaryError, DiaryLoading } from './DiaryStatus';
import { MissionItem } from './MissionItem';
import { useMissions } from './useMissions';
import {
  formatLevelTitle,
  formatMissionProgress,
  formatRemainingXp,
  getLevelProgress,
} from './utils';

// Figma: 일기 > 미션 (7:678)
export function MissionTab() {
  const { data, loading, error, retry, saveError, toggle } = useMissions();

  if (loading && !data) return <DiaryLoading />;
  if (error || !data) {
    return <DiaryError message="미션을 불러오지 못했어요" onRetry={retry} />;
  }

  const progress = getLevelProgress(data.level);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          <Text style={diaryText.missionBannerTitle}>{data.banner.title}</Text>
          {'\n'}
          <Text style={diaryText.missionBannerSubtitle}>{data.banner.subtitle}</Text>
        </Text>
        <Image
          source={require('../../../assets/diary/banner-mascot-mission.png')}
          style={styles.bannerMascot}
          contentFit="cover"
        />
      </View>

      <View style={styles.level}>
        <View style={styles.levelRow}>
          <Text style={styles.levelTitle}>{formatLevelTitle(data.level)}</Text>
          <Text style={styles.levelRemaining}>{formatRemainingXp(data.level)}</Text>
        </View>
        <View style={styles.levelTrack}>
          <View style={[styles.levelFill, { width: `${progress * 100}%` }]}>
            <Image
              source={require('../../../assets/diary/level-bar-fill.png')}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
            <Text style={styles.levelBadge}>{`Lv.${data.level.level}`}</Text>
          </View>
        </View>
      </View>

      <View style={styles.missionHeader}>
        <Text style={styles.missionHeading}>오늘의 미션</Text>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{formatMissionProgress(data.missions)}</Text>
        </View>
      </View>

      {data.missions.length === 0 ? (
        <Text style={styles.empty}>오늘의 미션이 아직 없어요</Text>
      ) : (
        <View style={styles.list}>
          {data.missions.map((mission) => (
            <MissionItem key={mission.id} mission={mission} onPress={() => toggle(mission.id)} />
          ))}
        </View>
      )}
      {saveError && <Text style={styles.empty}>미션을 저장하지 못했어요. 다시 시도해 주세요</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: diaryLayout.tabToBanner,
    paddingBottom: spacing.xl,
  },
  banner: {
    height: diaryLayout.bannerHeight,
    marginHorizontal: spacing.screenPadding,
    borderRadius: diaryLayout.bannerRadius,
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  bannerText: {
    position: 'absolute',
    left: diaryLayout.missionTextLeft,
    top: diaryLayout.missionTextTop,
    color: colors.white,
  },
  bannerMascot: {
    position: 'absolute',
    left: diaryLayout.missionMascotLeft,
    top: diaryLayout.missionMascotTop,
    width: diaryLayout.missionMascot,
    height: diaryLayout.missionMascot,
  },
  level: {
    marginTop: diaryLayout.levelTop,
    paddingHorizontal: spacing.screenPadding,
    gap: diaryLayout.levelRowGap,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  levelTitle: {
    ...diaryText.levelTitle,
    color: colors.textLabel,
  },
  levelRemaining: {
    ...diaryText.levelRemaining,
    color: colors.textMuted,
  },
  levelTrack: {
    height: diaryLayout.levelBarHeight,
    borderRadius: radius.circle,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  levelFill: {
    height: '100%',
    justifyContent: 'center',
    paddingLeft: diaryLayout.levelLabelLeft,
    borderRadius: radius.circle,
    overflow: 'hidden',
  },
  levelBadge: {
    ...diaryText.levelBadge,
    color: colors.white,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: diaryLayout.missionTitleTop,
    marginBottom: diaryLayout.missionTitleToList,
    paddingHorizontal: spacing.gutter,
  },
  missionHeading: {
    ...diaryText.missionHeading,
    color: colors.textPrimary,
  },
  chip: {
    paddingHorizontal: spacing.answerInset,
    paddingVertical: diaryLayout.chipPaddingY,
    borderRadius: radius.circle,
    backgroundColor: diaryColors.chipBackground,
  },
  chipText: {
    ...diaryText.chip,
    color: colors.primaryDark,
  },
  list: {
    gap: spacing.md,
    paddingHorizontal: spacing.gutter,
  },
  empty: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textMuted,
  },
});
