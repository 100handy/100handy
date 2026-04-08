import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Mail } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { resendEmailOTP } from '@shared/supabase/auth';
import { useToast } from '@/components/ui/toast';

export default function VerifyEmail() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [isResending, setIsResending] = useState(false);
  const toast = useToast();

  const handleResendEmail = async () => {
    if (!email) return;

    try {
      setIsResending(true);
      await resendEmailOTP(email);

      toast.success('Email sent', 'Please check your inbox');
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Failed to resend email', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignIn = () => {
    router.replace('/(auth)/(client)/sign-in');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-col flex-1 justify-center items-center px-6">
        {/* Icon */}
        <View className="w-20 h-20 bg-sage-green rounded-full items-center justify-center mb-8">
          <Mail size={40} color="white" />
        </View>

        {/* Title */}
        <Text className="text-2xl font-worksans-bold text-center mb-4" style={{ color: '#30352D' }}>
          Check your email
        </Text>

        {/* Description */}
        <Text className="text-base font-worksans text-center text-typography-600 mb-2 leading-6">
          We&apos;ve sent a verification link to
        </Text>

        <Text className="text-base font-worksans-semibold text-center mb-8" style={{ color: '#30352D' }}>
          {email || 'your email'}
        </Text>

        <Text className="text-sm font-worksans text-center text-typography-500 mb-8 px-4 leading-5">
          Click the link in the email to verify your account and complete your registration.
        </Text>

        {/* Resend Button */}
        <Button
          className="w-full max-w-sm rounded-full mb-4 flex-row items-center justify-center gap-2"
          style={{ backgroundColor: '#A3B899' }}
          onPress={handleResendEmail}
          isDisabled={isResending}
        >
          {isResending && <ButtonSpinner color="white" />}
          <ButtonText className="text-white text-base font-worksans-bold">
            {isResending ? 'Sending...' : 'Resend email'}
          </ButtonText>
        </Button>

        {/* Back to Sign In */}
        <Pressable onPress={handleBackToSignIn} className="mt-4">
          <Text className="text-sm font-worksans-medium" style={{ color: '#C1856A' }}>
            Back to sign in
          </Text>
        </Pressable>

        {/* Help Text */}
        <View className="mt-12 px-4">
          <Text className="text-xs font-worksans text-center text-typography-400 leading-5">
            Didn&apos;t receive the email? Check your spam folder or try resending.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
