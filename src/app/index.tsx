import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme';

const FADE_MS = 500;
const SPLASH_MS = 1800;

// Figma 스플래시 1:326 — 마스코트 도형 좌표 (그룹 좌상단 기준)
const MASCOT = {
  width: 122,
  height: 123,
  eye: { size: 13, left: [28, 81], top: 0 },
  bar: { width: 122, height: 29, top: [25, 94] },
  wordmark: { left: 23, top: 64, width: 75.482, height: 21.5 },
} as const;

export default function Splash() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: FADE_MS,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => router.replace('/login'), SPLASH_MS);
    return () => clearTimeout(timer);
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.mascot, { opacity }]}>
        {MASCOT.eye.left.map((left) => (
          <View key={left} style={[styles.eye, { left }]} />
        ))}
        {MASCOT.bar.top.map((top) => (
          <View key={top} style={[styles.bar, { top }]} />
        ))}
        <Image
          source={require('../../assets/newby-wordmark.svg')}
          style={styles.wordmark}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  mascot: {
    width: MASCOT.width,
    height: MASCOT.height,
  },
  eye: {
    position: 'absolute',
    top: MASCOT.eye.top,
    width: MASCOT.eye.size,
    height: MASCOT.eye.size,
    borderRadius: radius.circle,
    backgroundColor: colors.black,
  },
  bar: {
    position: 'absolute',
    left: 0,
    width: MASCOT.bar.width,
    height: MASCOT.bar.height,
    borderRadius: radius.circle,
    backgroundColor: colors.primary,
  },
  wordmark: {
    position: 'absolute',
    left: MASCOT.wordmark.left,
    top: MASCOT.wordmark.top,
    width: MASCOT.wordmark.width,
    height: MASCOT.wordmark.height,
  },
});
