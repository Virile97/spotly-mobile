import { PostCard } from '@/features/posts/components/PostCard';
import type { Post } from '@/features/posts/types/post.types';

export function FeedItem({ post }: { post: Post }) {
  return <PostCard post={post} />;
}
