import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase, enable2FA } from '@shared/supabase';
import { Alert, TextInput, ActivityIndicator, View, Text, Pressable } from 'react-native';

export default function Verify2FAOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    const otpCode = otp.join('');
    if (otpCode.length === 6 && !isLoading) {
      handleVerify();
    }
  }, [otp]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    // Clear error when user starts typing
    if (error) setError(null);

    if (value.length > 1) {
      // Handle paste - extract only digits
      const digits = value.replace(/[^0-9]/g, '').slice(0, 6);
      const otpArray = digits.split('');
      const newOtp = [...otp];

      otpArray.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);

      // Focus last filled input or next empty one
      const nextEmptyIndex = newOtp.findIndex((digit, i) => i >= index && !digit);
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(index + otpArray.length, 5);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    // Handle single digit input
    const digit = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
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
    if (resendTimer > 0) return; // Prevent resend if timer is active

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

      // Reset OTP and timer
      setOtp(['', '', '', '', '', '']);
      setResendTimer(60);
      inputRefs.current[0]?.focus();

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
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center p-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="p-2">
            <ChevronLeft size={28} color="#000000" />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold">Verify Code</Text>
          <View className="w-8" />
        </View>

        {/* Content */}
        <View className="flex-col p-6 space-y-6 flex-1">
          <View className="flex-col gap-2">
            <Text className="text-2xl font-bold text-gray-800">Enter verification code</Text>
            <Text className="text-base text-gray-600">
              We've sent a 6-digit code to {params.email}
            </Text>
          </View>

          {/* OTP Input */}
          <View className="flex-row justify-between mt-8 px-2">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                className="text-center text-2xl font-bold"
                style={{
                  width: 50,
                  height: 60,
                  borderWidth: 2,
                  borderColor: digit ? '#C1856A' : error ? '#EF4444' : '#E5E5E5',
                  borderRadius: 12,
                  backgroundColor: digit ? '#FFF5F0' : '#FFFFFF',
                  color: '#30352D',
                  fontSize: 28,
                  fontWeight: '700',
                }}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                editable={!isLoading}
              />
            ))}
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-4">
              <Text className="text-red-600 text-sm">{error}</Text>
            </View>
          )}

          {/* Resend Code */}
          <View className="mt-6">
            {resendTimer > 0 ? (
              <Text className="text-gray-400 text-center text-base">
                Resend code in {resendTimer}s
              </Text>
            ) : (
              <Pressable onPress={handleResendCode} disabled={isLoading}>
                <Text className="text-[#C1856A] text-center text-base font-semibold">
                  Didn't receive a code? Tap to resend
                </Text>
              </Pressable>
            )}
          </View>

          <View className="flex-1" />

          {/* Verifying Status or Manual Verify Button */}
          {isLoading ? (
            <View className="bg-[#C1856A]/10 rounded-xl py-4 items-center">
              <View className="flex-row items-center gap-3">
                <ActivityIndicator size="small" color="#C1856A" />
                <Text className="text-[#C1856A] text-base font-semibold">
                  Verifying your code...
                </Text>
              </View>
            </View>
          ) : otp.join('').length === 6 ? (
            <View className="bg-green-50 rounded-xl py-3 items-center">
              <Text className="text-green-600 text-sm font-medium">
                ✓ Code complete - verifying automatically
              </Text>
            </View>
          ) : (
            <View className="items-center">
              <Text className="text-gray-400 text-sm">
                Enter all 6 digits to verify automatically
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
