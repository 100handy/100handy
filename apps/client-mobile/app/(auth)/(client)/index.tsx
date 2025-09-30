import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import Logo100Top from '@/assets/images/logo-100-top.svg';
import Logo100Bottom from '@/assets/images/logo-100-bottom.svg';

export default function ClientWelcome() {
  const handleBack = (): void => {
    router.back();
  };

  const handleGetStarted = (): void => {
    router.push('/(auth)/(client)/onboarding');
  };

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <VStack className="flex-1">
            {/* Back Button */}
            <Box className="px-5 pt-2 pb-6">
              <Pressable onPress={handleBack}>
                <ChevronLeft size={24} color="#333A31" />
              </Pressable>
            </Box>

            {/* Logo Section */}
            <VStack className="flex-1 items-center justify-center px-8">
              {/* Top Logo Part - "100" */}
              <Box className="mb-2">
                <Logo100Top width={320} height={180} />
              </Box>

              {/* Bottom Logo Part - "HANDY" */}
              <Box>
                <Logo100Bottom width={320} height={180} />
              </Box>
            </VStack>

            {/* Get Started Link */}
            <Box className="px-6 pb-8">
              <Pressable onPress={handleGetStarted}>
                <HStack className="items-center justify-center gap-1">
                  <Text className="text-[18px] font-worksans-medium" style={{ color: '#A0B194' }}>
                    Get started
                  </Text>
                  <ChevronRight size={18} color="#A0B194" />
                </HStack>
              </Pressable>
            </Box>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
}
