import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { resolveInitialRoute } from "@/features/auth/session";
import { colors, radius } from "@/theme";

// Figma에 프로토타입 애니메이션 설정이 없어 임의로 정한 시간/easing (총 약 2.3초)
const HOLD_CLOSED_MS = 500;
const OPEN_MS = 600;
const HOLD_OPEN_MS = 1200;
const OPEN_EASING = Easing.out(Easing.cubic);

// 마스코트 도형 좌표 (그룹 좌상단 = 열린 상태 1:326의 눈 상단 기준, 단위 px)
// 열린 상태 값은 Figma 1:326, 닫힌 상태 값은 1:318 (그룹 y 372 → 열린 y 362 차이 10px 반영)
const MASCOT = {
  width: 122,
  height: 123,
  eye: { size: 13, left: [28, 81], open: 0, closed: 10 },
  bar: {
    width: 122,
    height: 29,
    upper: { open: 25, closed: 35 },
    lower: { open: 94, closed: 64 },
  },
  // 닫혀 있을 때만 보이는 갈색 선 (1:322)
  line: { left: 11, top: 63, width: 98, height: 2 },
  wordmark: { left: 23, top: 64, width: 75.482, height: 21.5 },
} as const;

export default function Splash() {
  // 0 = 닫힘, 1 = 열림
  const open = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(HOLD_CLOSED_MS),
      Animated.timing(open, {
        toValue: 1,
        duration: OPEN_MS,
        easing: OPEN_EASING,
        useNativeDriver: true,
      }),
      Animated.delay(HOLD_OPEN_MS),
    ]);
    // 화면이 사라져 중단되면 finished 가 false 라서 이동하지 않음
    // 저장된 토큰 확인은 애니메이션이 끝난 뒤에 해서, 만료 시 로그인 이동이 애니메이션을 끊지 않게 함
    let cancelled = false;
    animation.start(async ({ finished }) => {
      if (!finished) return;
      const route = await resolveInitialRoute();
      if (!cancelled) router.replace(route);
    });
    return () => {
      cancelled = true;
      animation.stop();
    };
  }, [open]);

  // 열린 위치 기준으로 배치하고, 닫힌 위치에서 열린 위치로 이동
  const eyeY = open.interpolate({
    inputRange: [0, 1],
    outputRange: [MASCOT.eye.closed - MASCOT.eye.open, 0],
  });
  const upperY = open.interpolate({
    inputRange: [0, 1],
    outputRange: [MASCOT.bar.upper.closed - MASCOT.bar.upper.open, 0],
  });
  const lowerY = open.interpolate({
    inputRange: [0, 1],
    outputRange: [MASCOT.bar.lower.closed - MASCOT.bar.lower.open, 0],
  });
  // 갈색 선은 열리기 시작하면 빠르게 사라지고, 워드마크는 열림 후반부에 나타남
  const lineOpacity = open.interpolate({
    inputRange: [0, 0.3],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const wordmarkOpacity = open.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <View style={styles.mascot}>
        {MASCOT.eye.left.map((left) => (
          <Animated.View
            key={left}
            style={[styles.eye, { left, transform: [{ translateY: eyeY }] }]}
          />
        ))}
        <Animated.View
          style={[
            styles.bar,
            { top: MASCOT.bar.upper.open, transform: [{ translateY: upperY }] },
          ]}
        />
        <Animated.View
          style={[
            styles.bar,
            { top: MASCOT.bar.lower.open, transform: [{ translateY: lowerY }] },
          ]}
        />
        <Animated.View style={[styles.line, { opacity: lineOpacity }]} />
        <Animated.View style={[styles.wordmark, { opacity: wordmarkOpacity }]}>
          <Image
            source={require("../../assets/newby-wordmark.svg")}
            style={styles.wordmarkImage}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  mascot: {
    width: MASCOT.width,
    height: MASCOT.height,
  },
  eye: {
    position: "absolute",
    top: MASCOT.eye.open,
    width: MASCOT.eye.size,
    height: MASCOT.eye.size,
    borderRadius: radius.circle,
    backgroundColor: colors.black,
  },
  bar: {
    position: "absolute",
    left: 0,
    width: MASCOT.bar.width,
    height: MASCOT.bar.height,
    borderRadius: radius.circle,
    backgroundColor: colors.primary,
  },
  line: {
    position: "absolute",
    left: MASCOT.line.left,
    top: MASCOT.line.top,
    width: MASCOT.line.width,
    height: MASCOT.line.height,
    borderRadius: radius.circle,
    backgroundColor: colors.primaryDeep,
  },
  wordmark: {
    position: "absolute",
    left: MASCOT.wordmark.left,
    top: MASCOT.wordmark.top,
    width: MASCOT.wordmark.width,
    height: MASCOT.wordmark.height,
  },
  wordmarkImage: {
    width: "100%",
    height: "100%",
  },
});
