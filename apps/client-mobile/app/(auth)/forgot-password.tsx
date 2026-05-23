import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import AuthLogo from '@/components/auth/AuthLogo';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@shared/schemas/auth';
import { sendPasswordResetOTP } from '@shared/supabase/auth';
import { useToast } from '@/components/ui/toast';
import { goBackOrReplace } from '@/lib/navigation';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

const DEFAULT_CONTENT = {
  'header.title': 'Reset Password',
  'body.description': "Enter your email address and we'll send you a verification code to reset your password.",
  'fields.email_placeholder': 'Email',
  'actions.submit': 'Send verification code',
  'actions.submitting': 'Sending...',
  'links.remember_prefix': 'Remember your password?',
  'links.remember_cta': 'Sign in',
  'feedback.success_title': 'Code sent!',
  'feedback.success_body': 'Check your email for the verification code',
  'feedback.error_title': 'Failed to send code',
  'feedback.error_body': 'Please try again',
} as const;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const content = useAppContent('auth_forgot_password', DEFAULT_CONTENT);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await sendPasswordResetOTP(data.email);
      toast.success(
        getAppContentValue(content, 'feedback.success_title', DEFAULT_CONTENT['feedback.success_title']),
        getAppContentValue(content, 'feedback.success_body', DEFAULT_CONTENT['feedback.success_body'])
      );

      // Navigate to verify-otp screen with reset type
      router.push({
        pathname: '/(auth)/verify-otp',
        params: {
          email: data.email,
          type: 'reset',
        },
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(
        getAppContentValue(content, 'feedback.error_title', DEFAULT_CONTENT['feedback.error_title']),
        error instanceof Error
          ? error.message
          : getAppContentValue(content, 'feedback.error_body', DEFAULT_CONTENT['feedback.error_body'])
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-col flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
              <Pressable onPress={() => goBackOrReplace(router, '/(auth)/welcome')}>
                <ChevronLeft size={24} color="#333A31" />
              </Pressable>
              <Text className="text-lg font-worksans-medium" style={{ color: '#333A31' }}>
                {getAppContentValue(content, 'header.title', DEFAULT_CONTENT['header.title'])}
              </Text>
              <View className="w-6" />
            </View>

            {/* Logo */}
            <View className="items-center my-12">
              <AuthLogo size="auth" variant="green" />
            </View>

            {/* Description */}
            <View className="px-5 mb-6">
              <Text className="text-base font-worksans text-typography-600 text-center leading-6">
                {getAppContentValue(content, 'body.description', DEFAULT_CONTENT['body.description'])}
              </Text>
            </View>

            {/* Form */}
            <View className="px-5">
              <View className="mb-3">
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <Input
                        variant="outline"
                        className="relative border-0 border-b border-gray-300 rounded-none px-0 h-10"
                      >
                        {!value ? (
                          <Text
                            pointerEvents="none"
                            className="absolute left-0 text-[15px] font-worksans"
                            style={{ color: '#9CA3AF' }}
                          >
                            {getAppContentValue(content, 'fields.email_placeholder', DEFAULT_CONTENT['fields.email_placeholder'])}
                          </Text>
                        ) : null}
                        <InputField
                          className="font-worksans text-[15px]"
                          style={{ color: '#30352D' }}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder=""
                          placeholderTextColor="#9CA3AF"
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </Input>
                      {errors.email && (
                        <Text className="text-xs text-red-600 mt-1 font-worksans">
                          {errors.email.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>

              <Button
                className="rounded-full shadow-sm my-6"
                style={{
                  backgroundColor: isValid ? '#C1856A' : '#E5E7EB',
                }}
                onPress={handleSubmit(onSubmit)}
                isDisabled={!isValid || isLoading}
              >
                <ButtonText
                  className="text-[18px] font-worksans-bold"
                  style={{ color: isValid ? 'white' : '#B7B7B7' }}
                >
                  {isLoading
                    ? getAppContentValue(content, 'actions.submitting', DEFAULT_CONTENT['actions.submitting'])
                    : getAppContentValue(content, 'actions.submit', DEFAULT_CONTENT['actions.submit'])}
                </ButtonText>
              </Button>

              <Pressable onPress={() => goBackOrReplace(router, '/(auth)/(client)/sign-in')} className="mt-4">
                <Text className="text-center text-sm font-worksans-medium" style={{ color: '#30352D' }}>
                  {getAppContentValue(content, 'links.remember_prefix', DEFAULT_CONTENT['links.remember_prefix'])}{' '}
                  <Text style={{ color: '#C1856A' }}>
                    {getAppContentValue(content, 'links.remember_cta', DEFAULT_CONTENT['links.remember_cta'])}
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
