import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { colors, gradients, radius, size } from '@/theme';

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
      {[MASCOT.bar.upperTop, MASCOT.bar.lowerTop].map((top) => (
        <LinearGradient
          key={top}
          colors={gradients.mascot}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.bar, { top }]}
        />
      ))}
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
