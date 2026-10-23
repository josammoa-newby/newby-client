import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';
import { titleIcon } from './constants';

// Figma: 17:1437 — 상자 위에 -31.73° 기울어진 표시가 겹친 아이콘 + "오늘의 투표"
export function VoteTitle() {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Image
          source={require('../../../assets/home/vote-icon-box.svg')}
          style={styles.iconBox}
        />
        <View style={styles.iconMarkWrap}>
          <Image
            source={require('../../../assets/home/vote-icon-mark.svg')}
            style={styles.iconMark}
          />
        </View>
      </View>
      <Text style={styles.title}>오늘의 투표</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 27,
    gap: spacing.md,
  },
  icon: {
    width: titleIcon.width,
    height: titleIcon.height,
  },
  iconBox: {
    position: 'absolute',
    left: titleIcon.boxLeft,
    top: titleIcon.boxTop,
    width: titleIcon.boxSize,
    height: titleIcon.boxSize,
  },
  iconMarkWrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: titleIcon.height,
    height: titleIcon.height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconMark: {
    width: titleIcon.markSize,
    height: titleIcon.markSize,
    transform: [{ rotate: titleIcon.markRotate }, { translateX: titleIcon.markShiftX }],
  },
  title: {
    ...typography.stepTitle,
    color: colors.textPrimary,
  },
});
