import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import Svg, { Path, Circle } from 'react-native-svg';

// Custom icon: House/Mailbox with arrow (based on Figma design)
function HouseMailboxIcon({ size = 90, color = "#A0B194" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 90 90" fill="none">
      <Circle cx="45" cy="45" r="45" fill="#3D4239" />
      <Path
        d="M45 25L30 35V55H60V35L45 25Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M50 45L55 40M55 40L50 35M55 40L65 40"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnalyticsWelcomeProps {
  onComplete: () => void;
  onSkip?: () => void;
}

interface WelcomeScreen {
  id: number;
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  body?: React.ReactNode;
  content?: React.ReactNode;
}

const welcomeScreens: WelcomeScreen[] = [
  {
    id: 0,
    icon: <HouseMailboxIcon size={90} color="#A0B194" />,
    title: 'Welcome to your Analytics!',
    body: (
      <Text className="text-[#F3E3D3] text-[14px] leading-[17px] text-center px-4">
        We've heard your feedback and made some big updates. Give a warm welcome to{' '}
        <Text className="text-[#A0B194] font-bold">Tasker Analytics</Text>!
      </Text>
    ),
  },
  {
    id: 1,
    title: "Let's get you up to speed!",
    subtitle: 'What are Analytics?',
    content: (
      <>
        <Text className="text-white text-base leading-6 mb-6 text-left">
          We've put together a brand new set of business data designed to help you see how you're performing as a Tasker based on local demand.
        </Text>
        <Text className="text-white text-base font-bold mb-4 text-left">
          These data points work together to:
        </Text>
        <View className="gap-3 flex-col">
          <View className="items-start gap-3 flex-row">
            <Text className="text-brand-taupe text-lg mt-0.5">•</Text>
            <Text className="text-white text-base flex-1 text-left">
              Show your business's potential.
            </Text>
          </View>
          <View className="items-start gap-3 flex-row">
            <Text className="text-brand-taupe text-lg mt-0.5">•</Text>
            <Text className="text-white text-base flex-1 text-left">
              Give you a snapshot of how you stack up against other Taskers.
            </Text>
          </View>
          <View className="items-start gap-3 flex-row">
            <Text className="text-brand-taupe text-lg mt-0.5">•</Text>
            <Text className="text-white text-base flex-1 text-left">
              Allow you insight into your performance and give tips on helping you achieve your goals.
            </Text>
          </View>
        </View>
      </>
    ),
  },
  {
    id: 2,
    title: "Let's get you up to speed!",
    subtitle: 'Why should I be excited?',
    content: (
      <>
        <Text className="text-white text-base leading-6 mb-6 text-left">
          We've designed these new Analytics with you in mind. Whether you task full time or part time, they're here to help you excel as a Tasker.
        </Text>
        <Text className="text-white text-base font-bold mb-4 text-left">
          With these new Analytics you can:
        </Text>
        <View className="gap-3 flex-col">
          <View className="items-start gap-3 flex-row">
            <Text className="text-brand-taupe text-lg mt-0.5">•</Text>
            <Text className="text-white text-base flex-1 text-left">
              Learn how to level up
            </Text>
          </View>
          <View className="items-start gap-3 flex-row">
            <Text className="text-brand-taupe text-lg mt-0.5">•</Text>
            <Text className="text-white text-base flex-1 text-left">
              See where you place among your peers
            </Text>
          </View>
          <View className="items-start gap-3 flex-row">
            <Text className="text-brand-taupe text-lg mt-0.5">•</Text>
            <Text className="text-white text-base flex-1 text-left">
              Keep a better pulse on your business
            </Text>
          </View>
        </View>
      </>
    ),
  },
];

const LAST_SCREEN_INDEX = welcomeScreens.length - 1;

export default function AnalyticsWelcome({ onComplete, onSkip }: AnalyticsWelcomeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userHasSwiped, setUserHasSwiped] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Auto-advance only the first (splash) screen after 4 seconds, stop if user swiped
  React.useEffect(() => {
    if (currentStep === 0 && !userHasSwiped) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 1, animated: true });
        setCurrentStep(1);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, userHasSwiped]);

  const handleGotIt = () => {
    onComplete();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    if (index !== currentStep) {
      setUserHasSwiped(true);
    }
    setCurrentStep(index);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  const renderItem = ({ item }: { item: WelcomeScreen }) => {
    const isFirstScreen = item.id === 0;
    const isLastScreen = item.id === LAST_SCREEN_INDEX;

    return (
      <View style={{ width: SCREEN_WIDTH }}>
        <SafeAreaView className="flex-1" edges={['top']}>
          <View className="flex-1 bg-[#4A5347]">
            {/* Skip button - always visible */}
            <View className="items-center justify-end pt-4 pr-6 flex-row">
              <Pressable onPress={handleSkip} hitSlop={12}>
                <X size={24} color="white" />
              </Pressable>
            </View>

            <View className="flex-1 justify-between px-6 pb-8 flex-col">
              {/* Main Content */}
              <View className={`flex-1 flex-col ${isFirstScreen ? 'justify-center items-center' : 'pt-4'}`}>
                {/* Icon (first screen only) */}
                {item.icon && (
                  <View className="items-center mb-6 flex-col">
                    {item.icon}
                  </View>
                )}

                {/* Title */}
                {item.title && (
                  <Text className="text-white text-[18px] font-bold text-center mb-4">
                    {item.title}
                  </Text>
                )}

                {/* Subtitle */}
                {item.subtitle && (
                  <Text className="text-white text-xl font-bold text-center mb-6">
                    {item.subtitle}
                  </Text>
                )}

                {/* Body/Content */}
                {(item.body || item.content) && (
                  <View className="flex-col">
                    {item.body || item.content}
                  </View>
                )}
              </View>

              {/* Navigation Dots + Button */}
              <View className="items-center gap-6 mt-8 flex-col">
                {/* Navigation dots */}
                <View className="gap-2 flex-row">
                  {welcomeScreens.map((_, index) => (
                    <View
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep ? 'bg-brand-taupe' : 'bg-white opacity-30'
                      }`}
                    />
                  ))}
                </View>

                {/* "Got it" button on last screen */}
                {isLastScreen && (
                  <Pressable
                    onPress={handleGotIt}
                    className="bg-brand-taupe rounded-full px-8 py-4"
                  >
                    <Text className="text-white text-lg font-bold">
                      Got it
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <FlatList
        ref={flatListRef}
        data={welcomeScreens}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id.toString()}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />
    </View>
  );
}
