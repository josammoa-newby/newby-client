import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, radius, typography } from '@/theme';
import { reactionSprite, voteLayout } from './constants';
import type { ReactionType, VoteComment } from './types';
import { formatReactors, formatRelativeTime, previewText } from './utils';

// Figma: 17:1524~1526 — 한 장의 스프라이트에서 이모지 하나씩 잘라 보여줌
function ReactionStack({ types }: { types: ReactionType[] }) {
  const sheet = voteLayout.reactionSize * voteLayout.reactionSheetScale;
  return (
    <View
      style={{
        width: voteLayout.reactionSize + voteLayout.reactionOverlap * (types.length - 1),
        height: voteLayout.reactionSize,
      }}
    >
      {types.map((type, index) => (
        <View
          key={type}
          style={[styles.reaction, { left: voteLayout.reactionOverlap * index }]}
        >
          <Image
            source={require('../../../assets/vote/reactions.png')}
            style={{
              position: 'absolute',
              width: sheet,
              height: sheet,
              left: (reactionSprite[type].left / 100) * voteLayout.reactionSize,
              top: (reactionSprite[type].top / 100) * voteLayout.reactionSize,
            }}
          />
        </View>
      ))}
    </View>
  );
}

type Props = {
  comment: VoteComment;
};

// Figma: 17:1508 — 작성자, 선택 뱃지, 시간, 본문(미리보기 + 더보기), 리액션, 댓글 수
export function CommentCard({ comment }: Props) {
  const [expanded, setExpanded] = useState(false);
  const preview = previewText(comment.content, voteLayout.previewLength);
  const showFull = expanded || !preview.truncated;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={require('../../../assets/vote/avatar.svg')} style={styles.avatar} />
        <View style={styles.author}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{comment.author.nickname}</Text>
            <Image
              source={
                comment.author.choice === 'O'
                  ? require('../../../assets/vote/badge-o.svg')
                  : require('../../../assets/home/vote-icon-box.svg')
              }
              style={styles.badge}
            />
          </View>
          <Text style={styles.time}>{formatRelativeTime(comment.createdAt)}</Text>
        </View>
      </View>
      <Text style={styles.content}>
        {showFull ? comment.content : `${preview.text}...`}
        {!showFull && (
          <Text style={styles.more} onPress={() => setExpanded(true)} accessibilityRole="button">
            {' 더보기'}
          </Text>
        )}
      </Text>
      <View style={styles.footer}>
        <View style={styles.reactions}>
          <ReactionStack types={comment.reactionTypes} />
          <Text style={styles.meta}>
            {formatReactors(comment.topReactorName, comment.reactionCount)}
          </Text>
        </View>
        <Pressable style={styles.replies}>
          <Text style={styles.meta}>댓글</Text>
          <Text style={styles.meta}>{comment.replyCount}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: voteLayout.commentGap,
    padding: voteLayout.commentPadding,
    borderRadius: radius.card,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    gap: 16,
  },
  avatar: {
    width: voteLayout.avatar,
    height: voteLayout.avatar,
  },
  author: {
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    ...typography.question,
    fontFamily: fontFamily.medium,
    color: colors.textPrimary,
  },
  badge: {
    width: voteLayout.badge,
    height: voteLayout.badge,
  },
  time: {
    ...typography.body,
    color: colors.textMuted,
  },
  content: {
    ...typography.completeBody,
    color: colors.textPrimary,
  },
  more: {
    color: colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reactions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reaction: {
    position: 'absolute',
    top: 0,
    width: voteLayout.reactionSize,
    height: voteLayout.reactionSize,
    overflow: 'hidden',
  },
  replies: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    ...typography.body,
    fontFamily: fontFamily.medium,
    color: colors.placeholder,
  },
});
