import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@shared/supabase';

export default function ClientLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="booking" />
    </Stack>
  );
}
