import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { size } from '@/theme';

// 장식 좌표는 마스코트(Figma image 6, 1:315) 좌상단 기준, 단위 px.
// Figma 에서 장식 7개는 가입 완료 프레임(1:312) 밖에 따로 놓여 있고, 프레임 위에 겹치는 위치라
// 마스코트 기준 상대 좌표로 환산했다. rotate 는 시계 방향 도(deg)이며 요소 중심을 기준으로 회전한다.
// (left/top 은 회전 전 사각형 기준 — Figma relativeTransform 에서 계산)
const DECORATIONS = [
  // 1:338 베이지 링
  {
    source: require('../../../assets/signup/deco-ring-beige.svg'),
    left: 193,
    top: -66,
    width: 33,
    height: 33,
    rotate: 0,
  },
  // 1:341 노랑 링
  {
    source: require('../../../assets/signup/deco-ring-yellow.svg'),
    left: -27,
    top: 142,
    width: 21,
    height: 21,
    rotate: 0,
  },
  // 1:344 주황 리본
  {
    source: require('../../../assets/signup/deco-ribbon-orange.svg'),
    left: 233,
    top: -9,
    width: 18,
    height: 43.19,
    rotate: 24.28,
  },
  // 1:350 연한 리본
  {
    source: require('../../../assets/signup/deco-ribbon-cream.svg'),
    left: -5.92,
    top: 8.79,
    width: 18,
    height: 43.19,
    rotate: 124.09,
  },
  // 1:356 노랑 리본 (작은 것)
  {
    source: require('../../../assets/signup/deco-ribbon-yellow-wide.svg'),
    left: 141.5,
    top: -66.92,
    width: 15.64,
    height: 37.53,
    rotate: -114.28,
  },
  // 1:362 노랑 리본 (세로)
  {
    source: require('../../../assets/signup/deco-ribbon-yellow-tall.svg'),
    left: 44,
    top: -63,
    width: 35.88,
    height: 60.56,
    rotate: 0,
  },
  // 1:367 노랑 리본 (큰 것)
  {
    source: require('../../../assets/signup/deco-ribbon-yellow-large.svg'),
    left: 241,
    top: 81,
    width: 35.88,
    height: 60.56,
    rotate: 52.39,
  },
] as const;

// Figma: 가입 완료 마스코트(1:315) + 주변 장식. 장식은 레이아웃·터치에 영향을 주지 않음
export function CompleteMascot() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/signup/mascot-welcome.png')}
        contentFit="cover"
        style={styles.mascot}
      />
      {DECORATIONS.map(({ source, left, top, width, height, rotate }) => (
        <View
          key={left + ',' + top}
          pointerEvents="none"
          style={[
            styles.decoration,
            { left, top, width, height, transform: [{ rotate: `${rotate}deg` }] },
          ]}
        >
          <Image source={source} style={styles.decorationImage} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: size.mascot,
    height: size.mascot,
  },
  mascot: {
    width: size.mascot,
    height: size.mascot,
  },
  decoration: {
    position: 'absolute',
  },
  decorationImage: {
    width: '100%',
    height: '100%',
  },
});
