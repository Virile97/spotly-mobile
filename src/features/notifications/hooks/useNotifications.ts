import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/core/query/query-keys';
import { notificationsApi } from '@/features/notifications/api/notifications.api';

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications(),
    queryFn: () => notificationsApi.getNotifications(),
  });
}
