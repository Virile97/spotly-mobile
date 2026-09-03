import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/core/query/query-keys';
import { postsApi } from '@/features/posts/api/posts.api';
import type { UpdatePostPayload } from '@/features/posts/types/post.types';

export function useUpdatePost(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePostPayload) => postsApi.updatePost(postId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.post(postId) });
    },
  });
}
