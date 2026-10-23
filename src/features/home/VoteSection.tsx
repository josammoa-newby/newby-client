import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import { formatVoteCount } from './format';
import type { VoteChoice } from './mock';

type Props = {
  question: string;
  totalCount: number;
  myChoice: VoteChoice | null;
  onVote: (choice: VoteChoice) => void;
};

// theme에 O/X 투표용 파랑·빨강·초록 토큰이 없어 임시로 직접 지정함 (추후 theme 추가 검토)
const VOTE_BLUE = '#3b82f6';
const VOTE_BLUE_BG = '#e7f0fe';
const VOTE_RED = '#ef4444';
const VOTE_RED_BG = '#fdeaea';
const VOTE_GREEN = '#2fab66';
// theme에 맞는 선택 버튼 높이 토큰이 없어 임시로 직접 지정함
const CHOICE_HEIGHT = 64;

// Figma 디자인 없음 — 임시 구현
export function VoteSection({ question, totalCount, myChoice, onVote }: Props) {
  const voted = myChoice !== null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{'🗳️  오늘의 투표'}</Text>
      <View style={styles.card}>
        <Text style={styles.question}>{question}</Text>
        <Text style={styles.count}>{`${formatVoteCount(totalCount)}명이 투표했어요!`}</Text>
        <View style={styles.choices}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="O 선택"
            accessibilityState={{ selected: myChoice === 'O', disabled: voted }}
            disabled={voted}
            onPress={() => onVote('O')}
            style={[
              styles.choice,
              { backgroundColor: VOTE_BLUE_BG },
              myChoice === 'O' && styles.choiceSelected,
            ]}
          >
            <Text style={[styles.choiceGlyph, { color: VOTE_BLUE }]}>○</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="X 선택"
            accessibilityState={{ selected: myChoice === 'X', disabled: voted }}
            disabled={voted}
            onPress={() => onVote('X')}
            style={[
              styles.choice,
              { backgroundColor: VOTE_RED_BG },
              myChoice === 'X' && styles.choiceSelected,
            ]}
          >
            <Text style={[styles.choiceGlyph, { color: VOTE_RED }]}>✕</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.lg,
  },
  sectionTitle: {
    ...typography.header,
    color: colors.textPrimary,
  },
  card: {
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  question: {
    ...typography.questionLoose,
    color: colors.textPrimary,
  },
  count: {
    ...typography.action,
    color: VOTE_GREEN,
  },
  choices: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  choice: {
    flex: 1,
    height: CHOICE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.card,
  },
  choiceSelected: {
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
  choiceGlyph: {
    fontSize: 28,
    fontWeight: '700',
  },
});
