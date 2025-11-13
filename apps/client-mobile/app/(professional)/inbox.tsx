import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Mail } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useProfileStore } from '@shared/supabase';

export default function InboxScreen() {
  const router = useRouter();
  const { profile } = useProfileStore();

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-[#F0F0F0]">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-[18px] text-[#30352D]">
          {profile?.first_name ? `${profile.first_name}'s inbox` : "Mike's inbox"}
        </Text>
        <View className="w-7" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Empty State */}
        <View className="flex-col items-center justify-center py-32 px-6">
          <View className="w-20 h-20 rounded-full bg-[#B8926A] items-center justify-center mb-4">
            <Mail color="white" size={36} strokeWidth={1.5} />
          </View>
          <Text className="font-worksans-semibold text-[16px] text-[#30352D]">
            Nothing here yet!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
