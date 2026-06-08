import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { useToast } from '@/components/ui/toast';
import { createSetupIntent } from '@shared/supabase';
import {
  getUnsupportedNativeFeatureMessage,
  initStripePaymentSheet,
  presentStripePaymentSheet,
  supportsStripeNative,
} from '@/lib/native-feature-support';
import { goBackOrReplace } from '@/lib/navigation';

export default function AddPaymentMethodScreen() {
  const router = useRouter();
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const isStripeSupported = supportsStripeNative();

  const handleSaveCard = async () => {
    if (!isStripeSupported) {
      Alert.alert('Unavailable in Expo Go', getUnsupportedNativeFeatureMessage('Adding a card'));
      return;
    }

    if (isSaving) return;

    setIsSaving(true);
    try {
      const setupIntent = await createSetupIntent();
      if (!setupIntent) {
        Alert.alert('Payment Error', 'Failed to initialize card entry. Please try again.');
        return;
      }

      const { error: initError } = await initStripePaymentSheet({
        setupIntentClientSecret: setupIntent.clientSecret,
        merchantDisplayName: '100Handy',
        ...(Platform.OS === 'ios' ? { applePay: { merchantCountryCode: 'GB' } } : {}),
        ...(Platform.OS === 'android'
          ? { googlePay: { merchantCountryCode: 'GB', testEnv: __DEV__ } }
          : {}),
        style: 'automatic',
      });

      if (initError) {
        Alert.alert('Payment Error', initError.message || 'Failed to initialize card entry. Please try again.');
        return;
      }

      const { error: presentError } = await presentStripePaymentSheet();
      if (presentError) {
        if (presentError.code !== 'Canceled') {
          Alert.alert('Payment Error', presentError.message || 'Failed to add payment method.');
        }
        return;
      }

      toast.success('Success', 'Payment method added successfully.');
      goBackOrReplace(router, '/(client)/profile/payment-methods');
    } catch (error) {
      console.error('Add payment method error:', error);
      Alert.alert('Payment Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
                ? 'Enter your card details securely through Stripe. Payment details are securely processed by Stripe.'
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
          disabled={isSaving}
          className="rounded-xl py-4 flex-row items-center justify-center"
          style={{
            backgroundColor: '#C1856A',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            opacity: isSaving ? 0.7 : 1,
          }}
        >
          {isSaving ? <ActivityIndicator color="#fff" className="mr-2" /> : null}
          <Text
            className="text-white text-base font-semibold"
            style={{ fontFamily: 'WorkSans_600SemiBold' }}
          >
            {isSaving ? 'Opening Stripe...' : 'Add Card'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
