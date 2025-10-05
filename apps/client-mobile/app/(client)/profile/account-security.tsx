import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, X, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';

export default function AccountSecurityScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('7535770002');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1">
        {/* Header */}
        <HStack className="items-center p-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="p-2">
            <Icon as={ChevronLeft} size="xl" />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold">Account Security</Text>
          <Box className="w-8" />
        </HStack>

        {/* Content */}
        <VStack className="p-6 space-y-6 flex-1">
          <VStack space="md">
            <Text className="text-2xl font-bold text-gray-800">Two-factor authentication</Text>
            <Text className="text-base text-gray-600">
              To keep your account secure, set up two-factor authentication.
            </Text>
            <Text className="text-base text-gray-600">
              Enter your phone number to receive the security code and activate two-factor
              authentication.
            </Text>
          </VStack>

          {/* Phone Number Input */}
          <Input className="border-0 border-b border-gray-300 rounded-none h-12 text-base px-0">
            <HStack className="items-center space-x-2 mr-2">
              <Image
                source={{ uri: 'https://cdn.britannica.com/25/4825-004-F1975B92/Flag-United-Kingdom.jpg' }}
                alt="UK Flag"
                className="w-6 h-4"
              />
              <Text className="text-base">+ 44</Text>
              <Icon as={ChevronDown} size="md" />
            </HStack>
            <InputField
              className="flex-1 text-base"
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            {phoneNumber.length > 0 && (
              <Pressable onPress={() => setPhoneNumber('')} className="p-2">
                <Icon as={X} size="md" className="text-gray-500" />
              </Pressable>
            )}
          </Input>

          <Box className="flex-1" />

          {/* Send Code Button */}
          <Pressable
            className="bg-[#C1856A] rounded-full py-4 items-center"
            onPress={() => console.log('Send code')}
          >
            <Text className="text-white text-lg font-bold">Send Code</Text>
          </Pressable>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}