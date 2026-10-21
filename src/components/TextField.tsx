import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors, radius, size, spacing, typography } from '@/theme';

type Props = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
  label: string;
  // 비밀번호용: 눈 아이콘으로 입력값 표시/숨김 토글
  secure?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Figma: 입력창 (1:186), 비밀번호 입력창 (1:209)
export function TextField({ label, secure = false, style, ...inputProps }: Props) {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.field}>
        <TextInput
          {...inputProps}
          secureTextEntry={secure && hidden}
          placeholderTextColor={colors.placeholder}
          style={styles.input}
        />
        {secure && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? '비밀번호 표시' : '비밀번호 숨기기'}
            onPress={() => setHidden((prev) => !prev)}
          >
            <Image
              source={require('../../assets/icons/eye.svg')}
              style={styles.icon}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    alignSelf: 'stretch',
  },
  label: {
    ...typography.label,
    color: colors.textLabel,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.inputPaddingY,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.input,
    backgroundColor: colors.white,
  },
  input: {
    ...typography.body,
    flex: 1,
    minWidth: 0,
    padding: 0,
    color: colors.textPrimary,
  },
  icon: {
    width: size.icon,
    height: size.icon,
  },
});
