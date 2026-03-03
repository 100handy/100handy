import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@shared/supabase';

export default function ProfessionalLayout() {
  const { isAuthenticated, userRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/role-selection" />;
  }

  if (userRole !== 'handy') {
    return <Redirect href="/(client)/(tabs)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="job-details" />
    </Stack>
  );
}
