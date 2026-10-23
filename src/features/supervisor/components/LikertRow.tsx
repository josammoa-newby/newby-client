import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, size, spacing, typography } from '@/theme';
import { LIKERT_SCALE } from '../options';

type Props = {
  text: string;
  value: number | null;
  onChange: (value: number) => void;
};

// 리커트 1~5점 척도 질문 한 문항 (Figma 디자인 없음 — 임시 구현)
export function LikertRow({ text, value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{text}</Text>
      <View style={styles.scale}>
        {LIKERT_SCALE.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ selected }}
              onPress={() => onChange(option.value)}
              style={styles.optionWrap}
            >
              <View style={[styles.dot, selected && styles.dotSelected]}>
                <Text style={[styles.dotText, selected && styles.dotTextSelected]}>
                  {option.value}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.labels}>
        <Text style={styles.label}>{LIKERT_SCALE[0].label}</Text>
        <Text style={styles.label}>{LIKERT_SCALE[LIKERT_SCALE.length - 1].label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  question: {
    ...typography.question,
    color: colors.textPrimary,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  optionWrap: {
    alignItems: 'center',
  },
  dot: {
    width: size.icon,
    height: size.icon,
    borderRadius: radius.circle,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  dotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dotText: {
    ...typography.caption,
    color: colors.textLabel,
  },
  dotTextSelected: {
    color: colors.white,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...typography.caption,
    color: colors.placeholder,
  },
});
