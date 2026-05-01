import React from 'react';
import { useUpdatePrivacySettings } from '@shared/query';
import { SafeAreaView } from 'react-native-safe-area-context'; import { ScrollView, View, Text, Pressable, Switch, ActivityIndicator } from 'react-native'; import { useRouter } from 'expo-router'; import Header from '@/components/Header'; import { usePrivacySettings } from '@shared/query';
import { useToast } from '@/components/ui/toast';

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
  const toast = useToast();

  // Fetch privacy settings from backend
  const { data: settings, isLoading, error, refetch } = usePrivacySettings();
  const updateSettings = useUpdatePrivacySettings();

  // Use backend data or fallback to defaults
  const locationSharing = settings?.privacy_location_sharing ?? true;
  const profileVisibility = settings?.privacy_profile_visibility ?? true;
  const activityStatus = settings?.privacy_activity_status ?? false;
  const dataCollection = settings?.privacy_data_collection ?? true;

  const handleToggle = async (
    field: 'privacy_location_sharing' | 'privacy_profile_visibility' | 'privacy_activity_status' | 'privacy_data_collection',
    value: boolean
  ) => {
    try {
      await updateSettings.mutateAsync({ [field]: value });
      toast.success('Success', 'Privacy settings updated');
    } catch (err) {
      console.error('Error updating privacy settings:', err);
      toast.error('Error', 'Failed to update privacy settings');
      // Refetch to revert to previous value
      refetch();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <Header title="Privacy Settings" onBackPress={() => router.back()} showBellIcon={false} />

        <ScrollView className="flex-1">
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-12">
              <ActivityIndicator size="large" color="#C1856A" />
              <Text className="text-gray-600 mt-4">Loading settings...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center py-12 px-6">
              <Text className="text-red-600 text-center mb-4">
                Failed to load privacy settings
              </Text>
              <Pressable
                className="bg-[#C1856A] rounded-full px-6 py-3"
                onPress={() => refetch()}
              >
                <Text className="text-white font-semibold">Retry</Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-col px-6 py-4">
              <Text className="text-2xl font-bold text-[#333333] mb-2">Privacy Settings</Text>
              <Text className="text-sm text-[#666666] mb-6">
                Manage how your information is shared and used
              </Text>

              <PrivacyToggle
                title="Location Sharing"
                description="Allow us to access your location for task matching"
                isEnabled={locationSharing}
                onToggle={(value) => handleToggle('privacy_location_sharing', value)}
              />

              <PrivacyToggle
                title="Profile Visibility"
                description="Let taskers see your profile and review history"
                isEnabled={profileVisibility}
                onToggle={(value) => handleToggle('privacy_profile_visibility', value)}
              />

              <PrivacyToggle
                title="Activity Status"
                description="Show when you're active on the platform"
                isEnabled={activityStatus}
                onToggle={(value) => handleToggle('privacy_activity_status', value)}
              />

              <PrivacyToggle
                title="Data Collection"
                description="Allow us to collect analytics to improve your experience"
                isEnabled={dataCollection}
                onToggle={(value) => handleToggle('privacy_data_collection', value)}
              />

              <View className="mt-8 p-4 bg-gray-50 rounded-lg">
                <Text className="text-xs text-[#666666] leading-5">
                  We respect your privacy. Your data is protected and will never be sold to third parties.
                  For more information, read our{' '}
                  <Text className="text-[#C1856A] font-semibold">Privacy Policy</Text>.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
