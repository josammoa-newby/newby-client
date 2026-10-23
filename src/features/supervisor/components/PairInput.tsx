import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TextField } from '@/components';
import { colors, spacing, typography } from '@/theme';

export type Pair = { said: string; meant: string };

type Props = {
  label: string;
  hint?: string;
  value: Pair[];
  max: number;
  onChange: (value: Pair[]) => void;
};

const PAIR_TEXT_MAX_LENGTH = 200;

// 실제 발언 ↔ 진짜 뜻 예시 쌍 입력 (최대 개수까지 추가, Figma 디자인 없음 — 임시 구현)
export function PairInput({ label, hint, value, max, onChange }: Props) {
  const update = (index: number, patch: Partial<Pair>) =>
    onChange(value.map((pair, i) => (i === index ? { ...pair, ...patch } : pair)));

  const add = () => {
    if (value.length >= max) return;
    onChange([...value, { said: '', meant: '' }]);
  };

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{`${label} (${value.length}/${max})`}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      {value.map((pair, i) => (
        <View key={i} style={styles.pair}>
          <TextField
            label="상사가 한 말"
            value={pair.said}
            onChangeText={(said) => update(i, { said })}
            maxLength={PAIR_TEXT_MAX_LENGTH}
          />
          <TextField
            label="진짜 의미"
            value={pair.meant}
            onChangeText={(meant) => update(i, { meant })}
            maxLength={PAIR_TEXT_MAX_LENGTH}
          />
          <Pressable accessibilityRole="button" onPress={() => remove(i)}>
            <Text style={styles.remove}>이 예시 삭제</Text>
          </Pressable>
        </View>
      ))}
      {value.length < max && (
        <Pressable accessibilityRole="button" onPress={add}>
          <Text style={styles.add}>+ 예시 추가</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.textLabel,
  },
  hint: {
    ...typography.caption,
    color: colors.accent,
  },
  pair: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  remove: {
    ...typography.caption,
    color: colors.placeholder,
  },
  add: {
    ...typography.action,
    color: colors.primary,
  },
});
