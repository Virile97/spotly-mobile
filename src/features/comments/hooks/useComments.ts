import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/query/query-keys'
import { commentsApi } from '@/features/comments/api/comments.api'

export function useComments(postId: string) {
  return useQuery({
    queryKey: queryKeys.postComments(postId),
    queryFn: () => commentsApi.getComments(postId),
    enabled: Boolean(postId),
  })
}
