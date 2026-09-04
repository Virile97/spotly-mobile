import { useRouter } from 'expo-router'

import { PostCard } from '@/features/posts/components/PostCard'
import type { Post } from '@/features/posts/types/post.types'

export function FeedItem({ post }: { post: Post }) {
  const router = useRouter()

  return <PostCard post={post} onPress={() => router.push(`/posts/${post.id}`)} />
}
