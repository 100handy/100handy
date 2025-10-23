import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@shared/supabase';
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

  useEffect(() => {
    // Initialize auth state when component mounts
    initialize();

    // Cleanup subscription when component unmounts
    return () => {
      cleanup();
    };
  }, [initialize, cleanup]);

  useEffect(() => {
    if (isLoading) return; // Don't redirect while loading

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
      if (!isEmailVerified && !isOnVerifyEmail) {
        // Email not verified - send to verification screen
        router.replace({
          pathname: '/(auth)/verify-email',
          params: { email: user.email || '' },
        });
        return;
      }

      // Email is verified - check onboarding status
      if (isEmailVerified) {
        const isClient = userRole === 'customer';
        const isProfessional = userRole === 'handy';

        // If on auth screens or index, redirect to appropriate home
        if (inAuthGroup || isOnIndex) {
          if (isProfessional) {
            // Check if they completed onboarding/verification
            if (!hasCompletedOnboarding) {
              router.replace('/(auth)/(professional)/verify-getting-started');
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
      // Only redirect if trying to access protected routes (not auth screens)
      const tryingToAccessProtectedRoute = (inTabsGroup || inClientGroup || inProfessionalGroup) && !inAuthGroup;
      
      if (tryingToAccessProtectedRoute) {
        router.replace('/(auth)/role-selection');
      }
    }
  }, [isAuthenticated, isEmailVerified, hasCompletedOnboarding, userRole, user, isLoading, segments, router]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}