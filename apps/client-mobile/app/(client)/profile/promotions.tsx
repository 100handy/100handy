import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Gift } from 'lucide-react-native';
import Header from '@/components/Header';
import { StatusBar } from 'expo-status-bar';
import ReferralShareModal from '@/components/modals/ReferralShareModal';
import { goBackOrReplace } from '@/lib/navigation';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

const DEFAULT_CONTENT = {
  'header.title': 'Promotions',
  'card.title': 'Help Your Friends, Get £10',
  'card.subtitle': 'Refer a Friend',
} as const;

export default function PromotionsScreen() {
  const router = useRouter();
  const [showReferralModal, setShowReferralModal] = useState(false);
  const content = useAppContent('client_promotions', DEFAULT_CONTENT);

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#FBF4ED]" edges={['top', 'bottom']}>
        <StatusBar style="dark" />
      {/* Header */}
      <Header
        title={getAppContentValue(content, 'header.title', DEFAULT_CONTENT['header.title'])}
        onBackPress={() => goBackOrReplace(router, '/(client)/(tabs)/profile')}
        showBellIcon={false}
      />

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
              {getAppContentValue(content, 'card.title', DEFAULT_CONTENT['card.title'])}
            </Text>
            <Text className="text-sm text-[#333A31]/70 mt-1">
              {getAppContentValue(content, 'card.subtitle', DEFAULT_CONTENT['card.subtitle'])}
            </Text>
          </View>
        </Pressable>
      </View>
      </SafeAreaView>

      <ReferralShareModal isOpen={showReferralModal} onClose={() => setShowReferralModal(false)} />
    </>
  );
}
