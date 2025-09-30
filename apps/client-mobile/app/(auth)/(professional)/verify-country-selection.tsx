import React, { useState } from 'react';
import { Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeft, ChevronDown, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { CancelVerificationModal } from '@/components/verification';

export default function VerifyCountrySelection() {
  const [selectedCountry, setSelectedCountry] = useState('United Kingdom');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleClose = (): void => {
    setShowCancelModal(true);
  };

  const handleBack = (): void => {
    router.back();
  };

  const handleResume = (): void => {
    setShowCancelModal(false);
  };

  const handleCancel = (): void => {
    setShowCancelModal(false);
    router.push('/(auth)/(professional)/sign-in');
  };

  const handleSelect = (): void => {
    router.push('/(auth)/(professional)/verify-document-type');
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
            {/* Header */}
            <HStack className="items-center justify-between px-4 pt-2 pb-6">
              <Pressable onPress={handleBack}>
                <ChevronLeft size={20} color="#30352D" />
              </Pressable>
              <Pressable onPress={handleClose}>
                <X size={20} color="#30352D" />
              </Pressable>
            </HStack>

            {/* Content */}
            <VStack className="flex-1 px-6">
              {/* Title */}
              <Text className="text-[20px] font-worksans-bold leading-[26px] mb-3" style={{ color: '#30352D' }}>
                What country is your government{'\n'}ID from?
              </Text>

              {/* Subtitle */}
              <Text className="text-[14px] font-worksans-medium leading-[20px] mb-8" style={{ color: '#30352D' }}>
                This helps us determine the best way to{'\n'}verify your identity.
              </Text>

              {/* Country Selector */}
              <Pressable 
                className="rounded-xl border px-4 py-3.5 mb-6"
                style={{ borderColor: '#E5E5E5' }}
              >
                <HStack className="items-center justify-between">
                  <HStack className="items-center gap-3">
                    <Image
                      source={require('@/assets/images/uk-flag.png')}
                      className="w-7 h-5"
                      resizeMode="contain"
                    />
                    <Text className="text-[15px] font-worksans-medium" style={{ color: '#30352D' }}>
                      {selectedCountry}
                    </Text>
                  </HStack>
                  <ChevronDown size={18} color="#30352D" />
                </HStack>
              </Pressable>

              {/* Spacer */}
              <Box className="flex-1" />

              {/* Select Button */}
              <Button
                className="rounded-full mb-6"
                style={{ backgroundColor: '#C1856A' }}
                onPress={handleSelect}
              >
                <ButtonText className="text-[17px] font-worksans-bold">
                  Select
                </ButtonText>
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>

      {/* Cancel Verification Modal */}
      <CancelVerificationModal
        visible={showCancelModal}
        onResume={handleResume}
        onCancel={handleCancel}
      />
    </Box>
  );
}
