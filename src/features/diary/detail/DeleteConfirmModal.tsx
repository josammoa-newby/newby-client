import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components';
import { colors, opacity, radius, spacing, typography } from '@/theme';

type Props = {
  visible: boolean;
  // 그날 마지막 일기면 경험치 회수 안내를 덧붙인다
  revokesXp: boolean;
  deleting: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

// 일기 삭제 확인 (Alert.alert 는 웹에서 동작하지 않아 직접 만든 Modal. 임시 UI)
export function DeleteConfirmModal({ visible, revokesXp, deleting, error, onCancel, onConfirm }: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text style={styles.title}>이 일기를 삭제할까요?</Text>
          {revokesXp && <Text style={styles.body}>삭제하면 받은 경험치 10 XP가 회수돼요</Text>}
          {error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.buttons}>
            <Pressable
              accessibilityRole="button"
              disabled={deleting}
              onPress={onCancel}
              style={[styles.cancel, deleting && styles.disabled]}
            >
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
            <Button title="삭제" loading={deleting} onPress={onConfirm} style={styles.confirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.screenPadding,
    // 모달 뒤를 어둡게: 토큰에 어두운 값이 없어 shadow 색을 그대로 쓴다
    backgroundColor: colors.shadow,
  },
  dialog: {
    alignSelf: 'stretch',
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.card,
    backgroundColor: colors.white,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  body: {
    ...typography.body,
    color: colors.textBody,
  },
  error: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cancel: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.buttonPaddingY,
  },
  cancelText: {
    ...typography.button,
    color: colors.textLabel,
  },
  confirm: {
    flex: 1,
  },
  disabled: {
    opacity: opacity.disabled,
  },
});
