import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components';
import { GreetingBanner } from '@/features/home/GreetingBanner';
import { HomeHeader } from '@/features/home/HomeHeader';
import { getHome, submitVote, type HomeData, type VoteChoice } from '@/features/home/mock';
import { PopularPostsSection } from '@/features/home/PopularPostsSection';
import { ShortcutGrid, type ShortcutKey } from '@/features/home/ShortcutGrid';
import { TipBar } from '@/features/home/TipBar';
import { VoteSection } from '@/features/home/VoteSection';
import { colors, spacing, typography } from '@/theme';

// Figma 디자인 없음(CLAUDE.md 1:173 "확정" 섹션에 홈 화면 노드가 아직 없음) — 요청 구조 + 참고 스크린샷 기준 임시 구현
export default function Home() {
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
  const [data, setData] = useState<HomeData | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const home = await getHome();
      setData(home);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleShortcut = (key: ShortcutKey) => {
    if (key === 'ai') {
      router.push('/ai');
      return;
    }
    // TODO: 캘린더/미션/커뮤니티 화면이 아직 없음 — 화면 생기면 연결
  };

  const handleVote = async (choice: VoteChoice) => {
    if (!data || data.vote.myChoice) return;
    // 낙관적 업데이트: 응답 기다리지 않고 먼저 반영, 실패하면 되돌림
    const previous = data.vote;
    setData({ ...data, vote: { ...previous, myChoice: choice, totalCount: previous.totalCount + 1 } });
    try {
      const { vote } = await submitVote(data.vote.id, choice);
      setData((prev) => (prev ? { ...prev, vote } : prev));
    } catch {
      setData((prev) => (prev ? { ...prev, vote: previous } : prev));
    }
  };

  const handlePressPost = (id: string) => {
    // TODO: 커뮤니티 상세 화면(/community/[id])이 아직 없음 — 화면 생기면 연결
  };

  if (status === 'loading') {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (status === 'error' || !data) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>홈 정보를 불러오지 못했어요</Text>
        <Button title="다시 시도" onPress={load} style={styles.retryButton} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <HomeHeader
          hasUnreadNotification={data.hasUnreadNotification}
          onSearchPress={() => {}}
          onNotificationPress={() => {}}
        />
        <GreetingBanner nickname={data.user.nickname} />
        <ShortcutGrid onPress={handleShortcut} />
        <TipBar text={data.tip.text} onPress={() => router.push('/ai')} />
        <VoteSection
          question={data.vote.question}
          totalCount={data.vote.totalCount}
          myChoice={data.vote.myChoice}
          onVote={handleVote}
        />
        <PopularPostsSection posts={data.popularPosts} onPressPost={handlePressPost} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  errorText: {
    ...typography.body,
    color: colors.textMuted,
  },
  retryButton: {
    alignSelf: 'stretch',
  },
});
