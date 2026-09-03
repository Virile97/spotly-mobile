import { FlatList } from 'react-native'

import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { useFeed } from '@/features/feed/hooks/useFeed'
import { FeedItem } from './FeedItem'
import { FeedSkeleton } from './FeedSkeleton'

export function FeedList() {
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage } = useFeed()
  const posts = data?.pages.flatMap((page) => page.items) ?? []

  if (isLoading) return <FeedSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (posts.length === 0) return <EmptyState title="No posts yet" description="Follow places and people to see their posts here." />

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedItem post={item} />}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
    />
  )
}
