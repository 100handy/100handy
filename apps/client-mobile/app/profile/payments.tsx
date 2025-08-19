import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Import gluestack-ui components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';

// Import lucide-react-native icons
import {
    ArrowLeft,
    Plus,
    DollarSign,
    Percent,
    CreditCard,
    MoreHorizontal,
    ChevronRight,
} from 'lucide-react-native';

// Custom icons for payment methods (using available icons as placeholders)
import { Smartphone } from 'lucide-react-native';

export default function PaymentsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            {/* Header */}
            <Box className="bg-bg-primary px-4 py-4 border-b-2 border-border-accent">
                <HStack className="items-center justify-between">
                    <Pressable onPress={() => router.back()} className="p-2">
                        <Icon as={ArrowLeft} size="lg" className="text-text-primary" />
                    </Pressable>
                    <Heading className="font-work-sans text-lg font-semibold text-text-primary">
                        Edit Payments
                    </Heading>
                    <Box className="w-10" />
                </HStack>
            </Box>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <VStack className="p-4 space-y-6">
                    {/* Redemptions Section */}
                    <Box className="bg-bg-primary p-6 rounded-lg">
                        <HStack className="items-center justify-between mb-4">
                            <Heading className="font-work-sans text-base font-semibold text-text-primary">
                                Redemptions
                            </Heading>
                            <Pressable>
                                <Text className="font-work-sans text-sm font-medium text-clay-orange">
                                    View All
                                </Text>
                            </Pressable>
                        </HStack>

                        <VStack className="space-y-3">
                            {/* Cashback Item */}
                            <HStack className="items-center justify-between p-3 rounded-lg">
                                <HStack className="items-center flex-1">
                                    <Box className="w-10 h-10 bg-transparent items-center justify-center rounded-lg">
                                        <Icon as={DollarSign} size="md" className="text-status-success-light" />
                                    </Box>
                                    <VStack className="ml-3 flex-1">
                                        <Text className="font-work-sans text-sm font-medium text-text-primary">
                                            £5 Cashback
                                        </Text>
                                        <Text className="font-work-sans text-xs text-text-tertiary">
                                            Redeemed Dec 15, 2023
                                        </Text>
                                    </VStack>
                                </HStack>
                                <Box className="bg-accent-green-bg px-2 py-1 rounded">
                                    <Text className="font-work-sans text-xs text-accent-green">
                                        Applied
                                    </Text>
                                </Box>
                            </HStack>

                            {/* Discount Item */}
                            <HStack className="items-center justify-between p-3 rounded-lg">
                                <HStack className="items-center flex-1">
                                    <Box className="w-10 h-10 bg-transparent items-center justify-center rounded-lg">
                                        <Icon as={Percent} size="sm" className="text-info" />
                                    </Box>
                                    <VStack className="ml-3 flex-1">
                                        <Text className="font-work-sans text-sm font-medium text-text-primary">
                                            10% Discount
                                        </Text>
                                        <Text className="font-work-sans text-xs text-text-tertiary">
                                            Expires Jan 30, 2024
                                        </Text>
                                    </VStack>
                                </HStack>
                                <Box className="bg-accent-orange-bg px-2 py-1 rounded">
                                    <Text className="font-work-sans text-xs text-warning">
                                        Pending
                                    </Text>
                                </Box>
                            </HStack>
                        </VStack>
                    </Box>

                    {/* Payment Methods Section */}
                    <Box className="bg-bg-primary p-6 rounded-lg">
                        <Heading className="font-work-sans text-base font-semibold text-text-primary mb-4">
                            Payment Methods
                        </Heading>

                        <VStack className="space-y-4">
                            {/* Credit Cards Subsection */}
                            <VStack className="space-y-3">
                                <HStack className="items-center justify-between">
                                    <Text className="font-work-sans text-sm font-medium text-text-primary">
                                        Credit Cards
                                    </Text>
                                    <Pressable className="flex-row items-center">
                                        <Icon as={Plus} size="sm" className="text-clay-orange mr-1" />
                                        <Text className="font-work-sans text-sm font-medium text-clay-orange">
                                            Add
                                        </Text>
                                    </Pressable>
                                </HStack>

                                {/* Visa Card */}
                                <HStack className="items-center justify-between p-3 rounded-lg">
                                    <HStack className="items-center flex-1">
                                        <Box className="w-10 h-10 items-center justify-center rounded-lg">
                                            <Icon as={CreditCard} size="lg" className="text-info" />
                                        </Box>
                                        <VStack className="ml-3 flex-1">
                                            <Text className="font-work-sans text-sm font-medium text-text-primary">
                                                Visa •••• 4532
                                            </Text>
                                            <Text className="font-work-sans text-xs text-text-tertiary">
                                                Expires 12/26
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    <HStack className="items-center">
                                        <Box className="bg-accent-green-bg px-2 py-1 rounded mr-2">
                                            <Text className="font-work-sans text-xs text-accent-green">
                                                Default
                                            </Text>
                                        </Box>
                                        <Icon as={MoreHorizontal} size="md" className="text-text-inactive" />
                                    </HStack>
                                </HStack>

                                {/* Mastercard */}
                                <HStack className="items-center justify-between p-3 rounded-lg">
                                    <HStack className="items-center flex-1">
                                        <Box className="w-10 h-10 items-center justify-center rounded-lg">
                                            <Icon as={CreditCard} size="lg" className="text-status-danger" />
                                        </Box>
                                        <VStack className="ml-3 flex-1">
                                            <Text className="font-work-sans text-sm font-medium text-text-primary">
                                                Mastercard •••• 8901
                                            </Text>
                                            <Text className="font-work-sans text-xs text-text-tertiary">
                                                Expires 08/25
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    <Icon as={MoreHorizontal} size="md" className="text-text-inactive" />
                                </HStack>
                            </VStack>

                            {/* Digital Wallets */}
                            <VStack className="space-y-3">
                                {/* Apple Pay */}
                                <HStack className="items-center justify-between p-3 rounded-lg">
                                    <HStack className="items-center flex-1">
                                        <Box className="w-10 h-10 items-center justify-center rounded-lg">
                                            <Icon as={Smartphone} size="lg" className="text-black" />
                                        </Box>
                                        <VStack className="ml-3 flex-1">
                                            <Text className="font-work-sans text-sm font-medium text-text-primary">
                                                Apple Pay
                                            </Text>
                                            <Text className="font-work-sans text-xs text-text-tertiary">
                                                Quick and secure payments
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    <HStack className="items-center">
                                        <Box className="bg-accent-green-bg px-2 py-1 rounded mr-2">
                                            <Text className="font-work-sans text-xs text-accent-green">
                                                Connected
                                            </Text>
                                        </Box>
                                        <Icon as={ChevronRight} size="sm" className="text-text-inactive" />
                                    </HStack>
                                </HStack>

                                {/* Google Pay */}
                                <HStack className="items-center justify-between p-3 rounded-lg">
                                    <HStack className="items-center flex-1">
                                        <Box className="w-10 h-10 items-center justify-center rounded-lg">
                                            <Icon as={Smartphone} size="lg" className="text-info" />
                                        </Box>
                                        <VStack className="ml-3 flex-1">
                                            <Text className="font-work-sans text-sm font-medium text-text-primary">
                                                Google Pay
                                            </Text>
                                            <Text className="font-work-sans text-xs text-text-tertiary">
                                                Pay with your Google account
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    <HStack className="items-center">
                                        <Box className="bg-accent-gray-bg px-2 py-1 rounded mr-2">
                                            <Text className="font-work-sans text-xs text-text-secondary">
                                                Not Connected
                                            </Text>
                                        </Box>
                                        <Icon as={ChevronRight} size="sm" className="text-text-inactive" />
                                    </HStack>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Box>

                    {/* Billing Information Section */}
                    <Box className="bg-bg-primary p-4 rounded-lg">
                        <VStack className="space-y-4">
                            <Heading className="font-work-sans text-sm font-medium text-text-primary">
                                Billing Information
                            </Heading>

                            <VStack className="space-y-3 px-4">
                                <HStack className="items-center justify-between">
                                    <Text className="font-work-sans text-sm text-text-secondary">
                                        Billing Address
                                    </Text>
                                    <Text className="font-work-sans text-sm text-text-primary">
                                        123 Main Street, London
                                    </Text>
                                </HStack>

                                <HStack className="items-center justify-between">
                                    <Text className="font-work-sans text-sm text-text-secondary">
                                        Next Billing
                                    </Text>
                                    <Text className="font-work-sans text-sm text-text-primary">
                                        Jan 15, 2024
                                    </Text>
                                </HStack>
                            </VStack>

                            <Pressable className="py-2.5 px-5 items-center">
                                <Text className="font-work-sans text-sm font-medium text-clay-orange">
                                    Update Billing Info
                                </Text>
                            </Pressable>
                        </VStack>
                    </Box>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}