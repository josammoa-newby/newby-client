import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import type { AiAnswer } from '@/api';
import { colors, radius, size, spacing, typography } from '@/theme';

const DISCLAIMER = 'AI 답변은 참고용이에요. 상황에 맞게 판단해주세요.';

// Figma: 뉴비 AI 분석 카드 (1:419)
export function AiResultCard({ answer }: { answer: AiAnswer }) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Image source={require('../../../assets/ai/card-star.svg')} style={styles.star} />
        <Text style={styles.title}>뉴비 AI 분석</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{answer.badge}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>상황 해석</Text>
        <Text style={styles.body}>{answer.interpretation}</Text>
      </View>

      <View style={styles.divider} />

      <View style={[styles.section, styles.actions]}>
        <Text style={styles.sectionLabel}>이렇게 해보세요</Text>
        {answer.actions.map((action, index) => (
          <View key={index} style={styles.step}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <Text style={[typography.body, styles.stepText]}>{action}</Text>
          </View>
        ))}
      </View>

      <View style={styles.phrase}>
        <Text style={styles.phraseLabel}>추천 말투</Text>
        <Text style={styles.body}>{answer.suggestedPhrase}</Text>
      </View>

      <View style={styles.disclaimer}>
        <Text style={[typography.caption, styles.disclaimerText]}>ⓘ</Text>
        <Text style={[typography.disclaimer, styles.disclaimerText]}>{DISCLAIMER}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    maxWidth: size.aiCardMaxWidth,
    marginLeft: spacing.lg,
    gap: spacing.answerInset,
    padding: spacing.lg,
    borderTopLeftRadius: radius.aiCardCorner,
    borderTopRightRadius: radius.aiCard,
    borderBottomLeftRadius: radius.aiCard,
    borderBottomRightRadius: radius.aiCard,
    backgroundColor: colors.white,
    // Android 는 elevation 으로 색을 지정할 수 없어 그림자 없음 (iOS/web 만 표시)
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  star: {
    width: size.cardStar,
    height: size.cardStar,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.badgePaddingY,
    borderRadius: radius.circle,
    backgroundColor: colors.surface,
  },
  badgeText: {
    ...typography.badge,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.xs,
  },
  actions: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.sectionLabel,
    color: colors.textMuted,
  },
  body: {
    ...typography.answerBody,
    color: colors.textLabel,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  stepBadge: {
    width: size.stepBadge,
    height: size.stepBadge,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.circle,
    backgroundColor: colors.line,
  },
  stepNumber: {
    ...typography.stepNumber,
    color: colors.textMuted,
  },
  stepText: {
    flex: 1,
    color: colors.textPrimary,
  },
  phrase: {
    gap: spacing.xs,
    paddingHorizontal: spacing.answerInset,
    paddingVertical: spacing.cardInnerGap,
    borderRadius: radius.input,
    backgroundColor: colors.surface,
  },
  phraseLabel: {
    ...typography.phraseLabel,
    color: colors.textLabel,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  disclaimerText: {
    color: colors.placeholder,
  },
});
