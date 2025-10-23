import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface MenuItem {
  label: string;
  hasChevron?: boolean;
  onPress?: () => void;
}

export default function SupportScreen() {
  const router = useRouter();

  const handleHandySupport = () => {
    console.log('Navigate to 100 Handy Support');
    // Navigate to support contact screen when implemented
  };

  const handleSupportCenter = () => {
    console.log('Visit support center');
    // Open support center URL or navigate to support center
  };

  const handleTestNotifications = () => {
    console.log('Test push notifications');
    // Trigger test notification functionality
  };

  const menuItems: MenuItem[] = [
    {
      label: '100 Handy Support',
      hasChevron: true,
      onPress: handleHandySupport,
    },
    {
      label: 'Visit support center',
      hasChevron: true,
      onPress: handleSupportCenter,
    },
    {
      label: 'Test push notifications',
      hasChevron: true,
      onPress: handleTestNotifications,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <HStack className="py-4 px-5 items-center justify-between border-b border-gray-100">
        <Pressable className="w-10 items-start" onPress={() => router.back()}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-xl text-theme-font">
          Support
        </Text>
        <Box className="w-10" />
      </HStack>

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Menu Items */}
        <VStack className="">
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              className="px-5 py-5 border-b border-gray-100"
              onPress={item.onPress}
            >
              <HStack className="items-center justify-between">
                <Text className="font-worksans-bold text-lg text-theme-font flex-1">
                  {item.label}
                </Text>
                {item.hasChevron && (
                  <ChevronRight color="#BDBDBD" size={22} strokeWidth={2} />
                )}
              </HStack>
            </Pressable>
          ))}
        </VStack>

        {/* Version Info */}
        <Box className="px-5 py-4">
          <Text className="font-worksans text-sm text-gray-500">
            Version 1.2.0 (100 Handy)
          </Text>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}