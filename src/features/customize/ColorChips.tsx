import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';
import { CHIP_COLORS, customizeColors, customizeLayout } from './constants';

type Props = {
  selected: number;
  onSelect: (index: number) => void;
};

// Figma: Frame 1707483762 (20:1663) — 40px 원 11개, 간격 8, 화면보다 길어서 가로 스크롤.
// 색은 아직 오리에 적용하지 않고 선택 표시(어두운 막 + 체크)만 바뀜
export function ColorChips({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {CHIP_COLORS.map((color, index) => {
        const isSelected = index === selected;
        return (
          <Pressable
            key={color}
            accessibilityRole="button"
            accessibilityLabel={`색상 ${index + 1}`}
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(index)}
            style={[styles.chip, { backgroundColor: color }]}
          >
            {isSelected && (
              <View style={styles.selected}>
                <Image
                  source={require('../../../assets/customize/check.svg')}
                  style={styles.check}
                />
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    marginTop: customizeLayout.chipsTop,
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
    gap: customizeLayout.chipGap,
  },
  chip: {
    width: customizeLayout.chipSize,
    height: customizeLayout.chipSize,
    borderRadius: customizeLayout.chipSize / 2,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  selected: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: customizeColors.chipOverlay,
  },
  check: {
    width: 24,
    height: 24,
  },
});
