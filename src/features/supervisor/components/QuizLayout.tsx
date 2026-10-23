import { router } from 'expo-router';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, StepHeader } from '@/components';
import { colors, signupLayout, spacing, typography } from '@/theme';

type Props = {
  // 0 ~ 1
  progress: number;
  title: string;
  children: ReactNode;
  onNext: () => void;
  nextLabel?: string;
  loading?: boolean;
  // 검증/요청 실패 문구
  error?: string | null;
  onBack?: () => void;
};

// 상사 성향 질문지 공통 레이아웃 (회원가입 SignupLayout과 동일 구조: 헤더 + 스크롤 + 하단 버튼)
export function QuizLayout({
  progress,
  title,
  children,
  onNext,
  nextLabel = '다음',
  loading,
  error,
  onBack,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + signupLayout.headerTop }]}>
      <View style={styles.padded}>
        <StepHeader title="상사 추가" progress={progress} onBack={onBack ?? (() => router.back())} />
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{title}</Text>
          {children}
        </ScrollView>
        <View style={styles.footer}>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title={nextLabel} onPress={onNext} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.screenPadding,
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: signupLayout.headerToTitle,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.stepTitle,
    color: colors.textPrimary,
  },
  footer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: signupLayout.footerBottom,
  },
  error: {
    ...typography.caption,
    color: colors.primary,
  },
});
