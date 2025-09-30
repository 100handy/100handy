import React, { useState, useMemo } from 'react';
import { Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeft, ChevronDown, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { signUp, type SignUpData } from '@shared/supabase/auth';

export default function ProfessionalSignUp() {
  const [selectedCountry, setSelectedCountry] = useState('+44');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    postcode: '',
  });

  const handleInputChange = (field: string, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.postcode.trim() !== ''
    );
  }, [formData]);

  const handleSignUp = async (): Promise<void> => {
    if (!isFormValid) {
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Navigate to verify info screen
    router.push('/(auth)/(professional)/verify-info');
  };

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <VStack className="flex-1">
          {/* Header */}
          <HStack className="items-center justify-between px-5 pt-2 pb-4">
            <Pressable onPress={() => router.back()}>
              <ChevronLeft size={24} color="#333A31" />
            </Pressable>
            <Text className="text-lg font-worksans-medium" style={{ color: '#333A31' }}>
              Sign Up
            </Text>
            <Pressable>
              <Text className="text-sm font-worksans-medium" style={{ color: '#333A31' }}>
                Not now
              </Text>
            </Pressable>
          </HStack>

          {/* Logo */}
          <Box className="items-center mb-6">
            <Box className="bg-white rounded-[20px] shadow-sm overflow-hidden" style={{ width: 100, height: 100 }}>
              {/* 100 HANDY Text */}
              <VStack className="items-center pt-2 pb-0">
                <Text className="text-[20px] font-worksans-bold leading-[22px] tracking-wide" style={{ color: '#30352D' }}>
                  100
                </Text>
                <Text className="text-[20px] font-worksans-bold leading-[22px] tracking-wide" style={{ color: '#30352D' }}>
                  HANDY
                </Text>
              </VStack>
              
              {/* Task Button */}
              <Box className="items-center px-2 mt-0.5">
                <Box className="bg-clay-orange rounded-full px-4 py-1.5 shadow-sm" style={{ transform: [{ rotate: '-9deg' }] }}>
                  <Text className="text-white text-[16px] font-worksans-bold tracking-wide">
                    Task
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Form Container */}
          <Box className="px-5">
            {/* First Name and Last Name Row */}
            <HStack className="mb-3 gap-4">
              <Box className="flex-1">
                <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                  First Name
                </Text>
                <Input
                  variant="outline"
                  className="border-0 border-b border-gray-300 rounded-none px-0 h-10"
                >
                  <InputField
                    className="font-worksans text-[15px]"
                    style={{ color: '#30352D' }}
                    value={formData.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    placeholder=""
                    placeholderTextColor="#9CA3AF"
                  />
                </Input>
              </Box>
              <Box className="flex-1">
                <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                  Last Name
                </Text>
                <Input
                  variant="outline"
                  className="border-0 border-b border-gray-300 rounded-none px-0 h-10"
                >
                  <InputField
                    className="font-worksans text-[15px]"
                    style={{ color: '#30352D' }}
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    placeholder=""
                    placeholderTextColor="#9CA3AF"
                  />
                </Input>
              </Box>
            </HStack>

            {/* Email */}
            <Box className="mb-3">
              <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                Email
              </Text>
              <Input
                variant="outline"
                className="border-0 border-b border-gray-300 rounded-none px-0 h-10"
              >
                <InputField
                  className="font-worksans text-[15px]"
                  style={{ color: '#30352D' }}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Input>
            </Box>

            {/* Password */}
            <Box className="mb-3">
              <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                Password
              </Text>
              <Input
                variant="outline"
                className="border-0 border-b border-gray-300 rounded-none px-0 h-10"
              >
                <InputField
                  className="font-worksans text-[15px]"
                  style={{ color: '#30352D' }}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
              </Input>
            </Box>

            {/* Phone Number */}
            <Box className="mb-3">
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
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    placeholder="Phone Number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                  />
                  {formData.phone.length > 0 && (
                    <InputSlot className="pr-0">
                      <Pressable onPress={() => handleInputChange('phone', '')} className="p-1">
                        <Box className="bg-gray-800 rounded-full w-5 h-5 items-center justify-center">
                          <X size={14} color="white" />
                        </Box>
                      </Pressable>
                    </InputSlot>
                  )}
                </HStack>
              </Input>
            </Box>

            {/* Post code */}
            <Box className="mb-3">
              <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                Post code
              </Text>
              <Input
                variant="outline"
                className="border-0 border-b border-gray-300 rounded-none px-0 h-10"
              >
                <InputField
                  className="font-worksans text-[15px]"
                  style={{ color: '#30352D' }}
                  value={formData.postcode}
                  onChangeText={(value) => handleInputChange('postcode', value)}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                />
              </Input>
            </Box>

            {/* Help Text */}
            <Text className="text-[12px] font-worksans-medium mb-5 leading-5" style={{ color: '#30352D' }}>
              Your phone and postcode help us match and{'\n'}
              Connect you with right Takers.
            </Text>

            {/* Signup Button */}
            <Button 
              className="rounded-full shadow-sm mb-6"
              style={{ 
                backgroundColor: isFormValid ? '#C1856A' : '#E5E7EB',
              }}
              onPress={handleSignUp}
              isDisabled={!isFormValid || isLoading}
            >
              <ButtonText 
                className="text-[18px] font-worksans-bold"
                style={{ color: isFormValid ? 'white' : '#B7B7B7' }}
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
            <Pressable onPress={() => router.push('/(auth)/(professional)/sign-in')}>
              <Text className="text-center text-[15px] font-worksans-medium" style={{ color: '#30352D' }}>
                Already have an account?{' '}
                <Text style={{ color: '#C1856A' }}>Log in</Text>
              </Text>
            </Pressable>
          </Box>
        </VStack>
        </ScrollView>
      </SafeAreaView>
      </Box>
  );
}