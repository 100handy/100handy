import { useEffect, useState, useCallback } from 'react';
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

const POLL_INTERVAL_MS = 300;
const POLL_TIMEOUT_MS = 8000;

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const type = params.type as string;
  const [error, setError] = useState<string | null>(null);

  const processCallback = useCallback(async () => {
    try {
      // Poll for a valid session instead of using a fixed delay
      const start = Date.now();
      let session = null;

      while (Date.now() - start < POLL_TIMEOUT_MS) {
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw new Error(sessionError.message);
        }

        if (data.session) {
          session = data.session;
          break;
        }

        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
      }

      if (!session) {
        throw new Error('Session not available after authentication. Please try again.');
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
  }, [type, router]);

  useEffect(() => {
    processCallback();
  }, [processCallback]);

  const handleRetry = () => {
    setError(null);
    processCallback();
  };

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg font-medium text-brand-dark mb-2 text-center">
          Something went wrong
        </Text>
        <Text className="text-sm text-gray-500 text-center mb-6">
          {error}
        </Text>
        <Pressable
          onPress={handleRetry}
          className="bg-brand-terracotta px-8 py-3 rounded-full mb-3"
        >
          <Text className="text-white font-medium">Try Again</Text>
        </Pressable>
        <Pressable
          onPress={() => router.replace('/(auth)/(client)')}
          className="px-8 py-3"
        >
          <Text className="text-brand-terracotta font-medium">Go to Sign In</Text>
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
