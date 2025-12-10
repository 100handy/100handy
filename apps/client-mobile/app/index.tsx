import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Loader } from "@/components/ui/loader";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore, usePendingBookingStore, useLocationStore } from '@shared/supabase';
import { getHandyProfile } from '@shared/supabase/profile';

const ONBOARDING_KEY = '@hasSeenOnboarding';

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
  const { isAuthenticated, isLoading, initialize, userRole, isEmailVerified, hasCompletedOnboarding, user } = useAuthStore();
  const { getPendingBooking, clearPendingBooking } = usePendingBookingStore();
  const { setLocation } = useLocationStore();

  useEffect(() => {
    // Initialize auth first
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Wait for auth to finish loading before checking onboarding
    if (isLoading) return;

    checkOnboardingStatus();
  }, [isLoading, isAuthenticated, user, userRole, isEmailVerified, hasCompletedOnboarding]);

  const checkOnboardingStatus = async () => {
    try {
      // Priority 1: If user is authenticated, route them appropriately
      if (isAuthenticated && user) {
        // Set the onboarding flag if not already set (for future visits)
        const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (hasSeenOnboarding !== 'true') {
          await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
        }
        // Route authenticated user
        await routeAuthenticatedUser();
        return;
      }

      // Priority 2: User is not authenticated - check if they've seen onboarding before
      const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
      
      if (hasSeenOnboarding === 'true') {
        // Returning user but not authenticated - redirect to login
        router.replace('/(auth)/role-selection');
        setIsChecking(false);
      } else {
        // First time user - show welcome flow
        router.replace('/(auth)/role-selection');
        setIsChecking(false);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // On error, check auth state first
      if (isAuthenticated && user) {
        await routeAuthenticatedUser();
      } else {
        router.replace('/(auth)/role-selection');
        setIsChecking(false);
      }
    }
  };

  // Check for pending booking and restore location if exists
  const checkAndRestorePendingBooking = () => {
    const pendingBooking = getPendingBooking();
    if (pendingBooking) {
      // Restore the location from pending booking
      setLocation(pendingBooking.location);

      // Clear the pending booking from storage to prevent repeated restoration
      clearPendingBooking();

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
        },
      });
      return true;
    }
    return false;
  };

  const routeAuthenticatedUser = async () => {
    try {
      // Check email verification
      if (!isEmailVerified) {
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

          // if (!onboardingComplete) {
          //   router.replace('/(auth)/(professional)/verify-info');
          // } else {
          //   router.replace('/(professional)/(tabs)/dashboard');
          // }
          router.replace('/(professional)/(tabs)/dashboard');
        } catch (error) {
          console.error('Error checking professional onboarding:', error);
          // If error, assume not completed and send to verification
          router.replace('/(auth)/(professional)/verify-info');
        }
      } else if (isClient) {
        // Client - check onboarding first
        if (!hasCompletedOnboarding) {
          router.replace('/(auth)/(client)/onboarding');
        } else {
          // Check for pending booking from before auth
          const hasPendingBooking = checkAndRestorePendingBooking();
          if (!hasPendingBooking) {
            // No pending booking, go to home
            router.replace('/(client)/(tabs)/home');
          }
        }
      } else {
        // Unknown role - redirect to role selection
        router.replace('/(auth)/role-selection');
      }
    } catch (error) {
      console.error('Error routing authenticated user:', error);
      router.replace('/(auth)/role-selection');
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking || isLoading) {
    return <Loader />;
  }

  // This should not be reached, but return null as fallback
  return null;
}
