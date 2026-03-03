import { Stack } from 'expo-router';

export default function ClientLayout() {
  // Allow both authenticated and unauthenticated (guest) access to client home
  // Guests can browse; auth is required for booking, profile, etc.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
