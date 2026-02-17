import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loader } from '@/components/ui/loader';
import { STORAGE_KEYS } from '@/lib/storage-keys';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
        // Skip welcome, onboarding, terms - go directly to sign-in
        router.replace('/(auth)/(client)/sign-in');
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
    <View className="flex-1 bg-white overflow-hidden">
      {/* Giant decorative letters that extend beyond screen */}
      <View className="absolute inset-0">
        {/* "1 0 0" - Top row */}
        <Text
          className="absolute font-worksans-light"
          style={{
            color: '#30352D',
            fontSize: SCREEN_HEIGHT * 0.22,
            lineHeight: SCREEN_HEIGHT * 0.22,
            top: SCREEN_HEIGHT * 0.08,
            left: -SCREEN_WIDTH * 0.12,
            letterSpacing: SCREEN_WIDTH * 0.06,
          }}
        >
          100
        </Text>

        {/* "H A N" - Second row */}
        <Text
          className="absolute font-worksans-bold"
          style={{
            color: '#30352D',
            fontSize: SCREEN_HEIGHT * 0.18,
            lineHeight: SCREEN_HEIGHT * 0.18,
            top: SCREEN_HEIGHT * 0.28,
            left: -SCREEN_WIDTH * 0.08,
            letterSpacing: SCREEN_WIDTH * 0.06,
          }}
        >
          HAN
        </Text>

        {/* Faded "0" - Middle area */}
        <Text
          className="absolute font-worksans-light"
          style={{
            color: '#30352D',
            fontSize: SCREEN_HEIGHT * 0.22,
            lineHeight: SCREEN_HEIGHT * 0.22,
            top: SCREEN_HEIGHT * 0.46,
            left: -SCREEN_WIDTH * 0.28,
            opacity: 0.12,
          }}
        >
          0
        </Text>

        {/* "N D Y" - Bottom row */}
        <Text
          className="absolute font-worksans-bold"
          style={{
            color: '#30352D',
            fontSize: SCREEN_HEIGHT * 0.18,
            lineHeight: SCREEN_HEIGHT * 0.18,
            top: SCREEN_HEIGHT * 0.68,
            left: -SCREEN_WIDTH * 0.15,
            letterSpacing: SCREEN_WIDTH * 0.06,
          }}
        >
          NDY
        </Text>
      </View>

      {/* Get Started Link - Bottom Right */}
      <SafeAreaView className="flex-1" edges={['bottom']}>
        <View className="flex-1 justify-end px-6 pb-8">
          <Pressable onPress={handleGetStarted}>
            <View className="flex-row items-center justify-end gap-1">
              <Text className="text-[18px] font-worksans-medium" style={{ color: '#A0B194' }}>
                Get started
              </Text>
              <ChevronRight size={18} color="#A0B194" />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
