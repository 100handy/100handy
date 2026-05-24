import React from 'react';
import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import { useToast } from '@/components/ui/toast';
import {
  configureNotifications,
  ensureAndroidNotificationChannelAsync,
} from '@/lib/notifications';
import { goBackOrReplace } from '@/lib/navigation';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

interface MenuItem {
  label: string;
  hasChevron?: boolean;
  onPress?: () => void;
}

const DEFAULT_CONTENT = {
  'header.title': 'Support',
  'menu.support_center': '100Handy Support',
  'menu.support_center_url': 'https://100handy.com/help',
  'menu.test_notifications': 'Test push notifications',
  'notifications.disabled_title': 'Notifications disabled',
  'notifications.disabled_body': 'Enable notifications to test this feature.',
  'notifications.sent_title': 'Test notification sent',
  'notifications.sent_body': 'A banner should appear immediately.',
  'notifications.error_title': 'Notification test failed',
  'notifications.error_body': 'Unable to trigger the test notification.',
  'version.prefix': 'Version',
} as const;

export default function SupportScreen() {
  const router = useRouter();
  const toast = useToast();
  const content = useAppContent('professional_support', DEFAULT_CONTENT);

  const handleHandySupport = () => {
    Linking.openURL(
      getAppContentValue(
        content,
        'menu.support_center_url',
        DEFAULT_CONTENT['menu.support_center_url'],
      ),
    );
  };

  const handleTestNotifications = async () => {
    try {
      configureNotifications();
      await ensureAndroidNotificationChannelAsync();

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        toast.error(
          getAppContentValue(content, 'notifications.disabled_title', DEFAULT_CONTENT['notifications.disabled_title']),
          getAppContentValue(content, 'notifications.disabled_body', DEFAULT_CONTENT['notifications.disabled_body']),
        );
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Notifications are working',
          body: 'If you can see this banner, notifications are enabled on this device.',
          data: { route: '/(professional)/(tabs)/dashboard' },
        },
        trigger: null,
      });

      toast.success(
        getAppContentValue(content, 'notifications.sent_title', DEFAULT_CONTENT['notifications.sent_title']),
        getAppContentValue(content, 'notifications.sent_body', DEFAULT_CONTENT['notifications.sent_body']),
      );
    } catch (e) {
      console.error('Test push notification error:', e);
      toast.error(
        getAppContentValue(content, 'notifications.error_title', DEFAULT_CONTENT['notifications.error_title']),
        getAppContentValue(content, 'notifications.error_body', DEFAULT_CONTENT['notifications.error_body']),
      );
    }
  };

  const menuItems: MenuItem[] = [
    {
      label: getAppContentValue(content, 'menu.support_center', DEFAULT_CONTENT['menu.support_center']),
      hasChevron: true,
      onPress: handleHandySupport,
    },
    {
      label: getAppContentValue(content, 'menu.test_notifications', DEFAULT_CONTENT['menu.test_notifications']),
      hasChevron: true,
      onPress: handleTestNotifications,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row py-4 px-5 items-center justify-between border-b border-gray-100">
        <Pressable className="w-10 items-start" onPress={() => goBackOrReplace(router, '/(professional)/(tabs)/profile')}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-xl text-theme-font">
          {getAppContentValue(content, 'header.title', DEFAULT_CONTENT['header.title'])}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Menu Items */}
        <View className="flex-col ">
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              className="px-5 py-5 border-b border-gray-100"
              onPress={item.onPress}
            >
              <View className="flex-row items-center justify-between">
                <Text className="font-worksans-bold text-lg text-theme-font flex-1">
                  {item.label}
                </Text>
                {item.hasChevron && (
                  <ChevronRight color="#BDBDBD" size={22} strokeWidth={2} />
                )}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Version Info */}
        <View className="px-5 py-4">
          <Text className="font-worksans text-sm text-gray-500">
            {getAppContentValue(content, 'version.prefix', DEFAULT_CONTENT['version.prefix'])} 1.2.0 (100Handy)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
