import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';
import { router, useLocalSearchParams } from 'expo-router';
import { countryCodeToFlagEmoji, getWelcomeCountry } from '@/lib/welcome-country';
import AuthLogo from '@/components/auth/AuthLogo';

export default function ClientWelcome() {
  const params = useLocalSearchParams();
  const [countryName, setCountryName] = useState('United Kingdom');
  const [countryCode, setCountryCode] = useState('GB');
  const ref = useMemo(() => {
    const value = params.ref;
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
    return undefined;
  }, [params.ref]);

  useEffect(() => {
    let isMounted = true;

    getWelcomeCountry().then((country) => {
      if (!isMounted) return;
      setCountryName(country.countryName);
      setCountryCode(country.countryCode);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-col flex-1 bg-white">
          {/* Dark Top Section */}
          <View className="flex-col pb-20" style={{ backgroundColor: '#333A31' }}>
            {/* Country Label */}
            <View className="items-center pt-4 pb-12">
              <View className="flex-row items-center px-4 py-2 rounded-full border border-white/30">
                <Text className="mr-2 text-[18px]">
                  {countryCodeToFlagEmoji(countryCode)}
                </Text>
                <Text className="text-white font-worksans-medium text-[15px]">
                  {countryName}
                </Text>
              </View>
            </View>

            {/* Logo */}
            <AuthLogo size="hero" color="#FFFFFF" />
          </View>

          {/* Light Bottom Section */}
          <View className="flex-col flex-1 bg-white mt-10">
            {/* Welcome Text */}
            <Text className="text-2xl font-worksans-bold text-center px-8 pt-10 pb-8" style={{ color: '#30352D' }}>
              Welcome to 100 Handy
            </Text>

            {/* Buttons */}
            <View className="px-5">
              {/* Create Account Button */}
              <Button
                className="rounded-full shadow-md mb-4"
                style={{ backgroundColor: '#C1856A' }}
                onPress={() =>
                  router.push({
                    pathname: '/(auth)/(client)/sign-up',
                    params: ref ? { ref } : {},
                  } as Parameters<typeof router.push>[0])
                }
              >
                <ButtonText className="text-[18px] font-worksans-bold text-white">
                  Create Account
                </ButtonText>
              </Button>

              {/* Sign In Button */}
              <Pressable
                className="rounded-full py-4 border-2 mb-10"
                style={{ borderColor: '#C1856A' }}
                onPress={() =>
                  router.push({
                    pathname: '/(auth)/(client)/sign-in',
                    params: ref ? { ref } : {},
                  } as Parameters<typeof router.push>[0])
                }
              >
                <Text className="text-center text-[18px] font-worksans-bold" style={{ color: '#C1856A' }}>
                  Sign in
                </Text>
              </Pressable>

              {/* Terms and Privacy */}
              <View className="pb-10">
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
            </View>
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
