import React, { useState } from 'react';
import { ScrollView, Alert, View, Text, Pressable } from 'react-native';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from '@/components/ui/select';
import { EyeIcon, EyeOffIcon, CheckIcon, ChevronDownIcon } from 'lucide-react-native';
import { signUp } from '@shared/supabase/auth';
import { useAuthStore } from '@shared/supabase';
import { useRouter } from 'expo-router';
import { Loader } from '@/components/ui/loader';
import { useToast } from '@/components/ui/toast';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [countryCode, setCountryCode] = useState('+44');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    postCode: '',
  });
  const router = useRouter();
  const toast = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const fullPhoneNumber = `${countryCode}${formData.phone}`;

      // Sign up with email - this will send email verification automatically
      await signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'customer',
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            postcode: formData.postCode,
            phone: fullPhoneNumber,
          },
        },
      });

      // Navigate to email verification screen
      router.push({
        pathname: '/(auth)/verify-email',
        params: { email: formData.email },
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Sign up failed', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader text="Creating account..." />;
  }

  return (
    <ScrollView>
      <View className="flex-1 bg-theme-background min-h-full">
        <View className="flex-1 justify-center items-center p-4">
          <View className="w-full max-w-[390px] bg-theme-background">
            {/* Header */}
            <View className="pt-24 pb-8 px-6">
              <Text className="text-center text-xl font-worksans-semibold text-theme-font leading-7">
                Create your account
              </Text>
            </View>

            {/* Form Container */}
            <View className="px-6 pb-6">
              <View className="space-y-4">
                {/* First Name */}
                <Input
                  variant="outline"
                  size="xl"
                  className="h-[58px] bg-typography-white border-typography-200 rounded-xl my-2"
                >
                  <InputField
                    placeholder="First Name"
                    value={formData.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    className="text-base text-typography-black font-worksans placeholder-typography-400"
                  />
                </Input>

                {/* Last Name */}
                <Input
                  variant="outline"
                  size="xl"
                  className="h-[58px] bg-typography-white border-typography-200 rounded-xl my-2"
                >
                  <InputField
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    className="text-base text-typography-black font-worksans placeholder-typography-400"
                  />
                </Input>

                {/* Email Address */}
                <Input
                  variant="outline"
                  size="xl"
                  className="h-[58px] bg-typography-white border-typography-200 rounded-xl my-2"
                >
                  <InputField
                    placeholder="Email address"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    className="text-base text-typography-black font-worksans placeholder-typography-400"
                  />
                </Input>

                {/* Phone Number */}
                <View className="flex-row space-x-2 my-2">
                  {/* Country Code Selector */}
                  <View className="w-28">
                    <Select selectedValue={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger
                        variant="outline"
                        size="xl"
                        className="h-[61px] bg-typography-white border-typography-200 rounded-xl flex-row items-center justify-between px-3"
                      >
                        <SelectInput
                          placeholder="+44"
                          className="text-base text-typography-700 font-worksans flex-1"
                          editable={false}
                        />
                        <SelectIcon className="ml-2">
                          <ChevronDownIcon size={20} className="text-typography-700" />
                        </SelectIcon>
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          <SelectItem label="+44" value="+44" />
                          <SelectItem label="+1" value="+1" />
                          <SelectItem label="+33" value="+33" />
                          <SelectItem label="+49" value="+49" />
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  </View>

                  {/* Phone Input */}
                  <View className="flex-1 ml-1">
                    <Input
                      variant="outline"
                      size="xl"
                      className="h-[61px] bg-typography-white border-typography-200 rounded-xl"
                    >
                      <InputField
                        placeholder="Phone number"
                        value={formData.phone}
                        onChangeText={(value) => handleInputChange('phone', value)}
                        keyboardType="phone-pad"
                        className="text-base text-typography-black font-worksans placeholder-typography-400"
                      />
                    </Input>
                  </View>
                </View>

                {/* Password */}
                <Input
                  variant="outline"
                  size="xl"
                  className="h-[58px] bg-typography-white border-typography-200 rounded-xl"
                >
                  <InputField
                    secureTextEntry={!showPassword}
                    placeholder="Password"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    className="text-base text-typography-black font-worksans placeholder-typography-400"
                  />
                  <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                    <InputIcon
                      as={showPassword ? EyeOffIcon : EyeIcon}
                      className="text-typography-400 w-5 h-5"
                    />
                  </InputSlot>
                </Input>

                {/* Post Code */}
                <Input
                  variant="outline"
                  size="xl"
                  className="h-[58px] bg-typography-white border-typography-200 rounded-xl my-2"
                >
                  <InputField
                    placeholder="Post code"
                    value={formData.postCode}
                    onChangeText={(value) => handleInputChange('postCode', value)}
                    className="text-base text-typography-black font-worksans placeholder-typography-400"
                  />
                </Input>
              </View>

              {/* Checkboxes */}
              <View className="space-y-3 mt-8">
                {/* Terms and Conditions */}
                <Pressable
                  onPress={() => setTermsAccepted(!termsAccepted)}
                  className="flex-row items-start"
                >
                  <View className={`w-5 h-5 rounded border-2 mr-3 mt-1 items-center justify-center ${termsAccepted ? 'bg-clayOrange border-clayOrange' : 'border-typography-300'}`}>
                    {termsAccepted && <CheckIcon size={14} color="white" />}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm leading-6 font-worksans">
                      <Text className="text-typography-500">I agree to the</Text>
                      <Text className="text-clayOrange underline"> Terms and Conditions</Text>
                      <Text className="text-typography-500"> and</Text>
                      <Text className="text-clayOrange underline"> Privacy Policy</Text>
                    </Text>
                  </View>
                </Pressable>

                {/* Marketing Communications */}
                <Pressable
                  onPress={() => setMarketingAccepted(!marketingAccepted)}
                  className="flex-row items-start"
                >
                  <View className={`w-5 h-5 rounded border-2 mr-3 mt-1 items-center justify-center ${marketingAccepted ? 'bg-clayOrange border-clayOrange' : 'border-typography-300'}`}>
                    {marketingAccepted && <CheckIcon size={14} color="white" />}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-typography-500 leading-6 font-worksans">
                      I would like to receive marketing communications and special offers
                    </Text>
                  </View>
                </Pressable>
              </View>

              {/* Sign Up Button */}
              <Button
                size="xl"
                className="h-[60px] bg-sage-green rounded-xl mt-8 shadow-lg"
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <ButtonText className="text-typography-white text-lg font-worksans-bold">
                  Sign up
                </ButtonText>
              </Button>

              {/* Login Link */}
              <View className="items-center mt-8">
                <Text className="text-sm text-typography-500 font-worksans">
                  Already have an account?
                  <Text 
                    className="text-clayOrange font-worksans-medium" 
                    onPress={() => router.push('/(auth)/role-selection')}
                  > Log in</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

