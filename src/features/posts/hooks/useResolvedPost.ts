import { mockPosts } from '@/features/feed/data/mock-posts'
import { usePost } from '@/features/posts/hooks/usePost'
import type { Post } from '@/features/posts/types/post.types'

interface UseResolvedPostResult {
  post: Post | null
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

/**
 * Feed posts are still mock-backed. Prefer the local post when present so
 * opening a card does not depend on the posts endpoint.
 */
export function useResolvedPost(postId: string): UseResolvedPostResult {
  const mock = mockPosts.find((post) => post.id === postId) ?? null
  const query = usePost(mock ? '' : postId)

  if (mock) {
    return { post: mock, isLoading: false, isError: false, refetch: () => undefined }
  }

  return {
    post: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: () => {
      void query.refetch()
    },
  }
}
