import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Mail } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { supabase } from '@shared/supabase';
import { useAuthStore } from '@shared/supabase';
import { Alert, ActivityIndicator } from 'react-native';

export default function AccountSecurityScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async () => {
    if (!user?.email) {
      setError('Email address not found');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Send OTP via Supabase Auth to email
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: user.email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (otpError) {
        throw otpError;
      }

      // Navigate to OTP verification screen
      router.push({
        pathname: '/(client)/profile/verify-2fa-otp',
        params: {
          email: user.email,
        },
      });
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
      Alert.alert(
        'Error',
        'Failed to send verification code. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1">
        {/* Header */}
        <HStack className="items-center p-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="p-2">
            <Icon as={ChevronLeft} size="xl" />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold">Account Security</Text>
          <Box className="w-8" />
        </HStack>

        {/* Content */}
        <VStack className="p-6 space-y-6 flex-1">
          <VStack space="md">
            <Text className="text-2xl font-bold text-gray-800">Two-factor authentication</Text>
            <Text className="text-base text-gray-600">
              To keep your account secure, set up two-factor authentication.
            </Text>
            <Text className="text-base text-gray-600">
              We'll send a verification code to your email address to activate two-factor
              authentication.
            </Text>
          </VStack>

          {/* Email Display */}
          <Box className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <HStack className="items-center gap-3">
              <Box className="w-12 h-12 bg-[#C1856A]/10 rounded-full items-center justify-center">
                <Icon as={Mail} size="xl" className="text-[#C1856A]" />
              </Box>
              <VStack className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">Verification code will be sent to</Text>
                <Text className="text-base font-semibold text-gray-800">{user?.email}</Text>
              </VStack>
            </HStack>
          </Box>

          {/* Error Message */}
          {error && (
            <Box className="bg-red-50 border border-red-200 rounded-lg p-4">
              <Text className="text-red-600 text-sm">{error}</Text>
            </Box>
          )}

          <Box className="flex-1" />

          {/* Send Code Button */}
          <Pressable
            className={`rounded-full py-4 items-center ${isLoading ? 'bg-gray-300' : 'bg-[#C1856A]'}`}
            onPress={handleSendCode}
            disabled={isLoading}
          >
            {isLoading ? (
              <HStack className="items-center gap-2">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white text-lg font-bold">Sending...</Text>
              </HStack>
            ) : (
              <Text className="text-white text-lg font-bold">Send Verification Code</Text>
            )}
          </Pressable>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}
