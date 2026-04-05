import { useQuery } from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadNotificationCount,
  type UserRole,
  type NotificationItem,
} from '../../supabase/notifications';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (userId: string) => ['notifications', 'list', userId] as const,
  count: (userId: string) => ['notifications', 'count', userId] as const,
};

export function useNotifications(userId: string, role: UserRole) {
  return useQuery<NotificationItem[]>({
    queryKey: notificationKeys.list(userId),
    queryFn: () => getNotifications(userId, role),
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useUnreadNotificationCount(userId: string, role: UserRole) {
  return useQuery<number>({
    queryKey: notificationKeys.count(userId),
    queryFn: () => getUnreadNotificationCount(userId, role),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds for badge freshness
  });
}
