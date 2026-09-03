import { apiClient } from '@/core/api/client'
import type { Post } from '@/features/posts/types/post.types'
import type { PaginatedResponse, PaginationParams } from '@/shared/types/pagination.types'

export const feedApi = {
  getFeed: (params: PaginationParams) =>
    apiClient
      .get<PaginatedResponse<Post>>('/feed', { params })
      .then((res) => res.data),
}
