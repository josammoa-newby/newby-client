import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/theme';
import { diaryLayout, diaryText } from './constants';

export type DiaryTabKey = 'calendar' | 'mission';

type Props = {
  active: DiaryTabKey;
  onChange: (tab: DiaryTabKey) => void;
};

const TABS: { key: DiaryTabKey; label: string }[] = [
  { key: 'calendar', label: '캘린더' },
  { key: 'mission', label: '미션' },
];

// Figma: 일기 7:418 > Frame 7:400 (캘린더 | 미션). 선택된 탭은 아래 선이 주황색
export function DiaryTabSwitch({ active, onChange }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map(({ key, label }) => {
        const selected = key === active;
        return (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(key)}
            style={[styles.tab, { borderBottomColor: selected ? colors.primary : colors.line }]}
          >
            <Text style={[styles.label, { color: selected ? colors.textPrimary : colors.textMuted }]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.gutter,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderBottomWidth: diaryLayout.tabBorder,
  },
  label: {
    ...diaryText.tab,
  },
});
