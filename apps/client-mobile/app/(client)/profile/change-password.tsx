import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { ChevronLeft, X } from 'lucide-react-native';

const PasswordInputRow = ({ label }: { label: string }) => (
  <Pressable onPress={() => console.log(`Entering ${label}`)}>
    <HStack
      className="items-center justify-between py-4 border-b border-gray-200"
    >
      <Text className="text-base text-gray-800">{label}</Text>
      <Icon as={X} size="md" className="text-gray-400" />
    </HStack>
  </Pressable>
);

export default function ChangePasswordScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1">
        {/* Header */}
        <HStack className="items-center p-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <Icon as={ChevronLeft} size="xl" className="mr-1" />
            <Text className="text-base">Profile</Text>
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold mr-12">Password</Text>
        </HStack>

        {/* Password Fields */}
        <VStack className="p-6 space-y-2 flex-1">
          <PasswordInputRow label="Current Password" />
          <PasswordInputRow label="New Password" />
          <PasswordInputRow label="Retype Password" />
        </VStack>

        {/* Save Button */}
        <Box className="px-6 pb-6">
          <Pressable
            className="bg-[#C1856A] rounded-full py-4 items-center"
            onPress={() => console.log('Save Password')}
          >
            <Text className="text-white text-lg font-bold">Save</Text>
          </Pressable>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
