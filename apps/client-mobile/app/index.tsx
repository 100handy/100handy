import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Loader } from "@/components/ui/loader";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@hasSeenOnboarding';

/**
 * Index Route - Entry Point
 * 
 * Checks if user has seen onboarding before:
 * - First time: Show welcome screens
 * - Returning: Go to home (guests) or appropriate screen (authenticated)
 * 
 * Authenticated users are handled by AuthWrapper which will
 * route them to the appropriate home screen based on their role.
 */
export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
      
      if (hasSeenOnboarding === 'true') {
        // Returning user - skip to home (guests can browse)
        router.replace('/(client)/(tabs)/home');
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

  if (isChecking) {
    return <Loader />;
  }

  return <Loader />;
}
