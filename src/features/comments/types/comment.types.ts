export interface Comment {
  id: string
  postId: string
  authorId: string
  authorUsername: string
  authorAvatarUrl: string | null
  body: string
  createdAt: string
}

export interface CreateCommentPayload {
  postId: string
  body: string
}
