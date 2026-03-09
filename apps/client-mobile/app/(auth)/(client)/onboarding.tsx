import React, { useState, useRef, type ReactNode } from 'react';
import { View, Text, Pressable, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, MapPin, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import StarRating from '@/assets/images/star-rating.svg';
import Logo100Top from '@/assets/images/logo-100-top.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore, usePendingBookingStore, useLocationStore, supabase } from '@shared/supabase';
import { STORAGE_KEYS } from '@/lib/storage-keys';

const CLIENT_ONBOARDING_COMPLETED_KEY_PREFIX = '@clientOnboardingCompleted:';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const GEOMETRIC_HEIGHT = SCREEN_HEIGHT * 0.42; // Top section for geometric shapes
const BOTTOM_NAV_HEIGHT = 80; // Approximate height for pagination + safe area
const CONTENT_HEIGHT = SCREEN_HEIGHT - GEOMETRIC_HEIGHT - BOTTOM_NAV_HEIGHT;

// Colors from tailwind.config.js and Figma design
const COLORS = {
  sageGreen: '#A3B899',
  sageGreenFigma: '#A0B194', // Exact color from Figma for "Got it" button
  clayOrange: '#D9896C',
  chatBubbleUser: '#C9886D', // Figma reddish-brown for user chat messages
  warmTaupe: '#BFA28D',
  themeBackground: '#F6E4D8',
  themeFont: '#30352D',
  cardBg: '#F7F1EC',
};

// Onboarding content data
const onboardingData = [
  {
    id: 0,
    description: (
      <>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: COLORS.themeFont }}>
          Help with everyday
        </Text>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: COLORS.themeFont }}>
          Life at your fingertips.
        </Text>
      </>
    ),
  },
  {
    id: 1,
    description: (
      <>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: COLORS.themeFont }}>
          See reviews prices
        </Text>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: COLORS.themeFont }}>
          of 140,000+
        </Text>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: COLORS.themeFont }}>
          background
        </Text>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: COLORS.themeFont }}>
          checked Taskers.
        </Text>
      </>
    ),
    content: (
      <View className="flex-col gap-4 mt-12">
        {/* Review Card 1 - Lukas Ernest */}
        <View className="bg-[#F7F1EC] rounded-2xl p-4 shadow-sm">
          <View className="flex-row items-center gap-3">
            <Image
              source={require('@/assets/images/avatar-lukas.png')}
              className="w-10 h-10 rounded-full"
            />
            <View className="flex-col flex-1">
              <Text className="text-[10px] font-worksans-medium" style={{ color: COLORS.themeFont }}>Lukas Ernest</Text>
              <Text className="text-[8px] font-worksans-medium mb-1" style={{ color: COLORS.themeFont }}>140 Handyman Task</Text>
              <StarRating width={114} height={16} />
            </View>
          </View>
        </View>

        {/* Review Card 2 - Jana Rado */}
        <View className="bg-[#F7F1EC] rounded-2xl p-4 shadow-sm">
          <View className="flex-row items-center gap-3">
            <Image
              source={require('@/assets/images/avatar-jana.png')}
              className="w-10 h-10 rounded-full"
            />
            <View className="flex-col flex-1">
              <Text className="text-[10px] font-worksans-medium" style={{ color: COLORS.themeFont }}>Jana Rado</Text>
              <Text className="text-[8px] font-worksans-medium mb-1" style={{ color: COLORS.themeFont }}>45 Delivery Tasks</Text>
              <StarRating width={114} height={16} />
            </View>
          </View>
        </View>
      </View>
    ),
  },
  {
    id: 2,
    description: (
      <>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: COLORS.themeFont }}>
          Chat with your Tasker to schedule
        </Text>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: COLORS.themeFont }}>
          The job and get it done.
        </Text>
      </>
    ),
    content: (
      <View className="flex-col gap-4 mt-12">
        {/* Chat Message 1 - Right aligned */}
        <View className="flex-row justify-end">
          <View className="flex-col bg-white rounded-2xl px-4 py-3 max-w-[50%] shadow-sm">
            <Text className="text-[13px] font-worksans-medium mb-1" style={{ color: COLORS.themeFont }}>Hi there!</Text>
            <Text className="text-[10px] font-worksans-medium" style={{ color: COLORS.themeFont }}>11:00am</Text>
          </View>
        </View>

        {/* Chat Message 2 with Avatar - Left aligned */}
        <View className="flex-row items-end gap-2">
          <Image
            source={require('@/assets/images/avatar-lukas.png')}
            className="w-10 h-10 rounded-full"
          />
          <View className="flex-col bg-white rounded-2xl px-4 py-3 max-w-[65%] shadow-sm">
            <Text className="text-[13px] font-worksans-medium" style={{ color: COLORS.themeFont }}>
              I&apos;ve got all the tools for the{'\n'}Job. Does 3 pm still work{'\n'}for you?
            </Text>
          </View>
        </View>

        {/* Chat Message 3 - Right aligned with avatar */}
        <View className="flex-row justify-end items-end gap-2">
          <View className="flex-col rounded-2xl px-4 py-3 max-w-[60%] shadow-sm" style={{ backgroundColor: COLORS.chatBubbleUser }}>
            <Text className="text-[13px] font-worksans-medium text-white mb-1">
              Yes, that&apos;s great{'\n'}See you soon!
            </Text>
            <Text className="text-[10px] font-worksans-medium text-white/90">11:00am</Text>
          </View>
          <Image
            source={require('@/assets/images/avatar-jana.png')}
            className="w-10 h-10 rounded-full"
          />
        </View>
      </View>
    ),
  },
  {
    id: 3,
    description: (
      <>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: COLORS.themeFont }}>
          Manage your tasks and build your
        </Text>
        <Text className="text-[23px] leading-[28px] font-worksans-light" style={{ color: COLORS.themeFont }}>
          Inner circle of taskers.
        </Text>
      </>
    ),
    content: (
      <View className="flex-col gap-4 mt-12">
        {/* Task Card 1 - Help move my bags (opacity 0.43 per Figma) */}
        <View className="bg-white rounded-2xl p-4 shadow-sm" style={{ opacity: 0.43 }}>
          <View className="flex-row justify-between">
            <View className="flex-col flex-1">
              <Text className="text-[8px] font-worksans-medium mb-1" style={{ color: COLORS.themeFont }}>Help move my bags</Text>
              <View className="flex-row items-center gap-1 mb-0.5">
                <MapPin size={14} color={COLORS.themeFont} strokeWidth={1.5} />
                <Text className="text-[5px] font-worksans-medium" style={{ color: COLORS.themeFont }}>
                  St John&apos;s Wood, Greater London, NW8 9
                </Text>
              </View>
              <View className="flex-row items-center gap-1 mb-1">
                <Calendar size={14} color={COLORS.themeFont} strokeWidth={1.5} />
                <Text className="text-[5px] font-worksans-medium" style={{ color: COLORS.themeFont }}>Today</Text>
              </View>
              <Text className="text-[9px] font-worksans-medium" style={{ color: '#C1856A' }}>Open</Text>
            </View>
            <View className="flex-col items-end justify-between">
              <Text className="text-[10px] font-worksans-bold" style={{ color: COLORS.themeFont }}>£50</Text>
              <Image
                source={require('@/assets/images/avatar-lukas.png')}
                className="w-[21px] h-[21px] rounded-full"
              />
            </View>
          </View>
        </View>

        {/* Task Card 2 - Carpet fitted */}
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <View className="flex-row justify-between">
            <View className="flex-col flex-1">
              <Text className="text-[8px] font-worksans-medium mb-1" style={{ color: COLORS.themeFont }}>Carpet fitted</Text>
              <View className="flex-row items-center gap-1 mb-0.5">
                <MapPin size={14} color={COLORS.themeFont} strokeWidth={1.5} />
                <Text className="text-[5px] font-worksans-medium" style={{ color: COLORS.themeFont }}>
                  Redbridge, Wanstead E11 3DF
                </Text>
              </View>
              <View className="flex-row items-center gap-1 mb-1">
                <Calendar size={14} color={COLORS.themeFont} strokeWidth={1.5} />
                <Text className="text-[5px] font-worksans-medium" style={{ color: COLORS.themeFont }}>Flexible</Text>
              </View>
              <Text className="text-[9px] font-worksans-medium" style={{ color: '#C1856A' }}>Open</Text>
            </View>
            <View className="flex-col items-end justify-between">
              <Text className="text-[8px] font-worksans-bold" style={{ color: COLORS.themeFont }}>£150</Text>
              <Image
                source={require('@/assets/images/avatar-jana.png')}
                className="w-[21px] h-[21px] rounded-full"
              />
            </View>
          </View>
        </View>

        {/* Task Card 3 - Recliner mechanism broken (opacity 0.43 per Figma) */}
        <View className="bg-white rounded-2xl p-4 shadow-sm" style={{ opacity: 0.43 }}>
          <View className="flex-row justify-between">
            <View className="flex-col flex-1">
              <Text className="text-[8px] font-worksans-medium mb-1" style={{ color: COLORS.themeFont }}>
                Recliner mechanism broken
              </Text>
              <View className="flex-row items-center gap-1 mb-0.5">
                <MapPin size={14} color={COLORS.themeFont} strokeWidth={1.5} />
                <Text className="text-[5px] font-worksans-medium" style={{ color: COLORS.themeFont }}>
                  Woolwich, SE 18
                </Text>
              </View>
              <View className="flex-row items-center gap-1 mb-1">
                <Calendar size={14} color={COLORS.themeFont} strokeWidth={1.5} />
                <Text className="text-[5px] font-worksans-medium" style={{ color: COLORS.themeFont }}>On Thu, 4 Sep</Text>
              </View>
              <Text className="text-[9px] font-worksans-medium" style={{ color: '#C1856A' }}>Open</Text>
            </View>
            <View className="flex-col items-end justify-between">
              <Text className="text-[8px] font-worksans-bold" style={{ color: COLORS.themeFont }}>£100</Text>
              <Image
                source={require('@/assets/images/avatar-lukas.png')}
                className="w-[21px] h-[22px] rounded-full"
              />
            </View>
          </View>
        </View>
      </View>
    ),
  },
];

export default function ClientOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const totalSteps = onboardingData.length;
  const { isAuthenticated, updateOnboardingStatus, user } = useAuthStore();
  const { getPendingBooking, hasRestorablePendingBooking, markPendingBookingRestored } = usePendingBookingStore();
  const { setLocation } = useLocationStore();

  // Check for pending booking and navigate there instead of home
  const checkAndRestorePendingBooking = (): boolean => {
    if (!hasRestorablePendingBooking()) {
      return false;
    }

    const pendingBooking = getPendingBooking();
    if (pendingBooking) {
      // Restore the location from pending booking
      setLocation(pendingBooking.location);

      // Keep the restored draft until the user confirms or explicitly discards it.
      markPendingBookingRestored();

      // Navigate to confirm booking with all the saved data
      router.replace({
        pathname: '/(client)/confirm-booking',
        params: {
          taskerId: pendingBooking.tasker.id,
          categoryId: pendingBooking.categoryId,
          categoryName: pendingBooking.categoryName,
          selectedDate: pendingBooking.selectedDate,
          selectedTime: pendingBooking.selectedTime,
          formResponses: JSON.stringify(pendingBooking.formResponses),
          selectedFrequency: pendingBooking.frequency ?? 'once',
        },
      });
      return true;
    }
    return false;
  };

  const completeOnboarding = async (): Promise<void> => {
    try {
      // Save to AsyncStorage for future app launches
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, 'true');
      if (user?.id) {
        await AsyncStorage.setItem(`${CLIENT_ONBOARDING_COMPLETED_KEY_PREFIX}${user.id}`, 'true');
      }

      // If user is already authenticated, update their metadata
      if (isAuthenticated) {
        const { error } = await supabase.auth.updateUser({
          data: { onboarding_completed: true }
        });

        if (error) {
          console.error('[Onboarding] Error updating user metadata:', error);
        } else {
          // Update the auth store state after the server confirms the write.
          updateOnboardingStatus(true);
        }

        // Even if the metadata write fails transiently, keep the current session
        // from being forced back through onboarding on the next cold start.
        updateOnboardingStatus(true);

        // Check for pending booking first
        const hasPendingBooking = checkAndRestorePendingBooking();
        if (!hasPendingBooking) {
          // No pending booking, navigate to home screen
          router.replace('/(client)/(tabs)/home');
        }
      } else {
        // User not authenticated, go to terms and privacy screen
        router.push('/(auth)/(client)/terms-and-privacy');
      }
    } catch (error) {
      console.error('[Onboarding] Error completing onboarding:', error);
      // Fallback navigation
      if (isAuthenticated) {
        // Check for pending booking first
        const hasPendingBooking = checkAndRestorePendingBooking();
        if (!hasPendingBooking) {
          router.replace('/(client)/(tabs)/home');
        }
      } else {
        router.push('/(auth)/(client)/terms-and-privacy');
      }
    }
  };

  const handleSkip = async (): Promise<void> => {
    await completeOnboarding();
  };

  const handleGotIt = async (): Promise<void> => {
    if (currentStep < totalSteps - 1) {
      // Go to next screen
      const nextIndex = currentStep + 1;
      scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH * nextIndex, animated: true });
      setCurrentStep(nextIndex);
    } else {
      // Last screen, complete onboarding
      await completeOnboarding();
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    if (index !== currentStep) {
      setCurrentStep(index);
    }
  };

  const renderLogo = (): ReactNode => {
    return (
      <View className="mb-8" style={{ marginLeft: SCREEN_WIDTH * 0.0585 }}>
        {/* @ts-ignore - SVG component type inference issue with react-native-svg-transformer */}
        <Logo100Top width={200} height={96} />
      </View>
    ) as ReactNode;
  };

  const renderSlide = (item: typeof onboardingData[number]) => (
    <View key={item.id} style={{ width: SCREEN_WIDTH, height: CONTENT_HEIGHT }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
        {/* Logo (for first slide only) */}
        {item.id === 0 ? renderLogo() : null}

        {/* Description */}
        <View style={{ marginLeft: SCREEN_WIDTH * 0.0585, marginBottom: 16 }}>
          {item.description}
        </View>

        {/* Additional Content (cards, chat, etc.) */}
        {'content' in item && item.content}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Top Section - Geometric Shapes (fixed height) */}
      <View style={{ height: GEOMETRIC_HEIGHT, overflow: 'hidden', position: 'relative' }}>
        {/* Top Left Sage Green Shape - Rectangle 92 (rotated) */}
        <View className="absolute" style={{ top: -80, left: -180, width: 434, height: 300, transform: [{ rotate: '302deg' }] }}>
          <Svg width="434" height="300" viewBox="0 0 435 301" fill="none">
            <Path d="M434.023 0H0V300.393H434.023V0Z" fill={COLORS.sageGreen} />
          </Svg>
        </View>

        {/* Center Large Beige Square - Path 108 (rotated) */}
        <View className="absolute" style={{ top: 30, left: -40, width: 421, height: 426, transform: [{ rotate: '327deg' }] }}>
          <Svg width="421" height="426" viewBox="0 0 422 427" fill="none">
            <Path d="M0 13.6505L421.099 0V426.201L68.6965 351.575L0 13.6505Z" fill={COLORS.themeBackground} />
          </Svg>
        </View>

        {/* Top Right Brown/Taupe Shape - Path 107 (rotated) */}
        <View className="absolute" style={{ top: -120, right: -320, width: 584, height: 393, transform: [{ rotate: '341deg' }] }}>
          <Svg width="584" height="393" viewBox="0 0 584 393" fill="none">
            <Path d="M0 102.254L583.814 0V300.393L183.748 392.49L0 102.254Z" fill={COLORS.warmTaupe} />
          </Svg>
        </View>

        {/* Bottom Right Terracotta Shape - Path 109 (rotated) */}
        <View className="absolute" style={{ bottom: -180, right: -180, width: 435, height: 346, transform: [{ rotate: '302deg' }] }}>
          <Svg width="435" height="346" viewBox="0 0 435 346" fill="none">
            <Path d="M10 0L434.023 44.742V345.135H0L10 0Z" fill={COLORS.clayOrange} />
          </Svg>
        </View>

        {/* Skip Button - positioned on top right within geometric area */}
        <SafeAreaView className="absolute top-0 right-0" edges={['top']}>
          <Pressable onPress={handleSkip} className="px-6 py-4">
            <Text className="text-[14px] font-worksans-medium text-white">
              Skip
            </Text>
          </Pressable>
        </SafeAreaView>
      </View>

      {/* Bottom Section - White background with content */}
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {/* Main Content - Swipeable */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {onboardingData.map((item) => renderSlide(item))}
        </ScrollView>

        {/* Bottom Navigation */}
        <SafeAreaView edges={['bottom']}>
          <View className="px-6 pb-6">
            <View className="flex-row justify-between items-center">
              {/* Pagination Dots */}
              <View className="flex-row gap-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: 6.5,
                      backgroundColor: index === currentStep ? '#D9896C' : 'transparent',
                      borderWidth: 1,
                      borderColor: '#30352D'
                    }}
                  />
                ))}
              </View>

              {/* Got it Button */}
              <Pressable onPress={handleGotIt}>
                <View className="flex-row items-center gap-1">
                  <Text className="text-[18px] font-worksans-medium" style={{ color: COLORS.sageGreenFigma }}>
                    Got it
                  </Text>
                  <ChevronRight size={18} color={COLORS.sageGreenFigma} />
                </View>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}
