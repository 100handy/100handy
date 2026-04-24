import React, { useState } from 'react';
import { StatusBar, ScrollView, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';
import { CheckIcon, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/lib/storage-keys';

export default function TermsAndPrivacyScreen() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!termsAccepted) return;

    try {
      // Save terms acceptance to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_ACCEPTED_TERMS, 'true');
      router.push('/(auth)/(client)/sign-up');
    } catch (error) {
      console.error('Error saving terms acceptance:', error);
      // Still navigate even if storage fails
      router.push('/(auth)/(client)/sign-up');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color="#333A31" />
        </Pressable>
        <Text className="text-[18px] font-worksans-medium" style={{ color: '#333A31' }}>
          Terms & Privacy
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-col flex-1 items-center px-6 pt-8">
          {/* Logo */}
          <View className="flex-col items-center mb-8">
            <Text className="text-[44px] leading-[44px] font-worksans-medium" style={{ color: '#30352D' }}>
              100
            </Text>
            <Text className="text-[44px] leading-[44px] font-worksans-medium tracking-[2px]" style={{ color: '#30352D' }}>
              HANDY
            </Text>
          </View>

          {/* Illustration - Figma design */}
          <Image
            source={require('@/assets/images/terms-privacy-illustration.png')}
            style={{ width: 200, height: 200, marginBottom: 32 }}
            contentFit="contain"
          />

          {/* Checkboxes */}
          <View className="flex-col w-full mb-8">
            <Pressable
              onPress={() => setTermsAccepted(!termsAccepted)}
              className="flex-row items-center mb-6"
            >
              <View
                className="mr-3 w-6 h-6 border-2 rounded items-center justify-center"
                style={{
                  borderColor: '#30352D',
                  backgroundColor: termsAccepted ? '#D9896C' : 'transparent'
                }}
              >
                {termsAccepted && <CheckIcon color="white" size={16} />}
              </View>
              <Text className="flex-1 text-[15px] font-worksans-light leading-5" style={{ color: '#30352D' }}>
                I agree to the Terms of Service and have {'\n'}reviewed the Privacy Policy.
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setMarketingAccepted(!marketingAccepted)}
              className="flex-row items-center"
            >
              <View
                className="mr-3 w-6 h-6 border-2 rounded items-center justify-center"
                style={{
                  borderColor: '#30352D',
                  backgroundColor: marketingAccepted ? '#D9896C' : 'transparent'
                }}
              >
                {marketingAccepted && <CheckIcon color="white" size={16} />}
              </View>
              <Text className="flex-1 text-[15px] font-worksans-light leading-5" style={{ color: '#30352D' }}>
                I do not wish to receive promotional {'\n'}communications from 100Handy.
              </Text>
            </Pressable>
          </View>

          {/* Continue Button */}
          <View className="w-full px-6 pb-8">
            <Button
              size="xl"
              className="h-[60px] rounded-full"
              style={{
                backgroundColor: termsAccepted ? '#D9896C' : '#E5E7EB'
              }}
              onPress={handleContinue}
              disabled={!termsAccepted}
            >
              <ButtonText 
                className="text-[18px] font-worksans-bold"
                style={{ color: termsAccepted ? '#FFFFFF' : '#B7B7B7' }}
              >
                Continue
              </ButtonText>
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
