import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { useRouter } from 'expo-router'; import Header from '@/components/Header'; import { StatusBar } from 'expo-status-bar'; import { useAccountBalance } from '@shared/query'; import { formatBalanceDisplay } from '@shared/supabase';
import { goBackOrReplace } from '@/lib/navigation';

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
      <Header title="Redemptions" onBackPress={() => goBackOrReplace(router, '/(client)/(tabs)/profile')} showBellIcon={false} />

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
