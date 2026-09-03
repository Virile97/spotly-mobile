import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAppTheme } from '@/providers/ThemeProvider';
import { formatRelativeTime } from '@/shared/utils/date';
import type { AppNotification } from '@/features/notifications/api/notifications.api';

interface NotificationItemProps {
  notification: AppNotification;
  onPress: () => void;
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.row, { paddingVertical: theme.spacing.sm }]}>
      <View
        style={[
          styles.dot,
          { backgroundColor: notification.isRead ? 'transparent' : theme.colors.primary },
        ]}
      />
      <View style={{ marginLeft: theme.spacing.sm, flex: 1 }}>
        <Text style={{ color: theme.colors.text }}>{notification.message}</Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.xs }}>
          {formatRelativeTime(notification.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
