import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, spacing, typography } from '@/theme';
import { homeLayout } from './constants';

export type ShortcutKey = 'customize' | 'calendar' | 'mission' | 'community';

type Shortcut = { key: ShortcutKey; label: string };

const SHORTCUTS: Shortcut[] = [
  { key: 'customize', label: '꾸미기' },
  { key: 'calendar', label: '캘린더' },
  { key: 'mission', label: '미션' },
  { key: 'community', label: '커뮤니티' },
];

type Props = {
  onPress: (key: ShortcutKey) => void;
};

// Figma: hanger (12:1250) — 옷걸이 모양 1개 + 작은 장식 2개, 벡터 에셋 4개를 겹쳐 구성
// 퍼센트 inset(Figma)을 40x40 기준 px로 환산한 값
function CustomizeIcon() {
  return (
    <View style={styles.icon}>
      <Image source={require('../../../assets/home/hanger-hook.svg')} style={styles.hangerHook} />
      <Image source={require('../../../assets/home/hanger-bar.svg')} style={styles.hangerBar} />
      <Image source={require('../../../assets/home/hanger-mark-1.svg')} style={styles.hangerMark1} />
      <Image source={require('../../../assets/home/hanger-mark-2.svg')} style={styles.hangerMark2} />
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
    case 'customize':
      return <CustomizeIcon />;
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

// Figma: "바로가기" 12:1247 + 타일 12:1248 (타일 테두리 없음, #f6f7f9 배경만)
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
  // 40x40 기준 Figma % inset에서 계산한 위치·크기
  hangerHook: {
    position: 'absolute',
    left: 2,
    top: 4,
    width: 29,
    height: 32,
  },
  hangerBar: {
    position: 'absolute',
    left: 9,
    top: 19,
    width: 15,
    height: 2,
  },
  hangerMark1: {
    position: 'absolute',
    left: 16,
    top: 22,
    width: 25,
    height: 12,
  },
  hangerMark2: {
    position: 'absolute',
    left: 25,
    top: 15,
    width: 7,
    height: 9,
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
    width: 37.9708,
    height: 30.6538,
  },
});
