// React Query hook for notification settings
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotificationSettings,
  updateNotificationSettings,
} from '../lib/supabase/notifications';
import type { NotificationSettings } from '../lib/supabase/types';
import { toast } from 'sonner';

export function useNotificationSettings() {
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: getNotificationSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Omit<NotificationSettings, 'user_id'>>) =>
      updateNotificationSettings(updates),
    onSuccess: (data) => {
      queryClient.setQueryData(['notificationSettings'], data);
      toast.success('Notification settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update notification settings');
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}

