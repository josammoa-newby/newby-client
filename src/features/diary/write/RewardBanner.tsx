import { StyleSheet, Text, View } from 'react-native';

import type { AwardResult } from '@/api';
import { colors, radius, spacing, typography } from '@/theme';
import { diaryColors } from '../constants';
import { formatXp } from '../utils';

type Props = {
  reward: AwardResult;
};

// 첫 일기 경험치 안내 (Figma 디자인 없음, 임시 UI). 상태는 모르고 그리기만 한다
export function RewardBanner({ reward }: Props) {
  return (
    <View style={styles.banner}>
      <Text style={styles.xp}>{formatXp(reward.gainedXp)}</Text>
      {reward.leveledUp && <Text style={styles.levelUp}>{`레벨 업! Lv.${reward.stats.level} ${reward.stats.title}`}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: diaryColors.chipBackground,
  },
  xp: {
    ...typography.title,
    color: colors.primaryDark,
  },
  levelUp: {
    ...typography.action,
    color: colors.textBody,
  },
});
