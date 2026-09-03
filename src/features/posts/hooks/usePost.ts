import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/query/query-keys'
import { postsApi } from '@/features/posts/api/posts.api'

export function usePost(postId: string) {
  return useQuery({
    queryKey: queryKeys.post(postId),
    queryFn: () => postsApi.getPost(postId),
    enabled: Boolean(postId),
  })
}
