import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { supabase, enable2FA } from '@shared/supabase';
import { Alert, TextInput, ActivityIndicator } from 'react-native';

export default function Verify2FAOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const otpArray = value.slice(0, 6).split('');
      const newOtp = [...otp];
      otpArray.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      // Focus last filled input
      const lastIndex = Math.min(index + otpArray.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Verify OTP
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: params.email,
        token: otpCode,
        type: 'email',
      });

      if (verifyError) {
        throw verifyError;
      }

      // Enable 2FA for the user
      const enabled = await enable2FA();

      if (!enabled) {
        throw new Error('Failed to enable 2FA. Please try again.');
      }

      // Show success and navigate back
      Alert.alert(
        'Success',
        'Two-factor authentication has been enabled successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError(err instanceof Error ? err.message : 'Invalid verification code');
      Alert.alert(
        'Verification Failed',
        'The code you entered is incorrect. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: params.email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (otpError) {
        throw otpError;
      }

      Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
    } catch (err) {
      console.error('Error resending OTP:', err);
      Alert.alert('Error', 'Failed to resend code. Please try again.');
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
          <Text className="flex-1 text-center text-lg font-semibold">Verify Code</Text>
          <Box className="w-8" />
        </HStack>

        {/* Content */}
        <VStack className="p-6 space-y-6 flex-1">
          <VStack space="md">
            <Text className="text-2xl font-bold text-gray-800">Enter verification code</Text>
            <Text className="text-base text-gray-600">
              We've sent a 6-digit code to {params.email}
            </Text>
          </VStack>

          {/* OTP Input */}
          <HStack className="justify-between mt-8">
            {otp.map((digit, index) => (
              <Input
                key={index}
                className="w-12 h-14 border-2 border-gray-300 rounded-lg text-center"
              >
                <InputField
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  className="text-center text-2xl font-bold text-gray-800"
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              </Input>
            ))}
          </HStack>

          {/* Error Message */}
          {error && (
            <Box className="bg-red-50 border border-red-200 rounded-lg p-4">
              <Text className="text-red-600 text-sm">{error}</Text>
            </Box>
          )}

          {/* Resend Code */}
          <Pressable onPress={handleResendCode} disabled={isLoading} className="mt-4">
            <Text className="text-[#C1856A] text-center text-base font-medium">
              Didn't receive a code? Resend
            </Text>
          </Pressable>

          <Box className="flex-1" />

          {/* Verify Button */}
          <Pressable
            className={`rounded-full py-4 items-center ${isLoading || otp.join('').length !== 6 ? 'bg-gray-300' : 'bg-[#C1856A]'}`}
            onPress={handleVerify}
            disabled={isLoading || otp.join('').length !== 6}
          >
            {isLoading ? (
              <HStack className="items-center gap-2">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white text-lg font-bold">Verifying...</Text>
              </HStack>
            ) : (
              <Text className="text-white text-lg font-bold">Verify & Enable 2FA</Text>
            )}
          </Pressable>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}
