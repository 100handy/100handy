import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { Mail } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@shared/supabase/supabaseClient';
import { useToast } from '@/components/ui/toast';

export default function VerifyEmail() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [isResending, setIsResending] = useState(false);
  const toast = useToast();

  const handleResendEmail = async () => {
    if (!email) return;

    try {
      setIsResending(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      toast.success('Email sent', 'Please check your inbox');
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Failed to resend email', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignIn = () => {
    router.replace('/(auth)/role-selection');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <VStack className="flex-1 justify-center items-center px-6">
        {/* Icon */}
        <Box className="w-20 h-20 bg-sage-green rounded-full items-center justify-center mb-8">
          <Mail size={40} color="white" />
        </Box>

        {/* Title */}
        <Text className="text-2xl font-worksans-bold text-center mb-4" style={{ color: '#30352D' }}>
          Check your email
        </Text>

        {/* Description */}
        <Text className="text-base font-worksans text-center text-typography-600 mb-2 leading-6">
          We've sent a verification link to
        </Text>
        
        <Text className="text-base font-worksans-semibold text-center mb-8" style={{ color: '#30352D' }}>
          {email || 'your email'}
        </Text>

        <Text className="text-sm font-worksans text-center text-typography-500 mb-8 px-4 leading-5">
          Click the link in the email to verify your account and complete your registration.
        </Text>

        {/* Resend Button */}
        <Button
          className="w-full max-w-sm rounded-full mb-4"
          style={{ backgroundColor: '#A3B899' }}
          onPress={handleResendEmail}
          isDisabled={isResending}
        >
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
        <Box className="mt-12 px-4">
          <Text className="text-xs font-worksans text-center text-typography-400 leading-5">
            Didn't receive the email? Check your spam folder or try resending.
          </Text>
        </Box>
      </VStack>
    </SafeAreaView>
  );
}

