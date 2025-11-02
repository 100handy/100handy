import React, { useState } from 'react';
import { Image } from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ChevronDown, X, Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';
import { type SignUpData, signUpWithPhone } from '@shared/supabase/auth';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpFormData } from '@shared/schemas/auth';

interface SignUpFormProps {
  onSubmit: (email: string, password: string, metadata: any) => void;
  isLoading: boolean;
  userRole: 'professional' | 'client';
}

export default function SignUpForm({
  onSubmit,
  isLoading,
  userRole,
}: SignUpFormProps) {
  const [selectedCountry, setSelectedCountry] = useState('+44');
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      postcode: '',
    },
  });

  const handleSignUp = (formData: SignUpFormData): void => {
    const fullPhone = `${selectedCountry}${formData.phone}`;
    const metadata = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      full_name: `${formData.firstName} ${formData.lastName}`,
      role: userRole === 'professional' ? 'handy' : 'customer',
      postcode: formData.postcode,
      phone: fullPhone,
    };

    onSubmit(formData.email, formData.password, metadata);
  };

  return (
    <Box className="px-5">
      {/* First Name and Last Name Row */}
      <HStack className="mb-3 gap-4">
        <Box className="flex-1">
          <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
            First Name
          </Text>
          <Controller
            control={control}
            name="firstName"
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
                    placeholder=""
                    placeholderTextColor="#9CA3AF"
                  />
                </Input>
                {errors.firstName && (
                  <Text className="text-xs text-red-600 mt-1 font-worksans">
                    {errors.firstName.message}
                  </Text>
                )}
              </Box>
            )}
          />
        </Box>
        <Box className="flex-1">
          <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
            Last Name
          </Text>
          <Controller
            control={control}
            name="lastName"
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
                    placeholder=""
                    placeholderTextColor="#9CA3AF"
                  />
                </Input>
                {errors.lastName && (
                  <Text className="text-xs text-red-600 mt-1 font-worksans">
                    {errors.lastName.message}
                  </Text>
                )}
              </Box>
            )}
          />
        </Box>
      </HStack>

      {/* Email */}
      <Box className="mb-3">
        <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
          Email
        </Text>
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
            </Box>
          )}
        />
      </Box>

      {/* Password */}
      <Box className="mb-3">
        <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
          Password
        </Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Box>
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
                  placeholder=""
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

      {/* Phone Number */}
      <Box className="mb-3">
        <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
          Phone Number
        </Text>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Box>
              <Input
                variant="outline"
                className="border-0 border-b border-gray-300 rounded-none px-0 h-10"
              >
                <HStack className="items-center flex-1">
                  <Image 
                    source={require('@/assets/images/uk-flag.png')}
                    className="w-7 h-4 mr-2"
                    resizeMode="contain"
                  />
                  <Pressable className="flex-row items-center mr-3">
                    <Text className="text-[15px] font-worksans-bold mr-1" style={{ color: '#30352D' }}>
                      {selectedCountry}
                    </Text>
                    <ChevronDown size={16} color="#30352D" />
                  </Pressable>
                  <InputField
                    className="flex-1 font-worksans text-[15px]"
                    style={{ color: '#30352D' }}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Phone Number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                  />
                  {value.length > 0 && (
                    <InputSlot className="pr-0">
                      <Pressable onPress={() => onChange('')} className="p-1">
                        <Box className="bg-gray-800 rounded-full w-5 h-5 items-center justify-center">
                          <X size={14} color="white" />
                        </Box>
                      </Pressable>
                    </InputSlot>
                  )}
                </HStack>
              </Input>
              {errors.phone && (
                <Text className="text-xs text-red-600 mt-1 font-worksans">
                  {errors.phone.message}
                </Text>
              )}
            </Box>
          )}
        />
      </Box>

      {/* Post code */}
      <Box className="mb-3">
        <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
          Post code
        </Text>
        <Controller
          control={control}
          name="postcode"
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
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                />
              </Input>
              {errors.postcode && (
                <Text className="text-xs text-red-600 mt-1 font-worksans">
                  {errors.postcode.message}
                </Text>
              )}
            </Box>
          )}
        />
      </Box>

      {/* Help Text */}
      <Text className="text-[12px] font-worksans-medium mb-5 leading-5" style={{ color: '#30352D' }}>
        Your phone and postcode help us match and{'\n'}
        connect you with the right Taskers.
      </Text>

      {/* Signup Button */}
      <Button 
        className="rounded-full shadow-sm mb-6"
        style={{ 
          backgroundColor: isValid ? '#C1856A' : '#E5E7EB',
        }}
        onPress={handleSubmit(handleSignUp)}
        isDisabled={!isValid || isLoading}
      >
        <ButtonText 
          className="text-[18px] font-worksans-bold"
          style={{ color: isValid ? 'white' : '#B7B7B7' }}
        >
          Signup
        </ButtonText>
      </Button>

      {/* Terms and Privacy */}
      <Box className="mb-6">
        <Text className="text-center text-[15px] font-worksans-medium leading-[22px]" style={{ color: '#30352D' }}>
          By singing up, you agree to the{' '}
          <Text style={{ color: '#C1856A' }}>Term of service</Text>
          {'\n'}
          and have reviewed the{' '}
          <Text style={{ color: '#C1856A' }}>Privacy Policy.</Text>
          {'\n'}
          Manage <Text style={{ color: '#C1856A' }}>privacy settings</Text>
        </Text>
      </Box>

      {/* Login Link */}
      <Pressable onPress={() => router.push(`/(auth)/(${userRole})/sign-in`)}>
        <Text className="text-center text-[15px] font-worksans-medium" style={{ color: '#30352D' }}>
          Already have an account?{' '}
          <Text style={{ color: '#C1856A' }}>Log in</Text>
        </Text>
      </Pressable>
    </Box>
  );
}
