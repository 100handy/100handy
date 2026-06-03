import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppAnnouncementsFeed } from '@/components/announcements/AppAnnouncements';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

const DEFAULT_CONTENT = {
  'header.title': 'Announcements',
  'empty.title': 'No new announcements',
} as const;

export default function AnnouncementsScreen() {
  const router = useRouter();
  const content = useAppContent('professional_announcements', DEFAULT_CONTENT);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(professional)/(tabs)/dashboard');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-[#F0F0F0]">
        <Pressable onPress={handleBack}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-[18px] text-brand-dark-alt">
          {getAppContentValue(content, 'header.title', DEFAULT_CONTENT['header.title'])}
        </Text>
        <View className="w-7" />
      </View>

      <AppAnnouncementsFeed />
    </SafeAreaView>
  );
}
