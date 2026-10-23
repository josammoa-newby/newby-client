import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components';
import { AiPromoCard } from '@/features/home/AiPromoCard';
import { GreetingBanner } from '@/features/home/GreetingBanner';
import { HomeHeader } from '@/features/home/HomeHeader';
import { getHome, markNotificationsRead, type HomeData } from '@/features/home/mock';
import { PopularPostsSection } from '@/features/home/PopularPostsSection';
import { ShortcutGrid, type ShortcutKey } from '@/features/home/ShortcutGrid';
import { TipBar } from '@/features/home/TipBar';
import { VoteSection } from '@/features/home/VoteSection';
import { colors, spacing, typography } from '@/theme';

// Figma: newby 파일 main (4:155)
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
    // diary는 탭 화면(싱글 인스턴스)이라 push 대신 navigate를 써야 이미 마운트된 화면의
    // params가 제대로 갱신됨 (push는 스택에 새로 쌓으려는 의도라 탭 전환에는 안 맞음)
    if (key === 'calendar') {
      router.navigate({ pathname: '/diary', params: { tab: 'calendar' } });
      return;
    }
    if (key === 'mission') {
      router.navigate({ pathname: '/diary', params: { tab: 'mission' } });
      return;
    }
    if (key === 'customize') {
      router.push('/customize');
      return;
    }
    // TODO: 커뮤니티 화면이 아직 없음 — 화면 생기면 연결
  };

  const handleNotificationPress = () => {
    // 알림 화면이 아직 없어 점만 끔. 낙관적 업데이트 (실패해도 다음 로드 때 서버 값으로 맞춰짐)
    setData((prev) => (prev ? { ...prev, hasUnreadNotification: false } : prev));
    markNotificationsRead().catch(() => {});
    // TODO: 알림 화면이 생기면 이동 연결
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
      <HomeHeader
        hasUnreadNotification={data.hasUnreadNotification}
        onSearchPress={() => {}}
        onNotificationPress={handleNotificationPress}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <GreetingBanner nickname={data.user.nickname} />
        <ShortcutGrid onPress={handleShortcut} />
        <TipBar text={data.tip.text} onPress={() => router.push('/ai')} />
        <AiPromoCard onPress={() => router.push('/ai')} />
        <VoteSection
          question={data.vote.question}
          totalCount={data.vote.totalCount}
          onPress={() => router.push('/vote')}
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
