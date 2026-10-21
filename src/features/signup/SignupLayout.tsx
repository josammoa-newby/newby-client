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
  progress: number;
  title: string;
  children: ReactNode;
  onNext: () => void;
  loading?: boolean;
  // 검증/요청 실패 문구 (Figma에 에러 디자인이 없어 임시)
  error?: string | null;
};

// 회원가입 STEP 공통 레이아웃: 헤더(뒤로가기+진행 막대) / 스크롤 영역 / 하단 "다음" 버튼
export function SignupLayout({ progress, title, children, onNext, loading, error }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + signupLayout.headerTop },
      ]}
    >
      <View style={styles.padded}>
        <StepHeader title="회원가입" progress={progress} onBack={() => router.back()} />
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
          <Button title="다음" onPress={onNext} loading={loading} />
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
