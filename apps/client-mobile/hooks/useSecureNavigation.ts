import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useProfile } from '@shared/query';
import { useAuthStore, signIn } from '@shared/supabase';
import { useToast } from '@/components/ui/toast';

/**
 * Hook for navigating to sensitive profile sections.
 * When 2FA is enabled and the route requires security,
 * sets pendingRoute so the UI can show a password prompt before navigating.
 */
export function useSecureNavigation() {
  const router = useRouter();
  const { data: profile } = useProfile();
  const user = useAuthStore((state) => state.user);
  const toast = useToast();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const navigateWithSecurityCheck = useCallback((route: string, requiresSecurity = false) => {
    if (requiresSecurity && profile?.two_factor_enabled) {
      setPendingRoute(route);
    } else {
      router.push(route as any);
    }
  }, [profile?.two_factor_enabled, router]);

  const verifyAndNavigate = useCallback(async (password: string) => {
    if (!pendingRoute || !user?.email) return;
    setIsVerifying(true);
    try {
      await signIn(user.email, password);
      const route = pendingRoute;
      setPendingRoute(null);
      router.push(route as any);
    } catch {
      toast.error('Verification Failed', 'Incorrect password. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  }, [pendingRoute, user?.email, router, toast]);

  const cancelVerification = useCallback(() => {
    setPendingRoute(null);
  }, []);

  return {
    navigateWithSecurityCheck,
    pendingRoute,
    isVerifying,
    verifyAndNavigate,
    cancelVerification,
    isTwoFactorEnabled: profile?.two_factor_enabled ?? false,
  };
}
