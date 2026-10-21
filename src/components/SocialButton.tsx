import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, type ImageStyle, type StyleProp } from 'react-native';

import { colors, radius, size } from '@/theme';

type Props = {
  source: ImageSource | number;
  label: string;
  onPress?: () => void;
  // 테두리 없는 버튼(카카오)용
  borderless?: boolean;
  // 이미지가 원보다 크게 잘려 배치된 경우의 이미지 스타일 (Apple)
  imageStyle?: StyleProp<ImageStyle>;
};

// Figma: 간편 로그인 원형 버튼 (1:203 / 1:204 / 1:205)
export function SocialButton({ source, label, onPress, borderless, imageStyle }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, !borderless && styles.border]}
    >
      <Image source={source} contentFit="cover" style={imageStyle ?? styles.image} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: size.socialButton,
    height: size.socialButton,
    borderRadius: radius.circle,
    overflow: 'hidden',
  },
  border: {
    borderWidth: 1,
    borderColor: colors.line,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
