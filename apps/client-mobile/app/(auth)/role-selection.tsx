import React, { useMemo } from 'react';
import { StatusBar, View, Text, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { User, Briefcase, ArrowRight } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import Logo100Top from '../../assets/images/logo-100-top.svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  sageGreen: '#A3B899',
  clayOrange: '#D9896C',
  warmTaupe: '#BFA28D',
  themeBackground: '#F6E4D8',
  themeFont: '#30352D',
};

export default function AuthRoleSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const ref = useMemo(() => {
    const value = params.ref;
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
    return undefined;
  }, [params.ref]);

  const handleClientAuth = (): void => {
    router.push({
      pathname: '/(auth)/(client)',
      params: ref ? { ref } : {},
    } as any);
  };

  const handleProfessionalAuth = (): void => {
    router.push({
      pathname: '/(auth)/(professional)/sign-up',
      params: ref ? { ref } : {},
    } as any);
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1" edges={['bottom']}>
        <StatusBar barStyle="dark-content" />

        {/* Background Decorative Shapes Layer */}
        <View className="absolute w-full h-full overflow-hidden">
          {/* Top Left Sage Green Shape */}
          <View className="absolute -top-[100px] -left-[200px] w-[434px] h-[300px]" style={{ transform: [{ rotate: '302deg' }] }}>
            <Svg width="434" height="300" viewBox="0 0 435 301" fill="none">
              <Path d="M434.023 0H0V300.393H434.023V0Z" fill={COLORS.sageGreen} />
            </Svg>
          </View>

          {/* Center Large Beige Square */}
          <View className="absolute top-[50px] left-[-60px] w-[421px] h-[426px]" style={{ transform: [{ rotate: '327deg' }] }}>
            <Svg width="421" height="426" viewBox="0 0 422 427" fill="none">
              <Path d="M0 13.6505L421.099 0V426.201L68.6965 351.575L0 13.6505Z" fill={COLORS.themeBackground} />
            </Svg>
          </View>

          {/* Top Right Brown/Taupe Shape */}
          <View className="absolute -top-[140px] -right-[340px] w-[584px] h-[393px]" style={{ transform: [{ rotate: '341deg' }] }}>
            <Svg width="584" height="393" viewBox="0 0 584 393" fill="none">
              <Path d="M0 102.254L583.814 0V300.393L183.748 392.49L0 102.254Z" fill={COLORS.warmTaupe} />
            </Svg>
          </View>

          {/* Bottom Right Terracotta Shape */}
          <View className="absolute -bottom-[240px] -right-[210px] w-[435px] h-[346px]" style={{ transform: [{ rotate: '302deg' }] }}>
            <Svg width="435" height="346" viewBox="0 0 435 346" fill="none">
              <Path d="M10 0L434.023 44.742V345.135H0L10 0Z" fill={COLORS.clayOrange} />
            </Svg>
          </View>
        </View>

        <View className="flex-col flex-1 justify-center items-center p-6 z-10">
          {/* Logo and Title */}
          <View className="flex-col items-center mb-12">
            <View className="mb-4">
              <Logo100Top width={200} height={96} />
            </View>
            <Text className="font-worksans-medium text-center text-typography-700 text-lg px-4">
              Choose how you'd like to use the app
            </Text>
          </View>

          {/* Role Selection Cards */}
          <View className="flex-col w-full space-y-6 mb-8">
            {/* Client Role */}
            <Pressable
              className="bg-white border border-outline-200 rounded-3xl p-6 shadow-sm active:opacity-90"
              style={{ elevation: 2 }}
              onPress={handleClientAuth}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-14 h-14 bg-sage-green rounded-2xl justify-center items-center mr-4">
                    <User color="white" size={28} />
                  </View>
                  <View className="flex-col flex-1">
                    <Text className="font-worksans-bold text-typography-900 text-xl mb-1">
                      I need help
                    </Text>
                    <Text className="font-worksans text-typography-600 text-base">
                      Find professionals for home tasks
                    </Text>
                  </View>
                </View>
                <ArrowRight color={COLORS.themeFont} size={24} />
              </View>
            </Pressable>

            {/* Professional Role */}
            <Pressable
              className="bg-white border border-outline-200 rounded-3xl p-6 shadow-sm active:opacity-90 mt-2"
              style={{ elevation: 2 }}
              onPress={handleProfessionalAuth}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-14 h-14 bg-clay-orange rounded-2xl justify-center items-center mr-4">
                    <Briefcase color="white" size={28} />
                  </View>
                  <View className="flex-col flex-1">
                    <Text className="font-worksans-bold text-typography-900 text-xl mb-1">
                      I provide services
                    </Text>
                    <Text className="font-worksans text-typography-600 text-base">
                      Earn money by helping others
                    </Text>
                  </View>
                </View>
                <ArrowRight color={COLORS.themeFont} size={24} />
              </View>
            </Pressable>
          </View>

          {/* Help Text */}
          <View className="flex-col w-full items-center px-8">
            <Text className="font-worksans text-center text-sm text-typography-600 leading-5">
              You can switch between roles anytime in your profile settings
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
