import { Stack } from 'expo-router';

export default function ProfessionalAuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="verify-info" />
      <Stack.Screen name="verify-document-upload" />
      {/* Legacy verification screens - can be removed later */}
      <Stack.Screen name="verify-getting-started" />
      <Stack.Screen name="verify-country-selection" />
      <Stack.Screen name="verify-document-type" />
      <Stack.Screen name="verify-final-summary" />
      <Stack.Screen name="verify-otp" />
    </Stack>
  );
}
