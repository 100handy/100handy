import React, { useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
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
import { ArrowLeft, Shield, Key, Home, CheckSquare, Users, User } from 'lucide-react-native';

export default function AccountSecurityScreen() {
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleTurnOffAuthentication = () => {
        // Handle turn off authentication logic
        console.log('Turn off authentication');
    };

    const handleChangePassword = () => {
        // Handle change password logic
        console.log('Change password:', { oldPassword, newPassword });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <Box className="bg-white px-4 py-4">
                <HStack className="items-center">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <HStack className="items-center">
                            <Icon as={ArrowLeft} size="lg" className="text-text-primary" />
                            <Text className="text-text-primary font-work-sans text-base ml-1">
                                Profile
                            </Text>
                        </HStack>
                    </Pressable>
                    <Text className="text-text-primary font-work-sans font-semibold text-lg flex-1 text-center mr-16">
                        Account Security
                    </Text>
                </HStack>
            </Box>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Two-Factor Authentication Section */}
                <Box className="bg-white px-6 py-8">
                    <HStack className="items-start mb-6">
                        {/* Two-Factor Authentication Icon */}
                        <Box className="w-12 h-12 items-center justify-center mr-4 bg-transparent">
                            <Box className="relative w-12 h-12">
                                {/* Shield outline in warning light color */}
                                <Icon as={Shield} size="xl" className="text-accent-yellow absolute top-0 left-3" />
                                {/* Inner lock/security element */}
                                <Box className="absolute top-2.5 left-4 w-4 h-1.5 bg-accent-orange rounded-sm" />
                                {/* Stars overlay */}
                                <Text className="absolute top-3.5 left-4.5 text-text-primary font-work-sans font-bold text-xs" style={{ textShadowColor: '#000000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 }}>
                                    ***
                                </Text>
                            </Box>
                        </Box>

                        <VStack className="flex-1">
                            <Text className="text-text-primary font-work-sans font-semibold text-lg leading-7">
                                Two-factor authentication
                            </Text>
                            <Text className="text-accent-purple font-work-sans font-bold text-xs leading-4 tracking-wider uppercase mt-1">
                                ACTIVATED
                            </Text>
                        </VStack>
                    </HStack>

                    <Text className="text-text-secondary font-work-sans text-base leading-6 mb-6">
                        Your two-factor authentication is activated. The phone number +447784500446 is the number you will
                        receive your authentication code if we notice an attempted login from an unrecognised device or browser.
                    </Text>

                    <Pressable
                        onPress={handleTurnOffAuthentication}
                        className="border-2 border-text-primary rounded-lg py-4 px-20 items-center bg-transparent"
                    >
                        <Text className="text-text-primary font-work-sans font-semibold text-base leading-5">
                            Turn off authentication
                        </Text>
                    </Pressable>
                </Box>

                {/* Change Password Section */}
                <Box className="bg-white px-6 py-8">
                    <HStack className="items-start mb-6">
                        <Box className="w-12 h-12 items-center justify-center mr-4">
                            <Icon as={Key} size="xl" className="text-text-secondary" />
                        </Box>

                        <VStack className="flex-1">
                            <Text className="text-text-primary font-work-sans font-semibold text-lg leading-7">
                                Change Password
                            </Text>
                            <Text className="text-text-secondary font-work-sans text-sm leading-5 mt-1">
                                Update your account password
                            </Text>
                        </VStack>
                    </HStack>

                    <VStack className="space-y-4">
                        {/* Old Password Input */}
                        <VStack>
                            <Text className="text-text-primary font-work-sans font-medium text-sm leading-4 mb-2">
                                Old Password
                            </Text>
                            <Box className="h-12 bg-white border border-accent rounded-lg px-4 justify-center">
                                <TextInput
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                    secureTextEntry
                                    placeholder="Enter old password"
                                    className="flex-1 font-work-sans text-base text-text-primary"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </Box>
                        </VStack>

                        {/* New Password Input */}
                        <VStack>
                            <Text className="text-text-primary font-work-sans font-medium text-sm leading-4 mb-2">
                                New Password
                            </Text>
                            <Box className="h-12 bg-white border border-accent rounded-lg px-4 justify-center">
                                <TextInput
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry
                                    placeholder="Enter new password"
                                    className="flex-1 font-work-sans text-base text-text-primary"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </Box>
                        </VStack>

                        {/* Change Password Button */}
                        <Pressable
                            onPress={handleChangePassword}
                            className="bg-text-primary rounded-lg py-4 px-24 items-center mt-4"
                        >
                            <Text className="text-white font-work-sans font-semibold text-base leading-5">
                                Change Password
                            </Text>
                        </Pressable>
                    </VStack>
                </Box>
            </ScrollView>

            {/* Bottom Navigation */}
            <Box className="bg-white border-t border-gray-200" style={{ height: 73 }}>
                <HStack className="flex-1">
                    {/* Home Tab */}
                    <Pressable className="flex-1 items-center justify-center py-3">
                        <Icon as={Home} size="lg" className="text-text-inactive mb-1" />
                        <Text className="text-text-inactive font-work-sans text-xs leading-4">
                            Home
                        </Text>
                    </Pressable>

                    {/* Tasks Tab */}
                    <Pressable className="flex-1 items-center justify-center py-3">
                        <Icon as={CheckSquare} size="lg" className="text-text-inactive mb-1" />
                        <Text className="text-text-inactive font-work-sans text-xs leading-4">
                            Tasks
                        </Text>
                    </Pressable>

                    {/* My Taskers Tab */}
                    <Pressable className="flex-1 items-center justify-center py-3">
                        <Icon as={Users} size="lg" className="text-text-inactive mb-1" />
                        <Text className="text-text-inactive font-work-sans text-xs leading-4">
                            My Taskers
                        </Text>
                    </Pressable>

                    {/* Profile Tab - Active */}
                    <Pressable className="flex-1 items-center justify-center py-3">
                        <Icon as={User} size="lg" className="text-accent-emerald mb-1" />
                        <Text className="text-accent-emerald font-work-sans font-semibold text-xs leading-4">
                            Profile
                        </Text>
                    </Pressable>
                </HStack>
            </Box>
        </SafeAreaView>
    );
}