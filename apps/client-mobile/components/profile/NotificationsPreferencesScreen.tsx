import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@shared/supabase';
import { useToast } from '@/components/ui/toast';

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
  <View className="flex-row items-start justify-between py-1 mb-6">
    <View className="flex-col flex-1 mr-4">
      <Text className="text-lg font-medium text-[#333333] mb-1">{title}</Text>
      <Text className="text-base text-[#666666] leading-6">{description}</Text>
    </View>
    <View className="mt-2">
      <Switch
        value={isEnabled}
        onValueChange={onToggle}
        trackColor={{ false: '#E0E0E0', true: '#C1856A' }}
        thumbColor="#ffffff"
      />
    </View>
  </View>
);

export function NotificationsPreferencesScreen() {
  const router = useRouter();
  const toast = useToast();

  const { data: preferences, isLoading, error, refetch } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  const pushOffers = preferences?.notification_push_offers ?? true;
  const textUpdates = preferences?.notification_text_updates ?? true;
  const emailOffers = preferences?.notification_email_offers ?? true;

  const handleToggle = async (
    field: 'notification_push_offers' | 'notification_text_updates' | 'notification_email_offers',
    value: boolean
  ) => {
    try {
      await updatePreferences.mutateAsync({ [field]: value });
      toast.success('Success', 'Notification preferences updated');
    } catch (err) {
      console.error('Error updating notification preferences:', err);
      toast.error('Error', 'Failed to update notification preferences');
      refetch();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-6 py-6 bg-white h-[100px]">
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <ChevronLeft size={24} color="#333333" />
            <Text className="text-lg text-[#333333] ml-2">Profile</Text>
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="text-xl font-semibold text-[#333333]">Notifications</Text>
          </View>
        </View>

        {/* Separator line */}
        <View className="h-[1px] bg-[#E0E0E0]" />

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-12">
              <ActivityIndicator size="large" color="#C1856A" />
              <Text className="text-gray-600 mt-4">Loading preferences...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center py-12 px-6">
              <Text className="text-red-600 text-center mb-4">
                Failed to load notification preferences
              </Text>
              <Pressable className="bg-[#C1856A] rounded-full px-6 py-3" onPress={() => refetch()}>
                <Text className="text-white font-semibold">Retry</Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-col px-6">
              {/* Push Notifications */}
              <View>
                <SectionHeader title="Push Notifications" />
                <NotificationToggle
                  title="Task Ideas and Offers"
                  description="Task recommendations and promotional offers"
                  isEnabled={pushOffers}
                  onToggle={(value) => handleToggle('notification_push_offers', value)}
                />
                <Text className="text-base text-[#666666] mb-6 leading-6">
                  You{"'"}ll always receive push notification updates for{"\n"}your tasks and
                  account activity
                </Text>
              </View>

              {/* Separator line */}
              <View className="h-[1px] bg-[#E0E0E0] mb-2" />

              {/* Text Messages */}
              <View>
                <SectionHeader title="Text Messages" />
                <NotificationToggle
                  title="Task Updates"
                  description="Updates from HQ or your 100 Handy"
                  isEnabled={textUpdates}
                  onToggle={(value) => handleToggle('notification_text_updates', value)}
                />
              </View>

              {/* Separator line */}
              <View className="h-[1px] bg-[#E0E0E0] mb-2" />

              {/* Email Notification */}
              <View>
                <SectionHeader title="Email Notification" />
                <NotificationToggle
                  title="Task Ideas and Offers"
                  description="Task recommendations and promotional offers"
                  isEnabled={emailOffers}
                  onToggle={(value) => handleToggle('notification_email_offers', value)}
                />
                <Text className="text-base text-[#666666] mb-6 leading-6">
                  You{"'"}ll always receive push notification updates for{"\n"}your tasks and
                  account activity
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


