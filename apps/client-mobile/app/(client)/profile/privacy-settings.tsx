import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
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
  <View className="flex-row items-start justify-between py-4 border-b border-gray-200">
    <View className="flex-col flex-1 mr-4">
      <Text className="text-base font-medium text-[#333333] mb-1">{title}</Text>
      <Text className="text-sm text-[#666666]">{description}</Text>
    </View>
    <View className="mt-1">
      <Switch
        value={isEnabled}
        onValueChange={onToggle}
        trackColor={{ false: '#E0E0E0', true: '#C1856A' }}
        thumbColor="#ffffff"
      />
    </View>
  </View>
);

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const [locationSharing, setLocationSharing] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activityStatus, setActivityStatus] = useState(false);
  const [dataCollection, setDataCollection] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <ChevronLeft size={24} color="#333333" />
            <Text className="text-base text-[#333333] ml-2">Profile</Text>
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold text-[#333333] mr-16">
            Privacy Settings
          </Text>
        </View>

        <ScrollView className="flex-1">
          <View className="flex-col px-6 py-4">
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

            <View className="mt-8 p-4 bg-gray-50 rounded-lg">
              <Text className="text-xs text-[#666666] leading-5">
                We respect your privacy. Your data is protected and will never be sold to third parties.
                For more information, read our{' '}
                <Text className="text-[#C1856A] font-semibold">Privacy Policy</Text>.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
