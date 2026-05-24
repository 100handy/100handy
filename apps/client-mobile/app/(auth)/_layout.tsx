import { Redirect, Stack, useSegments } from 'expo-router';
import { Loader } from '@/components/ui/loader';
import { useAuthStore } from '@shared/store';

export default function AuthLayout() {
  const { isAuthenticated, isLoading, isRoleResolved, isEmailVerified, user, userRole, accountStatus } =
    useAuthStore();
  const segments = useSegments().map(String);
  const professionalAuthSegmentIndex = segments.indexOf('(professional)');
  const professionalAuthLeaf =
    professionalAuthSegmentIndex >= 0 ? segments[professionalAuthSegmentIndex + 1] : null;
  const isAllowedProfessionalOnboardingRoute =
    professionalAuthLeaf === 'verify-info' || professionalAuthLeaf === 'verify-document-upload';

  if (isLoading || (isAuthenticated && !isRoleResolved)) {
    return <Loader />;
  }

  if (isAuthenticated && !isEmailVerified) {
    return (
      <Redirect
        href={{
          pathname: '/(auth)/verify-email',
          params: { email: user?.email || '' },
        }}
      />
    );
  }

  if (isAuthenticated && accountStatus && accountStatus !== 'active') {
    return <Redirect href="/(auth)/account-status" />;
  }

  if (isAuthenticated && userRole === 'handy' && !isAllowedProfessionalOnboardingRoute) {
    return <Redirect href="/(professional)/(tabs)/dashboard" />;
  }

  if (isAuthenticated && userRole === 'customer') {
    return <Redirect href="/(client)/(tabs)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="account-status" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="(client)" />
      <Stack.Screen name="(professional)" />
    </Stack>
  );
}
