import { Pressable, StyleSheet, Text, View } from 'react-native'

import type { Comment } from '@/features/comments/types/comment.types'
import { Avatar } from '@/shared/components/ui'
import { formatShortRelativeTime } from '@/shared/utils/date'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const ROOT_AVATAR_SIZE = 32
const REPLY_AVATAR_SIZE = 26
const AVATAR_BG = 'rgba(255,255,255,0.12)'
const AVATAR_FG = 'rgba(255,255,255,0.8)'

interface CommentItemProps {
  comment: Comment
  variant?: 'root' | 'reply'
  /** Omitted for replies, which keeps threads at two layers. */
  onReplyPress?: (comment: Comment) => void
}

export function CommentItem({ comment, variant = 'root', onReplyPress }: CommentItemProps) {
  const isReply = variant === 'reply'

  return (
    <View style={[styles.row, isReply && styles.rowReply]}>
      <Avatar
        uri={comment.authorAvatarUrl}
        fallback={comment.authorUsername}
        size={isReply ? REPLY_AVATAR_SIZE : ROOT_AVATAR_SIZE}
        backgroundColor={AVATAR_BG}
        color={AVATAR_FG}
      />

      <View style={styles.content}>
        <Text style={styles.author}>{comment.authorUsername}</Text>
        <Text style={styles.body}>{comment.body}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>
            {formatShortRelativeTime(comment.createdAt)} • {comment.likeCount}{' '}
            {comment.likeCount === 1 ? 'like' : 'likes'}
          </Text>

          {onReplyPress ? (
            <Pressable accessibilityRole="button" hitSlop={6} onPress={() => onReplyPress(comment)}>
              <Text style={styles.replyText}> • Reply</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  rowReply: {
    paddingLeft: spacing.xl + spacing.sm,
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  author: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  body: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    lineHeight: 20,
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
  replyText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bodySemiBold,
  },
})
