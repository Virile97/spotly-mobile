import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/core/query/query-keys';
import { commentsApi } from '@/features/comments/api/comments.api';

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentsApi.deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postComments(postId) });
    },
  });
}
