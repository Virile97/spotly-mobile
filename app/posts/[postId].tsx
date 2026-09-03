import { useLocalSearchParams } from 'expo-router';

import { PostCard } from '@/features/posts/components/PostCard';
import { usePost } from '@/features/posts/hooks/usePost';
import { Screen } from '@/shared/components/layout/Screen';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';

export default function PostDetailScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { data, isLoading, isError, refetch } = usePost(postId);

  return (
    <Screen scroll>
      {isLoading ? (
        <LoadingState />
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <PostCard post={data} />
      )}
    </Screen>
  );
}
