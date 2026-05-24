import { useEffect, useRef, useState } from 'react'; import { Stack, Redirect, useSegments, useFocusEffect } from 'expo-router'; import { useCallback } from 'react'; import { useAuthStore } from '@shared/store';
import { getHandyProfile } from '@shared/supabase/profile';
import {
  canAccessProfessionalTab,
  type ProfessionalVerificationStatus,
} from '@/lib/professional-access';
import { Loader } from '@/components/ui/loader';

export default function ProfessionalLayout() {
  const { isAuthenticated, isLoading, isRoleResolved, isEmailVerified, user, userRole, accountStatus } = useAuthStore();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<ProfessionalVerificationStatus>(null);
  const segments = useSegments();
  const isMountedRef = useRef(true);
  const hasLoadedOnFocusRef = useRef(false);

  const loadProfessionalStatus = useCallback(async () => {
    if (!isAuthenticated || userRole !== 'handy' || !isEmailVerified) {
      if (isMountedRef.current) {
        setIsCheckingOnboarding(false);
        setIsOnboardingComplete(null);
        setVerificationStatus(null);
      }
      return;
    }

    setIsCheckingOnboarding(true);

    try {
      const handyProfile = await getHandyProfile();
      if (isMountedRef.current) {
        setIsOnboardingComplete(!!handyProfile?.onboarding_completed);
        setVerificationStatus(
          (handyProfile?.verification_status as ProfessionalVerificationStatus | undefined) ?? null
        );
      }
    } catch (error) {
      console.warn('Unable to load professional onboarding state in layout:', error);
      if (isMountedRef.current) {
        setIsOnboardingComplete(null);
        setVerificationStatus(null);
      }
    } finally {
      if (isMountedRef.current) {
        setIsCheckingOnboarding(false);
      }
    }
  }, [isAuthenticated, isEmailVerified, userRole]);

  useEffect(() => {
    isMountedRef.current = true;
    loadProfessionalStatus();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadProfessionalStatus]);

  useFocusEffect(
    useCallback(() => {
      if (!hasLoadedOnFocusRef.current) {
        hasLoadedOnFocusRef.current = true;
        return undefined;
      }

      isMountedRef.current = true;
      loadProfessionalStatus();

      return () => {
        isMountedRef.current = false;
      };
    }, [loadProfessionalStatus])
  );

  if (
    isLoading ||
    (isAuthenticated && !isRoleResolved) ||
    (isAuthenticated && userRole === 'handy' && isCheckingOnboarding)
  ) {
    return <Loader text="Preparing your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/(client)" />;
  }

  if (accountStatus && accountStatus !== 'active') {
    return <Redirect href="/(auth)/account-status" />;
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
    return <Redirect href="/(auth)/(client)" />;
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
      <Stack.Screen
        name="add-profile-photo"
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      />
    </Stack>
  );
}
