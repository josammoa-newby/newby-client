import { Image } from 'expo-image';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, radius } from '@/theme';
import { diaryLayout } from './constants';

type Props = {
  recorded: boolean;
};

// Figma: 캘린더 날짜 아이콘 (7:379 켜짐 / 7:389 꺼짐). 몸통 SVG 위에 부리·눈 도형을 퍼센트 위치로 얹는다
export function DuckIcon({ recorded }: Props) {
  const beak = recorded ? colors.primary : colors.line;
  const mark = recorded ? colors.primaryDeep : colors.textMuted;
  const eye = recorded ? colors.textPrimary : colors.textMuted;

  return (
    <View
      style={styles.container}
      accessibilityLabel={recorded ? '기록 있음' : '기록 없음'}
    >
      <Image
        source={
          recorded
            ? require('../../../assets/diary/duck-on.svg')
            : require('../../../assets/diary/duck-off.svg')
        }
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.shape, inset(61.61, 25.56, 26.19, 25.45), { backgroundColor: beak }]} />
      <View style={[styles.shape, inset(73.81, 25.56, 13.98, 25.45), { backgroundColor: beak }]} />
      <View style={[styles.shape, inset(73.39, 29.97, 25.76, 30.67), { backgroundColor: mark }]} />
      <View style={[styles.shape, inset(51.08, 36.8, 43.45, 57.98), { backgroundColor: eye }]} />
      <View style={[styles.shape, inset(51.08, 58.09, 43.45, 36.69), { backgroundColor: eye }]} />
    </View>
  );
}

// Figma inset-[top right bottom left] (%) → left/top/right/bottom. 인자 순서: top, left, bottom, right
function inset(top: number, left: number, bottom: number, right: number): ViewStyle {
  return {
    top: `${top}%`,
    left: `${left}%`,
    bottom: `${bottom}%`,
    right: `${right}%`,
  };
}

const styles = StyleSheet.create({
  container: {
    width: diaryLayout.cellIcon,
    height: diaryLayout.cellIcon,
  },
  shape: {
    position: 'absolute',
    borderRadius: radius.circle,
  },
});
