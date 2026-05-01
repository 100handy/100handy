import React, { useEffect } from 'react';
import { router } from 'expo-router'; import { useAuthStore } from '@shared/store';
import { Loader } from '@/components/ui/loader';

/**
 * Backward-compatible route:
 * Older screens navigate to `/profile/notifications`. Redirect based on role.
 */
export default function NotificationsRedirectScreen() {
  const userId = useAuthStore((s) => s.user?.id);
  const userRole = useAuthStore((s) => s.userRole);

  useEffect(() => {
    if (!userId) {
      router.replace('/(auth)/(client)');
      return;
    }

    if (userRole === 'handy') {
      router.replace('/(professional)/profile/notifications');
      return;
    }

    router.replace('/(client)/profile/notifications');
  }, [userId, userRole]);

  return <Loader />;
}