import { apiClient } from '@/core/api/client'
import type { Comment, CreateCommentPayload } from '@/features/comments/types/comment.types'

export const commentsApi = {
  getComments: (postId: string) =>
    apiClient.get<Comment[]>(`/posts/${postId}/comments`).then((res) => res.data),

  createComment: (payload: CreateCommentPayload) =>
    apiClient.post<Comment>(`/posts/${payload.postId}/comments`, payload).then((res) => res.data),

  deleteComment: (postId: string, commentId: string) =>
    apiClient.delete(`/posts/${postId}/comments/${commentId}`).then(() => undefined),
}
