import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { ChevronLeft } from 'lucide-react-native';

interface MenuItemProps {
  title: string;
  onPress: () => void;
  showDivider?: boolean;
}

const MenuItem = ({ title, onPress, showDivider = true }: MenuItemProps) => (
  <Box>
    <Pressable onPress={onPress}>
      <Box className="px-6 py-4">
        <Text className="text-[20px] font-bold text-[#30352D]">{title}</Text>
      </Box>
    </Pressable>
    {showDivider && <Box className="h-[1px] bg-gray-200" />}
  </Box>
);

export default function SupportScreen() {
  const router = useRouter();

  const handleMessageSupport = () => {
    router.push('/(client)/support/message-support');
  };

  const handleSupportCenter = () => {
    // Navigate to support center or open URL
    console.log('Open Support Center');
  };

  const handleBecomeTasker = () => {
    // Navigate to become a tasker flow
    console.log('Open Become a Tasker');
  };

  const handleCancellationPolicy = () => {
    // Navigate to cancellation policy
    console.log('Open Cancellation Policy');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Delete account confirmed')
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1">
        {/* Header */}
        <HStack className="items-center px-6 py-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <Icon as={ChevronLeft} size="lg" className="text-[#30352D]" />
            <Text className="text-[18px] text-[#30352D] ml-2">Profile</Text>
          </Pressable>
          <Text className="flex-1 text-center text-[18px] font-bold text-[#30352D] mr-16">
            Support
          </Text>
        </HStack>

        <ScrollView className="flex-1">
          <VStack className="pt-6">
            <MenuItem
              title="Message Support"
              onPress={handleMessageSupport}
            />

            <MenuItem
              title="Support Center"
              onPress={handleSupportCenter}
            />

            <MenuItem
              title="Become a Tasker"
              onPress={handleBecomeTasker}
            />

            <MenuItem
              title="Cancellation Policy"
              onPress={handleCancellationPolicy}
            />

            <MenuItem
              title="Delete Account"
              onPress={handleDeleteAccount}
              showDivider={false}
            />

            <Box className="px-6 mt-8">
              <Text className="text-[13px] text-[#333A31]">
                Version 1.2.0 (100 Handy)
              </Text>
            </Box>
          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
