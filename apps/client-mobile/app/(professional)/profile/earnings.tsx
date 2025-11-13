import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Download, ChevronDown, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function EarningsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payouts'>('invoices');
  const [selectedMonth, setSelectedMonth] = useState('September');

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white px-5 py-4 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Pressable onPress={() => router.back()} className="mr-3">
                <ArrowLeft size={24} color="#30352d" />
              </Pressable>
              <Text className="text-[#30352d] text-[18px] font-bold">
                Earnings
              </Text>
            </View>
            <Pressable onPress={() => router.push('/profile/export-transactions')}>
              <Download size={24} color="#30352d" />
            </Pressable>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Month Selector */}
          <View className="px-5 pt-4">
            <Pressable className="bg-[#B8926A] rounded-lg px-4 py-3 self-start">
              <View className="flex-row items-center gap-2">
                <Text className="text-white text-[14px] font-bold">
                  {selectedMonth}
                </Text>
                <ChevronDown size={16} color="white" />
              </View>
            </Pressable>
          </View>

          {/* Stats Grid */}
          <View className="px-5 pt-6 pb-4">
            <View className="flex-col gap-4">
              {/* Row 1 */}
              <View className="flex-row gap-4">
                {/* Total earned */}
                <View className="flex-1 bg-[#F5F5F5] rounded-lg p-4">
                  <View className="flex-col gap-1">
                    <Text className="text-[#30352d] text-[12px] font-medium">
                      Total earned
                    </Text>
                    <Text className="text-[#30352d] text-[26px] font-bold">
                      £0
                    </Text>
                  </View>
                </View>

                {/* Sent to bank */}
                <View className="flex-1 bg-[#F5F5F5] rounded-lg p-4">
                  <View className="flex-col gap-1">
                    <Text className="text-[#30352d] text-[12px] font-medium">
                      Sent to bank
                    </Text>
                    <Text className="text-[#30352d] text-[26px] font-bold">
                      £0
                    </Text>
                  </View>
                </View>
              </View>

              {/* Row 2 */}
              <View className="flex-row gap-4">
                {/* Task count */}
                <View className="flex-1 bg-[#F5F5F5] rounded-lg p-4">
                  <View className="flex-col gap-1">
                    <Text className="text-[#30352d] text-[12px] font-medium">
                      Task count
                    </Text>
                    <Text className="text-[#30352d] text-[26px] font-bold">
                      £0
                    </Text>
                  </View>
                </View>

                {/* Hours invoiced */}
                <View className="flex-1 bg-[#F5F5F5] rounded-lg p-4">
                  <View className="flex-col gap-1">
                    <Text className="text-[#30352d] text-[12px] font-medium">
                      Hours invoiced
                    </Text>
                    <Text className="text-[#30352d] text-[26px] font-bold">
                      £0
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View className="px-5 pt-4">
            <View className="flex-row gap-4 border-b border-gray-200">
              <Pressable
                onPress={() => setActiveTab('invoices')}
                className={`pb-3 ${activeTab === 'invoices' ? 'border-b-2 border-[#30352d]' : ''}`}
              >
                <Text
                  className={`text-[12px] font-bold ${
                    activeTab === 'invoices' ? 'text-[#30352d]' : 'text-gray-400'
                  }`}
                >
                  Invoices
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveTab('payouts')}
                className={`pb-3 ${activeTab === 'payouts' ? 'border-b-2 border-[#30352d]' : ''}`}
              >
                <Text
                  className={`text-[12px] font-bold ${
                    activeTab === 'payouts' ? 'text-[#30352d]' : 'text-gray-400'
                  }`}
                >
                  Payouts
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Content */}
          <View className="px-5 pt-6 pb-8">
            {activeTab === 'invoices' && (
              <View className="flex-col gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[#333a31] text-[12px] font-medium flex-1">
                    You haven't submitted new invoices yet.
                  </Text>
                  <Pressable className="ml-2">
                    <Info size={20} color="#333a31" />
                  </Pressable>
                </View>
                <Pressable className="self-end">
                  <Text className="text-[#c1856a] text-[10px] font-medium">
                    More info
                  </Text>
                </Pressable>
              </View>
            )}

            {activeTab === 'payouts' && (
              <View className="flex-col gap-4">
                <Text className="text-[#333a31] text-[12px] font-medium">
                  No payouts yet.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

