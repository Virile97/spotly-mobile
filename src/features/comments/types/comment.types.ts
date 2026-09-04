export interface Comment {
  id: string
  postId: string
  /** `null` for a top-level comment, otherwise the comment being replied to. */
  parentId: string | null
  authorId: string
  authorUsername: string
  authorAvatarUrl: string | null
  body: string
  likeCount: number
  createdAt: string
}

/**
 * A top-level comment with its replies flattened into a single level. Threads
 * are capped at two layers, so a reply can never open a third one.
 */
export interface CommentThread {
  comment: Comment
  replies: Comment[]
}

export interface CreateCommentPayload {
  postId: string
  parentId?: string | null
  body: string
}
