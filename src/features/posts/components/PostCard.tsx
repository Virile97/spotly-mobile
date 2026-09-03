import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/providers/ThemeProvider';
import type { Post } from '@/features/posts/types/post.types';
import { PostActions } from './PostActions';
import { PostHeader } from './PostHeader';
import { PostMedia } from './PostMedia';

export function PostCard({ post }: { post: Post }) {
  const { theme } = useAppTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { marginBottom: theme.spacing.md }]}>
      <PostHeader post={post} />
      {post.mediaUrls[0] ? <PostMedia uri={post.mediaUrls[0]} /> : null}
      {post.caption ? (
        <Text style={{ color: theme.colors.text, marginTop: theme.spacing.sm }}>{post.caption}</Text>
      ) : null}
      <PostActions
        reactionCount={post.reactionCount}
        commentCount={post.commentCount}
        onReactionPress={() => {}}
        onCommentPress={() => router.push(`/comments/${post.id}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
