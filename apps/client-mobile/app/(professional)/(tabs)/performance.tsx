import React, { useState, useMemo, useCallback } from 'react';
import { useAuthStore } from '@shared/store';
import { useProfessionalRating } from '@shared/query';
import { ScrollView, View, Text, Pressable, RefreshControl } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { ChevronRight, Star, BarChart3 } from 'lucide-react-native'; import { useRouter, useFocusEffect } from 'expo-router'; import { getProfessionalEarnings, getEliteProgress, type EarningsSummary, type EliteProgress } from '@shared/supabase';
import { getUserSkills } from '@shared/supabase/profile';

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
          <Text className="font-worksans-bold text-[18px] text-brand-dark-alt mb-2">
            {title}
          </Text>
          {children}
        </View>
        <ChevronRight color="#30352D" size={24} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

function formatCurrency(cents: number): string {
  return `\u00A3${(cents / 100).toFixed(2)}`;
}

export default function PerformanceScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [activeSkillsCount, setActiveSkillsCount] = useState(0);
  const [eliteProgress, setEliteProgress] = useState<EliteProgress | null>(null);
  const { data: reviewSummary } = useProfessionalRating(user?.id ?? '');

  const { currentMonthLabel, currentMonthYear } = useMemo(() => {
    const now = new Date();
    const monthLabel = now.toLocaleDateString('en-GB', { month: 'short' });
    const monthYear = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    return { currentMonthLabel: monthLabel, currentMonthYear: monthYear };
  }, []);

  const loadData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoadError(null);
      const now = new Date();
      const [earningsData, skills, elite] = await Promise.all([
        getProfessionalEarnings(user.id, now.getFullYear(), now.getMonth() + 1),
        getUserSkills(),
        getEliteProgress(user.id),
      ]);

      setEarnings(earningsData);
      setActiveSkillsCount(skills.filter(s => s.is_active && s.hourly_rate_cents > 0).length);
      setEliteProgress(elite);
    } catch (error) {
      console.warn('Unable to load performance data:', error);
      setLoadError(error instanceof Error ? error.message : 'Failed to load performance data');
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.warn('Unable to refresh performance data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate elite milestones
  const eliteMilestones = useMemo(() => {
    if (!eliteProgress) return { met: 0, total: 4, percent: 0 };
    let met = 0;
    if (eliteProgress.monthlyCompletedTasks >= 10) met++;
    if (eliteProgress.lifetimeCompletedTasks >= 200) met++;
    if (eliteProgress.categoryProgress.some(c => c.completedTasks >= 50)) met++;
    // 4th milestone (top 35% performance) requires tracking — count as not met for now
    return { met, total: 4, percent: Math.round((met / 4) * 100) };
  }, [eliteProgress]);

  if (loadError) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
        <View className="bg-white px-5 py-4 border-b border-[#F0F0F0]">
          <Text className="font-worksans-bold text-[20px] text-brand-dark-alt text-center">
            Performance
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="font-worksans text-[16px] text-brand-dark-alt text-center mb-2">
            Failed to load performance data
          </Text>
          <Text className="font-worksans text-[14px] text-[#6B6B6B] text-center mb-4">
            {loadError}
          </Text>
          <Pressable
            onPress={loadData}
            className="bg-brand-terracotta px-6 py-2.5 rounded-full"
          >
            <Text className="text-white font-medium">Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
      {/* Header */}
      <View className="bg-white px-5 py-4 border-b border-[#F0F0F0]">
        <Text className="font-worksans-bold text-[20px] text-brand-dark-alt text-center">
          Performance
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C1856A" />
        }
      >
        <View className="flex-col py-4">
          {/* Earnings Card */}
          <PerformanceCard
            title="Earnings"
            onPress={() => router.push('/(professional)/profile/earnings')}
          >
            <View className="flex-col gap-1">
              <View className="flex-row items-baseline gap-2">
                <Text className="font-worksans text-[14px] text-[#6B6B6B]">
                  {currentMonthLabel} Total
                </Text>
                <Text className="font-worksans-bold text-[24px] text-brand-dark-alt">
                  {formatCurrency(earnings?.totalEarned || 0)}
                </Text>
              </View>
              <Text className="font-worksans text-[14px] text-[#6B6B6B]">
                {earnings?.taskCount || 0} {(earnings?.taskCount || 0) === 1 ? 'task' : 'tasks'} completed
              </Text>
            </View>
          </PerformanceCard>

          {/* Reviews Card */}
          <PerformanceCard
            title="Reviews"
            onPress={() => router.push('/(professional)/profile/reviews')}
          >
            <View className="flex-col gap-2">
              <View className="flex-row items-baseline gap-2">
                <Text className="font-worksans-bold text-[32px] text-brand-dark-alt">
                  {reviewSummary && reviewSummary.totalReviews > 0
                    ? reviewSummary.averageRating.toFixed(1)
                    : '--'}
                </Text>
                <Text className="font-worksans text-[18px] text-[#6B6B6B]">
                  / 5
                </Text>
              </View>
              <Text className="font-worksans text-[12px] text-[#6B6B6B]">
                {reviewSummary && reviewSummary.totalReviews > 0
                  ? `(${reviewSummary.totalReviews} ${
                      reviewSummary.totalReviews === 1 ? 'review' : 'reviews'
                    })`
                  : '(no reviews yet)'}
              </Text>
              <View className="flex-row gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    color={
                      reviewSummary && star <= Math.round(reviewSummary.averageRating)
                        ? '#C1856A'
                        : '#E5E5E5'
                    }
                    size={20}
                    strokeWidth={2}
                    fill={
                      reviewSummary && star <= Math.round(reviewSummary.averageRating)
                        ? '#C1856A'
                        : '#E5E5E5'
                    }
                  />
                ))}
              </View>
              <Text className="font-worksans-medium text-[11px] text-brand-taupe mt-1">
                {reviewSummary && reviewSummary.totalReviews > 0
                  ? 'Tap to view all customer reviews'
                  : 'Reviews will appear here after completing jobs'}
              </Text>
            </View>
          </PerformanceCard>

          {/* Analytics Card */}
          <PerformanceCard
            title="Analytics"
            onPress={() => router.push('/(professional)/profile/analytics')}
          >
            <View className="flex-col gap-1">
              <View className="flex-row items-center gap-2">
                <BarChart3 color="#B29D88" size={20} strokeWidth={1.5} />
                <Text className="font-worksans text-[14px] text-[#6B6B6B]">
                  View detailed analytics
                </Text>
              </View>
              <Text className="font-worksans text-[12px] text-[#6B6B6B] mt-1">
                Earnings, tasks, and opportunity metrics
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
                <Text className="font-worksans-bold text-[20px] text-brand-dark-alt">
                  {activeSkillsCount}
                </Text>
              </View>
              {activeSkillsCount === 0 && (
                <Text className="font-worksans text-[13px] text-[#6B6B6B] mt-1">
                  Activate at least one skill to be hirable.
                </Text>
              )}
            </View>
          </PerformanceCard>

          {/* Star Status Section */}
          <View className="bg-white mx-4 mb-6">
            <View className="flex-col gap-1 mb-3">
              <Text className="font-worksans-bold text-[18px] text-brand-dark-alt">
                Star status
              </Text>
              <Text className="font-worksans text-[13px] text-[#6B6B6B]">
                Become a 100Handy Star and earn up to 3x more!
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
                    Star progress
                  </Text>
                  <Text className="font-worksans-bold text-[32px] text-[#1F3A2C] mb-4">
                    {currentMonthYear}
                  </Text>

                  {/* Progress Bar */}
                  <View className="mb-3">
                    <View className="h-2 bg-white rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${eliteMilestones.percent}%`,
                          backgroundColor: '#1F3A2C',
                        }}
                      />
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="font-worksans text-[12px] text-[#1F3A2C]">
                      {eliteMilestones.met} / {eliteMilestones.total} milestones met
                    </Text>
                    <Text className="font-worksans-bold text-[12px] text-[#1F3A2C]">
                      {eliteMilestones.percent}%
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
