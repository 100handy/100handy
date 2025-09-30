import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Box } from '@/components/ui/box';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { EyeIcon, EyeOffIcon, Briefcase } from 'lucide-react-native';
import { signIn } from '@shared/supabase/auth';
import { useAuthStore } from '@shared/supabase';
import { useRouter } from 'expo-router';
import { Loader } from '@/components/ui/loader';
import TaskHelperLogo from "../../../assets/images/task-helper-logo.svg";
import { Link } from '@/components/ui/link';
import ScreenWrapper from '@/components/ui/ScreenWrapper';

export default function ProfessionalSignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const { setSession } = useAuthStore();

  const handleInputChange = (field: string, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (): Promise<void> => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const data = await signIn(formData.email, formData.password);

      // Update the auth store with the new session
      if (data.session) {
        setSession(data.session);
      }

      Alert.alert('Success', 'Logged in successfully!');
      console.log('Sign in successful:', data);

      // AuthWrapper will handle navigation automatically
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to sign in');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = (): void => {
    router.push('./sign-up');
  };

  if (isLoading) {
    return <Loader text="Signing in..." />;
  }

  return (
    <ScreenWrapper scrollable>
      <Box className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl px-4 sm:px-6 md:px-8">
        {/* Logo and Brand */}
        <Box className="items-center mb-8 sm:mb-10 md:mb-12">
          <Box className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-clay-orange rounded-2xl items-center justify-center shadow-lg mb-4 sm:mb-5 md:mb-6">
            <Briefcase color="white" size={32} />
          </Box>
          <Text className="font-cardo-bold text-xl sm:text-2xl md:text-3xl text-typography-900 mb-2">
            100Handy Pro
          </Text>
          <Text className="font-worksans text-center text-typography-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
            Earn money by helping others with home tasks
          </Text>
          <Text className="font-worksans-semibold text-center text-typography-900 text-lg sm:text-xl md:text-2xl">
            Welcome back, Professional
          </Text>
        </Box>

        {/* Form Container */}
        <Box>
          <Box className="space-y-4">
            {/* Email/Phone Input */}
            <Input
              variant="outline"
              size="xl"
              className="h-12 sm:h-[58px] md:h-16 bg-white border-outline-200 rounded-xl"
            >
              <InputField
                placeholder="Email or phone number"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                className="font-worksans text-sm sm:text-base md:text-lg text-typography-black placeholder-typography-400"
              />
            </Input>

            {/* Password Input */}
            <Input
              variant="outline"
              size="xl"
              className="h-12 sm:h-[58px] md:h-16 bg-white border-outline-200 rounded-xl mt-2"
            >
              <InputField
                secureTextEntry={!showPassword}
                placeholder="Password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                className="font-worksans text-sm sm:text-base md:text-lg text-typography-black placeholder-typography-400"
              />
              <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                <InputIcon
                  as={showPassword ? EyeOffIcon : EyeIcon}
                  className="text-typography-500 w-5 h-5"
                />
              </InputSlot>
            </Input>
          </Box>

          {/* Forgot Password */}
          <Box className="mt-4 mb-6 items-end">
            <Link href="./forgot-password">
              <Text className="font-worksans-medium text-clayOrange text-sm">
                Forgot password?
              </Text>
            </Link>
          </Box>

          {/* Login Button */}
          <Button
            size="xl"
            className="bg-clay-orange rounded-xl h-12 sm:h-[60px] md:h-16 mb-4 sm:mb-6 shadow-lg"
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <ButtonText className="font-worksans-bold text-white text-base sm:text-lg md:text-xl">
              Log in as Professional
            </ButtonText>
          </Button>

          {/* Sign Up Link */}
          <Box className="flex-row justify-center items-center mb-6 sm:mb-8">
            <Text className="font-worksans text-typography-black text-xs sm:text-sm md:text-base">
              Don't have an account?{' '}
            </Text>
            <Link href="./sign-up">
              <Text className="font-worksans-semibold text-typography-black text-xs sm:text-sm md:text-base">
                Join as Professional
              </Text>
            </Link>
          </Box>

          {/* Terms and Support */}
          <Box className="items-center">
            <Text className="font-worksans text-typography-black text-xs text-center leading-5">
              By continuing you agree to our Terms & Privacy
            </Text>
          </Box>
        </Box>
      </Box>
    </ScreenWrapper>
  );
}
