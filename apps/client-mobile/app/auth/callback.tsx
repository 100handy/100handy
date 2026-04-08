import { useEffect, useState, useCallback } from 'react';
import { useRouter, useLocalSearchParams, type Href } from 'expo-router';
import { Loader } from '@/components/ui/loader';
import { View, Text, Pressable } from 'react-native';
import { supabase } from '@shared/supabase/supabaseClient';
import { type EmailOtpType } from '@supabase/supabase-js';

/**
 * Auth Callback Route
 *
 * This route handles deep links from:
 * - Email verification links (handy://auth/callback?token_hash=...&type=signup)
 * - Password reset links (handy://auth/callback?token_hash=...&type=recovery)
 * - OAuth callbacks (handy://auth/callback?access_token=...&refresh_token=...)
 *
 * On mobile we complete the callback explicitly because session detection
 * from deep links is disabled in the native Supabase client.
 */

const EMAIL_OTP_TYPES = new Set<EmailOtpType>([
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
]);

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return value !== null && EMAIL_OTP_TYPES.has(value as EmailOtpType);
}

function getSafeNextRoute(next: string | null, type: string | null): Href {
  if (next && next.startsWith('/')) {
    return next as Href;
  }

  if (type === 'recovery') {
    return '/(auth)/reset-password';
  }

  return '/';
}

function getSafeErrorRoute(next: string | null, type: string | null): Href {
  if (type === 'recovery') {
    return '/(auth)/forgot-password';
  }

  if (next?.startsWith('/(professional)')) {
    return '/(auth)/(professional)';
  }

  return '/(auth)/welcome';
}

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const type = typeof params.type === 'string' ? params.type : null;
  const tokenHash = typeof params.token_hash === 'string' ? params.token_hash : null;
  const code = typeof params.code === 'string' ? params.code : null;
  const accessToken = typeof params.access_token === 'string' ? params.access_token : null;
  const refreshToken =
    typeof params.refresh_token === 'string' ? params.refresh_token : null;
  const next = typeof params.next === 'string' ? params.next : null;
  const errorDescription =
    typeof params.error_description === 'string' ? params.error_description : null;
  const [error, setError] = useState<string | null>(null);

  const processCallback = useCallback(async () => {
    try {
      if (errorDescription) {
        throw new Error(decodeURIComponent(errorDescription));
      }

      if (tokenHash && isEmailOtpType(type)) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          type,
          token_hash: tokenHash,
        });

        if (verifyError) {
          throw new Error(verifyError.message);
        }
      } else if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          throw new Error(exchangeError.message);
        }
      } else if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          throw new Error(sessionError.message);
        }
      } else {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw new Error(sessionError.message);
        }

        if (!session) {
          throw new Error('Authentication link is missing required callback parameters.');
        }
      }

      router.replace(getSafeNextRoute(next, type));
    } catch (err) {
      console.error('Auth callback error:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete sign in');
    }
  }, [accessToken, code, errorDescription, next, refreshToken, router, tokenHash, type]);

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
          onPress={() => router.replace(getSafeErrorRoute(next, type))}
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
