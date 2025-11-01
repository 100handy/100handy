import React, { useState, useRef } from 'react';
import { View, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { X, ChevronRight, Image as ImageIcon, CheckCircle2 } from 'lucide-react-native';
import Svg, { Path, Circle } from 'react-native-svg';

// Custom icon: House/Mailbox with arrow (based on Figma design)
function HouseMailboxIcon({ size = 90, color = "#A0B194" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 90 90" fill="none">
      {/* Circle background */}
      <Circle
        cx="45"
        cy="45"
        r="45"
        fill="#3D4239"
      />
      {/* House shape - simplified version matching Figma Path 196 */}
      <Path
        d="M45 25L30 35V55H60V35L45 25Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Mailbox/Arrow detail - simplified version matching Figma Path 197 */}
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

const welcomeScreens = [
  {
    id: 0,
    icon: <HouseMailboxIcon size={90} color="#A0B194" />,
    title: 'Welcome to your Analytics!',
    body: (
      <>
        <Text className="text-[#F3E3D3] text-[14px] leading-[17px] text-center px-4">
          We've heard your feedback and made some big updates. Give a warm welcome to{' '}
          <Text className="text-[#A0B194] font-bold">Tasker Analytics</Text>!
        </Text>
      </>
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
        <VStack className="gap-3">
          <HStack className="items-start gap-3">
            <Text className="text-[#B8926A] text-lg mt-0.5">•</Text>
            <Text className="text-white text-base flex-1 text-left">
              Show your business's potential.
            </Text>
          </HStack>
          <HStack className="items-start gap-3">
            <Text className="text-[#B8926A] text-lg mt-0.5">•</Text>
            <Text className="text-white text-base flex-1 text-left">
              Give you a snapshot of how you stack up against other Taskers.
            </Text>
          </HStack>
          <HStack className="items-start gap-3">
            <Text className="text-[#B8926A] text-lg mt-0.5">•</Text>
            <Text className="text-white text-base flex-1 text-left">
              Allow you insight into your performance and give tips on helping you achieve your goals.
            </Text>
          </HStack>
        </VStack>
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
        <VStack className="gap-3">
          <HStack className="items-start gap-3">
            <Text className="text-[#B8926A] text-lg mt-0.5">•</Text>
            <Text className="text-white text-base flex-1 text-left">
              Learn how to level up
            </Text>
          </HStack>
          <HStack className="items-start gap-3">
            <Text className="text-[#B8926A] text-lg mt-0.5">•</Text>
            <Text className="text-white text-base flex-1 text-left">
              See where you place among your peers
            </Text>
          </HStack>
          <HStack className="items-start gap-3">
            <Text className="text-[#B8926A] text-lg mt-0.5">•</Text>
            <Text className="text-white text-base flex-1 text-left">
              Keep a better pulse on your business
            </Text>
          </HStack>
        </VStack>
      </>
    ),
  },
  {
    id: 3,
    icon: <ImageIcon size={90} color="#A0B194" strokeWidth={1.5} />,
    title: "What should I keep in mind for business photos?",
    showCloseButton: true,
    content: (
      <>
        <VStack className="gap-4">
          <HStack className="items-start gap-3">
            <CheckCircle2 size={20} color="#A0B194" strokeWidth={2} />
            <Text className="text-[#F3E3D3] text-[14px] leading-[17px] flex-1 text-left">
              Include well-lit photos that show off work you're proud of.
            </Text>
          </HStack>
          <HStack className="items-start gap-3">
            <CheckCircle2 size={20} color="#A0B194" strokeWidth={2} />
            <Text className="text-[#F3E3D3] text-[14px] leading-[17px] flex-1 text-left">
              Make sure you have your Client's permission before taking photos inside their home.
            </Text>
          </HStack>
          <HStack className="items-start gap-3">
            <CheckCircle2 size={20} color="#A0B194" strokeWidth={2} />
            <Text className="text-[#F3E3D3] text-[14px] leading-[17px] flex-1 text-left">
              Don't include any images that include other people.
            </Text>
          </HStack>
          <HStack className="items-start gap-3">
            <CheckCircle2 size={20} color="#A0B194" strokeWidth={2} />
            <Text className="text-[#F3E3D3] text-[14px] leading-[17px] flex-1 text-left">
              Don't share images with personal information or inappropriate content.
            </Text>
          </HStack>
        </VStack>
        <Text className="text-[#F3E3D3] text-[14px] leading-[17px] text-center mt-6">
          Learn more about our accepted photo policy here.
        </Text>
      </>
    ),
  },
];

export default function AnalyticsWelcome({ onComplete, onSkip }: AnalyticsWelcomeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Auto-advance timer for first 3 screens (analytics intro)
  React.useEffect(() => {
    // Only auto-advance for screens 0, 1, 2 (first 3 screens)
    if (currentStep < 3) {
      const timer = setTimeout(() => {
        const nextStep = currentStep + 1;
        flatListRef.current?.scrollToIndex({ index: nextStep, animated: true });
        setCurrentStep(nextStep);
      }, 3000); // 3 seconds per screen

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < welcomeScreens.length - 1) {
      const nextStep = currentStep + 1;
      flatListRef.current?.scrollToIndex({ index: nextStep, animated: true });
      setCurrentStep(nextStep);
    } else {
      onComplete();
    }
  };

  const handleGotIt = () => {
    onComplete();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setCurrentStep(index);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  const renderItem = ({ item }: { item: typeof welcomeScreens[0] }) => (
    <View style={{ width: SCREEN_WIDTH }}>
      <SafeAreaView className="flex-1" edges={['top']}>
        <Box className="flex-1 bg-[#4A5347]">
          {/* Close/Skip button - only show if explicitly set to true */}
          {item.showCloseButton === true && (
            <HStack className="items-center justify-end pt-4 pr-6">
              <Pressable onPress={handleSkip}>
                <X size={24} color="white" />
              </Pressable>
            </HStack>
          )}

          <VStack className="flex-1 justify-between px-6 pb-8">
            {/* Main Content */}
            <VStack className="flex-1 justify-center">
              {/* Icon (for first and fourth screens) */}
              {item.icon && (
                <VStack className="items-center mb-6">
                  {item.id === 0 ? (
                    // First screen icon has built-in circular background
                    item.icon
                  ) : item.id === 3 ? (
                    // Fourth screen icon needs circular background wrapper
                    <Box className="w-[90px] h-[90px] rounded-full bg-[#3D4239] items-center justify-center">
                      {item.icon}
                    </Box>
                  ) : null}
                </VStack>
              )}

              {/* Title */}
              {item.title && (
                <Text className="text-white text-[18px] font-bold text-center mb-6">
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
              <VStack className="flex-1">
                {item.body || item.content}
              </VStack>
            </VStack>

            {/* Navigation Dots and Button */}
            <VStack className="items-center gap-6 mt-8">
              {/* Only show navigation dots for first 3 screens */}
              {currentStep < 3 && (
                <HStack className="gap-2">
                  {[0, 1, 2].map((index) => (
                    <Box
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep ? 'bg-[#B8926A]' : 'bg-white opacity-30'
                      }`}
                    />
                  ))}
                </HStack>
              )}

              {/* Only show "Got it" button on the last screen */}
              {currentStep === 3 && (
                <Pressable
                  onPress={handleGotIt}
                  className="bg-[#B8926A] rounded-full px-8 py-4"
                >
                  <Text className="text-white text-lg font-bold">
                    Got it
                  </Text>
                </Pressable>
              )}
            </VStack>
          </VStack>
        </Box>
      </SafeAreaView>
    </View>
  );

  return (
    <Box className="flex-1">
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
    </Box>
  );
}

