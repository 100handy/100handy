import React from 'react';
import { Alert, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { getUnsupportedNativeFeatureMessage, supportsStripeNative } from '@/lib/native-feature-support';
import { goBackOrReplace } from '@/lib/navigation';

export default function AddPaymentMethodScreen() {
  const router = useRouter();

  const handleSaveCard = async () => {
    Alert.alert('Unavailable in Expo Go', getUnsupportedNativeFeatureMessage('Adding a card'));
  };

  const isStripeSupported = supportsStripeNative();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Header title="Add Payment Method" onBackPress={() => goBackOrReplace(router, '/(client)/profile/payment-methods')} showBellIcon={false} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col px-5 py-6 gap-6">
          {/* Info Section */}
          <View className="flex-col gap-2">
            <Text
              className="text-base font-semibold text-[#30352D]"
              style={{ fontFamily: 'WorkSans_600SemiBold' }}
            >
              Card Details
            </Text>
            <Text
              className="text-sm text-[#6B6B6B]"
              style={{ fontFamily: 'WorkSans_400Regular' }}
            >
              {isStripeSupported
                ? 'Use a development build to complete card entry. Payment details are securely processed by Stripe.'
                : getUnsupportedNativeFeatureMessage('Card entry')}
            </Text>
          </View>

          {/* Security Info */}
          <View className="bg-[#F5F5F5] rounded-xl p-4">
            <View className="flex-row items-start gap-3">
              <Text className="text-2xl">🔒</Text>
              <View className="flex-1">
                <Text
                  className="text-sm font-semibold text-[#30352D] mb-1"
                  style={{ fontFamily: 'WorkSans_600SemiBold' }}
                >
                  Secure Payment
                </Text>
                <Text
                  className="text-xs text-[#6B6B6B] leading-5"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  Your payment information is encrypted and securely stored. We never store your full card details on our servers.
                </Text>
              </View>
            </View>
          </View>

          {/* Test Card Info (for development only) */}
          {__DEV__ && (
            <View className="bg-[#FEF3C7] rounded-xl p-4">
              <View className="flex-col gap-2">
                <Text
                  className="text-sm font-semibold text-[#92400E]"
                  style={{ fontFamily: 'WorkSans_600SemiBold' }}
                >
                  Test Card
                </Text>
                <Text
                  className="text-xs text-[#92400E] leading-5"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  For testing: Use card number 4242 4242 4242 4242 with any future expiry date and any 3-digit CVC.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="px-5 pb-6 pt-3 border-t border-[#F0F0F0]">
        <Pressable
          onPress={handleSaveCard}
          className="rounded-xl py-4 flex-row items-center justify-center"
          style={{
            backgroundColor: '#C1856A',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text
            className="text-white text-base font-semibold"
            style={{ fontFamily: 'WorkSans_600SemiBold' }}
          >
            Open in Dev Build
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
