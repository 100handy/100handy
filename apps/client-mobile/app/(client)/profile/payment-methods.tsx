import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { ChevronLeft, Plus, Trash2, CheckCircle } from 'lucide-react-native';
import {
  listPaymentMethods,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  PaymentMethod,
} from '@shared/supabase/payment-methods';

// Card brand to logo mapping (we'll use text for now, can add actual logos later)
const CARD_BRANDS: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
};

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Reload payment methods when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadPaymentMethods();
    }, [])
  );

  const loadPaymentMethods = async () => {
    setIsLoading(true);
    const methods = await listPaymentMethods();
    console.log('[DEBUG] PaymentMethodsScreen - Received methods:', methods);
    console.log('[DEBUG] PaymentMethodsScreen - Number of methods:', methods.length);
    setPaymentMethods(methods);
    setIsLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const methods = await listPaymentMethods();
    console.log('[DEBUG] PaymentMethodsScreen (onRefresh) - Received methods:', methods);
    setPaymentMethods(methods);
    setRefreshing(false);
  }, []);

  const handleAddPaymentMethod = () => {
    router.push('/(client)/profile/add-payment-method');
  };

  const handleDeletePaymentMethod = (paymentMethodId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deletePaymentMethod(paymentMethodId);
            if (success) {
              await loadPaymentMethods();
            } else {
              Alert.alert('Error', 'Failed to delete payment method. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    const success = await setDefaultPaymentMethod(paymentMethodId);
    if (success) {
      // Reload payment methods to get updated default status
      await loadPaymentMethods();
      Alert.alert('Success', 'Default payment method updated');
    } else {
      Alert.alert('Error', 'Failed to set default payment method. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color="#30352D" strokeWidth={2} />
        </Pressable>
        <Text
          className="text-xl font-bold text-[#30352D]"
          style={{ fontFamily: 'WorkSans_700Bold' }}
        >
          Payment Methods
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#C1856A"
            colors={['#C1856A']}
          />
        }
      >
        <View className="flex-col px-5 py-6 gap-4">
          {/* Info Text */}
          <Text
            className="text-sm text-[#6B6B6B] mb-2"
            style={{ fontFamily: 'WorkSans_400Regular' }}
          >
            Manage your payment methods for bookings and purchases
          </Text>

          {/* Payment Methods List */}
          {paymentMethods.length === 0 ? (
            /* Empty State */
            <View className="flex-col items-center justify-center py-12 gap-4">
              <View
                className="w-20 h-20 rounded-full items-center justify-center"
                style={{ backgroundColor: '#F5F5F5' }}
              >
                <Text className="text-4xl">💳</Text>
              </View>
              <Text
                className="text-center text-base text-[#30352D] font-semibold"
                style={{ fontFamily: 'WorkSans_600SemiBold' }}
              >
                No payment methods yet
              </Text>
              <Text
                className="text-center text-sm text-[#6B6B6B] px-8"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                Add a payment method to quickly book services
              </Text>
            </View>
          ) : (
            /* Payment Methods List */
            <View className="flex-col gap-3">
              {paymentMethods.map((method, index) => {
                console.log(`[DEBUG] Rendering payment method ${index}:`, method);

                // Skip if card data is missing
                if (!method.card) {
                  console.warn('[DEBUG] Payment method missing card data, skipping:', method);
                  return null;
                }

                const isDefault = method.isDefault || false;
                const brandName = CARD_BRANDS[method.card.brand] || method.card.brand.toUpperCase();

                return (
                  <View
                    key={method.id}
                    className="bg-white rounded-xl border border-[#E5E5E5] p-4"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-1">
                          <Text
                            className="text-base font-semibold text-[#30352D]"
                            style={{ fontFamily: 'WorkSans_600SemiBold' }}
                          >
                            {brandName}
                          </Text>
                          {isDefault && (
                            <View className="bg-[#BBF7D0] px-2 py-1 rounded">
                              <Text
                                className="text-[10px] font-bold text-[#166534]"
                                style={{ fontFamily: 'WorkSans_700Bold' }}
                              >
                                DEFAULT
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          className="text-sm text-[#6B6B6B]"
                          style={{ fontFamily: 'WorkSans_400Regular' }}
                        >
                          •••• {method.card.last4}
                        </Text>
                        <Text
                          className="text-xs text-[#999999] mt-1"
                          style={{ fontFamily: 'WorkSans_400Regular' }}
                        >
                          Expires {method.card.exp_month}/{method.card.exp_year}
                        </Text>
                      </View>

                      {/* Actions */}
                      <View className="flex-row items-center gap-2">
                        {!isDefault && (
                          <Pressable
                            onPress={() => handleSetDefault(method.id)}
                            className="p-2"
                          >
                            <CheckCircle size={20} color="#C1856A" strokeWidth={2} />
                          </Pressable>
                        )}
                        <Pressable
                          onPress={() => handleDeletePaymentMethod(method.id)}
                          className="p-2"
                        >
                          <Trash2 size={20} color="#EF4444" strokeWidth={2} />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Payment Method Button */}
      <View className="px-5 pb-6 pt-3 border-t border-[#F0F0F0]">
        <Pressable
          onPress={handleAddPaymentMethod}
          className="bg-[#C1856A] rounded-xl py-4 flex-row items-center justify-center gap-2"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Plus size={20} color="white" strokeWidth={2.5} />
          <Text
            className="text-white text-base font-semibold"
            style={{ fontFamily: 'WorkSans_600SemiBold' }}
          >
            Add Payment Method
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
