import { Image } from 'expo-image';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components';
import { colors, size, spacing, typography } from '@/theme';

export function closeScreen(fallback: '/profile' | '/supervisors' = '/profile') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

type ScaffoldProps = {
  title: string;
  onBack?: () => void;
  children: ReactNode;
};

// 임시 UI 공통 틀: 안전 영역 + 뒤로가기 + 제목
export function Scaffold({ title, onBack = () => closeScreen(), children }: ScaffoldProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="뒤로가기" hitSlop={16} onPress={onBack}>
          <Image source={require('../../../assets/signup/back-arrow.svg')} style={styles.back} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export function LoadingView({ message }: { message?: string }) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.centered}>
      <Text style={styles.message}>{message}</Text>
      <Button title="다시 시도" onPress={onRetry} />
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
  },
  message: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textMuted,
  },
});
