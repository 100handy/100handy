import { Stack } from 'expo-router';

export default function ProfessionalAuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="verify-info" />
      <Stack.Screen name="verify-document-upload" />
      <Stack.Screen name="verify-email-otp" />
    </Stack>
  );
}
