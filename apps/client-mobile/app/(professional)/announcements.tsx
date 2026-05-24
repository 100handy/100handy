import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Megaphone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
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

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Empty State */}
        <View className="flex-col items-center justify-center py-32 px-6">
          <View className="w-20 h-20 rounded-full bg-brand-taupe items-center justify-center mb-4">
            <Megaphone color="white" size={36} strokeWidth={1.5} />
          </View>
          <Text className="font-worksans-semibold text-[16px] text-brand-dark-alt">
            {getAppContentValue(content, 'empty.title', DEFAULT_CONTENT['empty.title'])}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
