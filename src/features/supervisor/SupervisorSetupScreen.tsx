import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, TextField } from '@/components';
import { colors, opacity, radius, size, spacing, typography } from '@/theme';
import type { PersonaMode } from '@/api';
import { NICKNAME_MAX_LENGTH, POSITION_MAX_LENGTH } from './constants';
import { QuestionStep } from './QuestionStep';
import { ResultView } from './ResultView';
import { ErrorView, LoadingView, Scaffold } from './Scaffold';
import { useSupervisorSetup } from './useSupervisorSetup';

const goToList = () => {
  if (router.canGoBack()) router.back();
  else router.replace('/supervisors');
};

// 상사 등록 플로우 (임시 UI). 상태·검증은 useSupervisorSetup 이 맡고 이 파일은 그리기만 한다
export function SupervisorSetupScreen({ mode }: { mode: PersonaMode }) {
  const s = useSupervisorSetup({ mode });

  if (s.stage === 'result' && s.result) {
    return (
      <Scaffold title="상사 등록 완료" onBack={goToList}>
        <ResultView supervisor={s.result} onDone={goToList} />
      </Scaffold>
    );
  }
  if (s.stage === 'loading') {
    return (
      <Scaffold title="상사 등록">
        <LoadingView />
      </Scaffold>
    );
  }
  if (s.stage === 'loadError') {
    return (
      <Scaffold title="상사 등록">
        <ErrorView message={s.loadError ?? ''} onRetry={s.reload} />
      </Scaffold>
    );
  }

  const inQuestions = s.stage === 'question';
  const nextTitle = inQuestions ? (s.isLast ? '제출' : '다음') : '다음';

  return (
    <Scaffold title="상사 등록">
      {inQuestions && (
        <View style={styles.progress}>
          <Text style={styles.progressText}>{`${s.progress}/${s.total}`}</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(s.progress / s.total) * 100}%` }]} />
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {s.stage === 'profile' ? (
          <>
            <Text style={styles.heading}>어떤 상사를 등록할까요?</Text>
            <TextField
              label="닉네임"
              placeholder="예: 김팀장"
              value={s.nickname}
              onChangeText={s.setNickname}
              maxLength={NICKNAME_MAX_LENGTH}
              autoCapitalize="none"
            />
            <TextField
              label="직급 (선택)"
              placeholder="예: 팀장"
              value={s.position}
              onChangeText={s.setPosition}
              maxLength={POSITION_MAX_LENGTH}
            />
          </>
        ) : (
          s.current && (
            <QuestionStep
              question={s.current}
              value={s.answers[s.current.id]}
              onChange={(value) => s.setAnswer(s.current!.id, value)}
            />
          )
        )}
        {s.submitError && <Text style={styles.error}>{s.submitError}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        {inQuestions && (
          <Pressable
            accessibilityRole="button"
            disabled={s.submitting}
            onPress={s.prev}
            style={styles.prev}
          >
            <Text style={styles.prevText}>이전</Text>
          </Pressable>
        )}
        <Button
          title={s.submitError && s.isLast ? '다시 시도' : nextTitle}
          loading={s.submitting}
          onPress={s.canNext ? s.next : undefined}
          style={[styles.next, !s.canNext && styles.disabled]}
        />
      </View>
    </Scaffold>
  );
}

const styles = StyleSheet.create({
  progress: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
  },
  progressText: {
    ...typography.label,
    color: colors.textMuted,
  },
  track: {
    height: size.progressTrack,
    borderRadius: radius.circle,
    backgroundColor: colors.line,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.circle,
    backgroundColor: colors.primary,
  },
  content: {
    gap: spacing.xl,
    flexGrow: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  heading: {
    ...typography.stepTitle,
    color: colors.textPrimary,
  },
  error: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.primaryDark,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
  },
  prev: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.line,
  },
  prevText: {
    ...typography.button,
    color: colors.textLabel,
  },
  next: {
    flex: 1,
  },
  disabled: {
    opacity: opacity.disabled,
  },
});
