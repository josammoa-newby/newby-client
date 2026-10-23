import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, spacing } from '@/theme';
import { homeColors, homeLayout } from './constants';
import { formatVoteCount } from './format';

type Props = {
  question: string;
  totalCount: number;
  onPress: () => void;
};

// Figma: 투표 아이콘 4:278 — 상자(20x20) 위에 -31.73° 기울어진 표시(24x24 에셋)가 겹침
function VoteTitleIcon() {
  return (
    <View style={styles.titleIcon}>
      <Image source={require('../../../assets/home/vote-icon-box.svg')} style={styles.iconBox} />
      <View style={styles.iconMarkWrap}>
        <Image source={require('../../../assets/home/vote-icon-mark.svg')} style={styles.iconMark} />
      </View>
    </View>
  );
}

// Figma: 오늘의 투표 4:276. 홈에서는 미리보기만 — 탭하면 /vote 로 이동해서 거기서 투표한다
export function VoteSection({ question, totalCount, onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.container}>
      <View style={styles.titleRow}>
        <VoteTitleIcon />
        <Text style={styles.title}>오늘의 투표</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.textBlock}>
          <Text style={styles.question}>{question}</Text>
          <Text style={styles.count}>{`${formatVoteCount(totalCount)}명이 투표했어요!`}</Text>
        </View>
        {/* 홈에서는 미리보기용 — 실제 투표 버튼은 /vote 화면에 있음 */}
        <View style={styles.choices} pointerEvents="none">
          <Image source={require('../../../assets/home/vote-o.svg')} style={styles.choice} />
          <Image source={require('../../../assets/home/vote-x.svg')} style={styles.choice} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: homeLayout.voteTop,
    marginHorizontal: spacing.screenPadding,
    gap: homeLayout.voteRowGap,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 27,
    gap: spacing.md,
  },
  titleIcon: {
    width: 38,
    height: 27.529,
  },
  iconBox: {
    position: 'absolute',
    left: 18,
    top: 1,
    width: 20,
    height: 20,
  },
  // 27.529 정사각형 중앙의 20x20 영역을 회전시키고, 그 안에서 에셋(24x24)이 위 -2·왼쪽 -1 만큼 벗어나 있음 (가운데 정렬 대비 x +1)
  iconMarkWrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 27.529,
    height: 27.529,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconMark: {
    width: 24,
    height: 24,
    transform: [{ rotate: '-31.73deg' }, { translateX: 1 }],
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 27,
    color: colors.textPrimary,
  },
  card: {
    gap: spacing.lg,
    padding: spacing.cardPaddingY,
    borderRadius: homeLayout.voteCardRadius,
    backgroundColor: colors.surface,
  },
  textBlock: {
    gap: 4,
  },
  question: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textLabel,
  },
  count: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 24,
    color: homeColors.voteCount,
  },
  choices: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: homeLayout.voteChoiceGap,
  },
  choice: {
    width: homeLayout.voteChoiceWidth,
    height: homeLayout.voteChoiceHeight,
  },
});
