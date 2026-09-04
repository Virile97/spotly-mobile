import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/core/query/query-keys'
import { reactionsApi } from '@/features/reactions/api/reactions.api'
import type { ReactionSelection } from '@/features/reactions/types/reaction.types'

export function useReaction(postId: string) {
  const queryClient = useQueryClient()

  const react = useMutation({
    mutationFn: (selection: ReactionSelection) => reactionsApi.react(postId, selection),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.post(postId) }),
  })

  const unreact = useMutation({
    mutationFn: () => reactionsApi.unreact(postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.post(postId) }),
  })

  return { react, unreact }
}
