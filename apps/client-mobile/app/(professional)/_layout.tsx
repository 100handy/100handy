import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@shared/supabase';

export default function ProfessionalLayout() {
  const { isAuthenticated, userRole } = useAuthStore();

  if (!isAuthenticated || userRole !== 'professional') {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="job-details" />
    </Stack>
  );
}
