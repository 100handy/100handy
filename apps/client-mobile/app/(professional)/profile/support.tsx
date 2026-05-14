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

interface MenuItem {
  label: string;
  hasChevron?: boolean;
  onPress?: () => void;
}

export default function SupportScreen() {
  const router = useRouter();
  const toast = useToast();

  const handleHandySupport = () => {
    Linking.openURL('https://100handy.com/help');
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
        toast.error('Notifications disabled', 'Enable notifications to test this feature.');
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

      toast.success('Test notification sent', 'A banner should appear immediately.');
    } catch (e) {
      console.error('Test push notification error:', e);
      toast.error('Notification test failed', 'Unable to trigger the test notification.');
    }
  };

  const menuItems: MenuItem[] = [
    {
      label: '100Handy Support',
      hasChevron: true,
      onPress: handleHandySupport,
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
      <View className="flex-row py-4 px-5 items-center justify-between border-b border-gray-100">
        <Pressable className="w-10 items-start" onPress={() => goBackOrReplace(router, '/(professional)/(tabs)/profile')}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-xl text-theme-font">
          Support
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
            Version 1.2.0 (100Handy)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
