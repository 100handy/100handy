import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { countryCodeToFlagEmoji, getWelcomeCountry } from '@/lib/welcome-country';
import AuthLogo from '@/components/auth/AuthLogo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/lib/storage-keys';

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

  const handleNotNow = async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, 'true'),
        AsyncStorage.setItem(STORAGE_KEYS.HAS_ACCEPTED_TERMS, 'true'),
      ]);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    } finally {
      router.replace('/(client)/(tabs)/home');
    }
  };

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
            <View className="flex-row items-center justify-between px-5 pt-4 pb-12">
              <View className="flex-row items-center px-4 py-2 rounded-full border border-white/30">
                <Text className="mr-2 text-[18px]">
                  {countryCodeToFlagEmoji(countryCode)}
                </Text>
                <Text className="text-white font-worksans-medium text-[15px]">
                  {countryName}
                </Text>
              </View>
              <Pressable onPress={handleNotNow} className="px-1 py-2">
                <Text className="text-[15px] font-worksans-medium text-white">
                  Not now
                </Text>
              </Pressable>
            </View>

            {/* Logo */}
            <AuthLogo size="hero" variant="cream" />
          </View>

          {/* Light Bottom Section */}
          <View className="flex-col flex-1 bg-white mt-10">
            {/* Welcome Text */}
            <Text className="text-2xl font-worksans-bold text-center px-8 pt-10 pb-8" style={{ color: '#30352D' }}>
              Welcome to 100Handy
            </Text>

            {/* Buttons */}
            <View className="px-5">
              {/* Create Account Button */}
              <Pressable
                className="rounded-full py-4 mb-4 border-2"
                style={{ backgroundColor: '#C1856A', borderColor: '#C1856A' }}
                onPress={() =>
                  router.push({
                    pathname: '/(auth)/(client)/sign-up',
                    params: ref ? { ref } : {},
                  } as Parameters<typeof router.push>[0])
                }
              >
                <Text className="text-center text-[18px] font-worksans-bold text-white">
                  Create Account
                </Text>
              </Pressable>

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
                  I agree to the{' '}
                  <Text
                    style={{ color: '#C1856A' }}
                    onPress={() => Linking.openURL('https://www.100handy.com/terms')}
                  >
                    Terms of Service
                  </Text>
                  {' '}and have reviewed the{' '}
                  <Text
                    style={{ color: '#C1856A' }}
                    onPress={() => Linking.openURL('https://www.100handy.com/terms')}
                  >
                    Privacy Policy
                  </Text>
                  .
                </Text>
                <Pressable
                  className="mt-5"
                  onPress={() =>
                    router.push({
                      pathname: '/(auth)/(professional)/sign-up',
                      params: ref ? { ref } : {},
                    } as Parameters<typeof router.push>[0])
                  }
                >
                  <Text className="text-center text-[14px] font-worksans-medium" style={{ color: '#30352D' }}>
                    Looking to sign up as a{' '}
                    <Text style={{ color: '#C1856A' }}>100Handy Pro</Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
