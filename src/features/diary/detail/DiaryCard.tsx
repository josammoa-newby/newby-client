import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Diary } from '@/api';
import { Button } from '@/components';
import { colors, radius, spacing, typography } from '@/theme';
import { diaryColors } from '../constants';
import { AnalysisCard } from '../write/AnalysisCard';
import { MIN_ANALYZE_LENGTH } from '../write/constants';
import { formatKstTime } from './format';

type Props = {
  diary: Diary;
  analyzing: boolean;
  analyzeError?: string;
  onEdit: () => void;
  onDelete: () => void;
  onAnalyze: (force: boolean) => void;
};

// 일기 한 개 카드 (Figma 디자인 없음, 임시 UI). 상태는 모르고 그리기만 한다
export function DiaryCard({ diary, analyzing, analyzeError, onEdit, onDelete, onAnalyze }: Props) {
  const time = formatKstTime(diary.createdAt);
  const canAnalyze = diary.content.trim().length >= MIN_ANALYZE_LENGTH;

  let analysisArea: React.ReactNode;
  if (analyzing) {
    analysisArea = (
      <View style={styles.analyzing}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.caption}>AI가 일기를 읽고 있어요</Text>
      </View>
    );
  } else if (diary.analysis) {
    analysisArea = (
      <View style={styles.analysisBox}>
        <AnalysisCard analysis={diary.analysis} />
        {analyzeError && <Text style={styles.error}>{analyzeError}</Text>}
        <Pressable accessibilityRole="button" hitSlop={8} onPress={() => onAnalyze(true)} style={styles.linkButton}>
          <Text style={styles.link}>다시 분석</Text>
        </Pressable>
      </View>
    );
  } else if (canAnalyze) {
    analysisArea = (
      <View style={styles.analysisBox}>
        {analyzeError && <Text style={styles.error}>{analyzeError}</Text>}
        <Button title={analyzeError ? '분석 다시 시도' : 'AI 분석하기'} onPress={() => onAnalyze(false)} />
      </View>
    );
  } else {
    analysisArea = <Text style={styles.caption}>{`${MIN_ANALYZE_LENGTH}자 이상 쓰면 AI 분석을 받을 수 있어요`}</Text>;
  }

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.meta}>
          {time !== '' && <Text style={styles.time}>{time}</Text>}
          {diary.mood && (
            <View style={styles.mood}>
              <Text style={styles.moodText}>{diary.mood}</Text>
            </View>
          )}
        </View>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onEdit}>
            <Text style={styles.action}>수정</Text>
          </Pressable>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onDelete}>
            <Text style={styles.action}>삭제</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.content}>{diary.content}</Text>
      {analysisArea}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  time: {
    ...typography.label,
    color: colors.textMuted,
  },
  mood: {
    paddingHorizontal: spacing.answerInset,
    paddingVertical: spacing.badgePaddingY,
    borderRadius: radius.circle,
    backgroundColor: diaryColors.chipBackground,
  },
  moodText: {
    ...typography.badge,
    color: colors.primaryDark,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  action: {
    ...typography.action,
    color: colors.textLabel,
  },
  content: {
    ...typography.body,
    color: colors.textBody,
  },
  analysisBox: {
    gap: spacing.md,
  },
  analyzing: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  caption: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textMuted,
  },
  error: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.primaryDark,
  },
  linkButton: {
    alignSelf: 'center',
  },
  link: {
    ...typography.action,
    color: colors.primaryDark,
  },
});
