import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, size, spacing, typography } from '@/theme';

type Props = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
};

// Figma: check (1:190) — off: 빈 원형 박스, on: check 아이콘
export function Checkbox({ checked, onChange, label }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange?.(!checked)}
      style={styles.row}
    >
      {checked ? (
        <Image
          source={require('../../assets/icons/check-on.svg')}
          style={styles.box}
        />
      ) : (
        <View style={[styles.box, styles.boxOff]} />
      )}
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  box: {
    width: size.checkbox,
    height: size.checkbox,
  },
  boxOff: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.checkbox,
    backgroundColor: colors.white,
  },
  label: {
    ...typography.caption,
    color: colors.textLabel,
  },
});
