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
        router.replace('/(auth)/role-selection');
      }
    }
  }, [isAuthenticated, isEmailVerified, hasCompletedOnboarding, userRole, user, isLoading, segments, router]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}