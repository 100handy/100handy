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

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

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
      toast.success('Code sent!', 'Check your email for the verification code');

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
      toast.error('Failed to send code', error instanceof Error ? error.message : 'Please try again');
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
              <Pressable onPress={() => router.back()}>
                <ChevronLeft size={24} color="#333A31" />
              </Pressable>
              <Text className="text-lg font-worksans-medium" style={{ color: '#333A31' }}>
                Reset Password
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
                Enter your email address and we'll send you a verification code to reset your password.
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
                        className="border-0 border-b border-gray-300 rounded-none px-0 h-10"
                      >
                        <InputField
                          className="font-worksans text-[15px]"
                          style={{ color: '#30352D' }}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Email"
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
                  {isLoading ? 'Sending...' : 'Send verification code'}
                </ButtonText>
              </Button>

              <Pressable onPress={() => router.back()} className="mt-4">
                <Text className="text-center text-sm font-worksans-medium" style={{ color: '#30352D' }}>
                  Remember your password?{' '}
                  <Text style={{ color: '#C1856A' }}>Sign in</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
