import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SupervisorListItem } from '@/api';
import { colors, opacity, spacing, typography } from '@/theme';
import { NEW_CHAT_LABEL } from './constants';

type Props = {
  supervisor: SupervisorListItem;
  // 전송 중에는 상사 전환과 새 대화를 막는다
  disabled: boolean;
  onPressSupervisor: () => void;
  onNewChat: () => void;
};

// AI 헤더 아래 현재 상사 한 줄 영역 (Figma 디자인 없음, 임시 UI). 상태는 모르고 그리기만 한다
export function SupervisorBar({ supervisor, disabled, onPressSupervisor, onNewChat }: Props) {
  const detail = [supervisor.position, supervisor.typeName].filter(Boolean).join(' · ');

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="상사 선택"
        disabled={disabled}
        onPress={onPressSupervisor}
        style={[styles.supervisor, disabled && styles.disabled]}
      >
        <Text style={styles.nickname} numberOfLines={1}>
          {supervisor.nickname}
        </Text>
        {detail ? (
          <Text style={styles.detail} numberOfLines={1}>
            {detail}
          </Text>
        ) : null}
        <Text style={styles.chevron}>▾</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onNewChat}
        style={disabled && styles.disabled}
      >
        <Text style={styles.newChat}>{NEW_CHAT_LABEL}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  supervisor: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nickname: {
    ...typography.title,
    flexShrink: 1,
    color: colors.textPrimary,
  },
  detail: {
    ...typography.caption,
    flexShrink: 1,
    color: colors.textMuted,
  },
  chevron: {
    ...typography.caption,
    color: colors.textMuted,
  },
  newChat: {
    ...typography.action,
    color: colors.primaryDark,
  },
  disabled: {
    opacity: opacity.disabled,
  },
});
