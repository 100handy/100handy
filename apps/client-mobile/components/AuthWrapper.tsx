import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@shared/supabase';
import { Loader } from '@/components/ui/loader';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Initialize auth state when component mounts
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isLoading) return; // Don't redirect while loading

    const segmentStrings = segments.map(String);
    const inAuthGroup = segmentStrings.includes('(auth)');
    const inTabsGroup = segmentStrings.includes('(tabs)');
    const isOnIndex = segmentStrings.length === 0;

    if (isAuthenticated) {
      if (inAuthGroup || isOnIndex) {
        router.replace('/(tabs)/home');
      }
    } else {
      // User is not authenticated
      if (inTabsGroup) {
        router.replace('/(auth)/sign-in');
      }
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}