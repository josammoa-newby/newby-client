import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, spacing, typography } from '@/theme';
import { homeLayout } from './constants';
import { formatCompactCount } from './format';
import type { PopularPost } from './mock';

type Props = {
  posts: PopularPost[];
  onPressPost: (id: string) => void;
};

// Figma: 인기글 4:271. 인기글 0개면 섹션 자체를 숨김
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
        {posts.map((post) => (
          <Pressable
            key={post.id}
            accessibilityRole="button"
            onPress={() => onPressPost(post.id)}
            style={styles.card}
          >
            {post.thumbnail ? (
              <Image source={post.thumbnail} contentFit="cover" style={styles.thumbnail} />
            ) : (
              <View style={[styles.thumbnail, styles.thumbnailEmpty]} />
            )}
            <View style={styles.info}>
              <Text style={styles.author}>{post.authorName}</Text>
              <Text numberOfLines={2} style={styles.title}>
                {post.title}
              </Text>
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Image
                    source={require('../../../assets/home/post-like.svg')}
                    style={styles.statIcon}
                  />
                  <Text style={[styles.statCount, { color: colors.textLabel }]}>
                    {formatCompactCount(post.likeCount)}
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Image
                    source={require('../../../assets/home/post-comment.svg')}
                    style={styles.statIcon}
                  />
                  <Text style={[styles.statCount, { color: colors.textPrimary }]}>
                    {formatCompactCount(post.commentCount)}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: homeLayout.popularTop,
    gap: homeLayout.popularTitleGap,
  },
  sectionTitle: {
    ...typography.header,
    lineHeight: 24,
    color: colors.textPrimary,
    marginLeft: homeLayout.gutter,
  },
  list: {
    gap: homeLayout.postGap,
    paddingHorizontal: homeLayout.gutter,
  },
  card: {
    width: homeLayout.postWidth,
    gap: homeLayout.postGapInner,
  },
  thumbnail: {
    width: '100%',
    height: homeLayout.postThumbHeight,
    borderRadius: homeLayout.postThumbRadius,
  },
  thumbnailEmpty: {
    backgroundColor: colors.surface,
  },
  info: {
    gap: homeLayout.postGapInner,
  },
  author: {
    ...typography.caption,
    color: colors.textMuted,
  },
  title: {
    ...typography.suggestionBody,
    color: colors.textPrimary,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.cardInnerGap,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    width: homeLayout.postIcon,
    height: homeLayout.postIcon,
  },
  statCount: {
    fontFamily: fontFamily.medium,
    fontSize: 10,
  },
});
