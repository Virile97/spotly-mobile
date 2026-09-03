import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postsApi } from '@/features/posts/api/posts.api';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
