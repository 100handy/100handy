import React, { useState, useRef } from 'react';
import { View, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import StarRating from '@/assets/images/star-rating.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@hasSeenOnboarding';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Colors from tailwind.config.js
const COLORS = {
  sageGreen: '#A3B899',
  clayOrange: '#D9896C',
  warmTaupe: '#BFA28D',
  themeBackground: '#F6E4D8',
  themeFont: '#333A31',
  cardBg: '#F7F1EC',
};

// Onboarding content data
const onboardingData = [
  {
    id: 0,
    title: (
      <VStack className="items-start">
        <Text className="text-[44px] leading-[44px] font-worksans-medium" style={{ color: '#30352D' }}>
          100
        </Text>
        <Text className="text-[44px] leading-[44px] font-worksans-medium tracking-[2px]" style={{ color: '#30352D' }}>
          HANDY
        </Text>
      </VStack>
    ),
    description: (
      <>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: '#30352D' }}>
          Help with everyday
        </Text>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: '#30352D' }}>
          Life at you fingertips.
        </Text>
      </>
    ),
  },
  {
    id: 1,
    description: (
      <>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: '#30352D' }}>
          See reviews prices
        </Text>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: '#30352D' }}>
          of 140,00 +
        </Text>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: '#30352D' }}>
          background
        </Text>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: '#30352D' }}>
          checked Taskers.
        </Text>
      </>
    ),
    content: (
      <VStack className="gap-4 mt-12">
        {/* Review Card 1 - Lukas Ernest */}
        <View className="bg-[#F7F1EC] rounded-2xl p-4 shadow-sm">
          <HStack className="items-center gap-3">
            <Image
              source={require('@/assets/images/avatar-lukas.png')}
              className="w-10 h-10 rounded-full"
            />
            <VStack className="flex-1">
              <Text className="text-[10px] font-worksans-medium text-theme-font">Lukas Ernest</Text>
              <Text className="text-[8px] font-worksans-medium text-theme-font mb-1">140 Handyman Task</Text>
              <StarRating width={114} height={16} />
            </VStack>
          </HStack>
        </View>

        {/* Review Card 2 - Jana Rado */}
        <View className="bg-[#F7F1EC] rounded-2xl p-4 shadow-sm">
          <HStack className="items-center gap-3">
            <Image
              source={require('@/assets/images/avatar-jana.png')}
              className="w-10 h-10 rounded-full"
            />
            <VStack className="flex-1">
              <Text className="text-[10px] font-worksans-medium text-theme-font">Jana Rado</Text>
              <Text className="text-[8px] font-worksans-medium text-theme-font mb-1">45 Delivery Tasks</Text>
              <StarRating width={114} height={16} />
            </VStack>
          </HStack>
        </View>
      </VStack>
    ),
  },
  {
    id: 2,
    description: (
      <>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: '#30352D' }}>
          Chat with your Tasker to schedule
        </Text>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: '#30352D' }}>
          The job and get it done.
        </Text>
      </>
    ),
    content: (
      <VStack className="gap-4 mt-12">
        {/* Chat Message 1 - Right aligned */}
        <HStack className="justify-end">
          <VStack className="bg-white rounded-2xl px-4 py-3 max-w-[50%] shadow-sm">
            <Text className="text-[12px] font-worksans-regular text-theme-font mb-1">Hi there!</Text>
            <Text className="text-[10px] font-worksans-light text-gray-500">11:00am</Text>
          </VStack>
        </HStack>

        {/* Chat Message 2 with Avatar - Left aligned */}
        <HStack className="items-end gap-2">
          <Image
            source={require('@/assets/images/avatar-lukas.png')}
            className="w-8 h-8 rounded-full"
          />
          <VStack className="bg-white rounded-2xl px-4 py-3 max-w-[65%] shadow-sm">
            <Text className="text-[12px] font-worksans-regular text-theme-font">
              I&apos;ve got all the tools for the{'\n'}Job. Does 3 pm still work{'\n'}for you?
            </Text>
          </VStack>
        </HStack>

        {/* Chat Message 3 - Right aligned with avatar */}
        <HStack className="justify-end items-end gap-2">
          <VStack className="bg-clay-orange rounded-2xl px-4 py-3 max-w-[60%] shadow-sm">
            <Text className="text-[12px] font-worksans-regular text-white mb-1">
              Yes, that&apos;s great{'\n'}See you soon!
            </Text>
            <Text className="text-[10px] font-worksans-light text-white/90">11:00am</Text>
          </VStack>
          <Image
            source={require('@/assets/images/avatar-jana.png')}
            className="w-8 h-8 rounded-full"
          />
        </HStack>
      </VStack>
    ),
  },
  {
    id: 3,
    description: (
      <>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: '#30352D' }}>
          Manage your tasks and build your
        </Text>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: '#30352D' }}>
          Inner circle of taskers.
        </Text>
      </>
    ),
    content: (
      <VStack className="gap-4 mt-12">
        {/* Task Card 1 - Help move my bags */}
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <HStack className="justify-between">
            <VStack className="flex-1">
              <Text className="text-[12px] font-worksans-medium text-theme-font mb-1">Help move my bags</Text>
              <Text className="text-[10px] font-worksans-light text-gray-600 mb-0.5">
                📍 St John&apos;s Wood, Greater London, NW8 9
              </Text>
              <Text className="text-[10px] font-worksans-light text-gray-600 mb-1">📅 Today</Text>
              <Text className="text-[10px] font-worksans-medium text-clay-orange">Open</Text>
            </VStack>
            <VStack className="items-end justify-between">
              <Text className="text-[14px] font-worksans-semibold text-theme-font">£50</Text>
              <Image
                source={require('@/assets/images/avatar-lukas.png')}
                className="w-8 h-8 rounded-full"
              />
            </VStack>
          </HStack>
        </View>

        {/* Task Card 2 - Carpet fitted */}
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <HStack className="justify-between">
            <VStack className="flex-1">
              <Text className="text-[12px] font-worksans-medium text-theme-font mb-1">Carpet fitted</Text>
              <Text className="text-[10px] font-worksans-light text-gray-600 mb-0.5">
                📍 Redbridge, Wanstead E11 3DF
              </Text>
              <Text className="text-[10px] font-worksans-light text-gray-600 mb-1">📋 Flexible</Text>
              <Text className="text-[10px] font-worksans-medium text-clay-orange">Open</Text>
            </VStack>
            <VStack className="items-end justify-between">
              <Text className="text-[14px] font-worksans-semibold text-theme-font">£150</Text>
              <Image
                source={require('@/assets/images/avatar-jana.png')}
                className="w-8 h-8 rounded-full"
              />
            </VStack>
          </HStack>
        </View>

        {/* Task Card 3 - Recliner mechanism broken */}
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <HStack className="justify-between">
            <VStack className="flex-1">
              <Text className="text-[12px] font-worksans-medium text-theme-font mb-1">Recliner mechanism broken</Text>
              <Text className="text-[10px] font-worksans-light text-gray-600 mb-0.5">
                📍 Woolwich, SE 18
              </Text>
              <Text className="text-[10px] font-worksans-light text-gray-600 mb-1">🗓️ On Thu, 4 Sep</Text>
              <Text className="text-[10px] font-worksans-medium text-clay-orange">Open</Text>
            </VStack>
            <VStack className="items-end justify-between">
              <Text className="text-[14px] font-worksans-semibold text-theme-font">£100</Text>
              <Image
                source={require('@/assets/images/avatar-lukas.png')}
                className="w-8 h-8 rounded-full"
              />
            </VStack>
          </HStack>
        </View>
      </VStack>
    ),
  },
];

export default function ClientOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const totalSteps = onboardingData.length;

  const handleSkip = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      router.push('/(auth)/(client)/terms-and-privacy');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.push('/(auth)/(client)/terms-and-privacy');
    }
  };

  const handleGotIt = async (): Promise<void> => {
    if (currentStep < totalSteps - 1) {
      // Go to next screen
      const nextIndex = currentStep + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentStep(nextIndex);
    } else {
      // Last screen, save onboarding completion and go to terms and privacy
      try {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
        router.push('/(auth)/(client)/terms-and-privacy');
      } catch (error) {
        console.error('Error saving onboarding status:', error);
        router.push('/(auth)/(client)/terms-and-privacy');
      }
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setCurrentStep(index);
  };

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => (
    <View style={{ width: SCREEN_WIDTH }}>
      <VStack className="flex-1 items-start px-6" style={{ paddingTop: 120 }}>
        {/* Title (for first slide only) */}
        {item.title && (
          <VStack className="items-start mb-6">
            {item.title}
          </VStack>
        )}

        {/* Description */}
        <VStack className="items-start mb-4">
          {item.description}
        </VStack>

        {/* Additional Content (cards, chat, etc.) */}
        {item.content}
      </VStack>
    </View>
  );

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView className="flex-1" edges={['bottom']}>
        <VStack className="flex-1">
          {/* Background Decorative Shapes Layer */}
          <View className="absolute w-full h-full overflow-hidden">
            {/* Top Left Sage Green Shape - Rectangle 92 (rotated) */}
            <View className="absolute -top-[100px] -left-[200px] w-[434px] h-[300px]" style={{ transform: [{ rotate: '302deg' }] }}>
              <Svg width="434" height="300" viewBox="0 0 435 301" fill="none">
                <Path d="M434.023 0H0V300.393H434.023V0Z" fill={COLORS.sageGreen} />
              </Svg>
            </View>

            {/* Center Large Beige Square - Path 108 (rotated) */}
            <View className="absolute top-[50px] left-[-60px] w-[421px] h-[426px]" style={{ transform: [{ rotate: '327deg' }] }}>
              <Svg width="421" height="426" viewBox="0 0 422 427" fill="none">
                <Path d="M0 13.6505L421.099 0V426.201L68.6965 351.575L0 13.6505Z" fill={COLORS.themeBackground} />
              </Svg>
            </View>

            {/* Top Right Brown/Taupe Shape - Path 107 (rotated) */}
            <View className="absolute -top-[140px] -right-[340px] w-[584px] h-[393px]" style={{ transform: [{ rotate: '341deg' }] }}>
              <Svg width="584" height="393" viewBox="0 0 584 393" fill="none">
                <Path d="M0 102.254L583.814 0V300.393L183.748 392.49L0 102.254Z" fill={COLORS.warmTaupe} />
              </Svg>
            </View>

            {/* Bottom Right Terracotta Shape - Path 109 (rotated) */}
            <View className="absolute -bottom-[240px] -right-[210px] w-[435px] h-[346px]" style={{ transform: [{ rotate: '302deg' }] }}>
              <Svg width="435" height="346" viewBox="0 0 435 346" fill="none">
                <Path d="M10 0L434.023 44.742V345.135H0L10 0Z" fill={COLORS.clayOrange} />
              </Svg>
            </View>
          </View>

          {/* Skip Button - positioned on top right */}
          <Box className="absolute top-[40px] right-[24px] z-20">
            <Pressable onPress={handleSkip}>
              <Text className="text-[14px] font-worksans-medium text-white">
                Skip
              </Text>
            </Pressable>
          </Box>

          {/* Main Content - Swipeable */}
          <FlatList
            ref={flatListRef}
            data={onboardingData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className="flex-1 z-10"
          />

          {/* Bottom Section */}
          <Box className="px-6 pb-8 z-20">
            <HStack className="justify-between items-center">
              {/* Pagination Dots */}
              <HStack className="gap-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: 6.5,
                      backgroundColor: index === currentStep ? '#D9896C' : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: '#30352D'
                    }}
                  />
                ))}
              </HStack>

              {/* Got it Button */}
              <Pressable onPress={handleGotIt}>
                <HStack className="items-center gap-1">
                  <Text className="text-[18px] font-worksans-medium text-sage-green">
                    Got it
                  </Text>
                  <ChevronRight size={18} color={COLORS.sageGreen} />
                </HStack>
              </Pressable>
            </HStack>
          </Box>
        </VStack>
      </SafeAreaView>
    </Box>
  );
}