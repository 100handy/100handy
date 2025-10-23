import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Loader } from '@/components/ui/loader';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

/**
 * Auth Callback Route
 * 
 * This route handles deep links from:
 * - Email verification links (handy://auth/callback?token_hash=...&type=signup)
 * - Password reset links (handy://auth/callback?token_hash=...&type=recovery)
 * - OAuth callbacks (handy://auth/callback?access_token=...&refresh_token=...)
 * 
 * Supabase automatically handles the session via the onAuthStateChange listener
 * in the auth store, so we just need to redirect the user appropriately.
 */
export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const type = params.type as string;

  useEffect(() => {
    // Give Supabase a moment to process the deep link and update the session
    const timeout = setTimeout(() => {
      // Route based on callback type
      if (type === 'recovery') {
        // Password reset - go to reset password screen
        router.replace('/(auth)/reset-password');
      } else {
        // Email verification or OAuth - let AuthWrapper handle routing
        // It will check email verification and onboarding status
        router.replace('/');
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [router, type]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Loader />
      <Text className="mt-4 text-typography-500">
        {type === 'recovery' ? 'Verifying reset link...' : 'Completing sign in...'}
      </Text>
    </View>
  );
}



