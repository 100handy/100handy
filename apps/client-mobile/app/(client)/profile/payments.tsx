import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Import gluestack-ui components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';

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
                <VStack className="flex-1">
                    {/* Redemptions Section */}
                    <Pressable 
                        onPress={() => {
                            // Navigate to redemptions screen
                            console.log('Navigate to Redemptions');
                        }}
                        className="border-b border-gray-200"
                    >
                        <HStack className="items-center justify-between px-6 py-5">
                            <Text className="font-work-sans text-xl font-bold" style={{ color: '#30352D' }}>
                                Redemptions
                            </Text>
                            <Icon as={ChevronRight} size="lg" className="text-gray-400" />
                        </HStack>
                    </Pressable>

                    {/* Add Payment Method Section Header */}
                    <Box className="px-6 py-4 bg-white border-b border-gray-200">
                        <Text className="font-work-sans text-xs font-medium tracking-wider" style={{ color: '#333A31' }}>
                            ADD PAYMENT METHOD
                        </Text>
                    </Box>

                    {/* Credit Card Option */}
                    <Pressable 
                        onPress={() => {
                            // Navigate to credit card screen
                            console.log('Navigate to Credit Card');
                            router.push('/profile/credit-card');
                        }}
                        className="border-b border-gray-200"
                    >
                        <HStack className="items-center justify-between px-6 py-5">
                            <Text className="font-work-sans text-xl font-bold" style={{ color: '#30352D' }}>
                                Credit Card
                            </Text>
                            <Icon as={ChevronRight} size="lg" className="text-gray-400" />
                        </HStack>
                    </Pressable>

                    {/* Apple Pay Option */}
                    <Pressable 
                        onPress={() => {
                            // Navigate to Apple Pay screen
                            console.log('Navigate to Apple Pay');
                        }}
                        className="border-b border-gray-200"
                    >
                        <HStack className="items-center justify-between px-6 py-5">
                            <HStack className="items-center gap-2">
                                <Box className="rounded bg-black px-1.5 py-0.5 flex-row items-center justify-center">
                                    <Text className="text-white text-[10px] font-medium">
                                        🍎
                                    </Text>
                                    <Text className="text-white text-[10px] font-medium">
                                        Pay
                                    </Text>
                                </Box>
                                <Text className="font-work-sans text-lg font-light" style={{ color: '#30352D' }}>
                                    Apple Pay
                                </Text>
                            </HStack>
                            <Icon as={ChevronRight} size="lg" className="text-gray-400" />
                        </HStack>
                    </Pressable>

                    {/* Footer Note */}
                    <Box className="px-6 py-6">
                        <Text className="font-work-sans text-[13px] font-medium leading-5" style={{ color: '#333A31' }}>
                            Payment method will update for all tasks, including the ones currently open.
                        </Text>
                    </Box>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}
