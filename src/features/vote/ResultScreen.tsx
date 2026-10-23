import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontFamily, spacing, typography } from '@/theme';
import { CommentCard } from './CommentCard';
import { voteLayout } from './constants';
import { ResultCard } from './ResultCard';
import { useVoteResult } from './useVoteResult';
import { VoteHeader } from './VoteHeader';
import { VoteError, VoteLoading } from './VoteStatus';
import { VoteTitle } from './VoteTitle';

type Props = {
  voteId: string;
};

// Figma: 퀴즈 17:1475 — 투표 결과와 다른 사람 의견
export function ResultScreen({ voteId }: Props) {
  const insets = useSafeAreaInsets();
  const { result, loading, error, retry } = useVoteResult(voteId);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <VoteHeader
        // 결과까지 본 뒤 닫으면 투표 화면으로 돌아가지 않고 홈으로 간다
        onClosePress={() => router.dismissTo('/home')}
        onSearchPress={() => {
          // TODO: 검색·알림 화면이 아직 없음 — 화면 생기면 연결
        }}
        onNotificationPress={() => {}}
      />
      {!result ? (
        loading && !error ? (
          <VoteLoading />
        ) : (
          <VoteError message="투표 결과를 불러오지 못했어요" onRetry={retry} />
        )
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, spacing.xl) },
          ]}
        >
          <View style={styles.top}>
            <VoteTitle />
            <ResultCard vote={result.vote} results={result.results} />
          </View>
          <Text style={styles.sectionTitle}>다른 사람 의견 보기</Text>
          <View style={styles.comments}>
            {result.comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: voteLayout.titleTop,
  },
  top: {
    gap: voteLayout.resultCardGap,
  },
  sectionTitle: {
    ...typography.header,
    fontFamily: fontFamily.medium,
    lineHeight: 30,
    marginTop: voteLayout.commentTitleTop,
    color: colors.black,
  },
  comments: {
    gap: voteLayout.commentGap,
    marginTop: voteLayout.commentTitleToList,
  },
});
