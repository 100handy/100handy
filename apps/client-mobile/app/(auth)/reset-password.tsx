import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';
import AuthLogo from '@/components/auth/AuthLogo';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordFormData } from '@shared/schemas/auth';
import { signOut, updatePassword } from '@shared/supabase/auth';
import { useToast } from '@/components/ui/toast';

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      await updatePassword(data.password);
      await signOut();
      toast.success('Password updated', 'You can now sign in with your new password');
      
      // Return to the welcome entry once the toast is visible.
      setTimeout(() => {
        router.replace('/(auth)/welcome');
      }, 1500);
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('Failed to update password', error instanceof Error ? error.message : 'Please try again');
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
                New Password
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
                Enter your new password below.
              </Text>
            </View>

            {/* Form */}
            <View className="px-5">
              {/* New Password */}
              <View className="mb-4">
                <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                  New Password
                </Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <Input
                        variant="outline"
                        className="border-0 border-b border-gray-300 rounded-none px-0 h-10"
                      >
                        <InputField
                          className="font-worksans text-[15px] flex-1"
                          style={{ color: '#30352D' }}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Enter new password"
                          placeholderTextColor="#9CA3AF"
                          secureTextEntry={!showPassword}
                        />
                        <InputSlot className="pr-0" onPress={() => setShowPassword(!showPassword)}>
                          <InputIcon
                            as={showPassword ? EyeOff : Eye}
                            className="text-typography-400"
                            size="sm"
                          />
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

              {/* Confirm Password */}
              <View className="mb-3">
                <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                  Confirm Password
                </Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <Input
                        variant="outline"
                        className="border-0 border-b border-gray-300 rounded-none px-0 h-10"
                      >
                        <InputField
                          className="font-worksans text-[15px] flex-1"
                          style={{ color: '#30352D' }}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Confirm new password"
                          placeholderTextColor="#9CA3AF"
                          secureTextEntry={!showConfirmPassword}
                        />
                        <InputSlot className="pr-0" onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                          <InputIcon
                            as={showConfirmPassword ? EyeOff : Eye}
                            className="text-typography-400"
                            size="sm"
                          />
                        </InputSlot>
                      </Input>
                      {errors.confirmPassword && (
                        <Text className="text-xs text-red-600 mt-1 font-worksans">
                          {errors.confirmPassword.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>

              {/* Password Requirements */}
              <View className="mb-6 mt-4">
                <Text className="text-xs font-worksans text-typography-500 leading-5">
                  Password must contain:
                  {'\n'}• At least 8 characters
                  {'\n'}• One uppercase letter
                  {'\n'}• One lowercase letter
                  {'\n'}• One number
                </Text>
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
                  {isLoading ? 'Updating...' : 'Update password'}
                </ButtonText>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
