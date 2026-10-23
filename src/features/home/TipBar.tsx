import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import { homeLayout } from './constants';

type Props = {
  text: string;
  onPress: () => void;
};

// Figma: TIP 바 4:266 (361x42, #f6f7f9, radius 8)
export function TipBar({ text, onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.badge}>TIP</Text>
        <Text numberOfLines={1} style={styles.text}>
          {text}
        </Text>
      </View>
      <View style={styles.chevron}>
        <Image source={require('../../../assets/home/tip-chevron.svg')} style={styles.chevronImage} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: homeLayout.tipHeight,
    marginHorizontal: spacing.screenPadding,
    marginTop: homeLayout.tipTop,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.button,
    backgroundColor: colors.surface,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
  badge: {
    ...typography.action,
    letterSpacing: -0.14,
    color: colors.primaryDark,
  },
  text: {
    ...typography.body,
    letterSpacing: -0.14,
    color: colors.textMuted,
    flexShrink: 1,
  },
  // Figma 에서 180° 회전된 8x14 영역 안에 에셋을 둠
  chevron: {
    width: 8,
    height: 14,
    transform: [{ rotate: '180deg' }],
  },
  chevronImage: {
    position: 'absolute',
    left: 0,
    top: 0.333,
    width: 7.6413,
    height: 13.3348,
  },
});
