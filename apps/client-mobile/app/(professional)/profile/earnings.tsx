import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ArrowLeft, Download, ChevronDown, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function EarningsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payouts'>('invoices');
  const [selectedMonth, setSelectedMonth] = useState('September');

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Box className="flex-1">
        {/* Header */}
        <Box className="bg-white px-5 py-4 border-b border-gray-100">
          <HStack className="items-center justify-between">
            <HStack className="items-center flex-1">
              <Pressable onPress={() => router.back()} className="mr-3">
                <ArrowLeft size={24} color="#30352d" />
              </Pressable>
              <Text className="text-[#30352d] text-[18px] font-bold">
                Earnings
              </Text>
            </HStack>
            <Pressable onPress={() => router.push('/profile/export-transactions')}>
              <Download size={24} color="#30352d" />
            </Pressable>
          </HStack>
        </Box>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Month Selector */}
          <Box className="px-5 pt-4">
            <Pressable className="bg-[#B8926A] rounded-lg px-4 py-3 self-start">
              <HStack className="items-center gap-2">
                <Text className="text-white text-[14px] font-bold">
                  {selectedMonth}
                </Text>
                <ChevronDown size={16} color="white" />
              </HStack>
            </Pressable>
          </Box>

          {/* Stats Grid */}
          <Box className="px-5 pt-6 pb-4">
            <VStack className="gap-4">
              {/* Row 1 */}
              <HStack className="gap-4">
                {/* Total earned */}
                <Box className="flex-1 bg-[#F5F5F5] rounded-lg p-4">
                  <VStack className="gap-1">
                    <Text className="text-[#30352d] text-[12px] font-medium">
                      Total earned
                    </Text>
                    <Text className="text-[#30352d] text-[26px] font-bold">
                      £0
                    </Text>
                  </VStack>
                </Box>

                {/* Sent to bank */}
                <Box className="flex-1 bg-[#F5F5F5] rounded-lg p-4">
                  <VStack className="gap-1">
                    <Text className="text-[#30352d] text-[12px] font-medium">
                      Sent to bank
                    </Text>
                    <Text className="text-[#30352d] text-[26px] font-bold">
                      £0
                    </Text>
                  </VStack>
                </Box>
              </HStack>

              {/* Row 2 */}
              <HStack className="gap-4">
                {/* Task count */}
                <Box className="flex-1 bg-[#F5F5F5] rounded-lg p-4">
                  <VStack className="gap-1">
                    <Text className="text-[#30352d] text-[12px] font-medium">
                      Task count
                    </Text>
                    <Text className="text-[#30352d] text-[26px] font-bold">
                      £0
                    </Text>
                  </VStack>
                </Box>

                {/* Hours invoiced */}
                <Box className="flex-1 bg-[#F5F5F5] rounded-lg p-4">
                  <VStack className="gap-1">
                    <Text className="text-[#30352d] text-[12px] font-medium">
                      Hours invoiced
                    </Text>
                    <Text className="text-[#30352d] text-[26px] font-bold">
                      £0
                    </Text>
                  </VStack>
                </Box>
              </HStack>
            </VStack>
          </Box>

          {/* Tabs */}
          <Box className="px-5 pt-4">
            <HStack className="gap-4 border-b border-gray-200">
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
            </HStack>
          </Box>

          {/* Content */}
          <Box className="px-5 pt-6 pb-8">
            {activeTab === 'invoices' && (
              <VStack className="gap-3">
                <HStack className="items-center justify-between">
                  <Text className="text-[#333a31] text-[12px] font-medium flex-1">
                    You haven't submitted new invoices yet.
                  </Text>
                  <Pressable className="ml-2">
                    <Info size={20} color="#333a31" />
                  </Pressable>
                </HStack>
                <Pressable className="self-end">
                  <Text className="text-[#c1856a] text-[10px] font-medium">
                    More info
                  </Text>
                </Pressable>
              </VStack>
            )}

            {activeTab === 'payouts' && (
              <VStack className="gap-4">
                <Text className="text-[#333a31] text-[12px] font-medium">
                  No payouts yet.
                </Text>
              </VStack>
            )}
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}

