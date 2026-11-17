import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import { diaryColors } from '../constants';
import { MOODS, type Mood } from './constants';

type Props = {
  // 서버에 저장된 값이 MOODS 에 없어도 받을 수 있게 string (칩이 선택되지 않을 뿐)
  value: string | null;
  onChange: (mood: Mood | null) => void;
};

// 기분 선택(선택 사항). 선택된 칩을 다시 누르면 해제된다
export function MoodChips({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {MOODS.map((mood) => {
        const selected = value === mood;
        return (
          <Pressable
            key={mood}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(selected ? null : mood)}
            style={[styles.chip, selected ? styles.chipSelected : styles.chipIdle]}
          >
            <Text style={[styles.label, { color: selected ? colors.primaryDark : colors.textLabel }]}>
              {mood}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.answerInset,
    paddingVertical: spacing.xs,
    borderRadius: radius.circle,
    borderWidth: 1,
  },
  chipIdle: {
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: diaryColors.chipBackground,
  },
  label: {
    ...typography.body,
  },
});
