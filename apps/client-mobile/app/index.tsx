import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Loader } from "@/components/ui/loader";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@shared/supabase';

const ONBOARDING_KEY = '@hasSeenOnboarding';

/**
 * Index Route - Entry Point
 * 
 * Checks if user has seen onboarding before:
 * - First time: Show welcome screens
 * - Returning: Wait for auth check, then let AuthWrapper handle routing
 * 
 * Authenticated users are handled by AuthWrapper which will
 * route them to the appropriate home screen based on their role.
 */
export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth first
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Wait for auth to finish loading before checking onboarding
    if (isLoading) return;

    checkOnboardingStatus();
  }, [isLoading]);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
      
      if (hasSeenOnboarding === 'true') {
        // Returning user - let AuthWrapper handle routing based on auth state
        // If authenticated, AuthWrapper will route to appropriate screen
        // If not authenticated, redirect to login
        if (isAuthenticated) {
          // AuthWrapper will handle the redirect based on role and onboarding
          return;
        } else {
          // Not authenticated - redirect to login
          router.replace('/(auth)/role-selection');
        }
      } else {
        // First time user - show welcome flow
        router.replace('/(auth)/role-selection');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // On error, show onboarding to be safe
      router.replace('/(auth)/role-selection');
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking || isLoading) {
    return <Loader />;
  }

  return <Loader />;
}
