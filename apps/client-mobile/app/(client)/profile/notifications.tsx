import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { ChevronLeft } from 'lucide-react-native';

const SectionHeader = ({ title }: { title: string }) => (
  <Text className="text-sm font-semibold text-[#666666] uppercase mt-8 mb-6">
    {title}
  </Text>
);

interface NotificationToggleProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

const NotificationToggle = ({
  title,
  description,
  isEnabled,
  onToggle,
}: NotificationToggleProps) => (
  <HStack className="items-start justify-between py-1 mb-6">
    <VStack className="flex-1 mr-4">
      <Text className="text-lg font-medium text-[#333333] mb-1">{title}</Text>
      <Text className="text-base text-[#666666] leading-6">{description}</Text>
    </VStack>
    <View className="mt-2">
      <Switch
        size="lg"
        value={isEnabled}
        onValueChange={onToggle}
        trackColor={{ false: '#E0E0E0', true: '#C1856A' }}
        thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
      />
    </View>
  </HStack>
);

export default function NotificationsScreen() {
  const router = useRouter();
  const [pushOffers, setPushOffers] = useState(true);
  const [textUpdates, setTextUpdates] = useState(true);
  const [emailOffers, setEmailOffers] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1">
        {/* Header */}
        <HStack className="items-center px-6 py-6 bg-white" style={{ height: 100 }}>
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <Icon as={ChevronLeft} size="lg" className="text-[#333333]" />
            <Text className="text-lg text-[#333333] ml-2">Profile</Text>
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="text-xl font-semibold text-[#333333]">Notifications</Text>
          </View>
        </HStack>
        
        {/* Separator line */}
        <View className="h-[1px] bg-[#E0E0E0]" />

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
          <VStack className="px-6">
            {/* Push Notifications */}
            <Box>
              <SectionHeader title="Push Notifications" />
              <NotificationToggle
                title="Task Ideas and Offers"
                description="Task recommendations and promotional offers"
                isEnabled={pushOffers}
                onToggle={setPushOffers}
              />
              <Text className="text-base text-[#666666] mb-6 leading-6">
                You'll always receive push notification updates for{"\n"}your tasks and account activity
              </Text>
            </Box>

            {/* Separator line */}
            <View className="h-[1px] bg-[#E0E0E0] mb-2" />

            {/* Text Messages */}
            <Box>
              <SectionHeader title="Text Messages" />
              <NotificationToggle
                title="Task Updates"
                description="Updates from HQ or your 100 Handy"
                isEnabled={textUpdates}
                onToggle={setTextUpdates}
              />
            </Box>

            {/* Separator line */}
            <View className="h-[1px] bg-[#E0E0E0] mb-2" />

            {/* Email Notification */}
            <Box>
              <SectionHeader title="Email Notification" />
              <NotificationToggle
                title="Task Ideas and Offers"
                description="Task recommendations and promotional offers"
                isEnabled={emailOffers}
                onToggle={setEmailOffers}
              />
              <Text className="text-base text-[#666666] mb-6 leading-6">
                You'll always receive push notification updates for{"\n"}your tasks and account activity
              </Text>
            </Box>

            {/* Separator line */}
            <View className="h-[1px] bg-[#E0E0E0] mb-2" />
            
            {/* Test Push Notifications */}
            <Box>
              <SectionHeader title="Test Push Notifications" />
              <Pressable
                className="bg-[#C1856A] rounded-full py-4 items-center mt-4"
                onPress={() => console.log('Test Push Notifications')}
              >
                <Text className="text-white text-lg font-semibold">Test Push Notifications</Text>
              </Pressable>
            </Box>
          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
