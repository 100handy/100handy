import React, { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { Box } from '@/components/ui/box';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { router } from 'expo-router';
import { Lock } from 'lucide-react-native';

interface SignInFormProps {
  onSubmit: (data: { email: string, password: string }) => void;
  isLoading: boolean;
  userRole: 'professional' | 'client';
}

export default function SignInForm({
  onSubmit,
  isLoading,
  userRole,
}: SignInFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (field: string, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = useMemo(() => {
    return formData.email.trim() !== '' && formData.password.trim() !== '';
  }, [formData]);

  const handleSignIn = async (): Promise<void> => {
    if (!isFormValid) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <Box className="px-5">
      {/* Email */}
      <Box className="mb-3">
        <Input
          variant="outline"
          className="border-0 border-b border-gray-300 rounded-none px-0 h-10"
        >
          <InputField
            className="font-worksans text-[15px]"
            style={{ color: '#30352D' }}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Input>
      </Box>

      {/* Password */}
      <Box className="mb-3">
        <Input
          variant="outline"
          className="border-0 border-b border-gray-300 rounded-none px-0 h-10 flex-row items-center"
        >
          <InputField
            className="font-worksans text-[15px] flex-1"
            style={{ color: '#30352D' }}
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
          />
          <Lock size={18} color="#30352D" />
        </Input>
      </Box>
      
      {/* Login Button */}
      <Button 
        className="rounded-full shadow-sm my-6"
        style={{ 
          backgroundColor: isFormValid ? '#C1856A' : '#E5E7EB',
        }}
        onPress={handleSignIn}
        isDisabled={!isFormValid || isLoading}
      >
        <ButtonText 
          className="text-[18px] font-worksans-bold"
          style={{ color: isFormValid ? 'white' : '#B7B7B7' }}
        >
          Log in
        </ButtonText>
      </Button>

      {/* Forgot Password */}
      <Pressable className="mb-6">
        <Text className="text-center text-[12px] font-worksans-medium" style={{ color: '#30352D' }}>
          Forgot your password?{' '}
          <Text style={{ color: '#C1856A' }}>Reset it</Text>
        </Text>
      </Pressable>
    </Box>
  );
}
