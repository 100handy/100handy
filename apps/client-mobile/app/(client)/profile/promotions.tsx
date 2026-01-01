import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Gift, ChevronLeft } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import ReferralShareModal from '@/components/modals/ReferralShareModal';

export default function PromotionsScreen() {
  const router = useRouter();
  const [showReferralModal, setShowReferralModal] = useState(false);

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#FBF4ED]" edges={['top', 'bottom']}>
        <StatusBar style="dark" />
      {/* Header */}
      <View className="flex-row px-4 py-3 items-center border-b border-gray-200">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <ChevronLeft size={24} color="#333A31" />
          <Text className="text-lg text-[#333A31] ml-1">Profile</Text>
        </Pressable>
        <Text className="text-lg font-bold text-[#333A31] ml-8">
          Promotions
        </Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-4 pt-4">
        <Pressable
          onPress={() => setShowReferralModal(true)}
          className="bg-white rounded-xl border border-gray-200 px-4 py-4 flex-row items-center"
        >
          <View className="w-12 h-12 rounded-full bg-[#C1856A]/10 items-center justify-center mr-4">
            <Gift size={24} color="#C1856A" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-[#333A31]">
              Help Your Friends, Get £10
            </Text>
            <Text className="text-sm text-[#333A31]/70 mt-1">
              Refer a Friend
            </Text>
          </View>
        </Pressable>
      </View>
      </SafeAreaView>

      <ReferralShareModal isOpen={showReferralModal} onClose={() => setShowReferralModal(false)} />
    </>
  );
}
