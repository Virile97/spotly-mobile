import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/core/query/query-keys';
import { commentsApi } from '@/features/comments/api/comments.api';
import type { CreateCommentPayload } from '@/features/comments/types/comment.types';

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => commentsApi.createComment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postComments(postId) });
    },
  });
}
