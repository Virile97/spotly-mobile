import { apiClient } from '@/core/api/client'
import type { Reaction, ReactionKind } from '@/features/reactions/types/reaction.types'

export const reactionsApi = {
  react: (postId: string, kind: ReactionKind) =>
    apiClient.post<Reaction>(`/posts/${postId}/reactions`, { kind }).then((res) => res.data),

  unreact: (postId: string) =>
    apiClient.delete(`/posts/${postId}/reactions`).then(() => undefined),
}
