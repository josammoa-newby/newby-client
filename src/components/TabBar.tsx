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
  diary: require('../../assets/icons/tab-diary.svg'),
  profile: require('../../assets/icons/tab-profile.svg'),
};

// Figma: AI 아이콘(1:99)은 벡터 에셋 없이 도형으로 구성됨
// 추정값, Figma 비활성 변형 필요: 비활성일 때도 활성과 같은 색(primary)을 그대로 사용 중
function AiIcon() {
  return (
    <View style={styles.aiIcon}>
      <View style={[styles.aiBar, { top: 6.42 }]} />
      <View style={[styles.aiBar, { top: 12.71 }]} />
      <View style={styles.aiHighlight} />
      <View style={[styles.aiDot, { left: 6.07 }]} />
      <View style={[styles.aiDot, { left: 17.57 }]} />
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
                <AiIcon />
              ) : (
                <Image source={ICONS[key]} style={styles.icon} />
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
