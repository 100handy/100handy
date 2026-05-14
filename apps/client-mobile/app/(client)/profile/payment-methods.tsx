import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useToast } from '@/components/ui/toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Plus, Trash2, CheckCircle } from 'lucide-react-native';
import Header from '@/components/Header';
import {
  listPaymentMethods,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  PaymentMethod,
} from '@shared/supabase/payment-methods';
import { goBackOrReplace } from '@/lib/navigation';

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
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const toast = useToast();

  // Reload payment methods when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadPaymentMethods();
    }, [])
  );

  const loadPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const methods = await listPaymentMethods();
      setPaymentMethods(methods);
    } finally {
      setIsLoading(false);
      setHasLoadedOnce(true);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const methods = await listPaymentMethods();
      setPaymentMethods(methods);
    } finally {
      setRefreshing(false);
    }
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
              toast.success('Deleted', 'Payment method removed.');
            } else {
              toast.error('Error', 'Failed to delete payment method. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    if (settingDefaultId) return;
    setSettingDefaultId(paymentMethodId);
    try {
      const success = await setDefaultPaymentMethod(paymentMethodId);
      if (success) {
        await loadPaymentMethods();
        toast.success('Updated', 'Default payment method changed.');
      } else {
        toast.error('Error', 'Failed to set default payment method. Please try again.');
      }
    } finally {
      setSettingDefaultId(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Header title="Payment Methods" onBackPress={() => goBackOrReplace(router, '/(client)/profile/payments')} showBellIcon={false} />

      {isLoading && !hasLoadedOnce ? (
        <View className="flex-1 px-5 py-6">
          <Text
            className="text-sm text-[#6B6B6B] mb-6"
            style={{ fontFamily: 'WorkSans_400Regular' }}
          >
            Manage your payment methods for bookings and purchases
          </Text>
          <View className="flex-1 items-center justify-center gap-4">
            <ActivityIndicator size="large" color="#C1856A" />
            <Text
              className="text-sm text-[#6B6B6B]"
              style={{ fontFamily: 'WorkSans_400Regular' }}
            >
              Loading payment methods...
            </Text>
          </View>
        </View>
      ) : (
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
                {paymentMethods.map((method) => {
                  if (!method.card) {
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

                        <View className="flex-row items-center gap-2">
                          {!isDefault && (
                            <Pressable
                              onPress={() => handleSetDefault(method.id)}
                              disabled={!!settingDefaultId}
                              className="p-2"
                            >
                              {settingDefaultId === method.id ? (
                                <ActivityIndicator size="small" color="#C1856A" />
                              ) : (
                                <CheckCircle size={20} color="#C1856A" strokeWidth={2} />
                              )}
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
      )}

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
