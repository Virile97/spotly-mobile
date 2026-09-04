import { useMemo } from 'react'
import { FlatList } from 'react-native'

import { useComments } from '@/features/comments/hooks/useComments'
import { buildCommentThreads } from '@/features/comments/utils/thread'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { CommentThreadItem } from './CommentThreadItem'

export function CommentList({ postId }: { postId: string }) {
  const { data, isLoading, isError, refetch } = useComments(postId)
  const threads = useMemo(() => buildCommentThreads(data ?? []), [data])

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (threads.length === 0) return <EmptyState title="No comments yet" />

  return (
    <FlatList
      data={threads}
      keyExtractor={(thread) => thread.comment.id}
      renderItem={({ item }) => <CommentThreadItem thread={item} />}
    />
  )
}
