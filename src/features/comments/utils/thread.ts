import type { Comment, CommentThread } from '@/features/comments/types/comment.types'

/**
 * Groups a flat comment list into two-layer threads: top-level comments, each
 * with their replies. A reply that points at another reply is re-attached to
 * the top-level ancestor so the UI never nests deeper than one level.
 */
export function buildCommentThreads(comments: Comment[]): CommentThread[] {
  const byId = new Map(comments.map((comment) => [comment.id, comment]))
  const threads: CommentThread[] = []
  const threadByRootId = new Map<string, CommentThread>()

  for (const comment of comments) {
    if (comment.parentId) continue

    const thread: CommentThread = { comment, replies: [] }
    threads.push(thread)
    threadByRootId.set(comment.id, thread)
  }

  for (const comment of comments) {
    if (!comment.parentId) continue

    const rootId = findRootId(comment, byId)
    const thread = rootId === null ? undefined : threadByRootId.get(rootId)

    if (thread) {
      thread.replies.push(comment)
      continue
    }

    // The parent is missing from this page of comments, so show the reply on
    // its own rather than dropping it.
    const orphan: CommentThread = { comment, replies: [] }
    threads.push(orphan)
    threadByRootId.set(comment.id, orphan)
  }

  for (const thread of threads) {
    thread.replies.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
  }

  return threads
}

function findRootId(comment: Comment, byId: Map<string, Comment>): string | null {
  const seen = new Set<string>([comment.id])
  let current = comment

  while (current.parentId) {
    // Guards against a malformed cycle in the parent chain.
    if (seen.has(current.parentId)) return null

    const parent = byId.get(current.parentId)
    if (!parent) return null

    seen.add(parent.id)
    current = parent
  }

  return current.id
}
