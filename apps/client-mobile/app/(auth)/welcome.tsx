import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import WelcomeLogo from '@/components/auth/WelcomeLogo';

export default function WelcomeSplash() {
  const router = useRouter();

  const handleGetStarted = (): void => {
    router.push('/(auth)/(client)');
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          {/* Logo Section */}
          <View className="flex-1 items-center px-8">
            <WelcomeLogo />
          </View>

          {/* Get Started Link */}
          <View className="px-6 pb-8">
            <Pressable onPress={handleGetStarted}>
              <View className="flex-row items-center justify-end gap-1">
                <Text
                  className="text-[18px] font-worksans-medium"
                  style={{ color: '#A0B194' }}
                >
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
