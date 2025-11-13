import { useRouter } from 'expo-router';
import { useProfile } from '@shared/query';

/**
 * Hook for navigating to sensitive profile sections with 2FA security check
 * If 2FA is not enabled, redirects to account security screen first
 */
export function useSecureNavigation() {
  const router = useRouter();
  const { data: profile } = useProfile();

  /**
   * Navigate to a route with security check
   * @param route - The route to navigate to
   * @param requiresSecurity - Whether this route requires 2FA to be enabled
   */
  const navigateWithSecurityCheck = (route: string, requiresSecurity = false) => {
    if (!requiresSecurity) {
      // Non-sensitive routes can be accessed directly
      router.push(route as any);
      return;
    }

    // Check if 2FA is enabled
    if (!profile?.two_factor_enabled) {
      // Redirect to account security screen to enable 2FA
      router.push('/(client)/profile/account-security' as any);
      return;
    }

    // 2FA is enabled, proceed to requested route
    router.push(route as any);
  };

  return {
    navigateWithSecurityCheck,
    isTwoFactorEnabled: profile?.two_factor_enabled ?? false,
  };
}
