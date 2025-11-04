import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, TextInput, View } from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ChevronLeftIcon, SmartphoneIcon, Mail } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { verifyOTP, verifyEmailOTP, verifyPasswordResetOTP, resendOTP, resendEmailOTP, sendPasswordResetOTP } from '@shared/supabase/auth';
import { useToast } from '@/components/ui/toast';

const VerifyOtp = () => {
  const params = useLocalSearchParams();
  const email = params.email as string | undefined;
  const phone = params.phone as string | undefined;
  const type = params.type as 'signup' | 'reset' | undefined;
  const userRole = params.userRole as 'professional' | 'client' | undefined;
  const toast = useToast();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isVerifyEnabled, setIsVerifyEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Determine verification target and type
  const isEmailVerification = !!email;
  const isPasswordReset = type === 'reset';
  const verificationTarget = email || phone || '+44 7123 456 789';

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Check if all OTP fields are filled
  useEffect(() => {
    const allFilled = otp.every(digit => digit.trim() !== '');
    setIsVerifyEnabled(allFilled);
  }, [otp]);

  // Handle OTP input change
  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    const code = otp.join('');
    setIsLoading(true);

    try {
      if (isPasswordReset && email) {
        // Verify password reset OTP
        await verifyPasswordResetOTP(email, code);
        toast.success('Verified!', 'Code verified. Set your new password.');
        router.push('/(auth)/reset-password');
      } else if (isEmailVerification && email) {
        // Verify email OTP for signup
        await verifyEmailOTP(email, code);
        toast.success('Email verified!', 'Your account has been verified.');

        // Navigate based on user role
        if (userRole === 'professional') {
          router.push('/(auth)/(professional)/verify-info');
        } else {
          router.push('/(auth)/(client)/onboarding');
        }
      } else if (phone) {
        // Verify phone OTP
        await verifyOTP(phone, code);
        toast.success('Phone verified!', 'Your phone has been verified.');
        router.push('/(tabs)');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Verification failed', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      if (isPasswordReset && email) {
        // Resend password reset OTP
        await sendPasswordResetOTP(email);
        toast.success('Code resent!', 'Check your email for the new code.');
      } else if (isEmailVerification && email) {
        // Resend email OTP for signup
        await resendEmailOTP(email);
        toast.success('Code resent!', 'Check your email for the new code.');
      } else if (phone) {
        // Resend phone OTP
        await resendOTP(phone);
        toast.success('Code resent!', 'Check your phone for the new code.');
      }

      setTimeLeft(120);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend', error instanceof Error ? error.message : 'Please try again');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleChangeNumber = () => {
    console.log('Change number');
    // Navigate back to phone number input or sign-up page
    // router.push('/sign-up');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6E4D8]">
      <Box className="flex-1 px-6 py-4">
        {/* Header */}
        <HStack className="items-center justify-center mb-8 relative">
          <Pressable
            className="absolute left-0 bg-white p-2 rounded-full shadow-sm"
            onPress={handleGoBack}
          >
            <ChevronLeftIcon size={24} color="#333A31" />
          </Pressable>
          <Text className="text-xl font-bold text-[#333A31]">
            {isPasswordReset ? 'Reset Password' : isEmailVerification ? 'Verify Email' : 'Verify Phone'}
          </Text>
        </HStack>

        <View className="flex-1  items-center px-4">
          <View className="items-center w-full max-w-sm">
            {/* Icon */}
            <View className="bg-[#A3B899] w-20 h-20 rounded-full mb-8 justify-center items-center">
              {isEmailVerification ? (
                <Mail size={32} color="white" />
              ) : (
                <SmartphoneIcon size={32} color="white" />
              )}
            </View>

            {/* Main Text */}
            <Text className="text-2xl font-bold text-[#333A31] text-center mb-4">
              {isPasswordReset
                ? 'Enter verification code'
                : isEmailVerification
                ? 'Verify your email'
                : 'Verify your phone number'}
            </Text>

            <Text className="text-[#666] text-center mb-1 text-base">
              {isPasswordReset
                ? 'Enter the 6-digit code sent to your email to reset your password'
                : `We've sent a 6-digit verification code to ${isEmailVerification ? 'your email' : 'your phone'}`}
            </Text>

            <Text className="text-lg font-semibold text-[#333A31] mb-8">
              {verificationTarget}
            </Text>

            {/* OTP Input Fields */}
            <View className="flex-row justify-center items-center mb-6 gap-3">
              {otp.map((digit, index) => (
                <View
                  key={index}
                  className={`w-12 h-12 bg-white rounded-lg border-2 ${
                    digit ? 'border-[#D9896C]' : 'border-[#BFA28D]'
                  } justify-center items-center`}
                >
                  <TextInput
                     ref={(ref: TextInput | null) => {
                       inputRefs.current[index] = ref;
                     }}
                     value={digit}
                     onChangeText={(value: string) => handleOtpChange(value, index)}
                     onKeyPress={({ nativeEvent }: { nativeEvent: { key: string } }) => handleKeyPress(nativeEvent.key, index)}
                     maxLength={1}
                     keyboardType="numeric"
                     className="text-center text-xl font-semibold text-[#333A31] w-full h-full"
                     autoFocus={index === 0}
                     style={{ textAlign: 'center' }}
                   />
                </View>
              ))}
            </View>

            {/* Timer */}
            <Text className="text-[#666] mb-8 text-center">
              Code expires in{' '}
              <Text className="font-semibold text-[#D9896C]">
                {formatTime(timeLeft)}
              </Text>
            </Text>

            {/* Verify Button */}
            <Pressable
              onPress={handleVerify}
              disabled={!isVerifyEnabled || isLoading}
              className={`w-full py-4 rounded-xl ${
                isVerifyEnabled && !isLoading
                  ? 'bg-[#A3B899]'
                  : 'bg-[#A3B899] opacity-50'
              } mb-8`}
            >
              <Text className="text-white text-lg font-semibold text-center">
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Text>
            </Pressable>

            {/* Resend and Change Links */}
            <View className="items-center">
              <View className="items-center mb-4">
                <Text className="text-[#666] text-center mb-1">Didn't receive the code?</Text>
                <Pressable onPress={handleResendCode}>
                  <Text className="font-semibold text-[#D9896C] text-center">
                    Resend Code
                  </Text>
                </Pressable>
              </View>
              
              <Pressable onPress={handleChangeNumber}>
                <Text className="text-[#666] text-center">
                  Wrong number? <Text className="font-semibold text-[#D9896C]">Change it</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Box>
    </SafeAreaView>
  );
};

export default VerifyOtp;