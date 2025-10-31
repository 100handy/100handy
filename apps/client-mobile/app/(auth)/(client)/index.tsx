import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ClientWelcome() {
  const handleGetStarted = (): void => {
    router.push('/(auth)/(client)/onboarding');
  };

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <VStack className="flex-1 justify-between">
          {/* Main Content - Centered Logo */}
          <VStack className="flex-1 items-center justify-center">
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
          </VStack>

          {/* Get Started Link - Bottom Right */}
          <Box className="px-6 pb-8">
            <Pressable onPress={handleGetStarted}>
              <HStack className="items-center justify-end gap-1">
                <Text className="text-[18px] font-worksans-medium" style={{ color: '#A0B194' }}>
                  Get started
                </Text>
                <ChevronRight size={18} color="#A0B194" />
              </HStack>
            </Pressable>
          </Box>
        </VStack>
      </SafeAreaView>
    </Box>
  );
}
