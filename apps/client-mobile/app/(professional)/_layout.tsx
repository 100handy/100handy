import { useEffect, useState } from 'react';
import { Stack, Redirect, useSegments, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useAuthStore } from '@shared/supabase';
import { getHandyProfile } from '@shared/supabase/profile';
import {
  canAccessProfessionalTab,
  type ProfessionalVerificationStatus,
} from '@/lib/professional-access';

export default function ProfessionalLayout() {
  const { isAuthenticated, isLoading, isRoleResolved, isEmailVerified, user, userRole } = useAuthStore();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<ProfessionalVerificationStatus>(null);
  const segments = useSegments();

  const loadProfessionalStatus = useCallback(async (isMounted: boolean) => {
    if (!isAuthenticated || userRole !== 'handy' || !isEmailVerified) {
      if (isMounted) {
        setIsCheckingOnboarding(false);
        setIsOnboardingComplete(null);
        setVerificationStatus(null);
      }
      return;
    }

    setIsCheckingOnboarding(true);

    try {
      const handyProfile = await getHandyProfile();
      if (isMounted) {
        setIsOnboardingComplete(!!handyProfile?.onboarding_completed);
        setVerificationStatus(
          (handyProfile?.verification_status as ProfessionalVerificationStatus | undefined) ?? null
        );
      }
    } catch (error) {
      console.error('Error checking professional onboarding in layout:', error);
      if (isMounted) {
        setIsOnboardingComplete(false);
        setVerificationStatus(null);
      }
    } finally {
      if (isMounted) {
        setIsCheckingOnboarding(false);
      }
    }
  }, [isAuthenticated, isEmailVerified, userRole]);

  useEffect(() => {
    let isMounted = true;

    loadProfessionalStatus(isMounted);

    return () => {
      isMounted = false;
    };
  }, [loadProfessionalStatus]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      loadProfessionalStatus(isMounted);

      return () => {
        isMounted = false;
      };
    }, [loadProfessionalStatus])
  );

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

  const segmentStrings = segments.map(String);
  const currentTab = segmentStrings.includes('(tabs)')
    ? segmentStrings[segmentStrings.indexOf('(tabs)') + 1]
    : null;

  if (
    typeof currentTab === 'string' &&
    !canAccessProfessionalTab(currentTab, verificationStatus)
  ) {
    return <Redirect href="/(professional)/(tabs)/dashboard" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="job-details" />
    </Stack>
  );
}
