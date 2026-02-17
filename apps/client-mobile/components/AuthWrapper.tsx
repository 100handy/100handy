import React, { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@shared/supabase';
import { getHandyProfile } from '@shared/supabase/profile';
import { Loader } from '@/components/ui/loader';

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

  useEffect(() => {
    // Initialize auth state when component mounts
    initialize();

    // Cleanup subscription when component unmounts
    return () => {
      cleanup();
    };
  }, [initialize, cleanup]);

  // Check professional onboarding status from database
  useEffect(() => {
    const checkProfessionalOnboarding = async () => {
      if (isAuthenticated && userRole === 'handy' && !isLoading) {
        setIsCheckingOnboarding(true);
        try {
          const handyProfile = await getHandyProfile();
          setProfessionalOnboardingComplete(handyProfile?.onboarding_completed || false);
        } catch (error) {
          console.error('Error checking professional onboarding:', error);
          setProfessionalOnboardingComplete(false);
        } finally {
          setIsCheckingOnboarding(false);
        }
      } else if (userRole !== 'handy') {
        setProfessionalOnboardingComplete(null);
      }
    };

    checkProfessionalOnboarding();

  }, [isAuthenticated, userRole, isLoading]);

  // Check identity verification status (professionals only)
  useEffect(() => {
    let isMounted = true;

    const checkIdentityVerification = async () => {
      if (isAuthenticated && !isLoading) {
        if (userRole === 'handy') {
          // For professionals: check handy_profiles.verification_status
          try {
            const handyProfile = await getHandyProfile();
            if (isMounted) {
              const isVerified = handyProfile?.verification_status === 'verified';
              setIsIdentityVerified(isVerified);
            }
          } catch (error) {
            console.error('Error checking identity verification:', error);
            if (isMounted) {
              // Assume verified on error to avoid blocking legitimate users on transient failures
              setIsIdentityVerified(true);
            }
          }
        } else {
          // For customers: skip identity verification check (removed from client flow)
          if (isMounted) {
            setIsIdentityVerified(true);
          }
        }
      } else if (!isAuthenticated && isMounted) {
        setIsIdentityVerified(null);
      }
    };

    checkIdentityVerification();

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
      const isOnPostTask = segmentStrings.includes('post-task') || segmentStrings.includes('task-form');
      const isOnAccount = segmentStrings.includes('account') || segmentStrings.includes('settings');

      const isProtectedRoute = isOnProfile || isOnBookings || isOnMessages || isOnBookingFlow || isOnPostTask || isOnAccount;

      // Only redirect if trying to access protected routes that require authentication
      const tryingToAccessProtectedRoute = (inTabsGroup || inClientGroup || inProfessionalGroup) && !inAuthGroup && isProtectedRoute;

      if (tryingToAccessProtectedRoute) {
        router.replace('/(auth)/(client)');
      }
    }
  }, [isAuthenticated, isEmailVerified, hasCompletedOnboarding, professionalOnboardingComplete, isIdentityVerified, userRole, user, isLoading, isCheckingOnboarding, segments, router]);

  if (isLoading || (isAuthenticated && userRole === 'handy' && isCheckingOnboarding) || (isAuthenticated && isIdentityVerified === null)) {
    return <Loader />;
  }

  return <>{children}</>;
}