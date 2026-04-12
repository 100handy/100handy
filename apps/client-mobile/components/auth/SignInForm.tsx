import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInFormData } from '@shared/schemas/auth';
import { useOAuthSignIn } from '@/lib/useOAuthSignIn';
import GoogleLogo from '@/assets/images/google-logo.svg';
import AppleLogo from '@/assets/images/apple-logo.svg';

interface SignInFormProps {
  onSubmit: (data: SignInFormData) => void;
  onOAuthSuccess: () => Promise<void>;
  isLoading: boolean;
  userRole: 'professional' | 'client';
}

export default function SignInForm({
  onSubmit,
  onOAuthSuccess,
  isLoading,
  userRole,
}: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useOAuthSignIn();

  const handleOAuth = async (provider: () => Promise<boolean>) => {
    setOauthLoading(true);
    try {
      const success = await provider();
      if (success) {
        await onOAuthSuccess();
      }
    } catch (error) {
      console.error('OAuth sign-in error:', error);
    } finally {
      setOauthLoading(false);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <View className="px-5">
      {/* Email */}
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

      {/* Password */}
      <View className="mb-3">
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Input
                variant="outline"
                className="border-0 border-b border-gray-300 rounded-none px-0 h-10 flex-row items-center"
              >
                <InputField
                  className="font-worksans text-[15px] flex-1"
                  style={{ color: '#30352D' }}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                />
                <InputSlot className="pr-0" onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={18} color="#30352D" />
                  ) : (
                    <Eye size={18} color="#30352D" />
                  )}
                </InputSlot>
              </Input>
              {errors.password && (
                <Text className="text-xs text-red-600 mt-1 font-worksans">
                  {errors.password.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Login Button */}
      <Button
        className="rounded-full shadow-sm my-6 flex-row items-center justify-center gap-2"
        style={{
          backgroundColor: isValid ? '#C1856A' : '#E5E7EB',
        }}
        onPress={handleSubmit(onSubmit)}
        isDisabled={!isValid || isLoading}
      >
        {isLoading && <ButtonSpinner color={isValid ? 'white' : '#B7B7B7'} />}
        <ButtonText
          className="text-[18px] font-worksans-bold"
          style={{ color: isValid ? 'white' : '#B7B7B7' }}
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </ButtonText>
      </Button>

      {/* Forgot Password */}
      <Pressable className="mb-6" onPress={() => router.push('/(auth)/forgot-password')}>
        <Text className="text-center text-[12px] font-worksans-medium" style={{ color: '#30352D' }}>
          Forgot your password?{' '}
          <Text style={{ color: '#C1856A' }}>Reset it</Text>
        </Text>
      </Pressable>

      {/* OAuth divider */}
      <View className="flex-row items-center mb-4">
        <View className="flex-1 h-px bg-gray-200" />
        <Text className="mx-3 text-xs font-worksans uppercase text-gray-400">Or continue with</Text>
        <View className="flex-1 h-px bg-gray-200" />
      </View>

      {/* OAuth buttons */}
      <View className="flex-row gap-3 mb-4">
        <Pressable
          onPress={() => handleOAuth(signInWithGoogle)}
          disabled={oauthLoading}
          className="flex-1 flex-row items-center justify-center border border-gray-200 rounded-full py-3 gap-2"
          style={{ opacity: oauthLoading ? 0.5 : 1 }}
        >
          <GoogleLogo width={18} height={18} />
          <Text className="text-[15px] font-worksans-medium" style={{ color: '#30352D' }}>Google</Text>
        </Pressable>
        <Pressable
          onPress={() => handleOAuth(signInWithApple)}
          disabled={oauthLoading}
          className="flex-1 flex-row items-center justify-center border border-gray-200 rounded-full py-3 gap-2"
          style={{ opacity: oauthLoading ? 0.5 : 1 }}
        >
          <AppleLogo width={18} height={18} />
          <Text className="text-[15px] font-worksans-medium" style={{ color: '#30352D' }}>Apple</Text>
        </Pressable>
      </View>
    </View>
  );
}
