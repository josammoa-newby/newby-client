import { Pressable, StyleSheet, Text, View } from 'react-native';

import { isSituationQuestion } from '@/api';
import type { PersonaAnswer, PersonaQuestion } from '@/api';
import { colors, radius, spacing, typography } from '@/theme';
import { LIKERT_MAX_LABEL, LIKERT_MIN_LABEL, LIKERT_VALUES, supervisorLayout } from './constants';

type Props = {
  question: PersonaQuestion;
  value: PersonaAnswer | undefined;
  onChange: (value: PersonaAnswer) => void;
};

// 문항 하나. 리커트는 1~5(양 끝 라벨), 상황형은 보기 선택
export function QuestionStep({ question, value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question.text}</Text>
      {isSituationQuestion(question) ? (
        <View style={styles.options}>
          {question.options.map((option) => {
            const selected = value === option.key;
            return (
              <Pressable
                key={option.key}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => onChange(option.key)}
                style={[styles.option, selected ? styles.optionSelected : styles.optionIdle]}
              >
                <Text style={[styles.optionKey, selected && styles.optionKeySelected]}>
                  {option.key.toUpperCase()}
                </Text>
                <Text style={styles.optionText}>{option.text}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={styles.likert}>
          <View style={styles.likertRow}>
            {LIKERT_VALUES.map((n) => {
              const selected = value === n;
              return (
                <Pressable
                  key={n}
                  accessibilityRole="radio"
                  accessibilityLabel={`${n}점`}
                  accessibilityState={{ selected }}
                  onPress={() => onChange(n)}
                  style={[styles.likertButton, selected ? styles.optionSelected : styles.optionIdle]}
                >
                  <Text style={[styles.likertText, selected && styles.optionKeySelected]}>{n}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.likertLabels}>
            <Text style={styles.caption}>{LIKERT_MIN_LABEL}</Text>
            <Text style={styles.caption}>{LIKERT_MAX_LABEL}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  question: {
    ...typography.questionLoose,
    color: colors.textPrimary,
  },
  options: {
    gap: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.cardInnerGap,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.cardPaddingY,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  optionIdle: {
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceSelected,
  },
  optionKey: {
    ...typography.cardTitle,
    color: colors.textMuted,
  },
  optionKeySelected: {
    color: colors.primaryDark,
  },
  optionText: {
    ...typography.body,
    flex: 1,
    color: colors.textBody,
  },
  likert: {
    gap: spacing.sm,
  },
  likertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likertButton: {
    width: supervisorLayout.likertButton,
    height: supervisorLayout.likertButton,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.circle,
    borderWidth: 1,
  },
  likertText: {
    ...typography.option,
    color: colors.textLabel,
  },
  likertLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  caption: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
