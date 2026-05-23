import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { countryCodeToFlagEmoji, getWelcomeCountry } from '@/lib/welcome-country';
import AuthLogo from '@/components/auth/AuthLogo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

const DEFAULT_CONTENT = {
  'header.not_now': 'Not now',
  'hero.title': 'Welcome to 100Handy',
  'actions.create_account': 'Create Account',
  'actions.sign_in': 'Sign in',
  'legal.prefix': 'I agree to the',
  'legal.terms_label': 'Terms of Service',
  'legal.middle': 'and have reviewed the',
  'legal.privacy_label': 'Privacy Policy',
  'legal.suffix': '.',
  'links.offer_services': 'Looking to offer services on 100Handy',
} as const;

export default function ClientWelcomeStart() {
  const params = useLocalSearchParams();
  const [countryName, setCountryName] = useState('United Kingdom');
  const [countryCode, setCountryCode] = useState('GB');
  const ref = useMemo(() => {
    const value = params.ref;
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
    return undefined;
  }, [params.ref]);
  const content = useAppContent('auth_client_start', DEFAULT_CONTENT);

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
            <View className="flex-col pb-20" style={{ backgroundColor: '#333A31' }}>
              <View
                className="w-full self-center px-5 pt-4 pb-12 flex-row items-center justify-between"
                style={{ maxWidth: 560 }}
              >
                <View className="flex-row items-center px-4 py-2 rounded-full border border-white/30">
                  <Text className="mr-2 text-[18px]">{countryCodeToFlagEmoji(countryCode)}</Text>
                  <Text className="text-white font-worksans-medium text-[15px]">{countryName}</Text>
                </View>
                <Pressable onPress={handleNotNow} className="px-1 py-2">
                  <Text className="text-[15px] font-worksans-medium text-white">
                    {getAppContentValue(content, 'header.not_now', DEFAULT_CONTENT['header.not_now'])}
                  </Text>
                </Pressable>
              </View>

              <AuthLogo size="hero" variant="cream" />
            </View>

            <View className="flex-col flex-1 bg-white mt-10 w-full self-center" style={{ maxWidth: 560 }}>
              <Text
                className="text-2xl font-worksans-bold text-center px-8 pt-10 pb-8"
                style={{ color: '#30352D' }}
              >
                {getAppContentValue(content, 'hero.title', DEFAULT_CONTENT['hero.title'])}
              </Text>

              <View className="px-5">
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
                    {getAppContentValue(content, 'actions.create_account', DEFAULT_CONTENT['actions.create_account'])}
                  </Text>
                </Pressable>

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
                  <Text
                    className="text-center text-[18px] font-worksans-bold"
                    style={{ color: '#C1856A' }}
                  >
                    {getAppContentValue(content, 'actions.sign_in', DEFAULT_CONTENT['actions.sign_in'])}
                  </Text>
                </Pressable>

                <View className="pb-10">
                  <Text
                    className="text-center text-[15px] font-worksans-medium leading-[22px]"
                    style={{ color: '#30352D' }}
                  >
                    {getAppContentValue(content, 'legal.prefix', DEFAULT_CONTENT['legal.prefix'])}{' '}
                    <Text
                      style={{ color: '#C1856A' }}
                      onPress={() => Linking.openURL('https://www.100handy.com/terms')}
                    >
                      {getAppContentValue(content, 'legal.terms_label', DEFAULT_CONTENT['legal.terms_label'])}
                    </Text>
                    {' '}{getAppContentValue(content, 'legal.middle', DEFAULT_CONTENT['legal.middle'])}{' '}
                    <Text
                      style={{ color: '#C1856A' }}
                      onPress={() => Linking.openURL('https://www.100handy.com/terms#privacy-policy')}
                    >
                      {getAppContentValue(content, 'legal.privacy_label', DEFAULT_CONTENT['legal.privacy_label'])}
                    </Text>
                    {getAppContentValue(content, 'legal.suffix', DEFAULT_CONTENT['legal.suffix'])}
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
                    <Text
                      className="text-center text-[14px] font-worksans-medium"
                      style={{ color: '#30352D' }}
                    >
                      {getAppContentValue(content, 'links.offer_services', DEFAULT_CONTENT['links.offer_services'])}
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
