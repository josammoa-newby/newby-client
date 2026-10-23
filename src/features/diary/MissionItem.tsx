import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { diaryColors, diaryLayout, diaryText } from './constants';
import type { Mission } from './types';
import { formatXp } from './utils';

type Props = {
  mission: Mission;
  onPress: () => void;
};

// Figma: 일기 > 미션 7:697 (미완료) / 7:707 (완료: 주황 체크 + 연한 주황 배경)
export function MissionItem({ mission, onPress }: Props) {
  const done = mission.completed;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      onPress={onPress}
      style={[styles.card, done ? styles.cardDone : styles.cardTodo]}
    >
      <View style={[styles.checkbox, done ? styles.checkboxDone : styles.checkboxTodo]}>
        {done && <Image source={require('../../../assets/diary/check.svg')} style={styles.check} />}
      </View>
      <Text style={[styles.title, done && styles.titleDone]}>{mission.title}</Text>
      <Text style={[styles.xp, { color: done ? colors.primaryDark : colors.primary }]}>
        {formatXp(mission.xp)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.cardInnerGap,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.cardPaddingY,
    borderRadius: radius.card,
  },
  cardTodo: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  cardDone: {
    backgroundColor: diaryColors.chipBackground,
  },
  checkbox: {
    width: diaryLayout.missionCheckbox,
    height: diaryLayout.missionCheckbox,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxTodo: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  checkboxDone: {
    backgroundColor: colors.primary,
  },
  check: {
    width: diaryLayout.missionCheckIcon,
    height: diaryLayout.missionCheckIcon,
  },
  title: {
    ...diaryText.missionTitle,
    flex: 1,
    color: colors.textPrimary,
  },
  titleDone: {
    ...diaryText.missionTitleDone,
    color: colors.primary,
  },
  xp: {
    ...diaryText.missionXp,
  },
});
