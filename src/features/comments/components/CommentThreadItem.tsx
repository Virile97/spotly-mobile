import { View } from 'react-native'

import type { Comment, CommentThread } from '@/features/comments/types/comment.types'
import { CommentItem } from './CommentItem'

interface CommentThreadItemProps {
  thread: CommentThread
  onReplyPress?: (comment: Comment) => void
}

export function CommentThreadItem({ thread, onReplyPress }: CommentThreadItemProps) {
  return (
    <View>
      <CommentItem comment={thread.comment} onReplyPress={onReplyPress} />

      {/* Replies get no reply handler, so the thread stops at two layers. */}
      {thread.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} variant="reply" />
      ))}
    </View>
  )
}
