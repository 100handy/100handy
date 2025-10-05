import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import gluestack-ui components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';

// Import lucide-react-native icons
import {
  ArrowLeft,
  HelpCircle,
  Calendar,
  TrendingUp,
  CreditCard,
  Briefcase,
  X,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function AnalyticsScreen() {
  const router = useRouter();
  const [showError, setShowError] = React.useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1">
        {/* Header with white background */}
        <Box className="bg-white px-6 py-4 border-b border-gray-100">
          <HStack className="items-center justify-between">
            {/* Back button */}
            <Pressable onPress={() => router.back()}>
              <ArrowLeft size={24} color="#30352D" />
            </Pressable>
            
            {/* Title */}
            <Text className="text-[#30352D] text-lg font-bold">Analytics</Text>
            
            {/* Help icon */}
            <Pressable>
              <HelpCircle size={24} color="#30352D" />
            </Pressable>
          </HStack>
        </Box>

        {/* Error Message Banner */}
        {showError && (
          <Box className="bg-[#E8D4CC] px-6 py-4">
            <HStack className="items-start justify-between">
              <VStack className="flex-1 mr-3">
                <Text className="text-[#30352D] text-sm font-bold">
                  Sorry! There seems to be a problem on our end.
                </Text>
                <Text className="text-[#30352D] text-sm font-bold">
                  Please check back later.
                </Text>
              </VStack>
              <Pressable onPress={() => setShowError(false)}>
                <X size={20} color="#30352D" />
              </Pressable>
            </HStack>
          </Box>
        )}

        {/* Main Content */}
        <ScrollView className="flex-1">
          {/* Category Cards Row */}
          <HStack className="px-6 py-6 gap-3">
            {/* Opportunity Card */}
            <VStack className="items-center flex-1">
              <Box className="bg-[#30352D] rounded-lg p-6 mb-2 w-full items-center justify-center aspect-square">
                <TrendingUp size={32} color="white" strokeWidth={2.5} />
              </Box>
              <Text className="text-[#30352D] text-xs font-bold">Opportunity</Text>
              <Box className="h-0.5 w-12 bg-[#C1856A] mt-1" />
            </VStack>

            {/* Earnings Card */}
            <VStack className="items-center flex-1">
              <Box className="bg-[#F5F5F5] rounded-lg p-6 mb-2 w-full items-center justify-center aspect-square">
                <CreditCard size={32} color="#30352D" strokeWidth={2.5} />
              </Box>
              <Text className="text-[#30352D] text-xs font-bold">Earnings</Text>
            </VStack>

            {/* Tasks Card */}
            <VStack className="items-center flex-1">
              <Box className="bg-[#F5F5F5] rounded-lg p-6 mb-2 w-full items-center justify-center aspect-square">
                <Briefcase size={32} color="#30352D" strokeWidth={2.5} />
              </Box>
              <Text className="text-[#30352D] text-xs font-bold">Tasks</Text>
            </VStack>
          </HStack>

          {/* Overview Section */}
          <Box className="px-6">
            <HStack className="items-center justify-between mb-4">
              <Text className="text-[#30352D] text-lg font-bold">Overview</Text>
              <HStack className="items-center gap-1">
                <Calendar size={16} color="#333A31" />
                <Text className="text-[#333A31] text-[10px] font-medium">PAST 30 DAYS</Text>
              </HStack>
            </HStack>

            {/* Overview Stats Card */}
            <Box className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
              <VStack className="gap-4">
                {/* Average Search Position */}
                <VStack>
                  <HStack className="items-center justify-between mb-2">
                    <Text className="text-[#30352D] text-base font-bold">
                      Average Search Position
                    </Text>
                    <Text className="text-[#30352D] text-lg font-bold">- -</Text>
                  </HStack>
                  <HStack className="items-center justify-end">
                    <Text className="text-[#333A31] text-[10px]">- -</Text>
                  </HStack>
                  <Text className="text-[#333A31] text-[10px] text-right mt-1">
                    Taskers in a search
                  </Text>
                </VStack>

                {/* Divider */}
                <Box className="h-px bg-gray-200" />

                {/* Search Result Appearances */}
                <VStack>
                  <HStack className="items-center justify-between mb-2">
                    <Text className="text-[#30352D] text-base font-bold">
                      Search Result Appearances
                    </Text>
                    <Text className="text-[#30352D] text-lg font-bold">- -</Text>
                  </HStack>
                </VStack>

                {/* Divider */}
                <Box className="h-px bg-gray-200" />

                {/* You've shown more than */}
                <VStack>
                  <HStack className="items-center justify-between mb-2">
                    <Text className="text-[#30352D] text-base font-bold">
                      You've shown more than
                    </Text>
                    <Text className="text-[#30352D] text-lg font-bold">- -</Text>
                  </HStack>
                  <Text className="text-[#333A31] text-[10px] text-right">
                    of Taskers
                  </Text>
                </VStack>
              </VStack>
            </Box>

            {/* More Details Section */}
            <Text className="text-[#30352D] text-lg font-bold mb-4">More Details</Text>

            {/* Average Search Position Detail Card */}
            <Box className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
              <VStack className="gap-4">
                <Text className="text-[#30352D] text-base font-bold">
                  Average Search Position
                </Text>

                {/* Gray info box */}
                <Box className="bg-[#F5F5F5] rounded-lg p-4">
                  <Text className="text-[#333A31] text-[10px] mb-3">
                    During an average search, you appeared:
                  </Text>
                  <HStack className="items-center gap-2">
                    <Text className="text-[#C1856A] text-lg font-bold">- -</Text>
                    <Text className="text-[#30352D] text-lg font-bold">- -</Text>
                  </HStack>
                </Box>

                {/* How can I place higher */}
                <VStack className="gap-2">
                  <Text className="text-[#30352D] text-base font-bold">
                    How can I place higher in search results?
                  </Text>
                  <Text className="text-[#30352D] text-sm leading-5">
                    There's always room to grow as a Tasker! The more
                  </Text>
                </VStack>
              </VStack>
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}