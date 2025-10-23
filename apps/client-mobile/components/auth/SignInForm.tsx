import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInFormData } from '@shared/schemas/auth';

interface SignInFormProps {
  onSubmit: (data: SignInFormData) => void;
  isLoading: boolean;
  userRole: 'professional' | 'client';
}

export default function SignInForm({
  onSubmit,
  isLoading,
  userRole,
}: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);

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
    <Box className="px-5">
      {/* Email */}
      <Box className="mb-3">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Box>
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
            </Box>
          )}
        />
      </Box>

      {/* Password */}
      <Box className="mb-3">
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Box>
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
            </Box>
          )}
        />
      </Box>
      
      {/* Login Button */}
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
          Log in
        </ButtonText>
      </Button>

      {/* Forgot Password */}
      <Pressable className="mb-6" onPress={() => router.push('/(auth)/forgot-password')}>
        <Text className="text-center text-[12px] font-worksans-medium" style={{ color: '#30352D' }}>
          Forgot your password?{' '}
          <Text style={{ color: '#C1856A' }}>Reset it</Text>
        </Text>
      </Pressable>
    </Box>
  );
}
