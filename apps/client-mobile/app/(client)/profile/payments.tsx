import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Platform, ActivityIndicator } from 'react-native';
import { useToast } from '@/components/ui/toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import Header from '@/components/Header';
import { createSetupIntent } from '@shared/supabase';
import {
  getUnsupportedNativeFeatureMessage,
  initStripePaymentSheet,
  presentStripePaymentSheet,
  supportsStripeNative,
} from '@/lib/native-feature-support';
import { goBackOrReplace } from '@/lib/navigation';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

const DEFAULT_CONTENT = {
  'header.title': 'Payment',
  'menu.redemptions': 'Redemptions',
  'section.add_payment_method': 'ADD PAYMENT METHOD',
  'menu.credit_card': 'Credit Card',
  'menu.apple_pay': 'Apple Pay',
  'menu.google_pay': 'Google Pay',
  'toasts.wallet_unavailable_title': 'Unavailable in Expo Go',
  'toasts.init_failed_title': 'Error',
  'toasts.init_failed_body': 'Failed to initialize payment. Please try again.',
  'toasts.success_title': 'Success',
  'toasts.success_body': 'Payment method added successfully!',
  'toasts.generic_error_body': 'Something went wrong. Please try again.',
  'footer.note': 'Payment method will update for all tasks, including the ones currently open.',
} as const;

export default function PaymentsScreen() {
    const router = useRouter();
    const [isWalletLoading, setIsWalletLoading] = useState(false);
    const toast = useToast();
    const content = useAppContent('client_payments', DEFAULT_CONTENT);

    const handleWalletPayment = async () => {
        if (!supportsStripeNative()) {
            toast.info(
              getAppContentValue(content, 'toasts.wallet_unavailable_title', DEFAULT_CONTENT['toasts.wallet_unavailable_title']),
              getUnsupportedNativeFeatureMessage('Wallet payments'),
            );
            return;
        }

        setIsWalletLoading(true);
        try {
            const setupIntent = await createSetupIntent();
            if (!setupIntent) {
                toast.error(
                  getAppContentValue(content, 'toasts.init_failed_title', DEFAULT_CONTENT['toasts.init_failed_title']),
                  getAppContentValue(content, 'toasts.init_failed_body', DEFAULT_CONTENT['toasts.init_failed_body']),
                );
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
                console.error('PaymentSheet init error:', initError);
                toast.error(
                  getAppContentValue(content, 'toasts.init_failed_title', DEFAULT_CONTENT['toasts.init_failed_title']),
                  initError.message,
                );
                return;
            }

            const { error: presentError } = await presentStripePaymentSheet();

            if (presentError) {
                if (presentError.code !== 'Canceled') {
                    toast.error(
                      getAppContentValue(content, 'toasts.init_failed_title', DEFAULT_CONTENT['toasts.init_failed_title']),
                      presentError.message,
                    );
                }
                return;
            }

            toast.success(
              getAppContentValue(content, 'toasts.success_title', DEFAULT_CONTENT['toasts.success_title']),
              getAppContentValue(content, 'toasts.success_body', DEFAULT_CONTENT['toasts.success_body']),
            );
            router.push('/(client)/profile/payment-methods');
        } catch (error) {
            console.error('Wallet payment error:', error);
            toast.error(
              getAppContentValue(content, 'toasts.init_failed_title', DEFAULT_CONTENT['toasts.init_failed_title']),
              getAppContentValue(content, 'toasts.generic_error_body', DEFAULT_CONTENT['toasts.generic_error_body']),
            );
        } finally {
            setIsWalletLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <Header 
                title={getAppContentValue(content, 'header.title', DEFAULT_CONTENT['header.title'])}
                onBackPress={() => goBackOrReplace(router, '/(client)/(tabs)/profile')} 
                showBellIcon={false}
                showFilterIcon={false}
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="flex-col flex-1">
                    {/* Redemptions Section */}
                    <Pressable
                        onPress={() => {
                            router.push('/(client)/profile/redemptions');
                        }}
                        className="border-b border-gray-200"
                    >
                        <View className="flex-row items-center justify-between px-6 py-5">
                            <Text className="font-work-sans text-xl font-bold" style={{ color: '#30352D' }}>
                                {getAppContentValue(content, 'menu.redemptions', DEFAULT_CONTENT['menu.redemptions'])}
                            </Text>
                            <ChevronRight size={24} color="#9ca3af" />
                        </View>
                    </Pressable>

                    {/* Add Payment Method Section Header */}
                    <View className="px-6 py-4 bg-white border-b border-gray-200">
                        <Text className="font-work-sans text-xs font-medium tracking-wider" style={{ color: '#333A31' }}>
                            {getAppContentValue(content, 'section.add_payment_method', DEFAULT_CONTENT['section.add_payment_method'])}
                        </Text>
                    </View>

                    {/* Credit Card Option */}
                    <Pressable
                        onPress={() => {
                            router.push('/(client)/profile/payment-methods');
                        }}
                        className="border-b border-gray-200"
                    >
                        <View className="flex-row items-center justify-between px-6 py-5">
                            <Text className="font-work-sans text-xl font-bold" style={{ color: '#30352D' }}>
                                {getAppContentValue(content, 'menu.credit_card', DEFAULT_CONTENT['menu.credit_card'])}
                            </Text>
                            <ChevronRight size={24} color="#9ca3af" />
                        </View>
                    </Pressable>

                    {/* Apple Pay / Google Pay Option */}
                    <Pressable
                        onPress={handleWalletPayment}
                        disabled={isWalletLoading}
                        className="border-b border-gray-200"
                    >
                        <View className="flex-row items-center justify-between px-6 py-5">
                            <View className="flex-row items-center gap-2">
                                {Platform.OS === 'ios' ? (
                                    <>
                                        <View className="rounded bg-black px-1.5 py-0.5 flex-row items-center justify-center">
                                            <Text className="text-white text-[10px] font-medium">
                                                Apple
                                            </Text>
                                            <Text className="text-white text-[10px] font-medium">
                                                {' '}Pay
                                            </Text>
                                        </View>
                                        <Text className="font-work-sans text-lg font-light" style={{ color: '#30352D' }}>
                                            {getAppContentValue(content, 'menu.apple_pay', DEFAULT_CONTENT['menu.apple_pay'])}
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <View className="rounded bg-white border border-gray-300 px-2 py-1 flex-row items-center justify-center">
                                            <Text className="text-[12px] font-medium" style={{ color: '#4285F4' }}>G</Text>
                                            <Text className="text-[12px] font-medium" style={{ color: '#EA4335' }}>o</Text>
                                            <Text className="text-[12px] font-medium" style={{ color: '#FBBC05' }}>o</Text>
                                            <Text className="text-[12px] font-medium" style={{ color: '#4285F4' }}>g</Text>
                                            <Text className="text-[12px] font-medium" style={{ color: '#34A853' }}>l</Text>
                                            <Text className="text-[12px] font-medium" style={{ color: '#EA4335' }}>e</Text>
                                            <Text className="text-[12px] font-medium text-gray-700"> Pay</Text>
                                        </View>
                                        <Text className="font-work-sans text-lg font-light" style={{ color: '#30352D' }}>
                                            {getAppContentValue(content, 'menu.google_pay', DEFAULT_CONTENT['menu.google_pay'])}
                                        </Text>
                                    </>
                                )}
                            </View>
                            {isWalletLoading ? (
                                <ActivityIndicator size="small" color="#9ca3af" />
                            ) : (
                                <ChevronRight size={24} color="#9ca3af" />
                            )}
                        </View>
                    </Pressable>

                    {/* Footer Note */}
                    <View className="px-6 py-6">
                        <Text className="font-work-sans text-[13px] font-medium leading-5" style={{ color: '#333A31' }}>
                            {getAppContentValue(content, 'footer.note', DEFAULT_CONTENT['footer.note'])}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
