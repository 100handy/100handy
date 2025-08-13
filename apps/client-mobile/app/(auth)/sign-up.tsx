import React, { useState } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { Box } from '@/components/ui/box';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from '@/components/ui/select';
import { EyeIcon, EyeOffIcon, CheckIcon, ChevronDownIcon } from 'lucide-react-native';
import { signUp } from '@shared/supabase/auth';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [countryCode, setCountryCode] = useState('+44');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    postCode: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const fullPhoneNumber = `${countryCode}${formData.phone}`;
      const data = await signUp({
        email: formData.email,
        password: formData.password,
        role: 'customer',
        name: formData.name,
      });
      
      Alert.alert('Success', 'Account created successfully!');
      console.log('Signup successful:', data);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create account');
      console.error('Signup error:', error);
    }
  };

  return (
    <ScrollView>
      <Box className="flex-1 bg-[#f6e4d8] min-h-full">
        <Box className="flex-1 justify-center items-center p-4">
          <Box className="w-full max-w-[390px] bg-themeBackground">
            {/* Header */}
            <Box className="pt-24 pb-8 px-6">
              <Text className="text-center text-xl font-semibold text-typography-700 leading-7">
                Create your account
              </Text>
            </Box>

            {/* Form Container */}
            <Box className="px-6 pb-6">
              <View className="space-y-4">
                {/* First & Last Name */}
                <Input
                  variant="outline"
                  size="xl"
                  className="h-[58px] bg-white border-gray-200 rounded-xl my-2"
                >
                  <InputField
                    placeholder="First & Last Name"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    className="text-base text-black placeholder-gray-400"
                  />
                </Input>

                {/* Email Address */}
                <Input
                  variant="outline"
                  size="xl"
                  className="h-[58px] bg-white border-gray-200 rounded-xl my-2"
                >
                  <InputField
                    placeholder="Email address"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    className="text-base text-black placeholder-gray-400"
                  />
                </Input>

                {/* Phone Number */}
                <View className="flex-row space-x-2 my-2">
                  {/* Country Code Selector */}
                  <Box className="w-28">
                    <Select selectedValue={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger
                        variant="outline"
                        size="xl"
                        className="h-[61px] bg-white border-gray-200 rounded-xl flex-row items-center justify-between px-3"
                      >
                        <SelectInput
                          placeholder="+44"
                          className="text-base text-gray-700 flex-1"
                          editable={false}
                        />
                        <SelectIcon className="ml-2">
                          <ChevronDownIcon size={20} className="text-gray-700" />
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
                  </Box>

                  {/* Phone Input */}
                  <Box className="flex-1 ml-1">
                    <Input
                      variant="outline"
                      size="xl"
                      className="h-[61px] bg-white border-gray-200 rounded-xl"
                    >
                      <InputField
                        placeholder="Phone number"
                        value={formData.phone}
                        onChangeText={(value) => handleInputChange('phone', value)}
                        keyboardType="phone-pad"
                        className="text-base text-black placeholder-gray-400"
                      />
                    </Input>
                  </Box>
                </View>

                {/* Password */}
                <Input
                  variant="outline"
                  size="xl"
                  className="h-[58px] bg-white border-gray-200 rounded-xl"
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

                {/* Post Code */}
                <Input
                  variant="outline"
                  size="xl"
                  className="h-[58px] bg-white border-gray-200 rounded-xl my-2"
                >
                  <InputField
                    placeholder="Post code"
                    value={formData.postCode}
                    onChangeText={(value) => handleInputChange('postCode', value)}
                    className="text-base text-black placeholder-gray-400"
                  />
                </Input>
              </View>

              {/* Checkboxes */}
              <View className="space-y-3 mt-8">
                {/* Terms and Conditions */}
                <Checkbox
                  value="terms"
                  isChecked={termsAccepted}
                  onChange={setTermsAccepted}
                  size="sm"
                  className="items-start"
                >
                  <CheckboxIndicator className="mr-3 mt-1">
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>
                    <Text className="text-sm leading-6">
                      <Text className="text-gray-500">I agree to the</Text>
                      <Text className="text-clayOrange underline"> Terms and Conditions</Text>
                      <Text className="text-gray-500"> and</Text>
                      <Text className="text-clayOrange underline"> Privacy Policy</Text>
                    </Text>
                  </CheckboxLabel>
                </Checkbox>

                {/* Marketing Communications */}
                <Checkbox
                  value="marketing"
                  isChecked={marketingAccepted}
                  onChange={setMarketingAccepted}
                  size="sm"
                  className="items-start"
                >
                  <CheckboxIndicator className="mr-3 mt-1">
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>
                    <Text className="text-sm text-gray-500 leading-6">
                      I would like to receive marketing communications and special offers
                    </Text>
                  </CheckboxLabel>
                </Checkbox>
              </View>

              {/* Sign Up Button */}
              <Button
                size="xl"
                className="h-[60px] bg-sageGreen rounded-xl mt-8 shadow-lg"
                onPress={handleSignUp}
              >
                <ButtonText className="text-white text-lg font-bold">
                  Sign up
                </ButtonText>
              </Button>

              {/* Login Link */}
              <Box className="items-center mt-8">
                <Text className="text-sm text-gray-500">
                  Already have an account?
                  <Text className="text-clayOrange font-medium"> Log in</Text>
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
}

