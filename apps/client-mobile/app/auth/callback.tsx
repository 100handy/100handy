import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Loader } from '@/components/ui/loader';
import { View, Text, Pressable } from 'react-native';
import { supabase } from '@shared/supabase/supabaseClient';

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
  const [error, setError] = useState<string | null>(null);

  const processCallback = async () => {
    try {
      // Wait for Supabase to process the deep link and update the session
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Verify we have a valid session after processing
      const { error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(sessionError.message);
      }

      if (type === 'recovery') {
        router.replace('/(auth)/reset-password');
      } else {
        router.replace('/');
      }
    } catch (err) {
      console.error('Auth callback error:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete sign in');
    }
  };

  useEffect(() => {
    processCallback();
  }, []);

  const handleRetry = () => {
    setError(null);
    processCallback();
  };

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg font-medium text-[#333A31] mb-2 text-center">
          Something went wrong
        </Text>
        <Text className="text-sm text-[#666666] text-center mb-6">
          {error}
        </Text>
        <Pressable
          onPress={handleRetry}
          className="bg-[#D17852] px-8 py-3 rounded-full mb-3"
        >
          <Text className="text-white font-medium">Try Again</Text>
        </Pressable>
        <Pressable
          onPress={() => router.replace('/(auth)/(client)')}
          className="px-8 py-3"
        >
          <Text className="text-[#D17852] font-medium">Go to Sign In</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Loader />
      <Text className="mt-4 text-typography-500">
        {type === 'recovery' ? 'Verifying reset link...' : 'Completing sign in...'}
      </Text>
    </View>
  );
}
