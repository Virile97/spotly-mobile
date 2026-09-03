import type { Post } from '@/features/posts/types/post.types';

export interface FeedItem {
  post: Post;
}

export interface FeedParams {
  cursor?: string;
}
