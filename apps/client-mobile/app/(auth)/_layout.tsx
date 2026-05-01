import { Redirect, Stack } from 'expo-router';
import { Loader } from '@/components/ui/loader';
import { useAuthStore } from '@shared/store';

export default function AuthLayout() {
  const { isAuthenticated, isLoading, isRoleResolved, isEmailVerified, user, userRole } =
    useAuthStore();

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

  if (isAuthenticated && userRole === 'handy') {
    return <Redirect href="/(professional)/(tabs)/dashboard" />;
  }

  if (isAuthenticated && userRole === 'customer') {
    return <Redirect href="/(client)/(tabs)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="(client)" />
      <Stack.Screen name="(professional)" />
    </Stack>
  );
}
