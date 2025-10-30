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

interface PrivacyToggleProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

const PrivacyToggle = ({
  title,
  description,
  isEnabled,
  onToggle,
}: PrivacyToggleProps) => (
  <HStack className="items-start justify-between py-4 border-b border-gray-200">
    <VStack className="flex-1 mr-4">
      <Text className="text-base font-medium text-[#333333] mb-1">{title}</Text>
      <Text className="text-sm text-[#666666]">{description}</Text>
    </VStack>
    <View className="mt-1">
      <Switch
        size="md"
        value={isEnabled}
        onValueChange={onToggle}
        trackColor={{ false: '#E0E0E0', true: '#C1856A' }}
        thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
      />
    </View>
  </HStack>
);

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const [locationSharing, setLocationSharing] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activityStatus, setActivityStatus] = useState(false);
  const [dataCollection, setDataCollection] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1">
        {/* Header */}
        <HStack className="items-center px-6 py-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <Icon as={ChevronLeft} size="lg" className="text-[#333333]" />
            <Text className="text-base text-[#333333] ml-2">Profile</Text>
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold text-[#333333] mr-16">
            Privacy Settings
          </Text>
        </HStack>

        <ScrollView className="flex-1">
          <VStack className="px-6 py-4">
            <Text className="text-2xl font-bold text-[#333333] mb-2">Privacy Settings</Text>
            <Text className="text-sm text-[#666666] mb-6">
              Manage how your information is shared and used
            </Text>

            <PrivacyToggle
              title="Location Sharing"
              description="Allow us to access your location for task matching"
              isEnabled={locationSharing}
              onToggle={setLocationSharing}
            />

            <PrivacyToggle
              title="Profile Visibility"
              description="Let taskers see your profile and review history"
              isEnabled={profileVisibility}
              onToggle={setProfileVisibility}
            />

            <PrivacyToggle
              title="Activity Status"
              description="Show when you're active on the platform"
              isEnabled={activityStatus}
              onToggle={setActivityStatus}
            />

            <PrivacyToggle
              title="Data Collection"
              description="Allow us to collect analytics to improve your experience"
              isEnabled={dataCollection}
              onToggle={setDataCollection}
            />

            <Box className="mt-8 p-4 bg-gray-50 rounded-lg">
              <Text className="text-xs text-[#666666] leading-5">
                We respect your privacy. Your data is protected and will never be sold to third parties.
                For more information, read our{' '}
                <Text className="text-[#C1856A] font-semibold">Privacy Policy</Text>.
              </Text>
            </Box>
          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
