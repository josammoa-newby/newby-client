import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fontFamily, typography } from '@/theme';
import { voteColors, voteLayout } from './constants';
import type { VoteChoice } from './types';

type Props = {
  choice: VoteChoice;
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
};

const ICON = {
  O: { source: require('../../../assets/vote/choice-o.svg'), size: 37, offset: 15 },
  X: { source: require('../../../assets/vote/choice-x.svg'), size: 36, offset: 14.5 },
} as const;

// Figma: 퀴즈 17:1430(O) / 17:1433(X) — 선택되면 17:1457 처럼 어두운 막과 도장이 올라옴
export function ChoiceCard({ choice, label, selected, disabled = false, onPress }: Props) {
  const isYes = choice === 'O';
  const icon = ICON[choice];

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.card, { backgroundColor: isYes ? voteColors.yesBg : voteColors.noBg }]}
    >
      <Image
        source={icon.source}
        style={{
          position: 'absolute',
          alignSelf: 'center',
          top: voteLayout.cardHeight / 2 - icon.offset - icon.size / 2,
          width: icon.size,
          height: icon.size,
        }}
      />
      <Text
        style={[
          styles.label,
          { color: isYes ? voteColors.yesText : voteColors.noText },
          selected && styles.labelSelected,
        ]}
      >
        {label}
      </Text>
      {selected && (
        <>
          <View pointerEvents="none" style={styles.overlay} />
          <Image
            source={require('../../../assets/vote/selected-stamp.png')}
            contentFit="cover"
            style={styles.stamp}
          />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: voteLayout.cardHeight,
    borderRadius: voteLayout.cardRadius,
    overflow: 'hidden',
  },
  label: {
    ...typography.question,
    fontFamily: fontFamily.semiBold,
    position: 'absolute',
    top: voteLayout.cardLabelTop,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  labelSelected: {
    opacity: voteLayout.selectedLabelOpacity,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: voteColors.selectedOverlay,
  },
  stamp: {
    position: 'absolute',
    left: voteLayout.stampLeft,
    top: voteLayout.stampTop,
    width: voteLayout.stampSize,
    height: voteLayout.stampSize,
  },
});
