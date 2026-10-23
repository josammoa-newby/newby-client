import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, size, spacing, typography } from '@/theme';

export type TabKey = 'home' | 'ai' | 'diary' | 'profile';

type Props = {
  active: TabKey;
  onChange?: (tab: TabKey) => void;
};

const TABS: { key: TabKey; label: string }[] = [
  { key: 'home', label: '홈' },
  { key: 'ai', label: 'AI' },
  { key: 'diary', label: '일기' },
  { key: 'profile', label: '프로필' },
];

const ICONS = {
  home: require('../../assets/icons/tab-home.svg'),
  homeActive: require('../../assets/icons/tab-home-active.svg'),
  diary: require('../../assets/icons/tab-diary.svg'),
  profile: require('../../assets/icons/tab-profile.svg'),
};

// Figma: AI 아이콘(1:99)은 벡터 에셋 없이 도형으로 구성됨 (홈 화면 탭바 4:5 의 비활성 색 반영)
// 비활성 막대 색은 theme에 없어 이 파일에서만 정의함
const AI_INACTIVE_BAR = '#b6bfce';

function AiIcon({ selected }: { selected: boolean }) {
  return (
    <View style={styles.aiIcon}>
      <View
        style={[styles.aiBar, { top: 6.42 }, !selected && { backgroundColor: AI_INACTIVE_BAR }]}
      />
      <View
        style={[styles.aiBar, { top: 12.71 }, !selected && { backgroundColor: AI_INACTIVE_BAR }]}
      />
      <View
        style={[styles.aiHighlight, !selected && { backgroundColor: colors.textLabel }]}
      />
      <View style={[styles.aiDot, { left: 6.07 }, !selected && { backgroundColor: colors.textMuted }]} />
      <View style={[styles.aiDot, { left: 17.57 }, !selected && { backgroundColor: colors.textMuted }]} />
    </View>
  );
}

// Figma: Tab_bar (1:406)
export function TabBar({ active, onChange }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.items}>
        {TABS.map(({ key, label }) => {
          const selected = key === active;
          return (
            <Pressable
              key={key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => onChange?.(key)}
              style={styles.item}
            >
              {key === 'ai' ? (
                <AiIcon selected={selected} />
              ) : (
                <Image
                  source={key === 'home' && selected ? ICONS.homeActive : ICONS[key]}
                  style={styles.icon}
                />
              )}
              <Text
                style={[
                  selected ? typography.tabLabelActive : typography.tabLabel,
                  { color: selected ? colors.primary : colors.textMuted },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: size.tabBarHeight,
    justifyContent: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: 46,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.white,
  },
  items: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  item: {
    width: size.tabItemWidth,
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: {
    width: size.icon,
    height: size.icon,
  },
  aiIcon: {
    width: 26,
    height: size.icon,
  },
  aiBar: {
    position: 'absolute',
    left: 0,
    width: 26.458,
    height: 6.289,
    borderRadius: 3424,
    backgroundColor: colors.primary,
  },
  aiHighlight: {
    position: 'absolute',
    left: 2.39,
    top: 12.49,
    width: 21.253,
    height: 0.434,
    backgroundColor: colors.primaryDark,
  },
  aiDot: {
    position: 'absolute',
    top: 1,
    width: 2.819,
    height: 2.819,
    borderRadius: 2.819,
    backgroundColor: colors.textPrimary,
  },
});
