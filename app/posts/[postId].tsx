import { useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'

import { PostDetail } from '@/features/posts/components/PostDetail'
import { useResolvedPost } from '@/features/posts/hooks/useResolvedPost'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { LoadingState } from '@/shared/components/feedback/LoadingState'

export default function PostDetailScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>()
  const { post, isLoading, isError, refetch } = useResolvedPost(postId)

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {isLoading ? (
        <LoadingState />
      ) : isError || !post ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <PostDetail post={post} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
})
