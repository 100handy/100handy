import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { CardField, useConfirmSetupIntent } from '@stripe/stripe-react-native';
import { createSetupIntent } from '@shared/supabase/payment-methods';

export default function AddPaymentMethodScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const { confirmSetupIntent } = useConfirmSetupIntent();

  const handleSaveCard = async () => {
    if (!cardComplete) {
      Alert.alert('Error', 'Please enter valid card details');
      return;
    }

    setIsLoading(true);

    try {
      // Create SetupIntent
      const setupIntent = await createSetupIntent();

      if (!setupIntent) {
        Alert.alert('Error', 'Failed to initialize payment setup. Please try again.');
        setIsLoading(false);
        return;
      }

      // Confirm SetupIntent with card details
      const { error } = await confirmSetupIntent(setupIntent.clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        console.error('Error confirming setup intent:', error);
        Alert.alert('Error', error.message || 'Failed to add payment method. Please try again.');
        setIsLoading(false);
        return;
      }

      // Success! Navigate back to payment methods list
      Alert.alert(
        'Success',
        'Payment method added successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving card:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
        <Pressable onPress={() => router.back()} disabled={isLoading}>
          <ChevronLeft size={24} color="#30352D" strokeWidth={2} />
        </Pressable>
        <Text
          className="text-xl font-bold text-[#30352D]"
          style={{ fontFamily: 'WorkSans_700Bold' }}
        >
          Add Payment Method
        </Text>
        <View style={{ width: 24 }} />
      </View>

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
              Enter your card information below. Your payment details are securely processed by Stripe.
            </Text>
          </View>

          {/* Card Input Field */}
          <View className="flex-col gap-2">
            <CardField
              postalCodeEnabled={false}
              placeholders={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={{
                backgroundColor: '#FFFFFF',
                textColor: '#30352D',
                borderWidth: 1,
                borderColor: '#E5E5E5',
                borderRadius: 12,
              }}
              style={{
                width: '100%',
                height: 50,
                marginVertical: 8,
              }}
              onCardChange={(cardDetails) => {
                setCardComplete(cardDetails.complete);
              }}
            />
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
          disabled={!cardComplete || isLoading}
          className="rounded-xl py-4 flex-row items-center justify-center"
          style={{
            backgroundColor: cardComplete && !isLoading ? '#C1856A' : '#D1D5DB',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              className="text-white text-base font-semibold"
              style={{ fontFamily: 'WorkSans_600SemiBold' }}
            >
              Save Card
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
