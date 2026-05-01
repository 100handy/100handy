import { Redirect, Stack } from 'expo-router';
import { Loader } from '@/components/ui/loader';
import { useAuthStore } from '@shared/store';

export default function ClientLayout() {
  const { isAuthenticated, isLoading, isRoleResolved, userRole } = useAuthStore();

  if (isLoading || (isAuthenticated && !isRoleResolved)) {
    return <Loader />;
  }

  if (isAuthenticated && userRole === 'handy') {
    return <Redirect href="/(professional)/(tabs)/dashboard" />;
  }

  // Allow both authenticated and unauthenticated (guest) access to client home
  // Guests can browse; auth is required for booking, profile, etc.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
