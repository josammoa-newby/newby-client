import { Image } from 'expo-image';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, opacity, radius, size, spacing, typography } from '@/theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  // true 이면 전송 버튼을 비활성 표시하고 전송하지 않음 (빈 입력, 응답 대기 중)
  sendDisabled?: boolean;
};

// 전송 아이콘은 벡터 2개(비행기 1:387, 점 1:388)를 40px 버튼 안에 배치한다.
// 좌표는 Figma send(1:386) 박스(24px, 버튼 좌 7.5 / 상 8.5) 기준
const SEND = {
  plane: { left: 9.743, top: 10.75, size: 19.4996 },
  dot: { left: 19.55, top: 16.24, size: 4.1972 },
} as const;

// Figma: AI 입력창 (1:380), 결과 화면 (1:454)
export function ChatInputBar({ value, onChangeText, onSubmit, sendDisabled = false }: Props) {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/ai/plus.svg')} style={styles.plus} />
      <View style={styles.field}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder="지금 떠오르는 생각을 적어보세요"
          placeholderTextColor={colors.chatPlaceholder}
          returnKeyType="send"
          // 전송 후에도 키보드를 유지해 이어서 질문할 수 있게 함
          submitBehavior="submit"
          style={styles.input}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="전송"
        accessibilityState={{ disabled: sendDisabled }}
        disabled={sendDisabled}
        onPress={onSubmit}
        style={[styles.send, sendDisabled && styles.sendDisabled]}
      >
        <Image
          source={require('../../assets/ai/send-plane.svg')}
          style={[styles.sendIcon, styles.plane]}
        />
        <Image
          source={require('../../assets/ai/send-dot.svg')}
          style={[styles.sendIcon, styles.dot]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.cardInnerGap,
    backgroundColor: colors.white,
  },
  plus: {
    width: size.icon,
    height: size.icon,
  },
  field: {
    flex: 1,
    paddingHorizontal: spacing.md,
    borderRadius: radius.chip,
    backgroundColor: colors.chatField,
  },
  input: {
    ...typography.option,
    paddingVertical: spacing.chatInputPaddingY,
    color: colors.textPrimary,
  },
  send: {
    width: size.sendButton,
    height: size.sendButton,
    borderRadius: radius.circle,
    backgroundColor: colors.primary,
  },
  sendDisabled: {
    opacity: opacity.disabled,
  },
  sendIcon: {
    position: 'absolute',
  },
  plane: {
    left: SEND.plane.left,
    top: SEND.plane.top,
    width: SEND.plane.size,
    height: SEND.plane.size,
  },
  dot: {
    left: SEND.dot.left,
    top: SEND.dot.top,
    width: SEND.dot.size,
    height: SEND.dot.size,
  },
});
