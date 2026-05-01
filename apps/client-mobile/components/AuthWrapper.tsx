import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSegments } from 'expo-router'; import { useAuthStore } from '@shared/store';
import { getHandyProfile } from '@shared/supabase/profile';
import { Loader } from '@/components/ui/loader';

const AUTH_TIMEOUT_MS = 10_000; // 10 second timeout for auth checks

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const {
    isAuthenticated,
    isLoading,
    isEmailVerified,
    hasCompletedOnboarding,
    userRole,
    user,
    initialize,
    cleanup
  } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();
  const [professionalOnboardingComplete, setProfessionalOnboardingComplete] = useState<boolean | null>(null);
  const [isIdentityVerified, setIsIdentityVerified] = useState<boolean | null>(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Initialize auth state when component mounts
    initialize();

    // Safety timeout: if auth checks don't resolve, stop loading
    timeoutRef.current = setTimeout(() => {
      setHasTimedOut(true);
    }, AUTH_TIMEOUT_MS);

    // Cleanup subscription and timeout when component unmounts
    return () => {
      cleanup();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [initialize, cleanup]);

  // Clear timeout once loading completes
  useEffect(() => {
    if (!isLoading && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [isLoading]);

  // Check professional onboarding and identity verification in a single effect
  useEffect(() => {
    let isMounted = true;

    const checkProfessionalStatus = async () => {
      if (!isAuthenticated || isLoading) {
        if (!isAuthenticated && isMounted) {
          setProfessionalOnboardingComplete(null);
          setIsIdentityVerified(null);
        }
        return;
      }

      if (userRole === 'handy') {
        setIsCheckingOnboarding(true);
        try {
          const handyProfile = await getHandyProfile();
          if (isMounted) {
            setProfessionalOnboardingComplete(
              typeof handyProfile?.onboarding_completed === 'boolean'
                ? handyProfile.onboarding_completed
                : true
            );
            setIsIdentityVerified(
              handyProfile ? handyProfile.verification_status === 'verified' : true
            );
          }
        } catch (error) {
          console.warn('Unable to check professional status:', error);
          if (isMounted) {
            // Avoid forcing legitimate professionals back into onboarding on transient failures.
            setProfessionalOnboardingComplete(true);
            setIsIdentityVerified(true);
          }
        } finally {
          if (isMounted) setIsCheckingOnboarding(false);
        }
      } else {
        if (isMounted) {
          setProfessionalOnboardingComplete(null);
          setIsIdentityVerified(true);
        }
      }
    };

    checkProfessionalStatus();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, userRole, isLoading]);

  useEffect(() => {
    if (isLoading || isCheckingOnboarding) return; // Don't redirect while loading

    const segmentStrings = segments.map(String);
    const inAuthGroup = segmentStrings.includes('(auth)');
    const inClientGroup = segmentStrings.includes('(client)');
    const inProfessionalGroup = segmentStrings.includes('(professional)');
    const inTabsGroup = segmentStrings.includes('(tabs)');
    const isOnIndex = segmentStrings.length === 0;
    const isOnVerifyEmail = segmentStrings.includes('verify-email');
    const isOnCallback = segmentStrings.includes('callback');

    if (isAuthenticated && user) {
      // User is authenticated

      // Don't redirect if on callback page (let it finish processing)
      if (isOnCallback) {
        return;
      }

      // Check email verification
      const isVerified = isEmailVerified;
      const isOnVerificationScreen = isOnVerifyEmail;

      if (!isVerified && !isOnVerificationScreen) {
        // Not verified - send to email verification screen
        router.replace({
          pathname: '/(auth)/verify-email',
          params: { email: user.email || '' },
        });
        return;
      }

      // Verification complete - route to appropriate home
      if (isVerified) {
        const isProfessional = userRole === 'handy';

        // Allow professionals to stay on onboarding screens (verify-info, verify-document-upload)
        const isOnProfessionalOnboarding = segmentStrings.includes('verify-info') || segmentStrings.includes('verify-document-upload');
        if (isProfessional && isOnProfessionalOnboarding) {
          return; // Don't redirect — let them complete onboarding
        }

        // If on auth screens or index, redirect to appropriate home
        if (inAuthGroup || isOnIndex) {
          if (isProfessional) {
            // Wait until we know the onboarding status before redirecting
            if (professionalOnboardingComplete === null) {
              return; // Still checking — don't redirect yet
            }
            if (professionalOnboardingComplete === false) {
              router.replace('/(auth)/(professional)/verify-info');
            } else {
              router.replace('/(professional)/(tabs)/dashboard');
            }
          } else {
            // Client - check onboarding
            if (!hasCompletedOnboarding) {
              router.replace('/(auth)/(client)/onboarding');
            } else {
              router.replace('/(client)/(tabs)/home');
            }
          }
        }
      }
    } else {
      // User is not authenticated
      // Block only routes that require user interaction (TaskRabbit clone approach)
      const isOnProfile = segmentStrings.includes('profile');
      const isOnBookings = segmentStrings.includes('bookings') || segmentStrings.includes('my-tasks');
      const isOnMessages = segmentStrings.includes('messages') || segmentStrings.includes('chat');
      const isOnBookingFlow = segmentStrings.includes('book') || segmentStrings.includes('confirm-booking');
      const isOnAccount = segmentStrings.includes('account') || segmentStrings.includes('settings');

      const isProtectedRoute = isOnProfile || isOnBookings || isOnMessages || isOnBookingFlow || isOnAccount;

      // Only redirect if trying to access protected routes that require authentication
      const tryingToAccessProtectedRoute = (inTabsGroup || inClientGroup || inProfessionalGroup) && !inAuthGroup && isProtectedRoute;

      if (tryingToAccessProtectedRoute) {
        router.replace('/(auth)/(client)');
      }
    }
  }, [isAuthenticated, isEmailVerified, hasCompletedOnboarding, professionalOnboardingComplete, isIdentityVerified, userRole, user, isLoading, isCheckingOnboarding, segments, router]);

  const stillLoading = !hasTimedOut && (isLoading || (isAuthenticated && userRole === 'handy' && isCheckingOnboarding) || (isAuthenticated && isIdentityVerified === null));
  if (stillLoading) {
    return <Loader text="Checking your account..." />;
  }

  return <>{children}</>;
}
