import React, { useState, useRef, useEffect } from 'react';
import { usePendingBookingStore, useLocationStore } from '@shared/store';
import { ScrollView, View, Text, Pressable } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { ChevronLeft } from 'lucide-react-native'; import { router, useLocalSearchParams } from 'expo-router'; import { verifyEmailOTP, resendEmailOTP } from '@shared/supabase/auth'; import { useToast } from '@/components/ui/toast'; import { OtpInput, OtpInputRef } from 'react-native-otp-entry'; import { useAuthStore } from '@shared/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHandyProfile } from '@shared/supabase/profile';
import { buildPendingBookingRoute, resolveAuthenticatedRoute } from '@/lib/auth-routing';
import { goBackOrReplace } from '@/lib/navigation';

export default function ProfessionalVerifyEmailOtp() {
  const params = useLocalSearchParams();
  const email = typeof params.email === 'string' ? params.email : '';

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const toast = useToast();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const pendingBookingStore = usePendingBookingStore();
  const { setLocation } = useLocationStore();

  const otpRef = useRef<OtpInputRef>(null);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async (otpCode: string): Promise<void> => {
    if (otpCode.length !== 6) {
      toast.error('Invalid code', 'Please enter a 6-digit code');
      return;
    }

    try {
      setIsLoading(true);

      // Verify the email OTP
      const result = await verifyEmailOTP(email, otpCode);

      if (result.user) {
        await checkAuth();
        const { isEmailVerified, userRole, accountStatus, hasCompletedOnboarding, user } = useAuthStore.getState();
        const route = await resolveAuthenticatedRoute({
          isEmailVerified,
          userRole,
          accountStatus,
          hasCompletedOnboarding,
          userEmail: user?.email,
          userId: user?.id,
          getLocalClientOnboardingCompleted: async (userId) =>
            (await AsyncStorage.getItem(`@clientOnboardingCompleted:${userId}`)) === 'true',
          getProfessionalOnboardingCompleted: async () => {
            const handyProfile = await getHandyProfile();
            return handyProfile?.onboarding_completed || false;
          },
          getPendingBookingRoute: () =>
            buildPendingBookingRoute({
              hasRestorablePendingBooking: pendingBookingStore.hasRestorablePendingBooking,
              getPendingBooking: pendingBookingStore.getPendingBooking,
              markPendingBookingRestored: pendingBookingStore.markPendingBookingRestored,
              setLocation,
            }),
        });

        toast.success('Success', 'Email verified!');
        router.replace(route as Parameters<typeof router.replace>[0]);
      }
    } catch (error) {
      console.error('Email OTP verification error:', error);
      toast.error('Verification failed', error instanceof Error ? error.message : 'Invalid code. Please try again');
      // Clear code on error
      otpRef.current?.clear();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (): Promise<void> => {
    if (!canResend) return;

    try {
      setIsResending(true);
      await resendEmailOTP(email);
      toast.success('Code sent', 'A new verification code has been sent');
      setCanResend(false);
      setCountdown(60);
    } catch (error) {
      console.error('Resend email OTP error:', error);
      toast.error('Resend failed', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-col flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-2 pb-6">
              <Pressable onPress={() => goBackOrReplace(router, '/(auth)/welcome')}>
                <ChevronLeft size={24} color="#333A31" />
              </Pressable>
              <Text className="text-[18px] font-worksans-medium" style={{ color: '#333A31' }}>
                Account Security
              </Text>
              <View className="w-6" />
            </View>

            {/* Content */}
            <View className="flex-col px-5">
              {/* Title */}
              <Text className="text-[24px] font-worksans-bold mb-3" style={{ color: '#30352D' }}>
                Verify your{'\n'}authentication code
              </Text>

              {/* Description */}
              <Text className="text-[15px] font-worksans-medium mb-8 leading-[20px]" style={{ color: '#30352D' }}>
                A code has been sent to{'\n'}
                <Text className="font-worksans-bold">{email}</Text>
              </Text>

              {/* OTP Input */}
              <View className="mb-8">
                <OtpInput
                  ref={otpRef}
                  numberOfDigits={6}
                  focusColor="#C1856A"
                  focusStickBlinkingDuration={500}
                  onFilled={(text) => handleVerify(text)}
                  disabled={isLoading}
                  textInputProps={{
                    accessibilityLabel: 'One-Time Password',
                  }}
                  theme={{
                    containerStyle: { width: '100%', justifyContent: 'space-between' },
                    pinCodeContainerStyle: {
                      width: 50,
                      height: 60,
                      borderWidth: 2,
                      borderColor: '#E5E5E5',
                      borderRadius: 12,
                      backgroundColor: '#FFFFFF',
                    },
                    pinCodeTextStyle: {
                      color: '#30352D',
                      fontSize: 28,
                      fontWeight: '700',
                    },
                    focusedPinCodeContainerStyle: {
                      borderColor: '#C1856A',
                      backgroundColor: '#FFF5F0',
                    },
                    filledPinCodeContainerStyle: {
                      borderColor: '#C1856A',
                      backgroundColor: '#FFF5F0',
                    },
                  }}
                />
              </View>

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
                Need your code sent to a new email address?{' '}
                <Text style={{ color: '#C1856A' }}>Contact customer support</Text>
              </Text>

              {/* Auto-verify hint */}
              <View className="items-center">
                <Text className="text-gray-400 text-sm font-worksans">
                  {isLoading ? 'Verifying your code...' : 'Enter all 6 digits to verify automatically'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
