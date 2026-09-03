import { apiClient } from '@/core/api/client';
import type { CreatePostPayload, Post, UpdatePostPayload } from '@/features/posts/types/post.types';

export const postsApi = {
  getPost: (postId: string) => apiClient.get<Post>(`/posts/${postId}`).then((res) => res.data),

  createPost: (payload: CreatePostPayload) =>
    apiClient.post<Post>('/posts', payload).then((res) => res.data),

  updatePost: (postId: string, payload: UpdatePostPayload) =>
    apiClient.patch<Post>(`/posts/${postId}`, payload).then((res) => res.data),

  deletePost: (postId: string) => apiClient.delete(`/posts/${postId}`).then(() => undefined),
};
