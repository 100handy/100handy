import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Star, BarChart3 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

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
      <View className="flex-row items-center justify-between">
        <View className="flex-col flex-1">
          <Text className="font-worksans-bold text-[18px] text-[#30352D] mb-2">
            {title}
          </Text>
          {children}
        </View>
        <ChevronRight color="#30352D" size={24} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

export default function ProfessionalEarnings() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
      {/* Header */}
      <View className="bg-white px-5 py-4 border-b border-[#F0F0F0]">
        <Text className="font-worksans-bold text-[20px] text-[#30352D] text-center">
          Performance
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col py-4">
          {/* Earnings Card */}
          <PerformanceCard
            title="Earnings"
            onPress={() => router.push('/(professional)/profile/earnings')}
          >
            <View className="flex-col gap-1">
              <View className="flex-row items-baseline gap-2">
                <Text className="font-worksans text-[14px] text-[#6B6B6B]">
                  Sep Total
                </Text>
                <Text className="font-worksans-bold text-[24px] text-[#30352D]">
                  £0
                </Text>
              </View>
              <Text className="font-worksans text-[14px] text-[#6B6B6B]">
                Task count
              </Text>
            </View>
          </PerformanceCard>

          {/* Reviews Card */}
          <PerformanceCard title="Reviews">
            <View className="flex-col gap-2">
              <View className="flex-row items-baseline gap-2">
                <Text className="font-worksans-bold text-[32px] text-[#30352D]">
                  --
                </Text>
                <Text className="font-worksans text-[18px] text-[#6B6B6B]">
                  / 5
                </Text>
              </View>
              <Text className="font-worksans text-[12px] text-[#6B6B6B]">
                (no review yet)
              </Text>
              <View className="flex-row gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} color="#E5E5E5" size={20} strokeWidth={2} fill="#E5E5E5" />
                ))}
              </View>
            </View>
          </PerformanceCard>

          {/* Analytics Card */}
          <PerformanceCard 
            title="Analytics" 
            onPress={() => router.push('/profile/analytics')}
          >
            <View className="flex-col gap-1">
              <View className="flex-row items-center gap-2">
                <BarChart3 color="#B8926A" size={20} strokeWidth={1.5} />
                <Text className="font-worksans text-[14px] text-[#6B6B6B]">
                  View detailed analytics
                </Text>
              </View>
              <Text className="font-worksans text-[12px] text-[#6B6B6B] mt-1">
                Search position, appearances, and performance metrics
              </Text>
            </View>
          </PerformanceCard>

          {/* Skills & Rates Card */}
          <PerformanceCard
            title="Skills & rates"
            onPress={() => router.push('/(professional)/skills/my-skills')}
          >
            <View className="flex-col gap-1">
              <View className="flex-row items-baseline gap-2">
                <Text className="font-worksans text-[14px] text-[#6B6B6B]">
                  Activated skills:
                </Text>
                <Text className="font-worksans-bold text-[20px] text-[#30352D]">
                  0
                </Text>
              </View>
              <Text className="font-worksans text-[13px] text-[#6B6B6B] mt-1">
                Activate at least one skill to be hirable.
              </Text>
            </View>
          </PerformanceCard>

          {/* Elite Status Section */}
          <View className="bg-white mx-4 mb-6">
            <View className="flex-col gap-1 mb-3">
              <Text className="font-worksans-bold text-[18px] text-[#30352D]">
                Elite status
              </Text>
              <Text className="font-worksans text-[13px] text-[#6B6B6B]">
                Become Elite and earn up to 3x more!
              </Text>
            </View>

            <Pressable
              className="rounded-2xl p-5"
              style={{ backgroundColor: '#A7D5B8' }}
              onPress={() => router.push('/(professional)/elite')}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-col flex-1">
                  <Text className="font-worksans text-[13px] text-[#1F3A2C] mb-1">
                    Elite progress
                  </Text>
                  <Text className="font-worksans-bold text-[32px] text-[#1F3A2C] mb-4">
                    December 2025
                  </Text>

                  {/* Progress Bar */}
                  <View className="mb-3">
                    <View className="h-2 bg-white rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: '0%',
                          backgroundColor: '#1F3A2C',
                        }}
                      />
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="font-worksans text-[12px] text-[#1F3A2C]">
                      0 / 4 milestones met
                    </Text>
                    <Text className="font-worksans-bold text-[12px] text-[#1F3A2C]">
                      0%
                    </Text>
                  </View>
                </View>
                <View className="ml-3">
                  <ChevronRight color="#1F3A2C" size={24} strokeWidth={2} />
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
