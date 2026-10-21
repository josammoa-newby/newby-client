import { StyleSheet, View } from 'react-native';

import { colors, radius, size } from '@/theme';

// 마스코트 도형 좌표 (그룹 좌상단 기준, 단위 px). Figma ai(1:372)의 1:373 그룹
const MASCOT = {
  bar: { width: 78, height: 18.541, upperTop: 15.98, lowerTop: 34.52 },
  line: { left: 7.03, top: 33.89, width: 62.656, height: 1.279 },
  eye: { size: 8.311, left: [17.9, 51.79] },
} as const;

// Figma: AI 입력 화면 마스코트 (1:373)
export function AiMascot() {
  return (
    <View style={styles.container}>
      <View style={[styles.bar, { top: MASCOT.bar.upperTop }]} />
      <View style={[styles.bar, { top: MASCOT.bar.lowerTop }]} />
      <View style={styles.line} />
      {MASCOT.eye.left.map((left) => (
        <View key={left} style={[styles.eye, { left }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: size.aiMascotWidth,
    height: size.aiMascotHeight,
  },
  bar: {
    position: 'absolute',
    left: 0,
    width: MASCOT.bar.width,
    height: MASCOT.bar.height,
    borderRadius: radius.circle,
    // 그라데이션을 지원하지 않는 환경에서는 단색으로 보임
    backgroundColor: colors.accent,
    experimental_backgroundImage: `linear-gradient(to right, ${colors.accent}, ${colors.accentLight})`,
  },
  line: {
    position: 'absolute',
    left: MASCOT.line.left,
    top: MASCOT.line.top,
    width: MASCOT.line.width,
    height: MASCOT.line.height,
    borderRadius: radius.circle,
    backgroundColor: colors.primaryDeep,
  },
  eye: {
    position: 'absolute',
    top: 0,
    width: MASCOT.eye.size,
    height: MASCOT.eye.size,
    borderRadius: radius.circle,
    backgroundColor: colors.textPrimary,
  },
});
