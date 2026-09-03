import { FlatList } from 'react-native'

import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { useComments } from '@/features/comments/hooks/useComments'
import { CommentItem } from './CommentItem'

export function CommentList({ postId }: { postId: string }) {
  const { data, isLoading, isError, refetch } = useComments(postId)

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (!data || data.length === 0) return <EmptyState title="No comments yet" />

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CommentItem comment={item} />}
    />
  )
}
