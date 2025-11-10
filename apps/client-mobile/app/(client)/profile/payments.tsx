import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Import gluestack-ui components

// Import lucide-react-native icons
import { ChevronRight } from 'lucide-react-native';

// Import Header component
import Header from '@/components/Header';

export default function PaymentsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <Header 
                title="Edit Payment" 
                onBackPress={() => router.back()} 
                showBellIcon={false}
                showFilterIcon={false}
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="flex-col flex-1">
                    {/* Redemptions Section */}
                    <Pressable
                        onPress={() => {
                            // Navigate to redemptions screen
                            console.log('Navigate to Redemptions');
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
                            // Navigate to credit card screen
                            console.log('Navigate to Credit Card');
                            router.push('/profile/credit-card');
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

                    {/* Apple Pay Option */}
                    <Pressable
                        onPress={() => {
                            // Navigate to Apple Pay screen
                            console.log('Navigate to Apple Pay');
                        }}
                        className="border-b border-gray-200"
                    >
                        <View className="flex-row items-center justify-between px-6 py-5">
                            <View className="flex-row items-center gap-2">
                                <View className="rounded bg-black px-1.5 py-0.5 flex-row items-center justify-center">
                                    <Text className="text-white text-[10px] font-medium">
                                        🍎
                                    </Text>
                                    <Text className="text-white text-[10px] font-medium">
                                        Pay
                                    </Text>
                                </View>
                                <Text className="font-work-sans text-lg font-light" style={{ color: '#30352D' }}>
                                    Apple Pay
                                </Text>
                            </View>
                            <ChevronRight size={24} color="#9ca3af" />
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
