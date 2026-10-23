import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

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

// Figma: 17:1497(O) / 17:1502(X) — 아래에서부터 득표율만큼 채워지는 막대
function ResultBar({ result, total }: BarProps) {
  const isYes = result.choice === 'O';
  const icon = ICON[result.choice];

  return (
    <View style={[styles.bar, { backgroundColor: isYes ? voteColors.yesBg : voteColors.noBg }]}>
      <View
        style={[
          styles.fill,
          {
            height: `${percentOf(result.count, total)}%`,
            backgroundColor: isYes ? voteColors.yesFill : voteColors.noFill,
          },
        ]}
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
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
