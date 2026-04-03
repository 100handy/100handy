import React, { useMemo } from 'react';
import { Image, ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';
import { router, useLocalSearchParams } from 'expo-router';

export default function ClientWelcome() {
  const params = useLocalSearchParams();
  const ref = useMemo(() => {
    const value = params.ref;
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
    return undefined;
  }, [params.ref]);

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
          <View className="flex-col pb-10" style={{ backgroundColor: '#333A31' }}>
            {/* Country Label */}
            <View className="items-center pt-4 pb-12">
              <View className="flex-row items-center px-4 py-2 rounded-full border border-white/30">
                <Image
                  source={require('@/assets/images/uk-flag.png')}
                  className="w-7 h-4 mr-2"
                  resizeMode="contain"
                />
                <Text className="text-white font-worksans-medium text-[15px]">
                  United Kingdom
                </Text>
              </View>
            </View>

            {/* Logo Container */}
            <View className="items-center">
              <View className="bg-white rounded-[32px] shadow-lg overflow-hidden" style={{ width: 175, height: 175 }}>
                {/* 100 HANDY Text */}
                <View className="flex-col items-center pt-6 pb-3">
                  <Text className="text-[34px] font-worksans-bold leading-[36px] tracking-wider" style={{ color: '#30352D' }}>
                    100
                  </Text>
                  <Text className="text-[34px] font-worksans-bold leading-[36px] tracking-wider" style={{ color: '#30352D' }}>
                    HANDY
                  </Text>
                </View>

                {/* Task Button */}
                <View className="items-center px-4 pb-4">
                  <View className="bg-clay-orange rounded-full px-7 py-2.5 shadow-md" style={{ transform: [{ rotate: '-9deg' }] }}>
                    <Text className="text-white text-[30px] font-worksans-bold tracking-wide">
                      Task
                    </Text>
                  </View>
                </View>
              </View>

              {/* By Text */}
              <View className="flex-row items-center mt-3">
                <Text className="font-worksans-medium text-[16px] mr-1.5 text-white">
                  By
                </Text>
                <Text className="font-worksans-bold text-[16px] tracking-wide text-white">
                  100 HANDY
                </Text>
              </View>
            </View>
          </View>

          {/* Light Bottom Section */}
          <View className="flex-col flex-1 bg-white">
            {/* Welcome Text */}
            <Text className="text-[19px] font-worksans-bold text-center px-8 pt-10 pb-8" style={{ color: '#30352D' }}>
              Welcome to 100 Handy Task
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
