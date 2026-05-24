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
import { getAppContentValue, useAppContent } from '@/lib/app-content';

// Card brand to logo mapping (we'll use text for now, can add actual logos later)
const CARD_BRANDS: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
};

const DEFAULT_CONTENT = {
  'header.title': 'Payment Methods',
  'body.description': 'Manage your payment methods for bookings and purchases',
  'loading.text': 'Loading payment methods...',
  'empty.title': 'No payment methods yet',
  'empty.body': 'Add a payment method to quickly book services',
  'badges.default': 'DEFAULT',
  'labels.expires': 'Expires',
  'alerts.delete_title': 'Delete Payment Method',
  'alerts.delete_body': 'Are you sure you want to delete this payment method?',
  'actions.cancel': 'Cancel',
  'actions.delete': 'Delete',
  'actions.add': 'Add Payment Method',
  'toasts.deleted_title': 'Deleted',
  'toasts.deleted_body': 'Payment method removed.',
  'toasts.delete_failed_title': 'Error',
  'toasts.delete_failed_body': 'Failed to delete payment method. Please try again.',
  'toasts.updated_title': 'Updated',
  'toasts.updated_body': 'Default payment method changed.',
  'toasts.update_failed_title': 'Error',
  'toasts.update_failed_body': 'Failed to set default payment method. Please try again.',
} as const;

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const toast = useToast();
  const content = useAppContent('client_payment_methods', DEFAULT_CONTENT);

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
      getAppContentValue(content, 'alerts.delete_title', DEFAULT_CONTENT['alerts.delete_title']),
      getAppContentValue(content, 'alerts.delete_body', DEFAULT_CONTENT['alerts.delete_body']),
      [
        {
          text: getAppContentValue(content, 'actions.cancel', DEFAULT_CONTENT['actions.cancel']),
          style: 'cancel',
        },
        {
          text: getAppContentValue(content, 'actions.delete', DEFAULT_CONTENT['actions.delete']),
          style: 'destructive',
          onPress: async () => {
            const success = await deletePaymentMethod(paymentMethodId);
            if (success) {
              await loadPaymentMethods();
              toast.success(
                getAppContentValue(content, 'toasts.deleted_title', DEFAULT_CONTENT['toasts.deleted_title']),
                getAppContentValue(content, 'toasts.deleted_body', DEFAULT_CONTENT['toasts.deleted_body']),
              );
            } else {
              toast.error(
                getAppContentValue(content, 'toasts.delete_failed_title', DEFAULT_CONTENT['toasts.delete_failed_title']),
                getAppContentValue(content, 'toasts.delete_failed_body', DEFAULT_CONTENT['toasts.delete_failed_body']),
              );
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
        toast.success(
          getAppContentValue(content, 'toasts.updated_title', DEFAULT_CONTENT['toasts.updated_title']),
          getAppContentValue(content, 'toasts.updated_body', DEFAULT_CONTENT['toasts.updated_body']),
        );
      } else {
        toast.error(
          getAppContentValue(content, 'toasts.update_failed_title', DEFAULT_CONTENT['toasts.update_failed_title']),
          getAppContentValue(content, 'toasts.update_failed_body', DEFAULT_CONTENT['toasts.update_failed_body']),
        );
      }
    } finally {
      setSettingDefaultId(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Header title={getAppContentValue(content, 'header.title', DEFAULT_CONTENT['header.title'])} onBackPress={() => goBackOrReplace(router, '/(client)/profile/payments')} showBellIcon={false} />

      {isLoading && !hasLoadedOnce ? (
        <View className="flex-1 px-5 py-6">
          <Text
            className="text-sm text-[#6B6B6B] mb-6"
            style={{ fontFamily: 'WorkSans_400Regular' }}
          >
            {getAppContentValue(content, 'body.description', DEFAULT_CONTENT['body.description'])}
          </Text>
          <View className="flex-1 items-center justify-center gap-4">
            <ActivityIndicator size="large" color="#C1856A" />
            <Text
              className="text-sm text-[#6B6B6B]"
              style={{ fontFamily: 'WorkSans_400Regular' }}
            >
              {getAppContentValue(content, 'loading.text', DEFAULT_CONTENT['loading.text'])}
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
              {getAppContentValue(content, 'body.description', DEFAULT_CONTENT['body.description'])}
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
                  {getAppContentValue(content, 'empty.title', DEFAULT_CONTENT['empty.title'])}
                </Text>
                <Text
                  className="text-center text-sm text-[#6B6B6B] px-8"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  {getAppContentValue(content, 'empty.body', DEFAULT_CONTENT['empty.body'])}
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
                                  {getAppContentValue(content, 'badges.default', DEFAULT_CONTENT['badges.default'])}
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
                            {getAppContentValue(content, 'labels.expires', DEFAULT_CONTENT['labels.expires'])} {method.card.exp_month}/{method.card.exp_year}
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
            {getAppContentValue(content, 'actions.add', DEFAULT_CONTENT['actions.add'])}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
