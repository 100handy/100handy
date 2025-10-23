import React from 'react';
import { ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeft } from 'lucide-react-native';

export default function BusinessPhotosScreen() {
  const handleGoToSkillsRates = () => {
    // Navigate to Skills & Rates screen
    console.log('Navigate to Skills & Rates');
  };

  const handleLearnMore = () => {
    // Open photo policy link
    const policyUrl = 'https://example.com/photo-policy'; // Replace with actual URL
    Linking.openURL(policyUrl).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <HStack className="items-center px-5 py-4">
        <Pressable onPress={() => {/* Navigate back */}}>
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text 
          className="flex-1 text-center text-lg font-semibold text-[#333A31] pr-6" 
          style={{ fontFamily: 'WorkSans_600SemiBold' }}
        >
          Business Photos
        </Text>
      </HStack>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <VStack className="px-5 py-6 gap-6">
          {/* Empty State */}
          <VStack className="gap-4 items-center py-8">
            {/* Title */}
            <Text 
              className="text-lg font-semibold text-[#333A31] text-center" 
              style={{ fontFamily: 'WorkSans_600SemiBold' }}
            >
              You have no skills added
            </Text>

            {/* Description */}
            <Text 
              className="text-sm text-[#666666] leading-5 text-center px-4" 
              style={{ fontFamily: 'WorkSans_400Regular' }}
            >
              Go to your Skills & Rates and add your skills. You Can then come back here to upload your business Photos.
            </Text>

            {/* Go to Skills & Rates Link */}
            <Pressable 
              onPress={handleGoToSkillsRates}
              className="mt-2"
            >
              <Text 
                className="text-base font-medium text-[#D17852]" 
                style={{ fontFamily: 'WorkSans_500Medium' }}
              >
                Go Skills & Rates
              </Text>
            </Pressable>

            {/* Policy Link */}
            <VStack className="mt-4 items-center">
              <HStack className="flex-wrap justify-center">
                <Text 
                  className="text-sm text-[#666666]" 
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  Learn more about our accepted photo policy{' '}
                </Text>
                <Pressable onPress={handleLearnMore}>
                  <Text 
                    className="text-sm text-[#D17852]" 
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    here
                  </Text>
                </Pressable>
                <Text 
                  className="text-sm text-[#666666]" 
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  .
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}