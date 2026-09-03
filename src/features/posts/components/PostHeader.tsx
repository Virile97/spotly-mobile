import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/providers/ThemeProvider';
import { Avatar } from '@/shared/components/ui';
import { formatRelativeTime } from '@/shared/utils/date';
import type { Post } from '@/features/posts/types/post.types';

export function PostHeader({ post }: { post: Post }) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.row}>
      <Avatar uri={post.author.avatarUrl} fallback={post.author.username} size={36} />
      <View style={{ marginLeft: theme.spacing.sm }}>
        <Text style={{ color: theme.colors.text, fontWeight: theme.fontWeight.semibold }}>
          {post.author.username}
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.xs }}>
          {formatRelativeTime(post.createdAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
