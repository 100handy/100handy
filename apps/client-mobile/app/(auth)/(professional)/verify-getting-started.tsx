import React, { useState } from 'react';
import { Image, ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';
import { X } from 'lucide-react-native';
import { router } from 'expo-router';
import { CancelVerificationModal } from '@/components/verification';

export default function VerifyGettingStarted() {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleClose = (): void => {
    setShowCancelModal(true);
  };

  const handleResume = (): void => {
    setShowCancelModal(false);
  };

  const handleCancel = (): void => {
    setShowCancelModal(false);
    router.back();
  };

  const handleBeginVerifying = (): void => {
    router.push('/(auth)/(professional)/verify-country-selection');
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
            {/* Header with Close */}
            <View className="px-6 pt-3 pb-4">
              <View className="items-end">
                <Pressable onPress={handleClose}>
                  <X size={20} color="#30352D" />
                </Pressable>
              </View>
            </View>

            {/* Content */}
            <View className="flex-col flex-1 px-8">
              {/* Title */}
              <Text className="text-[22px] font-worksans-bold mb-3" style={{ color: '#30352D' }}>
                Getting Started
              </Text>

              {/* Subtitle */}
              <Text className="text-[15px] font-worksans-medium leading-[20px] mb-8" style={{ color: '#30352D' }}>
                We need some information to help us{'\n'}Confirm your identity.
              </Text>

              {/* Illustration */}
              <View className="items-center mb-10">
                <Image
                  source={require('@/assets/images/id-verification-illustration.png')}
                  style={{ width: 190, height: 190 }}
                  resizeMode="contain"
                />
              </View>

              {/* Legal Text */}
              <Text className="text-[12px] font-worksans leading-[16px] text-center mb-8" style={{ color: '#30352D' }}>
                By clicking the button below, you consent to Persona, our vendor, collecting, using, and utilizing its service providers to process your biometric information to verify your identity, identify fraud, and improve Persona's platform in accordance with its{' '}
                <Text className="font-worksans-bold" style={{ color: '#C1856A' }}>Privacy Policy.</Text>
                {'\n'}Your biometric information will be stored for no more than 3 years.
              </Text>

              {/* Spacer */}
              <View className="flex-1" />

              {/* Begin Button */}
              <Button
                className="rounded-full mb-4"
                style={{ backgroundColor: '#C1856A' }}
                onPress={handleBeginVerifying}
              >
                <ButtonText className="text-[18px] font-worksans-bold">
                  Begin verifying
                </ButtonText>
              </Button>
            </View>

            {/* Gray Footer with Persona Logo */}
            <View className="py-4" style={{ backgroundColor: '#F5F5F5' }}>
              <View className="items-center">
                <Text className="text-[11px] font-worksans" style={{ color: '#9CA3AF' }}>
                  powered by{' '}
                  <Text className="font-worksans-bold">persona</Text>
                </Text>
              </View>
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
