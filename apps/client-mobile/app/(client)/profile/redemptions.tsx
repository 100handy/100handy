import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useAccountBalance, formatBalanceDisplay } from '@shared/supabase';

export default function RedemptionsScreen() {
  const router = useRouter();
  const { data: balanceCents, isLoading, error } = useAccountBalance();

  const displayBalance = balanceCents !== undefined
    ? formatBalanceDisplay(balanceCents)
    : '0';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row px-4 py-3 items-center border-b border-gray-200">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <ChevronLeft size={24} color="#333A31" />
          <Text className="text-lg text-[#333A31] ml-1">Ed...</Text>
        </Pressable>
        <Text className="text-lg font-bold text-[#333A31] ml-8">
          Redemptions
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1">
        {/* Available Balance Section */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
          <Text className="text-base font-semibold text-[#333A31]">
            Available Balance
          </Text>
          {isLoading ? (
            <ActivityIndicator size="small" color="#333A31" />
          ) : (
            <Text className="text-base font-normal text-[#333A31]">
              {displayBalance}
            </Text>
          )}
        </View>

        {/* Information Text */}
        <View className="px-4 py-4">
          <Text className="text-sm text-[#666666] leading-5">
            Account balances are automatically applied when a task closes
          </Text>
        </View>

        {/* Error State */}
        {error && (
          <View className="px-4 py-2">
            <Text className="text-sm text-red-500">
              Unable to load balance. Please try again later.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
