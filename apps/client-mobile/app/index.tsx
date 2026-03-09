import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "expo-router";
import { Loader } from "@/components/ui/loader";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore, usePendingBookingStore, useLocationStore } from '@shared/supabase';
import { getHandyProfile } from '@shared/supabase/profile';
import { STORAGE_KEYS } from '@/lib/storage-keys';

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

  const checkAndRestorePendingBooking = useCallback(() => {
    if (!hasRestorablePendingBooking()) {
      return false;
    }

    const pendingBooking = getPendingBooking();
    if (pendingBooking) {
      // Restore the location from pending booking
      setLocation(pendingBooking.location);

      // Keep the draft until the user completes booking or explicitly discards it.
      markPendingBookingRestored();

      // Navigate to confirm booking with all the saved data
      router.replace({
        pathname: '/(client)/confirm-booking',
        params: {
          taskerId: pendingBooking.tasker.id,
          categoryId: pendingBooking.categoryId,
          categoryName: pendingBooking.categoryName,
          selectedDate: pendingBooking.selectedDate,
          selectedTime: pendingBooking.selectedTime,
          formResponses: JSON.stringify(pendingBooking.formResponses),
          selectedFrequency: pendingBooking.frequency ?? 'once',
        },
      });
      return true;
    }
    return false;
  }, [
    getPendingBooking,
    hasRestorablePendingBooking,
    markPendingBookingRestored,
    router,
    setLocation,
  ]);

  const routeAuthenticatedUser = useCallback(async () => {
    try {
      // Check email verification
      if (!isEmailVerified) {
        hasRouted.current = true;
        router.replace({
          pathname: '/(auth)/verify-email',
          params: { email: user?.email || '' },
        });
        setIsChecking(false);
        return;
      }

      // Email verified - check role and onboarding
      const isClient = userRole === 'customer';
      const isProfessional = userRole === 'handy';

      if (isProfessional) {
        // Check professional onboarding status
        try {
          const handyProfile = await getHandyProfile();
          const onboardingComplete = handyProfile?.onboarding_completed || false;

          hasRouted.current = true;
          if (!onboardingComplete) {
            router.replace('/(auth)/(professional)/verify-info');
          } else {
            router.replace('/(professional)/(tabs)/dashboard');
          }
        } catch (error) {
          console.error('Error checking professional onboarding:', error);
          // Fail closed so incomplete professional accounts cannot bypass onboarding.
          hasRouted.current = true;
          router.replace('/(auth)/(professional)/verify-info');
        }
      } else if (isClient) {
        const localOnboardingCompleted =
          user?.id
            ? await AsyncStorage.getItem(`${CLIENT_ONBOARDING_COMPLETED_KEY_PREFIX}${user.id}`)
            : null;

        // Client - check onboarding first
        if (!hasCompletedOnboarding && localOnboardingCompleted !== 'true') {
          hasRouted.current = true;
          router.replace('/(auth)/(client)/onboarding');
        } else {
          // Check for pending booking from before auth
          const hasPendingBooking = checkAndRestorePendingBooking();
          hasRouted.current = true;
          if (!hasPendingBooking) {
            // No pending booking, go to home
            router.replace('/(client)/(tabs)/home');
          }
        }
      } else {
        // Unknown role - fail closed instead of misrouting into the client app.
        hasRouted.current = true;
        router.replace('/(auth)/role-selection');
      }
    } catch (error) {
      console.error('Error routing authenticated user:', error);
      // Default to client home on error (user is authenticated)
      hasRouted.current = true;
      router.replace('/(client)/(tabs)/home');
    } finally {
      setIsChecking(false);
    }
  }, [
    checkAndRestorePendingBooking,
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
      const [hasSeenOnboarding, hasAcceptedTerms] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING),
        AsyncStorage.getItem(STORAGE_KEYS.HAS_ACCEPTED_TERMS),
      ]);

      if (hasSeenOnboarding === 'true' && hasAcceptedTerms === 'true') {
        // Returning guest who finished onboarding and accepted terms
        hasRouted.current = true;
        router.replace('/(auth)/(client)/sign-up');
        setIsChecking(false);
      } else if (hasSeenOnboarding === 'true') {
        // Guest finished onboarding but still needs the mandatory terms screen
        hasRouted.current = true;
        router.replace('/(auth)/(client)/terms-and-privacy');
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
