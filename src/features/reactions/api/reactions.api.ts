import { apiClient } from '@/core/api/client'
import type { Reaction, ReactionSelection } from '@/features/reactions/types/reaction.types'

export const reactionsApi = {
  react: (postId: string, selection: ReactionSelection) =>
    apiClient.post<Reaction>(`/posts/${postId}/reactions`, selection).then((res) => res.data),

  unreact: (postId: string) =>
    apiClient.delete(`/posts/${postId}/reactions`).then(() => undefined),
}
