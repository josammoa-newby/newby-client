import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, spacing, typography } from '@/theme';
import { homeLayout } from './constants';

export type ShortcutKey = 'ai' | 'calendar' | 'mission' | 'community';

type Shortcut = { key: ShortcutKey; label: string };

const SHORTCUTS: Shortcut[] = [
  { key: 'ai', label: '뉴비 AI' },
  { key: 'calendar', label: '캘린더' },
  { key: 'mission', label: '미션' },
  { key: 'community', label: '커뮤니티' },
];

type Props = {
  onPress: (key: ShortcutKey) => void;
};

// Figma: 뉴비 AI 아이콘(4:225)은 벡터 에셋 없이 도형으로 구성됨 (TabBar 의 AiIcon 과 같은 구성, 활성 색)
function AiShortcutIcon() {
  return (
    <View style={styles.icon}>
      <View style={[styles.aiBar, { top: 15.63 }]} />
      <View style={[styles.aiBar, { top: 23.31 }]} />
      <View style={styles.aiHighlight} />
      <View style={[styles.aiEye, { left: 11.57 }]} />
      <View style={[styles.aiEye, { left: 25.91 }]} />
    </View>
  );
}

// Figma: flag-02 (4:249) — 깃대·깃발 두 조각을 40x40 안에 겹쳐 놓음
function MissionIcon() {
  return (
    <View style={styles.icon}>
      <Image
        source={require('../../../assets/home/mission-flag-pole.svg')}
        style={styles.missionPole}
      />
      <Image source={require('../../../assets/home/mission-flag.svg')} style={styles.missionFlag} />
    </View>
  );
}

function ShortcutIcon({ shortcut }: { shortcut: ShortcutKey }) {
  switch (shortcut) {
    case 'ai':
      return <AiShortcutIcon />;
    case 'calendar':
      return (
        <Image source={require('../../../assets/home/shortcut-calendar.svg')} style={styles.icon} />
      );
    case 'mission':
      return <MissionIcon />;
    case 'community':
      return (
        <Image
          source={require('../../../assets/home/shortcut-community.svg')}
          style={styles.icon}
        />
      );
  }
}

// Figma: "바로가기" 4:265 + 타일 4:222
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
            style={styles.item}
          >
            <View style={styles.tile}>
              <ShortcutIcon shortcut={shortcut.key} />
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
    marginTop: homeLayout.shortcutTop,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 29,
    color: colors.textPrimary,
    marginLeft: homeLayout.gutter,
    marginBottom: homeLayout.shortcutTitleToTiles,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
  },
  item: {
    width: homeLayout.tile,
    alignItems: 'center',
    gap: homeLayout.tileLabelGap,
  },
  tile: {
    width: homeLayout.tile,
    height: homeLayout.tile,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: homeLayout.tileRadius,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  label: {
    ...typography.body,
    lineHeight: homeLayout.tileLabelLineHeight,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  icon: {
    width: homeLayout.tileIcon,
    height: homeLayout.tileIcon,
  },
  aiBar: {
    position: 'absolute',
    left: 4,
    width: 33,
    height: 7.687,
    borderRadius: 1088,
    backgroundColor: colors.primary,
  },
  aiHighlight: {
    position: 'absolute',
    left: 6.98,
    top: 23.05,
    width: 26.508,
    height: 0.53,
    backgroundColor: colors.primaryDeep,
  },
  aiEye: {
    position: 'absolute',
    top: 9,
    width: 3.516,
    height: 3.446,
    borderRadius: 1.75,
    backgroundColor: colors.textPrimary,
  },
  // 40x40 기준 Figma inset 값에서 계산한 위치·크기 (에셋 원본 크기와 동일)
  missionPole: {
    position: 'absolute',
    left: 1.071,
    top: 1.976,
    width: 28.1674,
    height: 32.8035,
  },
  missionFlag: {
    position: 'absolute',
    left: 1.584,
    top: 6.06,
    width: 38.6373,
    height: 30.6538,
  },
});
