import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import { formatCompactCount } from './format';
import type { PopularPost } from './mock';

type Props = {
  posts: PopularPost[];
  onPressPost: (id: string) => void;
};

// 썸네일 이미지 대신 쓰는 색상 팔레트 (실제 썸네일 연동 전 placeholder)
const THUMBNAIL_COLORS = [colors.surface, colors.surfaceSelected, colors.bubble, colors.chatField];

// Figma 디자인 없음 — 임시 구현. 인기글 0개면 상위 컴포넌트에서 섹션 자체를 숨김
export function PopularPostsSection({ posts, onPressPost }: Props) {
  if (posts.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>이번 주 인기글 모음</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {posts.map((post, i) => (
          <Pressable
            key={post.id}
            accessibilityRole="button"
            onPress={() => onPressPost(post.id)}
            style={styles.card}
          >
            <View
              style={[
                styles.thumbnail,
                { backgroundColor: THUMBNAIL_COLORS[i % THUMBNAIL_COLORS.length] },
              ]}
            />
            <Text style={styles.author}>{post.authorName}</Text>
            <Text numberOfLines={2} style={styles.title}>
              {post.title}
            </Text>
            <View style={styles.stats}>
              <Text style={styles.stat}>{`❤️ ${formatCompactCount(post.likeCount)}`}</Text>
              <Text style={styles.stat}>{`💬 ${formatCompactCount(post.commentCount)}`}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// theme에 맞는 카드 크기 토큰이 없어 임시로 직접 지정함 (추후 theme 추가 검토)
const CARD_WIDTH = 160;
const THUMBNAIL_HEIGHT = 96;

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  sectionTitle: {
    ...typography.header,
    color: colors.textPrimary,
    marginHorizontal: spacing.screenPadding,
  },
  list: {
    gap: spacing.cardInnerGap,
    paddingHorizontal: spacing.screenPadding,
  },
  card: {
    width: CARD_WIDTH,
    gap: spacing.xs,
  },
  thumbnail: {
    width: CARD_WIDTH,
    height: THUMBNAIL_HEIGHT,
    borderRadius: radius.chip,
  },
  author: {
    ...typography.caption,
    color: colors.textMuted,
  },
  title: {
    ...typography.suggestionTitle,
    color: colors.textPrimary,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
