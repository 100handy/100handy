import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { Loader } from "@/components/ui/loader";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore, usePendingBookingStore, useLocationStore } from '@shared/supabase';
import { getHandyProfile } from '@shared/supabase/profile';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { buildPendingBookingRoute, resolveAuthenticatedRoute, type AuthRouteTarget } from '@/lib/auth-routing';

const CLIENT_ONBOARDING_COMPLETED_KEY_PREFIX = '@clientOnboardingCompleted:';

/**
 * Index Route - Entry Point
 * 
 * Checks if user has seen onboarding before:
 * - First time: Show welcome screens
 * - Returning: Wait for auth check, then route appropriately
 * 
 * Authenticated users are routed to their appropriate home screen based on role.
 */
export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const hasRouted = useRef(false);
  const {
    isAuthenticated,
    isLoading,
    isRoleResolved,
    userRole,
    isEmailVerified,
    hasCompletedOnboarding,
    user,
  } = useAuthStore();
  const {
    hasHydrated: hasPendingBookingHydrated,
    getPendingBooking,
    hasRestorablePendingBooking,
    markPendingBookingRestored,
  } = usePendingBookingStore();
  const { setLocation } = useLocationStore();

  const getPendingBookingRoute = useCallback((): AuthRouteTarget | null => {
    return buildPendingBookingRoute({
      hasRestorablePendingBooking,
      getPendingBooking,
      markPendingBookingRestored,
      setLocation,
    });
  }, [
    getPendingBooking,
    hasRestorablePendingBooking,
    markPendingBookingRestored,
    setLocation,
  ]);

  const routeAuthenticatedUser = useCallback(async () => {
    try {
      const route = await resolveAuthenticatedRoute({
        isEmailVerified,
        userRole,
        hasCompletedOnboarding,
        userEmail: user?.email,
        userId: user?.id,
        getLocalClientOnboardingCompleted: async (userId) => {
          const localValue = await AsyncStorage.getItem(
            `${CLIENT_ONBOARDING_COMPLETED_KEY_PREFIX}${userId}`
          );
          return localValue === 'true';
        },
        getProfessionalOnboardingCompleted: async () => {
          const handyProfile = await getHandyProfile();
          return handyProfile?.onboarding_completed || false;
        },
        getPendingBookingRoute,
      });

      hasRouted.current = true;
      router.replace(route as Parameters<typeof router.replace>[0]);
    } catch (error) {
      console.error('Error routing authenticated user:', error);
      // Default to client home on error (user is authenticated)
      hasRouted.current = true;
      router.replace('/(client)/(tabs)/home');
    } finally {
      setIsChecking(false);
    }
  }, [
    getPendingBookingRoute,
    hasCompletedOnboarding,
    isEmailVerified,
    router,
    user?.id,
    user?.email,
    userRole,
  ]);

  const checkOnboardingStatus = useCallback(async () => {
    try {
      // Priority 1: If user is authenticated, route them appropriately
      if (isAuthenticated && user) {
        // Set the onboarding flag if not already set (for future visits)
        const hasSeenOnboarding = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
        if (hasSeenOnboarding !== 'true') {
          await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, 'true');
        }
        // Route authenticated user
        await routeAuthenticatedUser();
        return;
      }

      // Priority 2: User is not authenticated - check guest onboarding state
      const hasSeenOnboarding = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);

      if (hasSeenOnboarding === 'true') {
        // Returning signed-out user - always show the welcome/auth entry screen.
        hasRouted.current = true;
        router.replace('/(auth)/(client)');
        setIsChecking(false);
      } else {
        // First time user - show welcome flow
        hasRouted.current = true;
        router.replace('/(auth)/(client)');
        setIsChecking(false);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // On error, check auth state first
      if (isAuthenticated && user) {
        await routeAuthenticatedUser();
      } else {
        // Default to sign-up for errors (user has seen onboarding flow)
        hasRouted.current = true;
        router.replace('/(auth)/(client)/sign-up');
        setIsChecking(false);
      }
    }
  }, [isAuthenticated, routeAuthenticatedUser, router, user]);

  // Reset hasRouted when this screen gains focus (e.g. after sign-in calls router.replace('/'))
  useFocusEffect(
    useCallback(() => {
      hasRouted.current = false;
    }, [])
  );

  useEffect(() => {
    // Wait for auth to finish loading before checking onboarding
    if (isLoading) return;
    if (isAuthenticated && user && !isRoleResolved) return;
    if (!hasPendingBookingHydrated) return;
    // Prevent multiple routing calls during auth state changes
    if (hasRouted.current) return;

    checkOnboardingStatus();
  }, [checkOnboardingStatus, hasPendingBookingHydrated, isAuthenticated, isLoading, isRoleResolved, user]);

  if (
    isChecking ||
    isLoading ||
    !hasPendingBookingHydrated ||
    (isAuthenticated && user && !isRoleResolved)
  ) {
    return <Loader />;
  }

  // This should not be reached, but return null as fallback
  return null;
}
