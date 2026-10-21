import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, size, spacing, typography } from '@/theme';

type Props = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  // 회원가입 약관용: "(필수)" / "(선택)" 태그. 지정하면 라벨이 13px 약관 스타일로 바뀜
  tag?: { text: string; required: boolean };
};

// Figma: check (1:190) — off: 빈 원형 박스, on: check 아이콘
export function Checkbox({ checked, onChange, label, tag }: Props) {
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
      {label ? (
        <Text style={tag ? styles.termsLabel : styles.label}>{label}</Text>
      ) : null}
      {tag ? (
        <Text
          style={[
            styles.tag,
            { color: tag.required ? colors.primary : colors.placeholder },
          ]}
        >
          {tag.text}
        </Text>
      ) : null}
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
  termsLabel: {
    ...typography.checkLabel,
    color: colors.textLabel,
  },
  tag: {
    ...typography.caption,
  },
});
