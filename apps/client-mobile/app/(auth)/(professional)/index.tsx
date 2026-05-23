import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';
import { router, useLocalSearchParams } from 'expo-router';
import { countryCodeToFlagEmoji, getWelcomeCountry } from '@/lib/welcome-country';
import AuthLogo from '@/components/auth/AuthLogo';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

const DEFAULT_CONTENT = {
  'hero.title': 'Offer services on 100Handy',
  'actions.create_account': 'Create Account',
  'actions.sign_in': 'Sign in',
  'legal.prefix': 'I agree to the',
  'legal.terms_label': 'Terms of Service',
  'legal.middle': 'and have reviewed the',
  'legal.privacy_label': 'Privacy Policy',
  'legal.suffix': '.',
} as const;

export default function ProfessionalWelcome() {
  const params = useLocalSearchParams();
  const [countryName, setCountryName] = useState('United Kingdom');
  const [countryCode, setCountryCode] = useState('GB');
  const ref = useMemo(() => {
    const value = params.ref;
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
    return undefined;
  }, [params.ref]);
  const content = useAppContent('auth_professional_start', DEFAULT_CONTENT);

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
    <View className="flex-1 bg-brand-dark">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-col flex-1">
          {/* Dark Top Section */}
          <View className="flex-col pb-20 bg-brand-dark">
            {/* Country Label */}
            <View className="items-center pt-4 pb-12 w-full self-center" style={{ maxWidth: 560 }}>
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
            <AuthLogo size="hero" variant="cream" />
          </View>

          {/* Light Bottom Section */}
          <View className="flex-col flex-1 bg-white w-full self-center" style={{ maxWidth: 560 }}>
            {/* Welcome Text */}
            <Text className="text-[19px] font-worksans-bold text-center px-8 pt-10 pb-8 text-brand-dark-alt">
              {getAppContentValue(content, 'hero.title', DEFAULT_CONTENT['hero.title'])}
            </Text>

            {/* Create Account Button */}
            <View className="px-5">
              <Button
                className="rounded-full shadow-md mb-4 bg-brand-terracotta"
                onPress={() =>
                  router.push({
                    pathname: '/(auth)/(professional)/sign-up',
                    params: { ...(ref ? { ref } : {}), via: 'welcome' },
                  } as Parameters<typeof router.push>[0])
                }
                >
                <ButtonText className="text-[18px] font-worksans-bold">
                  {getAppContentValue(content, 'actions.create_account', DEFAULT_CONTENT['actions.create_account'])}
                </ButtonText>
              </Button>

              {/* Sign In Button */}
              <Pressable 
                className="rounded-full py-4 border-2 mb-10 border-brand-terracotta bg-transparent"
                onPress={() =>
                  router.push({
                    pathname: '/(auth)/(professional)/sign-in',
                    params: ref ? { ref } : {},
                  } as Parameters<typeof router.push>[0])
                }
                >
                <Text className="text-center text-[18px] font-worksans-bold text-brand-terracotta">
                  {getAppContentValue(content, 'actions.sign_in', DEFAULT_CONTENT['actions.sign_in'])}
                </Text>
              </Pressable>

              {/* Terms and Privacy */}
              <View className="pb-10">
                <Text className="text-center text-[15px] font-worksans-medium leading-[22px] text-brand-dark-alt">
                  {getAppContentValue(content, 'legal.prefix', DEFAULT_CONTENT['legal.prefix'])}{' '}
                  <Text
                    className="text-brand-terracotta"
                    onPress={() => Linking.openURL('https://www.100handy.com/terms')}
                  >
                    {getAppContentValue(content, 'legal.terms_label', DEFAULT_CONTENT['legal.terms_label'])}
                  </Text>
                  {' '}{getAppContentValue(content, 'legal.middle', DEFAULT_CONTENT['legal.middle'])}{' '}
                  <Text
                    className="text-brand-terracotta"
                    onPress={() => Linking.openURL('https://www.100handy.com/terms#privacy-policy')}
                  >
                    {getAppContentValue(content, 'legal.privacy_label', DEFAULT_CONTENT['legal.privacy_label'])}
                  </Text>
                  {getAppContentValue(content, 'legal.suffix', DEFAULT_CONTENT['legal.suffix'])}
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
