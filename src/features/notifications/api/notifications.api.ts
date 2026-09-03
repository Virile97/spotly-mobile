import { apiClient } from '@/core/api/client';

export interface AppNotification {
  id: string;
  type: 'comment' | 'reaction' | 'follow';
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getNotifications: () =>
    apiClient.get<AppNotification[]>('/notifications').then((res) => res.data),

  markAsRead: (notificationId: string) =>
    apiClient.patch(`/notifications/${notificationId}/read`).then(() => undefined),
};
