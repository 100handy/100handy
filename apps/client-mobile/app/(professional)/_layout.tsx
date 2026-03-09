import { useEffect, useState } from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@shared/supabase';
import { getHandyProfile } from '@shared/supabase/profile';

export default function ProfessionalLayout() {
  const { isAuthenticated, isLoading, isRoleResolved, isEmailVerified, user, userRole } = useAuthStore();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkProfessionalOnboarding = async () => {
      if (!isAuthenticated || userRole !== 'handy' || !isEmailVerified) {
        if (isMounted) {
          setIsCheckingOnboarding(false);
          setIsOnboardingComplete(null);
        }
        return;
      }

      setIsCheckingOnboarding(true);

      try {
        const handyProfile = await getHandyProfile();
        if (isMounted) {
          setIsOnboardingComplete(!!handyProfile?.onboarding_completed);
        }
      } catch (error) {
        console.error('Error checking professional onboarding in layout:', error);
        if (isMounted) {
          setIsOnboardingComplete(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingOnboarding(false);
        }
      }
    };

    checkProfessionalOnboarding();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isEmailVerified, userRole]);

  if (
    isLoading ||
    (isAuthenticated && !isRoleResolved) ||
    (isAuthenticated && userRole === 'handy' && isCheckingOnboarding)
  ) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/role-selection" />;
  }

  if (!isEmailVerified) {
    return (
      <Redirect
        href={{
          pathname: '/(auth)/verify-email',
          params: { email: user?.email || '' },
        }}
      />
    );
  }

  if (userRole === 'customer') {
    return <Redirect href="/(client)/(tabs)/home" />;
  }

  if (userRole !== 'handy') {
    return <Redirect href="/(auth)/role-selection" />;
  }

  if (isOnboardingComplete === false) {
    return <Redirect href="/(auth)/(professional)/verify-info" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="job-details" />
    </Stack>
  );
}
