import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loader } from '@/components/ui/loader';
import { STORAGE_KEYS } from '@/lib/storage-keys';

export default function ClientWelcome() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkReturningUser();
  }, []);

  const checkReturningUser = async (): Promise<void> => {
    try {
      const [hasSeenOnboarding, hasAcceptedTerms] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING),
        AsyncStorage.getItem(STORAGE_KEYS.HAS_ACCEPTED_TERMS),
      ]);

      // Returning user: has seen onboarding AND accepted terms before
      if (hasSeenOnboarding === 'true' && hasAcceptedTerms === 'true') {
        // Skip welcome, onboarding, terms - go directly to sign-up
        router.replace('/(auth)/(client)/sign-up');
        return;
      }

      // First-time user or incomplete flow - show welcome screen
      setIsChecking(false);
    } catch (error) {
      console.error('Error checking returning user status:', error);
      setIsChecking(false);
    }
  };

  const handleGetStarted = (): void => {
    router.push('/(auth)/(client)/onboarding');
  };

  if (isChecking) {
    return <Loader />;
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <View className="flex-col flex-1 justify-between">
          {/* Main Content - Centered Logo */}
          <View className="flex-col flex-1 items-center justify-center">
            <Text
              className="text-[80px] leading-[80px] font-worksans-light tracking-[4px]"
              style={{ color: '#30352D' }}
            >
              100
            </Text>
            <Text
              className="text-[52px] leading-[52px] font-worksans-bold tracking-[2px]"
              style={{ color: '#30352D' }}
            >
              HANDY
            </Text>
          </View>

          {/* Get Started Link - Bottom Right */}
          <View className="px-6 pb-8">
            <Pressable onPress={handleGetStarted}>
              <View className="flex-row items-center justify-end gap-1">
                <Text className="text-[18px] font-worksans-medium" style={{ color: '#A0B194' }}>
                  Get started
                </Text>
                <ChevronRight size={18} color="#A0B194" />
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
