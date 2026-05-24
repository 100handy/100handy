import React from 'react';
import { useUpdatePrivacySettings } from '@shared/query';
import { SafeAreaView } from 'react-native-safe-area-context'; import { ScrollView, View, Text, Pressable, Switch, ActivityIndicator } from 'react-native'; import { useRouter } from 'expo-router'; import Header from '@/components/Header'; import { usePrivacySettings } from '@shared/query';
import { useToast } from '@/components/ui/toast';
import { goBackOrReplace } from '@/lib/navigation';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

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
  const content = useAppContent('client_privacy_settings', {
    'header.title': 'Privacy Settings',
    'hero.title': 'Privacy Settings',
    'hero.body': 'Manage how your information is shared and used',
    'loading.text': 'Loading settings...',
    'error.title': 'Failed to load privacy settings',
    'error.retry': 'Retry',
    'toasts.success_title': 'Success',
    'toasts.success_body': 'Privacy settings updated',
    'toasts.error_title': 'Error',
    'toasts.error_body': 'Failed to update privacy settings',
    'toggle_location.title': 'Location Sharing',
    'toggle_location.body': 'Allow us to access your location for task matching',
    'toggle_profile.title': 'Profile Visibility',
    'toggle_profile.body': 'Let taskers see your profile and review history',
    'toggle_activity.title': 'Activity Status',
    'toggle_activity.body': "Show when you're active on the platform",
    'toggle_data.title': 'Data Collection',
    'toggle_data.body': 'Allow us to collect analytics to improve your experience',
    'footer.policy_notice': 'We respect your privacy. Your data is protected and will never be sold to third parties. For more information, read our Privacy Policy.',
  });

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
      toast.success(
        getAppContentValue(content, 'toasts.success_title', 'Success'),
        getAppContentValue(content, 'toasts.success_body', 'Privacy settings updated'),
      );
    } catch (err) {
      console.error('Error updating privacy settings:', err);
      toast.error(
        getAppContentValue(content, 'toasts.error_title', 'Error'),
        getAppContentValue(content, 'toasts.error_body', 'Failed to update privacy settings'),
      );
      // Refetch to revert to previous value
      refetch();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <Header title={getAppContentValue(content, 'header.title', 'Privacy Settings')} onBackPress={() => goBackOrReplace(router, '/(client)/(tabs)/profile')} showBellIcon={false} />

        <ScrollView className="flex-1">
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-12">
              <ActivityIndicator size="large" color="#C1856A" />
              <Text className="text-gray-600 mt-4">{getAppContentValue(content, 'loading.text', 'Loading settings...')}</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center py-12 px-6">
              <Text className="text-red-600 text-center mb-4">
                {getAppContentValue(content, 'error.title', 'Failed to load privacy settings')}
              </Text>
              <Pressable
                className="bg-[#C1856A] rounded-full px-6 py-3"
                onPress={() => refetch()}
              >
                <Text className="text-white font-semibold">{getAppContentValue(content, 'error.retry', 'Retry')}</Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-col px-6 py-4">
              <Text className="text-2xl font-bold text-[#333333] mb-2">{getAppContentValue(content, 'hero.title', 'Privacy Settings')}</Text>
              <Text className="text-sm text-[#666666] mb-6">
                {getAppContentValue(content, 'hero.body', 'Manage how your information is shared and used')}
              </Text>

              <PrivacyToggle
                title={getAppContentValue(content, 'toggle_location.title', 'Location Sharing')}
                description={getAppContentValue(content, 'toggle_location.body', 'Allow us to access your location for task matching')}
                isEnabled={locationSharing}
                onToggle={(value) => handleToggle('privacy_location_sharing', value)}
              />

              <PrivacyToggle
                title={getAppContentValue(content, 'toggle_profile.title', 'Profile Visibility')}
                description={getAppContentValue(content, 'toggle_profile.body', 'Let taskers see your profile and review history')}
                isEnabled={profileVisibility}
                onToggle={(value) => handleToggle('privacy_profile_visibility', value)}
              />

              <PrivacyToggle
                title={getAppContentValue(content, 'toggle_activity.title', 'Activity Status')}
                description={getAppContentValue(content, 'toggle_activity.body', "Show when you're active on the platform")}
                isEnabled={activityStatus}
                onToggle={(value) => handleToggle('privacy_activity_status', value)}
              />

              <PrivacyToggle
                title={getAppContentValue(content, 'toggle_data.title', 'Data Collection')}
                description={getAppContentValue(content, 'toggle_data.body', 'Allow us to collect analytics to improve your experience')}
                isEnabled={dataCollection}
                onToggle={(value) => handleToggle('privacy_data_collection', value)}
              />

              <View className="mt-8 p-4 bg-gray-50 rounded-lg">
                <Text className="text-xs text-[#666666] leading-5">
                  {getAppContentValue(content, 'footer.policy_notice', 'We respect your privacy. Your data is protected and will never be sold to third parties. For more information, read our Privacy Policy.')}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
