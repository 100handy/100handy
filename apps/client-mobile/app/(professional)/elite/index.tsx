import React, { useState, useMemo, useCallback } from 'react';
import { useAuthStore } from '@shared/store';
import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { router, useFocusEffect } from 'expo-router'; import { ChevronLeft, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react-native'; import { getUserSkills, UserSkill } from '@shared/supabase/profile'; import { getEliteProgress, type EliteProgress } from '@shared/supabase';
import { goBackOrReplace } from '@/lib/navigation';

type TabType = 'progress' | 'about';

export default function EliteScreen() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('progress');
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [eliteProgress, setEliteProgress] = useState<EliteProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const currentMonthYear = useMemo(() => {
    return new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [userSkills, elite] = await Promise.all([
        getUserSkills(),
        user?.id ? getEliteProgress(user.id) : Promise.resolve(null),
      ]);
      const activeSkills = userSkills.filter(s => s.is_active && s.hourly_rate_cents > 0);
      setSkills(activeSkills);
      setEliteProgress(elite);
    } catch (error) {
      console.error('Error loading elite data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.skill?.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, UserSkill[]>);

  // Calculate milestones
  const milestones = useMemo(() => {
    if (!eliteProgress) return { met: 0, total: 4, percent: 0 };
    let met = 0;
    if (eliteProgress.monthlyCompletedTasks >= 10) met++;
    if (eliteProgress.lifetimeCompletedTasks >= 200) met++;
    if (eliteProgress.categoryProgress.some(c => c.completedTasks >= 50)) met++;
    // 4th milestone (top 35% performance) requires tracking
    return { met, total: 4, percent: Math.round((met / 4) * 100) };
  }, [eliteProgress]);

  // Get completed tasks for a category from elite progress
  const getCategoryCompletedTasks = (categoryName: string): number => {
    if (!eliteProgress) return 0;
    const match = eliteProgress.categoryProgress.find(c => c.category === categoryName);
    return match?.completedTasks || 0;
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#C1856A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <Pressable onPress={() => goBackOrReplace(router, '/(professional)/(tabs)/performance')} className="mr-4">
            <ChevronLeft size={24} color="#1F2937" strokeWidth={2} />
          </Pressable>
          <Text
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: 'WorkSans_700Bold' }}
          >
            Star
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200">
        <Pressable
          onPress={() => setActiveTab('progress')}
          className="flex-1 py-4"
          style={{
            borderBottomWidth: activeTab === 'progress' ? 3 : 0,
            borderBottomColor: '#C1856A',
          }}
        >
          <Text
            className="text-center text-base font-semibold"
            style={{
              fontFamily: 'WorkSans_600SemiBold',
              color: activeTab === 'progress' ? '#C1856A' : '#9CA3AF',
            }}
          >
            Progress
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('about')}
          className="flex-1 py-4"
          style={{
            borderBottomWidth: activeTab === 'about' ? 3 : 0,
            borderBottomColor: '#C1856A',
          }}
        >
          <Text
            className="text-center text-base font-semibold"
            style={{
              fontFamily: 'WorkSans_600SemiBold',
              color: activeTab === 'about' ? '#C1856A' : '#9CA3AF',
            }}
          >
            About
          </Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {activeTab === 'progress' ? (
          <View className="px-4 py-6 gap-6">
            {/* Star Progress Card */}
            <View
              className="rounded-xl p-6"
              style={{ backgroundColor: '#BBF7D0' }}
            >
              <Text
                className="text-sm text-gray-700 mb-2"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                Star progress
              </Text>
              <Text
                className="text-3xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                {currentMonthYear}
              </Text>

              {/* Progress Bar */}
              <View className="mb-4">
                <View className="h-2 bg-white rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${milestones.percent}%`,
                      backgroundColor: '#16A34A',
                    }}
                  />
                </View>
              </View>

              <View className="flex-row justify-between">
                <Text
                  className="text-sm text-gray-700"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  {milestones.met} / {milestones.total} milestones met
                </Text>
                <Text
                  className="text-sm font-semibold text-gray-900"
                  style={{ fontFamily: 'WorkSans_600SemiBold' }}
                >
                  {milestones.percent}%
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View className="items-center">
              <Text
                className="text-2xl text-gray-400"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                --
              </Text>
            </View>

            {/* Monthly Task Progress */}
            <View className="gap-3">
              <Text
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                Monthly task progress
              </Text>
              <Text
                className="text-sm text-gray-600"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                This resets each month.
              </Text>

              <View className="bg-gray-100 rounded-lg p-4 mt-2">
                <Text
                  className="text-base text-gray-900 mb-3"
                  style={{ fontFamily: 'WorkSans_500Medium' }}
                >
                  {eliteProgress?.monthlyCompletedTasks || 0} / 10 Monthly tasks
                </Text>
                <View className="h-2 bg-gray-300 rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(((eliteProgress?.monthlyCompletedTasks || 0) / 10) * 100, 100)}%`,
                      backgroundColor: '#C1856A',
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Lifetime Task Progress */}
            <View className="gap-3">
              <Text
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                Lifetime task progress
              </Text>
              <Text
                className="text-sm text-gray-600"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                Reach 200 once—it never resets.
              </Text>

              <View className="bg-gray-100 rounded-lg p-4 mt-2">
                <Text
                  className="text-base text-gray-900 mb-3"
                  style={{ fontFamily: 'WorkSans_500Medium' }}
                >
                  {eliteProgress?.lifetimeCompletedTasks || 0} / 200 Lifetime tasks
                </Text>
                <View className="h-2 bg-gray-300 rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(((eliteProgress?.lifetimeCompletedTasks || 0) / 200) * 100, 100)}%`,
                      backgroundColor: '#C1856A',
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Category Task Progress */}
            <View className="gap-3">
              <Text
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                Category task progress
              </Text>
              <Text
                className="text-sm text-gray-600"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                Reach 50 tasks per category (it never resets) and be a top 35% performer (calculated monthly).
              </Text>

              {/* Categories */}
              <View className="gap-4 mt-2">
                {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
                  const isExpanded = expandedCategories.has(category);
                  const completedInCategory = getCategoryCompletedTasks(category);
                  const categoryPercent = Math.min((completedInCategory / 50) * 100, 100);

                  return (
                    <View key={category} className="gap-3">
                      {/* Category Header */}
                      <Text
                        className="text-lg font-semibold text-gray-900"
                        style={{ fontFamily: 'WorkSans_600SemiBold' }}
                      >
                        {category}
                      </Text>

                      {/* Category Progress */}
                      <View className="bg-gray-100 rounded-lg p-4">
                        <Text
                          className="text-base text-gray-900 mb-3"
                          style={{ fontFamily: 'WorkSans_500Medium' }}
                        >
                          {completedInCategory} / 50 {category}
                        </Text>
                        <View className="h-2 bg-gray-300 rounded-full overflow-hidden">
                          <View
                            className="h-full rounded-full"
                            style={{
                              width: `${categoryPercent}%`,
                              backgroundColor: '#C1856A',
                            }}
                          />
                        </View>
                      </View>

                      {/* Performance Score Ranking */}
                      <View className="bg-gray-100 rounded-lg overflow-hidden">
                        <Pressable
                          onPress={() => toggleCategory(category)}
                          className="flex-row items-center justify-between p-4"
                        >
                          <Text
                            className="text-base text-gray-900"
                            style={{ fontFamily: 'WorkSans_500Medium' }}
                          >
                            Performance Score Ranking
                          </Text>
                          {isExpanded ? (
                            <ChevronUp size={24} color="#4B5563" strokeWidth={2} />
                          ) : (
                            <ChevronDown size={24} color="#4B5563" strokeWidth={2} />
                          )}
                        </Pressable>

                        {/* Slider */}
                        <View className="px-4 pb-4">
                          <View className="flex-row justify-between mb-2">
                            <Text
                              className="text-sm text-gray-600"
                              style={{ fontFamily: 'WorkSans_400Regular' }}
                            >
                              0%
                            </Text>
                            <Text
                              className="text-sm text-gray-600"
                              style={{ fontFamily: 'WorkSans_400Regular' }}
                            >
                              65%+
                            </Text>
                          </View>
                          <View className="h-2 bg-gray-300 rounded-full overflow-hidden">
                            <View
                              className="h-full rounded-full"
                              style={{
                                width: '0%',
                                backgroundColor: '#16A34A',
                              }}
                            />
                          </View>
                          <Text
                            className="text-xs text-gray-500 mt-2"
                            style={{ fontFamily: 'WorkSans_400Regular' }}
                          >
                            Performance ranking data coming soon
                          </Text>
                        </View>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <View className="px-4 pb-4">
                            <Text
                              className="text-lg font-semibold text-gray-900 mb-2"
                              style={{ fontFamily: 'WorkSans_600SemiBold' }}
                            >
                              How is this calculated?
                            </Text>
                            <Text
                              className="text-sm text-gray-600 leading-5"
                              style={{ fontFamily: 'WorkSans_400Regular' }}
                            >
                              The more tasks you complete compared to the number of invitations you receive, the higher your score will be. Your Performance Score Ranking is how you compare to other pros in your area. These scores can change on a daily basis, but we use the monthly average for Star qualification.
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}

                {/* No Skills Message */}
                {Object.keys(skillsByCategory).length === 0 && (
                  <View className="bg-gray-100 rounded-lg p-6 items-center">
                    <Text
                      className="text-base text-gray-600 text-center"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      Activate skills to track your category progress
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ) : (
          // About Tab
          <View className="px-4 py-6 gap-6">
            {/* What is a 100Handy Star? */}
            <View className="gap-3">
              <Text
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                What is a 100Handy Star?
              </Text>
              <Text
                className="text-base text-gray-700 leading-6"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                Star is a status you can qualify for each month by hitting all the goals outlined in your progress panel. Star status is not determined until the end of the month.
              </Text>
            </View>

            {/* What are the benefits? */}
            <View className="gap-3">
              <Text
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                What are the benefits?
              </Text>
              <Text
                className="text-base text-gray-700 leading-6 mb-3"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                On average, you can earn 3x more if you&apos;re a Star Professional. You also get these rewards:
              </Text>

              {/* Benefits List */}
              <View className="gap-3">
                <View className="flex-row items-start gap-3">
                  <CheckCircle2 size={24} color="#16A34A" strokeWidth={2} />
                  <Text
                    className="flex-1 text-base text-gray-700"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Star badge shown to clients
                  </Text>
                </View>
                <View className="flex-row items-start gap-3">
                  <CheckCircle2 size={24} color="#16A34A" strokeWidth={2} />
                  <Text
                    className="flex-1 text-base text-gray-700"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Priority in search results
                  </Text>
                </View>
                <View className="flex-row items-start gap-3">
                  <CheckCircle2 size={24} color="#16A34A" strokeWidth={2} />
                  <Text
                    className="flex-1 text-base text-gray-700"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Bigger bonus when you refer a friend
                  </Text>
                </View>
              </View>
            </View>

            {/* How do I become a 100Handy Star? */}
            <View className="gap-3">
              <Text
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                How do I become a 100Handy Star?
              </Text>
              <Text
                className="text-base text-gray-700 leading-6 mb-3"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                Meet all four of the milestones below in order to earn Star status:
              </Text>

              {/* Milestones */}
              <View className="gap-4">
                <View className="flex-row items-start gap-3">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: '#D1FAE5' }}
                  >
                    <CheckCircle2 size={20} color="#16A34A" strokeWidth={2.5} />
                  </View>
                  <Text
                    className="flex-1 text-base text-gray-700 pt-1"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Complete 200 tasks in any category since joining 100handy.
                  </Text>
                </View>

                <View className="flex-row items-start gap-3">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: '#D1FAE5' }}
                  >
                    <CheckCircle2 size={20} color="#16A34A" strokeWidth={2.5} />
                  </View>
                  <Text
                    className="flex-1 text-base text-gray-700 pt-1"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Complete 50 tasks in a single category since joining 100handy.
                  </Text>
                </View>

                <View className="flex-row items-start gap-3">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: '#D1FAE5' }}
                  >
                    <CheckCircle2 size={20} color="#16A34A" strokeWidth={2.5} />
                  </View>
                  <Text
                    className="flex-1 text-base text-gray-700 pt-1"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Complete 10 tasks per month.
                  </Text>
                </View>

                <View className="flex-row items-start gap-3">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: '#D1FAE5' }}
                  >
                    <CheckCircle2 size={20} color="#16A34A" strokeWidth={2.5} />
                  </View>
                  <Text
                    className="flex-1 text-base text-gray-700 pt-1"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Maintain a top 35% Performance Score Ranking in each of your active categories.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
