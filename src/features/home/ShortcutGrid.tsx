import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

export type ShortcutKey = 'ai' | 'calendar' | 'mission' | 'community';

type Shortcut = { key: ShortcutKey; emoji: string; label: string };

// 아이콘 에셋은 Figma에 없어, 이 코드베이스가 선택지 버튼에 이미 쓰고 있는 이모지 방식을 따름
// (src/features/signup/options.ts 의 JOBS/BOSS_STYLES와 동일한 패턴)
const SHORTCUTS: Shortcut[] = [
  { key: 'ai', emoji: '🤖', label: '뉴비 AI' },
  { key: 'calendar', emoji: '📅', label: '캘린더' },
  { key: 'mission', emoji: '🚩', label: '미션' },
  { key: 'community', emoji: '💬', label: '커뮤니티' },
];

type Props = {
  onPress: (key: ShortcutKey) => void;
};

export function ShortcutGrid({ onPress }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>바로가기</Text>
      <View style={styles.row}>
        {SHORTCUTS.map((shortcut) => (
          <Pressable
            key={shortcut.key}
            accessibilityRole="button"
            accessibilityLabel={shortcut.label}
            onPress={() => onPress(shortcut.key)}
            style={styles.button}
          >
            <View style={styles.iconWrap}>
              <Text style={styles.emoji}>{shortcut.emoji}</Text>
            </View>
            <Text style={styles.label}>{shortcut.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.lg,
  },
  sectionTitle: {
    ...typography.header,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  // theme에 맞는 아이콘 버튼 크기 토큰이 없어 임시로 직접 지정함 (추후 theme 추가 검토)
  iconWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.card,
    backgroundColor: colors.surfaceSelected,
  },
  emoji: {
    ...typography.cardEmoji,
  },
  label: {
    ...typography.caption,
    color: colors.textLabel,
  },
});
