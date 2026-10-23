import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, typography } from '@/theme';
import { voteColors, voteLayout } from './constants';
import type { Vote, VoteOptionResult } from './types';
import { formatCount, formatPercent, percentOf } from './utils';

type BarProps = {
  result: VoteOptionResult;
  total: number;
};

const ICON = {
  O: { source: require('../../../assets/vote/choice-o.svg'), size: 37, offset: 15 },
  X: { source: require('../../../assets/vote/choice-x.svg'), size: 36, offset: 14.5 },
} as const;

// 물결 한 줄: 타원을 가로로 이어 붙이고 한 주기씩 계속 밀어 파도처럼 보이게 함
function WaveRow({ color, height, offset }: { color: string; height: number; offset: Animated.Value }) {
  const { waveWidth, waveCount } = voteLayout;
  return (
    <Animated.View
      style={[
        styles.waveRow,
        {
          width: waveWidth * waveCount,
          transform: [
            { translateX: offset.interpolate({ inputRange: [0, 1], outputRange: [0, -waveWidth] }) },
          ],
        },
      ]}
    >
      {Array.from({ length: waveCount }, (_, i) => (
        <View
          key={i}
          style={{ width: waveWidth, height, borderRadius: '50%', backgroundColor: color }}
        />
      ))}
    </Animated.View>
  );
}

// 막대 아래에서부터 득표율까지 물결치며 차오르는 채움. 다 차오르면 물결이 잦아들어 평평해짐
function WaveFill({ percent, color }: { percent: number; color: string }) {
  const progress = useRef(new Animated.Value(0)).current;
  const front = useRef(new Animated.Value(0)).current;
  const back = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    const rise = Animated.timing(progress, {
      toValue: 1,
      duration: voteLayout.riseDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    const loopFront = Animated.loop(
      Animated.timing(front, {
        toValue: 1,
        duration: voteLayout.waveSpeed,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    // 뒤쪽 물결은 반대 방향으로 움직여 파도가 겹쳐 보이게 함
    const loopBack = Animated.loop(
      Animated.timing(back, {
        toValue: 0,
        duration: voteLayout.waveSpeedBack,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    back.setValue(1);
    loopFront.start();
    loopBack.start();
    rise.start(({ finished }) => {
      if (finished) {
        loopFront.stop();
        loopBack.stop();
      }
    });
    return () => {
      rise.stop();
      loopFront.stop();
      loopBack.stop();
    };
  }, [percent, progress, front, back]);

  const { resultBarHeight, waveHeight } = voteLayout;
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [resultBarHeight + waveHeight, resultBarHeight * (1 - percent / 100)],
  });
  const amplitude = progress.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] });

  return (
    <Animated.View style={[styles.fill, { backgroundColor: color, transform: [{ translateY }] }]}>
      <Animated.View
        style={[styles.waveLayer, { height: waveHeight, transform: [{ scaleY: amplitude }] }]}
      >
        <WaveRow color={color} height={waveHeight} offset={front} />
      </Animated.View>
      <Animated.View
        style={[
          styles.waveLayer,
          {
            height: waveHeight * 0.7,
            top: (-waveHeight * 0.7) / 2,
            transform: [{ scaleY: amplitude }],
          },
        ]}
      >
        <WaveRow color={color} height={waveHeight * 0.7} offset={back} />
      </Animated.View>
    </Animated.View>
  );
}

// Figma: 17:1497(O) / 17:1502(X) — 아래에서부터 득표율만큼 채워지는 막대
function ResultBar({ result, total }: BarProps) {
  const isYes = result.choice === 'O';
  const icon = ICON[result.choice];

  return (
    <View style={[styles.bar, { backgroundColor: isYes ? voteColors.yesBg : voteColors.noBg }]}>
      <WaveFill
        percent={percentOf(result.count, total)}
        color={isYes ? voteColors.yesFill : voteColors.noFill}
      />
      <Image
        source={icon.source}
        style={{
          position: 'absolute',
          alignSelf: 'center',
          top: voteLayout.resultBarHeight / 2 - icon.offset - icon.size / 2,
          width: icon.size,
          height: icon.size,
        }}
      />
      <Text style={[styles.percent, { color: isYes ? voteColors.yesText : voteColors.noText }]}>
        {formatPercent(result.count, total)}
      </Text>
      <Text style={styles.people}>{`${formatCount(result.count)}명`}</Text>
    </View>
  );
}

type Props = {
  vote: Vote;
  results: VoteOptionResult[];
};

// Figma: 17:1492 — 질문, 참여자 수, 선택지별 결과 막대
export function ResultCard({ vote, results }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.textBlock}>
        <Text style={styles.question}>{vote.question}</Text>
        <Text style={styles.count}>{`${formatCount(vote.totalCount)}명이 투표했어요!`}</Text>
      </View>
      <View style={styles.bars}>
        {results.map((result) => (
          <ResultBar key={result.choice} result={result} total={vote.totalCount} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: voteLayout.resultCardInnerGap,
    padding: voteLayout.resultCardPadding,
    borderRadius: voteLayout.resultCardRadius,
    backgroundColor: colors.white,
  },
  textBlock: {
    gap: 4,
  },
  question: {
    ...typography.completeBody,
    fontFamily: fontFamily.semiBold,
    color: colors.textLabel,
  },
  count: {
    ...typography.body,
    fontFamily: fontFamily.medium,
    lineHeight: 24,
    color: voteColors.count,
  },
  bars: {
    flexDirection: 'row',
    gap: voteLayout.resultBarGap,
  },
  bar: {
    flex: 1,
    height: voteLayout.resultBarHeight,
    borderRadius: voteLayout.cardRadius,
    overflow: 'hidden',
  },
  // 막대 전체 높이만큼의 채움을 아래로 내려 두고 translateY 로 끌어올림
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: voteLayout.resultBarHeight,
  },
  // 채움 윗면 위에 걸쳐진 물결. 중심이 윗면에 닿아 scaleY 를 0으로 줄이면 평평해짐
  waveLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -voteLayout.waveHeight / 2,
  },
  waveRow: {
    flexDirection: 'row',
  },
  percent: {
    ...typography.question,
    fontFamily: fontFamily.semiBold,
    position: 'absolute',
    top: 102,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  people: {
    ...typography.label,
    position: 'absolute',
    top: 132,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: colors.textMuted,
  },
});
