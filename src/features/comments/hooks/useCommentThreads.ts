import { useCallback, useMemo, useState } from 'react'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { mockCommentsByPost } from '@/features/comments/data/mock-comments'
import type { Comment, CommentThread } from '@/features/comments/types/comment.types'
import { buildCommentThreads } from '@/features/comments/utils/thread'

interface UseCommentThreadsResult {
  threads: CommentThread[]
  /** Reported total, which stays in step with locally added comments. */
  commentCount: number
  addComment: (body: string, parentId: string | null) => void
}

/**
 * Comment threads for a post, backed by mock data while the feed itself runs
 * on mock posts.
 *
 * TODO: swap the local state for `useComments` / `useCreateComment` once the
 * comments endpoints are live.
 */
export function useCommentThreads(postId: string, initialCount: number): UseCommentThreadsResult {
  const user = useAuthStore((state) => state.user)
  const [comments, setComments] = useState<Comment[]>(() => mockCommentsByPost[postId] ?? [])
  const [addedCount, setAddedCount] = useState(0)

  const threads = useMemo(() => buildCommentThreads(comments), [comments])

  const addComment = useCallback(
    (body: string, parentId: string | null) => {
      const comment: Comment = {
        id: `comment-local-${Date.now()}`,
        postId,
        parentId,
        authorId: user?.id ?? 'user-me',
        authorUsername: user?.displayName ?? 'You',
        authorAvatarUrl: user?.avatarUrl ?? null,
        body,
        likeCount: 0,
        createdAt: new Date().toISOString(),
      }

      setComments((previous) => [...previous, comment])
      setAddedCount((previous) => previous + 1)
    },
    [postId, user]
  )

  return { threads, commentCount: initialCount + addedCount, addComment }
}
