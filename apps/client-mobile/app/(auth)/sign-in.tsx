import React, { useState } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { Box } from '@/components/ui/box';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { signIn } from '@shared/supabase/auth';
import { useAuthStore } from '@shared/supabase';
import { useRouter } from 'expo-router';
import { Loader } from '@/components/ui/loader';
import TaskHelperLogo from "../../assets/images/task-helper-logo.svg";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const { setSession } = useAuthStore();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async () => {
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



  const handleSignUp = () => {
    router.push('./sign-up');
  };

  if (isLoading) {
    return <Loader text="Signing in..." />;
  }

  return (
    <ScrollView>
      <Box className="flex-1 bg-themeBackground min-h-full">
        <Box className="flex-1 justify-center items-center p-4">
          <Box className="w-full max-w-[390px]">
            {/* Logo and Brand */}
            <Box className="items-center mb-8">
              <TaskHelperLogo width={80} height={80} className="mb-4" />
              <Text style={{ fontFamily: "Futura-Medium" }} className="text-3xl text-typography-700 mb-2">
                TaskHelper
              </Text>
              <Text style={{ fontFamily: "SourceCodeProVariable" }} className="text-center text-typography-600 text-base mb-4">
                Get help with home tasks fast and trusted
              </Text>
              <Text style={{ fontFamily: "SourceCodeProVariable" }} className="text-center text-typography-700 text-lg font-semibold">
                Welcome back
              </Text>
            </Box>

            {/* Form Container */}
            <Box className="px-6">
              <View className="space-y-4">
                {/* Email/Phone Input */}
                <Input
                  variant="outline"
                  size="xl"
                  className="h-[58px] bg-white border-gray-200 rounded-xl"
                >
                  <InputField
                    placeholder="Email address or phone number"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    className="text-base text-black placeholder-gray-400"
                  />
                </Input>

                {/* Password Input */}
                <Input
                  variant="outline"
                  size="xl"
                  className="h-[58px] bg-white border-gray-200 rounded-xl my-2"
                >
                  <InputField
                    secureTextEntry={!showPassword}
                    placeholder="Password"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    className="text-base text-black placeholder-gray-400"
                  />
                  <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                    <InputIcon
                      as={showPassword ? EyeOffIcon : EyeIcon}
                      className="text-gray-400 w-5 h-5"
                    />
                  </InputSlot>
                </Input>
              </View>

              {/* Forgot Password */}
              <Box className="mt-2 mb-6">
                <Text 
                  className="text-clayOrange text-sm text-right"
                >
                  Forgot password?
                </Text>
              </Box>

              {/* Login Button */}
              <Button
                size="xl"
                className="bg-clayOrange rounded-xl h-[58px] mb-4"
                onPress={handleSignIn}
                disabled={isLoading}
              >
                <ButtonText style={{ fontFamily: "SourceCodeProVariable" }} className="text-white font-bold text-lg">
                  Log in
                </ButtonText>
              </Button>

              {/* Sign Up Link */}
              <Box className="flex-row justify-center items-center mt-4">
                <Text className="text-typography-600 text-sm">
                  Don't have an account? 
                </Text>
                <Text 
                  className="text-clayOrange text-sm font-semibold ml-1"
                  onPress={handleSignUp}
                >
                  Sign up
                </Text>
              </Box>

              {/* Terms and Support */}
              <Box className="mt-8">
                <Text style={{ fontFamily: 'Inter' }} className="text-typography-600 text-xs text-center leading-5">
                  By continuing you agree to our Terms & Privacy
                </Text>
                <Text style={{ fontFamily: 'Inter' }} className="text-typography-600 text-xs text-center mt-2">
                  Need help? Contact Support
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
}