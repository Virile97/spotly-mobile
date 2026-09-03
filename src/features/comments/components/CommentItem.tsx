import { StyleSheet, Text, View } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'
import { Avatar } from '@/shared/components/ui'
import { formatRelativeTime } from '@/shared/utils/date'
import type { Comment } from '@/features/comments/types/comment.types'

export function CommentItem({ comment }: { comment: Comment }) {
  const { theme } = useAppTheme()

  return (
    <View style={[styles.row, { marginBottom: theme.spacing.sm }]}>
      <Avatar uri={comment.authorAvatarUrl} fallback={comment.authorUsername} size={28} />
      <View style={{ marginLeft: theme.spacing.sm, flex: 1 }}>
        <Text style={{ color: theme.colors.text }}>
          <Text style={{ fontWeight: theme.fontWeight.semibold }}>{comment.authorUsername} </Text>
          {comment.body}
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.xs }}>
          {formatRelativeTime(comment.createdAt)}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
})
