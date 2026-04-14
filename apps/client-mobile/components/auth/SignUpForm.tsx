import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { ChevronDown, X, Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, validatePostcode, type SignUpFormData } from '@shared/schemas/auth';
import CountryPicker, { type Country, type CountryCode } from 'react-native-country-picker-modal';

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
  const [countryCode, setCountryCode] = useState<CountryCode>('GB');
  const [callingCode, setCallingCode] = useState('44');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSelectCountry = (country: Country): void => {
    setCountryCode(country.cca2);
    if (country.callingCode && country.callingCode.length > 0) {
      setCallingCode(country.callingCode[0]);
    }
    setShowCountryPicker(false);
  };

  // State for custom postcode error
  const [postcodeError, setPostcodeError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
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

  const postcodeValue = watch('postcode');

  // Validate postcode when country or postcode value changes
  useEffect(() => {
    if (postcodeValue && postcodeValue.length >= 2) {
      const isValidPostcode = validatePostcode(postcodeValue, countryCode);
      if (!isValidPostcode) {
        setPostcodeError(`Please enter a valid postcode for ${countryCode}`);
      } else {
        setPostcodeError(null);
      }
    } else {
      setPostcodeError(null);
    }
  }, [countryCode, postcodeValue]);

  // Check if form is truly valid (including custom postcode validation)
  const isFormValid = isValid && !postcodeError;
  const handleSignUp = (formData: SignUpFormData): void => {
    const fullPhone = `+${callingCode}${formData.phone}`;
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
    <View className="px-5">
      {/* First Name and Last Name Row */}
      <View className="mb-3 gap-4 flex-row">
        <View className="flex-1">
          <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
            First Name
          </Text>
          <Controller
            control={control}
            name="firstName"
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
                    placeholder=""
                    placeholderTextColor="#9CA3AF"
                  />
                </Input>
                {errors.firstName && (
                  <Text className="text-xs text-red-600 mt-1 font-worksans">
                    {errors.firstName.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
            Last Name
          </Text>
          <Controller
            control={control}
            name="lastName"
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
                    placeholder=""
                    placeholderTextColor="#9CA3AF"
                  />
                </Input>
                {errors.lastName && (
                  <Text className="text-xs text-red-600 mt-1 font-worksans">
                    {errors.lastName.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
      </View>

      {/* Email */}
      <View className="mb-3">
        <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
          Email
        </Text>
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
            </View>
          )}
        />
      </View>

      {/* Password */}
      <View className="mb-3">
        <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
          Password
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
            </View>
          )}
        />
      </View>

      {/* Phone Number */}
      <View className="mb-3">
        <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
          Phone Number
        </Text>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Input
                variant="outline"
                className="border-0 border-b border-gray-300 rounded-none px-0 h-10"
              >
                <View className="items-center flex-1 flex-row">
                  <Pressable
                    className="flex-row items-center mr-3"
                    onPress={() => setShowCountryPicker(true)}
                  >
                    <CountryPicker
                      countryCode={countryCode}
                      withFilter
                      withFlag
                      withCallingCode
                      withCallingCodeButton
                      withEmoji
                      onSelect={onSelectCountry}
                      visible={showCountryPicker}
                      onClose={() => setShowCountryPicker(false)}
                      containerButtonStyle={{ marginRight: 4 }}
                    />
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
                        <View className="bg-gray-800 rounded-full w-5 h-5 items-center justify-center">
                          <X size={14} color="white" />
                        </View>
                      </Pressable>
                    </InputSlot>
                  )}
                </View>
              </Input>
              {errors.phone && (
                <Text className="text-xs text-red-600 mt-1 font-worksans">
                  {errors.phone.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Post code */}
      <View className="mb-3">
        <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
          Post code
        </Text>
        <Controller
          control={control}
          name="postcode"
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
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                />
              </Input>
              {(errors.postcode || postcodeError) && (
                <Text className="text-xs text-red-600 mt-1 font-worksans">
                  {postcodeError || errors.postcode?.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Help Text */}
      <Text className="text-[12px] font-worksans-medium mb-5 leading-5" style={{ color: '#30352D' }}>
        Your phone and postcode help us match and{'\n'}
        connect you with the right 100 Handy Pros.
      </Text>

      {/* Signup Button */}
      <Button
        className="rounded-full shadow-sm mb-6 flex-row items-center justify-center gap-2"
        style={{
          backgroundColor: isFormValid ? '#C1856A' : '#E5E7EB',
        }}
        onPress={handleSubmit(handleSignUp)}
        isDisabled={!isFormValid || isLoading}
      >
        {isLoading && <ButtonSpinner color={isFormValid ? 'white' : '#B7B7B7'} />}
        <ButtonText
          className="text-[18px] font-worksans-bold"
          style={{ color: isFormValid ? 'white' : '#B7B7B7' }}
        >
          {isLoading ? 'Signing up...' : 'Signup'}
        </ButtonText>
      </Button>

      {/* Terms and Privacy */}
      <View className="mb-6">
        <Text className="text-center text-[15px] font-worksans-medium leading-[22px]" style={{ color: '#30352D' }}>
          By signing up, you agree to the{' '}
          <Text style={{ color: '#C1856A' }}>Terms of Service</Text>
          {'\n'}
          and have reviewed the{' '}
          <Text style={{ color: '#C1856A' }}>Privacy Policy.</Text>
          {'\n'}
          Manage <Text style={{ color: '#C1856A' }}>privacy settings</Text>
        </Text>
      </View>

      {/* Login Link */}
      <Pressable onPress={() => router.push(`/(auth)/(${userRole})/sign-in`)}>
        <Text className="text-center text-[15px] font-worksans-medium" style={{ color: '#30352D' }}>
          Already have an account?{' '}
          <Text style={{ color: '#C1856A' }}>Log in</Text>
        </Text>
      </Pressable>
    </View>
  );
}
