import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, opacity, radius, size, spacing, typography } from '@/theme';
import {
  FEEDBACK_ALREADY,
  FEEDBACK_HELPFUL,
  FEEDBACK_NEW_NOTE,
  FEEDBACK_NOT_HELPFUL,
  FEEDBACK_QUESTION,
  FEEDBACK_REASON_LABEL,
  FEEDBACK_SCORE_ADJUSTED,
  FEEDBACK_SEND,
  FEEDBACK_SKIP_REASON,
  FEEDBACK_THANKS,
  MAX_REACTION_LENGTH,
  RETRY_LABEL,
} from './constants';
import type { FeedbackState } from './useAiFeedback';

type Props = {
  state: FeedbackState;
  onHelpful: () => void;
  onNotHelpful: () => void;
  onReasonChange: (text: string) => void;
  onSendReason: () => void;
  onSkipReason: () => void;
  onRetry: () => void;
};

// 답변 카드 하단 피드백 박스 (Figma 디자인 없음, 임시 UI). 상태는 useAiFeedback 이 맡고 여기서는 그리기만 한다
export function FeedbackBox({
  state,
  onHelpful,
  onNotHelpful,
  onReasonChange,
  onSendReason,
  onSkipReason,
  onRetry,
}: Props) {
  const { status, helpful, reason, error, result } = state;
  const sending = status === 'sending';

  if (status === 'done' && result) {
    return (
      <View style={styles.box}>
        {result.alreadyExists ? (
          <Text style={styles.body}>{FEEDBACK_ALREADY}</Text>
        ) : (
          <>
            {result.newNote && <Text style={styles.body}>{`${FEEDBACK_NEW_NOTE}${result.newNote}`}</Text>}
            {result.scoreAdjusted && <Text style={styles.body}>{FEEDBACK_SCORE_ADJUSTED}</Text>}
            {!result.newNote && !result.scoreAdjusted && <Text style={styles.body}>{FEEDBACK_THANKS}</Text>}
          </>
        )}
      </View>
    );
  }

  // 👎 사유 입력 (전송 중이거나 실패해도 입력값을 유지한 채 이 폼을 계속 보여준다)
  if (helpful === false && status !== 'idle') {
    return (
      <View style={styles.box}>
        <Text style={styles.label}>{FEEDBACK_REASON_LABEL}</Text>
        <TextInput
          multiline
          editable={!sending}
          value={reason}
          onChangeText={onReasonChange}
          maxLength={MAX_REACTION_LENGTH}
          placeholderTextColor={colors.placeholder}
          style={styles.input}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.row}>
          <Pressable
            accessibilityRole="button"
            disabled={sending}
            onPress={onSendReason}
            style={[styles.primary, sending && styles.disabled]}
          >
            {sending ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.primaryText}>{error ? RETRY_LABEL : FEEDBACK_SEND}</Text>
            )}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={sending}
            onPress={onSkipReason}
            style={[styles.secondary, sending && styles.disabled]}
          >
            <Text style={styles.secondaryText}>{FEEDBACK_SKIP_REASON}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // 👍 전송 중/실패
  if (helpful === true && status !== 'idle') {
    return (
      <View style={styles.box}>
        {sending ? <ActivityIndicator color={colors.primary} style={styles.spinner} /> : null}
        {error && <Text style={styles.error}>{error}</Text>}
        {status === 'error' && (
          <Pressable accessibilityRole="button" onPress={onRetry} style={styles.secondary}>
            <Text style={styles.secondaryText}>{RETRY_LABEL}</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={styles.box}>
      <Text style={styles.label}>{FEEDBACK_QUESTION}</Text>
      <View style={styles.row}>
        <Pressable accessibilityRole="button" onPress={onHelpful} style={styles.secondary}>
          <Text style={styles.secondaryText}>{FEEDBACK_HELPFUL}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onNotHelpful} style={styles.secondary}>
          <Text style={styles.secondaryText}>{FEEDBACK_NOT_HELPFUL}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignSelf: 'stretch',
    maxWidth: size.aiCardMaxWidth,
    marginLeft: spacing.lg,
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.input,
    backgroundColor: colors.surface,
  },
  label: {
    ...typography.label,
    color: colors.textLabel,
  },
  body: {
    ...typography.body,
    color: colors.textLabel,
  },
  input: {
    ...typography.body,
    minHeight: spacing.xl * 2,
    padding: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  error: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  primary: {
    minWidth: size.actionButtonWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.answerInset,
    paddingVertical: spacing.sm,
    borderRadius: radius.circle,
    backgroundColor: colors.primary,
  },
  primaryText: {
    ...typography.action,
    color: colors.white,
  },
  secondary: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.answerInset,
    paddingVertical: spacing.sm,
    borderRadius: radius.circle,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  secondaryText: {
    ...typography.action,
    color: colors.textLabel,
  },
  disabled: {
    opacity: opacity.disabled,
  },
  spinner: {
    alignSelf: 'flex-start',
  },
});
