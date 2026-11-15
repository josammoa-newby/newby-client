import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SupervisorListItem } from '@/api';
import { colors, radius, spacing, typography } from '@/theme';
import { DEFAULT_BADGE, PICKER_TITLE } from './constants';

type Props = {
  visible: boolean;
  supervisors: SupervisorListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
};

// 상사 선택 바텀시트 (Figma 디자인 없음, 임시 UI). 항목을 누르면 선택하고 닫는다
export function SupervisorPickerModal({ visible, supervisors, selectedId, onSelect, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable accessibilityLabel="닫기" style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Text style={styles.title}>{PICKER_TITLE}</Text>
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {supervisors.map((item) => {
            const selected = item.id === selectedId;
            const detail = [item.position, item.typeName].filter(Boolean).join(' · ');
            return (
              <Pressable
                key={item.id}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => {
                  onSelect(item.id);
                  onClose();
                }}
                style={[styles.row, selected && styles.rowSelected]}
              >
                <View style={styles.rowText}>
                  <View style={styles.rowTop}>
                    <Text style={styles.nickname}>{item.nickname}</Text>
                    {item.isDefault && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{DEFAULT_BADGE}</Text>
                      </View>
                    )}
                  </View>
                  {detail ? <Text style={styles.detail}>{detail}</Text> : null}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.shadow,
  },
  sheet: {
    maxHeight: '60%',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopLeftRadius: radius.aiCard,
    borderTopRightRadius: radius.aiCard,
    backgroundColor: colors.white,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.cardInnerGap,
    marginBottom: spacing.sm,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  rowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceSelected,
  },
  rowText: {
    gap: spacing.xs,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nickname: {
    ...typography.body,
    color: colors.textPrimary,
  },
  detail: {
    ...typography.caption,
    color: colors.textMuted,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.badgePaddingY,
    borderRadius: radius.circle,
    backgroundColor: colors.surface,
  },
  badgeText: {
    ...typography.badge,
    color: colors.primaryDark,
  },
});
