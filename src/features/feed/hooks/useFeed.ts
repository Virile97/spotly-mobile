import { useInfiniteQuery } from '@tanstack/react-query';

import { queryKeys } from '@/core/query/query-keys';
import { feedApi } from '@/features/feed/api/feed.api';

export function useFeed() {
  return useInfiniteQuery({
    queryKey: queryKeys.feed(),
    queryFn: ({ pageParam }: { pageParam?: string }) => feedApi.getFeed({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined),
  });
}
