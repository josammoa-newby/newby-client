import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Supervisor } from '@/api';
import { Button } from '@/components';
import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  supervisor: Supervisor;
  onDone: () => void;
};

// 등록 결과: 유형 이름, 코드, 핵심 행동 규칙. 서버가 준 값을 그대로 보여준다
export function ResultView({ supervisor, onDone }: Props) {
  // needsCheck 는 응답이 엇갈려 확인이 필요한 축 이름 배열이다. 하나라도 있으면 안내한다
  const inconsistent = supervisor.needsCheck.length > 0;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.caption}>{`${supervisor.nickname}님의 유형`}</Text>
      <Text style={styles.typeName}>{supervisor.typeName ?? supervisor.code}</Text>
      <View style={styles.code}>
        <Text style={styles.codeText}>{supervisor.code}</Text>
      </View>

      {inconsistent && (
        <Text style={styles.warning}>답변이 일관되지 않아 결과가 부정확할 수 있어요</Text>
      )}

      {supervisor.topRules.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>이런 성향이에요</Text>
          {supervisor.topRules.map((rule, index) => (
            <Text key={index} style={styles.body}>{`• ${rule}`}</Text>
          ))}
        </View>
      )}

      <Button title="목록으로" onPress={onDone} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  caption: {
    ...typography.caption,
    color: colors.textMuted,
  },
  typeName: {
    ...typography.stepTitle,
    color: colors.textPrimary,
  },
  code: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.answerInset,
    paddingVertical: spacing.badgePaddingY,
    borderRadius: radius.circle,
    backgroundColor: colors.surfaceSelected,
  },
  codeText: {
    ...typography.action,
    color: colors.primaryDark,
  },
  warning: {
    ...typography.body,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    color: colors.textLabel,
  },
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  sectionLabel: {
    ...typography.sectionLabel,
    color: colors.primaryDark,
  },
  body: {
    ...typography.answerBody,
    color: colors.textBody,
  },
});
