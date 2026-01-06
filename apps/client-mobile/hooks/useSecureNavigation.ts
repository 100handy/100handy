import { useRouter } from 'expo-router';
import { useProfile } from '@shared/query';

/**
 * Hook for navigating to profile sections
 * 2FA is optional - users are not forced to enable it to access routes
 */
export function useSecureNavigation() {
  const router = useRouter();
  const { data: profile } = useProfile();

  /**
   * Navigate to a route
   * @param route - The route to navigate to
   * @param _requiresSecurity - Kept for backwards compatibility (not enforced)
   */
  const navigateWithSecurityCheck = (route: string, _requiresSecurity = false) => {
    // Navigate directly - 2FA is optional, not required
    router.push(route as any);
  };

  return {
    navigateWithSecurityCheck,
    isTwoFactorEnabled: profile?.two_factor_enabled ?? false,
  };
}
