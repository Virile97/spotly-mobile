import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Avatar } from '@/shared/components/ui'
import { formatRelativeTime } from '@/shared/utils/date'
import type { Post } from '@/features/posts/types/post.types'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

export function PostHeader({ post }: { post: Post }) {
  const meta = post.location ? `${formatRelativeTime(post.createdAt)} · ${post.location}` : formatRelativeTime(post.createdAt)

  return (
    <View style={styles.row}>
      <Avatar uri={post.author.avatarUrl} fallback={post.author.username} size={36} />
      <View style={styles.info}>
        <Text style={styles.name}>{post.author.username}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
      <Pressable accessibilityRole="button" hitSlop={8}>
        <Ionicons name="ellipsis-horizontal" size={18} color="rgba(255,255,255,0.5)" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  info: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  name: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  meta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
})
