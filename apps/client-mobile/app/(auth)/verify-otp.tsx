import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Button, ButtonText } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { verifyOTP, resendOTP } from '@shared/supabase/auth';
import { useToast } from '@/components/ui/toast';

export default function VerifyOtp() {
  const params = useLocalSearchParams();
  const phone = params.phone as string;
  const metadata = params.metadata ? JSON.parse(params.metadata as string) : {};

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const toast = useToast();

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleCodeChange = (value: string, index: number): void => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number): void => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (): Promise<void> => {
    const otpCode = code.join('');

    if (otpCode.length !== 6) {
      toast.error('Invalid code', 'Please enter a 6-digit code');
      return;
    }

    try {
      setIsLoading(true);

      // Verify the OTP
      const result = await verifyOTP(phone, otpCode);

      if (result.user) {
        // OTP verified successfully - navigate based on role
        toast.success('Success', 'Phone number verified!');

        const role = metadata.role;
        if (role === 'handy') {
          // Professional - go to verification flow
          router.replace('/(auth)/(professional)/verify-info');
        } else {
          // Customer - go to client onboarding or home
          router.replace('/(client)/(tabs)/home');
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Verification failed', error instanceof Error ? error.message : 'Invalid code. Please try again');
      // Clear code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (): Promise<void> => {
    if (!canResend) return;

    try {
      setIsResending(true);
      await resendOTP(phone);
      toast.success('Code sent', 'A new verification code has been sent');
      setCanResend(false);
      setCountdown(60);
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Resend failed', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setIsResending(false);
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <VStack className="flex-1">
            {/* Header */}
            <HStack className="items-center justify-between px-5 pt-2 pb-6">
              <Pressable onPress={() => router.back()}>
                <ChevronLeft size={24} color="#333A31" />
              </Pressable>
              <Text className="text-[18px] font-worksans-medium" style={{ color: '#333A31' }}>
                Account Security
              </Text>
              <Box className="w-6" />
            </HStack>

            {/* Content */}
            <VStack className="px-5">
              {/* Title */}
              <Text className="text-[24px] font-worksans-bold mb-3" style={{ color: '#30352D' }}>
                Verify your{'\n'}authentication code
              </Text>

              {/* Description */}
              <Text className="text-[15px] font-worksans-medium mb-8 leading-[20px]" style={{ color: '#30352D' }}>
                A code has been sent to{'\n'}
                <Text className="font-worksans-bold">{phone}</Text>
              </Text>

              {/* OTP Input */}
              <HStack className="justify-between mb-8">
                {code.map((digit, index) => (
                  <Box key={index} className="flex-1 mx-1">
                    <TextInput
                      ref={(ref) => {
                        inputRefs.current[index] = ref;
                      }}
                      className="text-center text-[24px] font-worksans-bold border-b-2 pb-2"
                      style={{
                        color: '#30352D',
                        borderBottomColor: digit ? '#C1856A' : '#E5E5E5',
                      }}
                      value={digit}
                      onChangeText={(value) => handleCodeChange(value, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      autoFocus={index === 0}
                      selectTextOnFocus
                    />
                  </Box>
                ))}
              </HStack>

              {/* Resend Code */}
              <Pressable onPress={handleResend} disabled={!canResend || isResending}>
                <Text
                  className="text-[15px] font-worksans-bold mb-4"
                  style={{ color: canResend ? '#C1856A' : '#9CA3AF' }}
                >
                  {isResending ? 'Sending...' : canResend ? 'Resend code' : `Resend code in ${countdown}s`}
                </Text>
              </Pressable>

              {/* Support Text */}
              <Text className="text-[13px] font-worksans-medium mb-8 leading-[18px]" style={{ color: '#30352D' }}>
                Need your code sent to a new phone number?{' '}
                <Text style={{ color: '#C1856A' }}>Contact customer support</Text>
              </Text>

              {/* Verify Button */}
              <Button
                className="rounded-full shadow-sm"
                style={{
                  backgroundColor: isCodeComplete && !isLoading ? '#C1856A' : '#E5E7EB',
                }}
                onPress={handleVerify}
                isDisabled={!isCodeComplete || isLoading}
              >
                <ButtonText
                  className="text-[18px] font-worksans-bold"
                  style={{ color: isCodeComplete && !isLoading ? 'white' : '#B7B7B7' }}
                >
                  {isLoading ? 'Verifying...' : 'Verify'}
                </ButtonText>
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
}
