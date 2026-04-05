import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Platform, ActivityIndicator } from 'react-native';
import { useToast } from '@/components/ui/toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStripe } from '@stripe/stripe-react-native';

// Import lucide-react-native icons
import { ChevronRight } from 'lucide-react-native';

// Import Header component
import Header from '@/components/Header';

// Import shared supabase functions
import { createSetupIntent } from '@shared/supabase';

export default function PaymentsScreen() {
    const router = useRouter();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [isWalletLoading, setIsWalletLoading] = useState(false);
    const toast = useToast();

    const handleWalletPayment = async () => {
        setIsWalletLoading(true);
        try {
            // 1. Create SetupIntent to save the payment method
            const setupIntent = await createSetupIntent();
            if (!setupIntent) {
                toast.error('Error', 'Failed to initialize payment. Please try again.');
                return;
            }

            // 2. Initialize PaymentSheet with wallet support
            const { error: initError } = await initPaymentSheet({
                setupIntentClientSecret: setupIntent.clientSecret,
                merchantDisplayName: '100Handy',
                applePay: { merchantCountryCode: 'GB' },
                googlePay: { merchantCountryCode: 'GB', testEnv: __DEV__ },
                style: 'automatic',
            });

            if (initError) {
                console.error('PaymentSheet init error:', initError);
                toast.error('Error', initError.message);
                return;
            }

            // 3. Present the PaymentSheet
            const { error: presentError } = await presentPaymentSheet();

            if (presentError) {
                // User cancelled or error
                if (presentError.code !== 'Canceled') {
                    toast.error('Error', presentError.message);
                }
                return;
            }

            // Success - card was saved
            toast.success('Success', 'Payment method added successfully!');
            router.push('/(client)/profile/payment-methods');
        } catch (error) {
            console.error('Wallet payment error:', error);
            toast.error('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsWalletLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <Header 
                title="Payment"
                onBackPress={() => router.back()} 
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
                                Redemptions
                            </Text>
                            <ChevronRight size={24} color="#9ca3af" />
                        </View>
                    </Pressable>

                    {/* Add Payment Method Section Header */}
                    <View className="px-6 py-4 bg-white border-b border-gray-200">
                        <Text className="font-work-sans text-xs font-medium tracking-wider" style={{ color: '#333A31' }}>
                            ADD PAYMENT METHOD
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
                                Credit Card
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

                                            </Text>
                                            <Text className="text-white text-[10px] font-medium">
                                                Pay
                                            </Text>
                                        </View>
                                        <Text className="font-work-sans text-lg font-light" style={{ color: '#30352D' }}>
                                            Apple Pay
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
                                            Google Pay
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
                            Payment method will update for all tasks, including the ones currently open.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
