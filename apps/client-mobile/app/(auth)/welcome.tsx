import React from 'react';
import { View, Pressable, Text, Dimensions, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeSplash() {
  const router = useRouter();

  const handleGetStarted = (): void => {
    router.push('/(auth)/(client)');
  };

  return (
    <ImageBackground
      className="flex-1"
      source={require('@/assets/images/welcome-background.png')}
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          {/* Welcome centered above the branded artwork footer */}
          <View className="flex-1 items-center justify-end" style={{ paddingBottom: SCREEN_HEIGHT * 0.22 }}>
            <View className="items-center">
              <Text
                className="font-worksans-light text-[32px]"
                style={{ color: '#FFFFFF' }}
              >
                Welcome
              </Text>
            </View>
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
    </ImageBackground>
  );
}
