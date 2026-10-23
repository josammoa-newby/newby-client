import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components';
import { colors, fontFamily, opacity, size, spacing, typography } from '@/theme';
import { homeColors, homeLayout } from './constants';
import { formatVoteCount } from './format';
import { getVote, submitVote, type HomeVote, type VoteChoice } from './mock';

// 홈 "오늘의 투표" 섹션을 탭하면 오는 화면. 실제 투표는 여기서만 함 (Figma 디자인 없음 — 홈 카드 스타일 재사용)
export function VoteScreen() {
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
  const [vote, setVote] = useState<HomeVote | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const { vote } = await getVote();
      setVote(vote);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleVote = async (choice: VoteChoice) => {
    if (!vote || vote.myChoice) return;
    const previous = vote;
    setVote({ ...previous, myChoice: choice, totalCount: previous.totalCount + 1 });
    try {
      const { vote: updated } = await submitVote(previous.id, choice);
      setVote(updated);
    } catch {
      setVote(previous);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
          hitSlop={16}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Image source={require('../../../assets/signup/back-arrow.svg')} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.headerTitle}>오늘의 투표</Text>
        <View style={styles.headerSpacer} />
      </View>

      {status === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}

      {status === 'error' && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>투표 정보를 불러오지 못했어요</Text>
          <Button title="다시 시도" onPress={load} />
        </View>
      )}

      {status === 'ready' && vote && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.textBlock}>
              <Text style={styles.question}>{vote.question}</Text>
              <Text style={styles.count}>{`${formatVoteCount(vote.totalCount)}명이 투표했어요!`}</Text>
            </View>
            <View style={styles.choices}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="O 선택"
                accessibilityState={{ selected: vote.myChoice === 'O', disabled: !!vote.myChoice }}
                disabled={!!vote.myChoice}
                onPress={() => handleVote('O')}
                style={!!vote.myChoice && vote.myChoice !== 'O' && styles.unselected}
              >
                <Image source={require('../../../assets/home/vote-o.svg')} style={styles.choice} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="X 선택"
                accessibilityState={{ selected: vote.myChoice === 'X', disabled: !!vote.myChoice }}
                disabled={!!vote.myChoice}
                onPress={() => handleVote('X')}
                style={!!vote.myChoice && vote.myChoice !== 'X' && styles.unselected}
              >
                <Image source={require('../../../assets/home/vote-x.svg')} style={styles.choice} />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: homeLayout.headerTop,
    paddingBottom: homeLayout.headerBottom,
  },
  backButton: {
    width: size.icon,
    height: size.icon,
    justifyContent: 'center',
  },
  backIcon: {
    width: size.backArrowWidth,
    height: size.backArrowHeight,
  },
  headerTitle: {
    ...typography.header,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: size.icon,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
  },
  errorText: {
    ...typography.body,
    color: colors.textMuted,
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  card: {
    gap: spacing.lg,
    padding: spacing.cardPaddingY,
    borderRadius: homeLayout.voteCardRadius,
    backgroundColor: colors.surface,
  },
  textBlock: {
    gap: 4,
  },
  question: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textLabel,
  },
  count: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 24,
    color: homeColors.voteCount,
  },
  choices: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: homeLayout.voteChoiceGap,
  },
  choice: {
    width: homeLayout.voteChoiceWidth,
    height: homeLayout.voteChoiceHeight,
  },
  unselected: {
    opacity: opacity.disabled,
  },
});
