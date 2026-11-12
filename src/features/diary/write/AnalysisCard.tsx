import { StyleSheet, Text, View } from 'react-native';

import type { DiaryAnalysis } from '@/api';
import { colors, radius, spacing, typography } from '@/theme';
import { diaryColors } from '../constants';

type Props = {
  analysis: DiaryAnalysis;
};

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.list}>
      {items.map((item, index) => (
        <Text key={index} style={styles.body}>{`• ${item}`}</Text>
      ))}
    </View>
  );
}

// AI 분석 결과 카드 (Figma 디자인 없음, 임시 UI). 문구는 서버가 준 값을 그대로 보여준다
export function AnalysisCard({ analysis }: Props) {
  if (analysis.safetyFlag) {
    // 안전 일기: 잘한 점/성장 방향 대신 서버가 준 nextStep(지지 문구와 상담 안내 포함)을 중심으로 보여준다
    return (
      <View style={styles.card}>
        <Section label="요약">
          <Text style={styles.body}>{analysis.summary}</Text>
        </Section>
        <View style={styles.careBox}>
          <Text style={styles.careText}>{analysis.nextStep}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Section label="요약">
        <Text style={styles.body}>{analysis.summary}</Text>
      </Section>
      <Section label="오늘의 감정">
        <View style={styles.emotion}>
          <Text style={styles.emotionText}>{analysis.emotion}</Text>
        </View>
      </Section>
      {analysis.strengths.length > 0 && (
        <Section label="잘한 점">
          <BulletList items={analysis.strengths} />
        </Section>
      )}
      {analysis.growthPoints.length > 0 && (
        <Section label="성장 방향">
          <BulletList items={analysis.growthPoints} />
        </Section>
      )}
      <Section label="내일 해볼 것">
        <Text style={styles.body}>{analysis.nextStep}</Text>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.sectionLabel,
    color: colors.primaryDark,
  },
  body: {
    ...typography.answerBody,
    color: colors.textBody,
  },
  list: {
    gap: spacing.xs,
  },
  emotion: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.answerInset,
    paddingVertical: spacing.badgePaddingY,
    borderRadius: radius.circle,
    backgroundColor: diaryColors.chipBackground,
  },
  emotionText: {
    ...typography.action,
    color: colors.primaryDark,
  },
  careBox: {
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.surfaceSelected,
  },
  careText: {
    ...typography.answerBody,
    color: colors.textBody,
  },
});
