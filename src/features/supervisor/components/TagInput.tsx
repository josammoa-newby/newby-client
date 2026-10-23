import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TextField } from '@/components';
import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  label: string;
  value: string[];
  max: number;
  onChange: (value: string[]) => void;
  placeholder?: string;
};

// 최대 개수까지 추가할 수 있는 태그 입력 (상사님 말버릇용, Figma 디자인 없음 — 임시 구현)
export function TagInput({ label, value, max, onChange, placeholder }: Props) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const text = draft.trim();
    if (!text || value.length >= max) return;
    onChange([...value, text]);
    setDraft('');
  };

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <View style={styles.container}>
      <TextField
        label={`${label} (${value.length}/${max})`}
        placeholder={placeholder}
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={add}
        editable={value.length < max}
        action={{ title: '추가', onPress: add }}
      />
      {value.length > 0 && (
        <View style={styles.tags}>
          {value.map((tag, i) => (
            <Pressable
              key={`${tag}-${i}`}
              accessibilityRole="button"
              accessibilityLabel={`${tag} 삭제`}
              onPress={() => remove(i)}
              style={styles.tag}
            >
              <Text style={styles.tagText}>{tag} ✕</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.chip,
    backgroundColor: colors.surface,
  },
  tagText: {
    ...typography.caption,
    color: colors.textLabel,
  },
});
