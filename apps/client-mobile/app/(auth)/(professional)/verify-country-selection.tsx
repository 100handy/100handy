import React, { useState } from 'react';
import { Image, ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';
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
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-col flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pt-2 pb-6">
              <Pressable onPress={handleBack}>
                <ChevronLeft size={20} color="#30352D" />
              </Pressable>
              <Pressable onPress={handleClose}>
                <X size={20} color="#30352D" />
              </Pressable>
            </View>

            {/* Content */}
            <View className="flex-col flex-1 px-6">
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
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Image
                      source={require('@/assets/images/uk-flag.png')}
                      className="w-7 h-5"
                      resizeMode="contain"
                    />
                    <Text className="text-[15px] font-worksans-medium" style={{ color: '#30352D' }}>
                      {selectedCountry}
                    </Text>
                  </View>
                  <ChevronDown size={18} color="#30352D" />
                </View>
              </Pressable>

              {/* Spacer */}
              <View className="flex-1" />

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
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Cancel Verification Modal */}
      <CancelVerificationModal
        visible={showCancelModal}
        onResume={handleResume}
        onCancel={handleCancel}
      />
    </View>
  );
}
