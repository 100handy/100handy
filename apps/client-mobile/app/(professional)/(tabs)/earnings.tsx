import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { ChevronRight, Star } from 'lucide-react-native';

interface PerformanceCardProps {
  title: string;
  children: React.ReactNode;
  onPress?: () => void;
}

function PerformanceCard({ title, children, onPress }: PerformanceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white mx-4 mb-3 p-4 rounded-2xl"
    >
      <HStack className="items-center justify-between">
        <VStack className="flex-1">
          <Text className="font-worksans-bold text-[18px] text-[#30352D] mb-2">
            {title}
          </Text>
          {children}
        </VStack>
        <ChevronRight color="#30352D" size={24} strokeWidth={2} />
      </HStack>
    </Pressable>
  );
}

export default function ProfessionalEarnings() {

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
      {/* Header */}
      <Box className="bg-white px-5 py-4 border-b border-[#F0F0F0]">
        <Text className="font-worksans-bold text-[20px] text-[#30352D] text-center">
          Performance
        </Text>
      </Box>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <VStack className="py-4">
          {/* Earnings Card */}
          <PerformanceCard title="Earnings">
            <VStack className="gap-1">
              <HStack className="items-baseline gap-2">
                <Text className="font-worksans text-[14px] text-[#6B6B6B]">
                  Sep Total
                </Text>
                <Text className="font-worksans-bold text-[24px] text-[#30352D]">
                  £0
                </Text>
              </HStack>
              <Text className="font-worksans text-[14px] text-[#6B6B6B]">
                Task count
              </Text>
            </VStack>
          </PerformanceCard>

          {/* Reviews Card */}
          <PerformanceCard title="Reviews">
            <VStack className="gap-2">
              <HStack className="items-baseline gap-2">
                <Text className="font-worksans-bold text-[32px] text-[#30352D]">
                  --
                </Text>
                <Text className="font-worksans text-[18px] text-[#6B6B6B]">
                  / 5
                </Text>
              </HStack>
              <Text className="font-worksans text-[12px] text-[#6B6B6B]">
                (no review yet)
              </Text>
              <HStack className="gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} color="#E5E5E5" size={20} strokeWidth={2} fill="#E5E5E5" />
                ))}
              </HStack>
            </VStack>
          </PerformanceCard>

          {/* Reviews Info Card */}
          <PerformanceCard title="Reviews">
            <VStack className="gap-2">
              <Text className="font-worksans text-[14px] text-[#30352D] leading-5">
                We don’t have your numbers yet! Actively task{'\n'}For 30 days and check back to see result.
              </Text>
              <VStack className="gap-1 mt-2">
                <Text className="font-worksans text-[13px] text-[#6B6B6B]">
                  Average search position <Text className="font-worksans-bold">--</Text>
                </Text>
                <Text className="font-worksans text-[13px] text-[#6B6B6B]">
                  You’ve shown more than <Text className="font-worksans-bold">--</Text>
                </Text>
              </VStack>
            </VStack>
          </PerformanceCard>

          {/* Skills & Rates Card */}
          <PerformanceCard title="Skills & rates">
            <VStack className="gap-1">
              <HStack className="items-baseline gap-2">
                <Text className="font-worksans text-[14px] text-[#6B6B6B]">
                  Activated skills:
                </Text>
                <Text className="font-worksans-bold text-[20px] text-[#30352D]">
                  0
                </Text>
              </HStack>
              <Text className="font-worksans text-[13px] text-[#6B6B6B] mt-1">
                Activate at least one skill to be hirable.
              </Text>
            </VStack>
          </PerformanceCard>

          {/* Elite Status Card */}
          <Box className="mx-4 mb-6">
            <VStack className="gap-2">
              <Text className="font-worksans-bold text-[18px] text-[#30352D]">
                Elite status
              </Text>
              <Text className="font-worksans text-[13px] text-[#6B6B6B]">
                Become elite and earn up to 3x more!
              </Text>
            </VStack>

            <Pressable className="mt-3 bg-[#A8B89E] rounded-2xl p-4">
              <HStack className="items-center justify-between">
                <VStack className="flex-1 gap-2">
                  <Text className="font-worksans text-[12px] text-[#30352D]">
                    Elite progress
                  </Text>
                  <Text className="font-worksans-bold text-[28px] text-[#30352D]">
                    October 2025
                  </Text>
                  <HStack className="items-center justify-between mt-2">
                    <Text className="font-worksans text-[11px] text-[#30352D]">
                      0 / 4 milestones met
                    </Text>
                    <Text className="font-worksans-bold text-[11px] text-[#30352D]">
                      0%
                    </Text>
                  </HStack>
                  <Box className="h-2 bg-[#30352D] bg-opacity-20 rounded-full overflow-hidden mt-1">
                    <Box className="h-full w-0 bg-[#30352D]" />
                  </Box>
                </VStack>
                <ChevronRight color="#30352D" size={24} strokeWidth={2} />
              </HStack>
            </Pressable>
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
