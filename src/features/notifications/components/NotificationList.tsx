import { FlatList } from 'react-native'

import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { notificationsApi } from '@/features/notifications/api/notifications.api'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { NotificationItem } from './NotificationItem'

export function NotificationList() {
  const { data, isLoading, isError, refetch } = useNotifications()

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (!data || data.length === 0) return <EmptyState title="No notifications" />

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NotificationItem
          notification={item}
          onPress={() => notificationsApi.markAsRead(item.id).then(() => refetch())}
        />
      )}
    />
  )
}
