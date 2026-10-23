import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components';
import { colors, fontFamily, opacity, spacing, typography } from '@/theme';
import { ChoiceCard } from './ChoiceCard';
import { voteLayout } from './constants';
import type { VoteChoice } from './types';
import { useTodayVote } from './useTodayVote';
import { formatMonthDay } from './utils';
import { VoteHeader } from './VoteHeader';
import { VoteError, VoteLoading } from './VoteStatus';
import { VoteTitle } from './VoteTitle';

// Figma: 퀴즈 17:1420(선택 전) · 17:1447(선택 후) — 같은 화면의 상태 변화라 한 라우트로 구현
export function VoteScreen() {
  const insets = useSafeAreaInsets();
  const { vote, loading, error, retry, submit, submitting, submitError } = useTodayVote();
  const [selected, setSelected] = useState<VoteChoice | null>(null);

  const handleClose = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/home');
  };

  const header = (
    <VoteHeader
      onClosePress={handleClose}
      onSearchPress={() => {
        // TODO: 검색·알림 화면이 아직 없음 — 화면 생기면 연결
      }}
      onNotificationPress={() => {}}
    />
  );

  if (!vote) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {header}
        {loading && !error ? (
          <VoteLoading />
        ) : (
          <VoteError message="오늘의 투표를 불러오지 못했어요" onRetry={retry} />
        )}
      </View>
    );
  }

  // 이미 투표한 상태면 서버 값이 우선이고 선택을 바꿀 수 없다
  const locked = vote.myChoice !== null;
  const current = vote.myChoice ?? selected;

  const handleNext = async () => {
    if (!current || submitting) return;
    if (!locked) {
      const updated = await submit(current);
      if (!updated) return;
    }
    router.push({ pathname: '/vote/result', params: { voteId: vote.id } });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {header}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <VoteTitle />
        <Text style={styles.date}>{`${formatMonthDay(vote.voteDate)} 질문`}</Text>
        <Text style={styles.question}>{vote.question}</Text>
        <View style={styles.cards}>
          {vote.options.map((option) => (
            <ChoiceCard
              key={option.id}
              choice={option.choice}
              label={option.label}
              selected={current === option.choice}
              disabled={locked || submitting}
              onPress={() => setSelected(option.choice)}
            />
          ))}
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, voteLayout.footerBottom) }]}>
        {submitError && (
          <Text style={styles.errorText}>투표를 저장하지 못했어요. 다시 시도해 주세요</Text>
        )}
        {/* 선택 전에는 비활성 (Figma에 비활성 디자인 없음, 공통 disabled 투명도 사용) */}
        <View
          pointerEvents={current ? 'auto' : 'none'}
          style={!current && styles.disabled}
        >
          <Button title="다음" onPress={handleNext} loading={submitting} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: voteLayout.titleTop,
  },
  date: {
    ...typography.question,
    fontFamily: fontFamily.medium,
    lineHeight: 26,
    marginTop: voteLayout.titleToDate,
    color: colors.textMuted,
  },
  question: {
    ...typography.completeTitle,
    marginTop: voteLayout.dateToQuestion,
    color: colors.textPrimary,
  },
  cards: {
    flexDirection: 'row',
    gap: voteLayout.cardGap,
    marginTop: voteLayout.questionToCards,
  },
  footer: {
    gap: spacing.sm,
    paddingTop: voteLayout.footerTop,
    paddingHorizontal: spacing.screenPadding,
  },
  disabled: {
    opacity: opacity.disabled,
  },
  errorText: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textMuted,
  },
});
