import React, { useCallback } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

// Import lucide-react-native icons
import {
  ArrowLeft,
  HelpCircle,
  Calendar,
  TrendingUp,
  CreditCard,
  Briefcase,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AnalyticsWelcome } from '@/components/analytics';
import {
  getProfessionalAnalytics,
  useAuthStore,
  type AnalyticsData,
} from '@shared/supabase';

const ANALYTICS_WELCOME_KEY = '@hasSeenAnalyticsWelcome';

type TabType = 'opportunity' | 'earnings' | 'tasks';

function formatCurrency(cents: number): string {
  return `£${(cents / 100).toFixed(2)}`;
}

export default function AnalyticsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showWelcome, setShowWelcome] = React.useState(false);
  const [isCheckingWelcome, setIsCheckingWelcome] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<TabType>('opportunity');
  const [isLoading, setIsLoading] = React.useState(true);
  const [analytics, setAnalytics] = React.useState<AnalyticsData | null>(null);

  React.useEffect(() => {
    checkWelcomeStatus();
  }, []);

  const loadAnalytics = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const data = await getProfessionalAnalytics(user.id);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadAnalytics();
    }, [loadAnalytics])
  );

  const checkWelcomeStatus = async () => {
    try {
      const hasSeenWelcome = await AsyncStorage.getItem(ANALYTICS_WELCOME_KEY);
      if (hasSeenWelcome !== 'true') {
        setShowWelcome(true);
      }
    } catch (error) {
      console.error('Error checking analytics welcome status:', error);
      setShowWelcome(true);
    } finally {
      setIsCheckingWelcome(false);
    }
  };

  const handleWelcomeComplete = async () => {
    try {
      await AsyncStorage.setItem(ANALYTICS_WELCOME_KEY, 'true');
      setShowWelcome(false);
    } catch (error) {
      console.error('Error saving analytics welcome status:', error);
      setShowWelcome(false);
    }
  };

  if (isCheckingWelcome) {
    return null;
  }

  if (showWelcome) {
    return <AnalyticsWelcome onComplete={handleWelcomeComplete} onSkip={handleWelcomeComplete} />;
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#C1856A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header with white background */}
        <View className="bg-white px-6 py-4 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            {/* Back button */}
            <Pressable onPress={() => router.back()}>
              <ArrowLeft size={24} color="#30352D" />
            </Pressable>

            {/* Title */}
            <Text
              className="text-[#30352D] text-lg font-bold"
              style={{ fontFamily: 'WorkSans_700Bold' }}
            >
              Analytics
            </Text>

            {/* Help icon */}
            <Pressable>
              <HelpCircle size={24} color="#30352D" />
            </Pressable>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView className="flex-1">
          {/* Category Cards Row */}
          <View className="flex-row px-6 py-6 gap-3">
            {/* Opportunity Card */}
            <Pressable
              onPress={() => setActiveTab('opportunity')}
              className="flex-col items-center flex-1"
            >
              <View
                className="rounded-lg p-6 mb-2 w-full items-center justify-center aspect-square"
                style={{
                  backgroundColor: activeTab === 'opportunity' ? '#30352D' : '#F5F5F5',
                }}
              >
                <TrendingUp
                  size={32}
                  color={activeTab === 'opportunity' ? 'white' : '#30352D'}
                  strokeWidth={2.5}
                />
              </View>
              <Text
                className="text-[#30352D] text-xs font-bold text-center"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                Opportunity
              </Text>
              {activeTab === 'opportunity' && <View className="h-0.5 w-12 bg-[#C1856A] mt-1" />}
            </Pressable>

            {/* Earnings Card */}
            <Pressable
              onPress={() => setActiveTab('earnings')}
              className="flex-col items-center flex-1"
            >
              <View
                className="rounded-lg p-6 mb-2 w-full items-center justify-center aspect-square"
                style={{
                  backgroundColor: activeTab === 'earnings' ? '#30352D' : '#F5F5F5',
                }}
              >
                <CreditCard
                  size={32}
                  color={activeTab === 'earnings' ? 'white' : '#30352D'}
                  strokeWidth={2.5}
                />
              </View>
              <Text
                className="text-[#30352D] text-xs font-bold text-center"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                Earnings
              </Text>
              {activeTab === 'earnings' && <View className="h-0.5 w-12 bg-[#C1856A] mt-1" />}
            </Pressable>

            {/* Tasks Card */}
            <Pressable
              onPress={() => setActiveTab('tasks')}
              className="flex-col items-center flex-1"
            >
              <View
                className="rounded-lg p-6 mb-2 w-full items-center justify-center aspect-square"
                style={{
                  backgroundColor: activeTab === 'tasks' ? '#30352D' : '#F5F5F5',
                }}
              >
                <Briefcase
                  size={32}
                  color={activeTab === 'tasks' ? 'white' : '#30352D'}
                  strokeWidth={2.5}
                />
              </View>
              <Text
                className="text-[#30352D] text-xs font-bold text-center"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                Tasks
              </Text>
              {activeTab === 'tasks' && <View className="h-0.5 w-12 bg-[#C1856A] mt-1" />}
            </Pressable>
          </View>

          {/* Earnings Tab Content */}
          {activeTab === 'earnings' && (
            <View className="px-6">
              {/* Overview Header */}
              <View className="flex-row items-center justify-between mb-4">
                <Text
                  className="text-[#30352D] text-lg font-bold"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  Overview
                </Text>
                <View className="flex-row items-center gap-1">
                  <Calendar size={16} color="#333A31" />
                  <Text
                    className="text-[#333A31] text-[10px] font-medium"
                    style={{ fontFamily: 'WorkSans_500Medium' }}
                  >
                    PAST 30 DAYS
                  </Text>
                </View>
              </View>

              {/* Overview Stats Card */}
              <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <View className="flex-col gap-4">
                  {/* Total Earnings */}
                  <View className="flex-col">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text
                        className="text-[#30352D] text-base font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        Total Earnings
                      </Text>
                      <Text
                        className="text-[#30352D] text-lg font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        {formatCurrency(analytics?.totalEarnings || 0)}
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View className="h-px bg-gray-200" />

                  {/* Anticipated Earnings */}
                  <View className="flex-col">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text
                        className="text-[#30352D] text-base font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        Anticipated Earnings
                      </Text>
                      <Text
                        className="text-[#30352D] text-lg font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        {formatCurrency(analytics?.anticipatedEarnings || 0)}
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View className="h-px bg-gray-200" />

                  {/* You earned more than */}
                  <View className="flex-col">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text
                        className="text-[#30352D] text-base font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        You earned more than
                      </Text>
                      <Text
                        className="text-[#30352D] text-lg font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        {analytics?.earningsPercentile || 0}%
                      </Text>
                    </View>
                    <Text
                      className="text-[#333A31] text-[10px] text-right"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      of Taskers
                    </Text>
                  </View>
                </View>
              </View>

              {/* More Details Section */}
              <Text
                className="text-[#30352D] text-lg font-bold mb-4"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                More Details
              </Text>

              {/* Total Earnings Detail Card */}
              <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <Text
                  className="text-[#30352D] text-base font-bold mb-4"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  Total Earnings
                </Text>

                {/* Gray info box */}
                <View className="bg-[#F5F5F5] rounded-lg p-4 mb-4">
                  <Text
                    className="text-[#333A31] text-sm mb-3"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Earnings from the past 30 days:
                  </Text>
                  <Text
                    className="text-[#16A34A] text-lg font-bold"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    {formatCurrency(analytics?.totalEarnings || 0)}
                  </Text>
                </View>

                {/* How can I earn more */}
                <View className="flex-col gap-2">
                  <Text
                    className="text-[#30352D] text-base font-bold"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    How can I earn more?
                  </Text>
                  <Text
                    className="text-[#30352D] text-sm leading-5"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    The best way to earn more is to be seen by as many clients as possible! You can do
                    this by completing tasks, charging rates that follow pricing guidance, and earning
                    fantastic reviews.
                  </Text>
                </View>
              </View>

              {/* Anticipated Earnings Card */}
              <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <Text
                  className="text-[#30352D] text-base font-bold mb-4"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  Anticipated Earnings
                </Text>

                {/* Gray info box */}
                <View className="bg-[#F5F5F5] rounded-lg p-4 mb-4">
                  <Text
                    className="text-[#333A31] text-sm mb-3"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    We anticipated you could have earned:
                  </Text>
                  <Text
                    className="text-[#16A34A] text-lg font-bold"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    {formatCurrency(analytics?.anticipatedEarnings || 0)}
                  </Text>
                </View>

                {/* How was this calculated */}
                <View className="flex-col gap-2">
                  <Text
                    className="text-[#30352D] text-base font-bold"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    How was this calculated?
                  </Text>
                  <Text
                    className="text-[#30352D] text-sm leading-5"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    We calculate this number based on your Availability, current performance, and the
                    performance of other Taskers in your city. We've personalized it so you can determine
                    your potential on the platform, but we always encourage you to exceed it!
                  </Text>
                </View>
              </View>

              {/* Earnings Percentile Card */}
              <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <Text
                  className="text-[#30352D] text-base font-bold mb-4"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  Earnings Percentile
                </Text>

                <Text
                  className="text-[#30352D] text-sm mb-2"
                  style={{ fontFamily: 'WorkSans_600SemiBold' }}
                >
                  You earned more than:
                </Text>
                <Text
                  className="text-[#30352D] text-2xl font-bold mb-4"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  {analytics?.earningsPercentile || 0}%
                </Text>

                {/* Percentile Slider */}
                <View className="mb-4">
                  <View className="flex-row justify-between mb-2">
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      0%
                    </Text>
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      20%
                    </Text>
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      40%
                    </Text>
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      60%
                    </Text>
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      80%+
                    </Text>
                  </View>
                  <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View className="flex-row">
                      <View className="h-full rounded-full bg-[#D1FAE5]" style={{ width: `${Math.min(analytics?.earningsPercentile || 0, 80)}%` }} />
                      <View className="h-full bg-[#16A34A]" style={{ width: `${Math.max((analytics?.earningsPercentile || 0) - 80, 0)}%` }} />
                    </View>
                  </View>
                  {/* Dot indicator */}
                  <View className="relative" style={{ marginTop: -8, marginLeft: `${Math.min(analytics?.earningsPercentile || 0, 95)}%` }}>
                    <View
                      className="w-4 h-4 rounded-full bg-[#30352D]"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                    />
                  </View>
                </View>

                {/* What does this number show me */}
                <View className="flex-col gap-2">
                  <Text
                    className="text-[#30352D] text-base font-bold"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    What does this number show me?
                  </Text>
                  <Text
                    className="text-[#30352D] text-sm leading-5"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    This is a snapshot of the competition! Your Earnings Comparison shows how much you've
                    earned compared to other Taskers in your city. For example, 50% means you've earned 50%
                    more than other local Taskers.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Opportunity Tab Content */}
          {activeTab === 'opportunity' && (
            <View className="px-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text
                  className="text-[#30352D] text-lg font-bold"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  Overview
                </Text>
                <View className="flex-row items-center gap-1">
                  <Calendar size={16} color="#333A31" />
                  <Text
                    className="text-[#333A31] text-[10px] font-medium"
                    style={{ fontFamily: 'WorkSans_500Medium' }}
                  >
                    PAST 30 DAYS
                  </Text>
                </View>
              </View>

              {/* Overview Stats Card */}
              <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <View className="flex-col gap-4">
                  {/* Average Search Position */}
                  <View className="flex-col">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text
                        className="text-[#30352D] text-base font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        Average Search Position
                      </Text>
                      <Text
                        className="text-[#30352D] text-lg font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        {analytics?.averageSearchPosition ?? '- -'}
                      </Text>
                    </View>
                    <Text
                      className="text-[#333A31] text-[10px] text-right mt-1"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      Taskers in a search
                    </Text>
                  </View>

                  {/* Divider */}
                  <View className="h-px bg-gray-200" />

                  {/* Search Result Appearances */}
                  <View className="flex-col">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text
                        className="text-[#30352D] text-base font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        Search Result Appearances
                      </Text>
                      <Text
                        className="text-[#30352D] text-lg font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        {analytics?.searchAppearances || '- -'}
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View className="h-px bg-gray-200" />

                  {/* You've shown more than */}
                  <View className="flex-col">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text
                        className="text-[#30352D] text-base font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        You've shown more than
                      </Text>
                      <Text
                        className="text-[#30352D] text-lg font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        {analytics?.opportunityPercentile || 0}%
                      </Text>
                    </View>
                    <Text
                      className="text-[#333A31] text-[10px] text-right"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      of Taskers
                    </Text>
                  </View>
                </View>
              </View>

              {/* More Details Section */}
              <Text
                className="text-[#30352D] text-lg font-bold mb-4"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                More Details
              </Text>

              {/* Average Search Position Detail Card */}
              <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <View className="flex-col gap-4">
                  <Text
                    className="text-[#30352D] text-base font-bold"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    Average Search Position
                  </Text>

                  {/* Gray info box */}
                  <View className="bg-[#F5F5F5] rounded-lg p-4">
                    <Text
                      className="text-[#333A31] text-[10px] mb-3"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      During an average search, you appeared:
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text
                        className="text-[#C1856A] text-lg font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        - -
                      </Text>
                      <Text
                        className="text-[#30352D] text-lg font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        - -
                      </Text>
                    </View>
                  </View>

                  {/* How can I place higher */}
                  <View className="flex-col gap-2">
                    <Text
                      className="text-[#30352D] text-base font-bold"
                      style={{ fontFamily: 'WorkSans_700Bold' }}
                    >
                      How can I place higher in search results?
                    </Text>
                    <Text
                      className="text-[#30352D] text-sm leading-5"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      There's always room to grow as a Tasker! The more tasks you complete with high ratings,
                      the better your search position will become. Regularly refusing tasks can cause you to
                      place lower in search results.
                    </Text>
                  </View>
                </View>
              </View>

              {/* Search Result Appearances Card */}
              <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <Text
                  className="text-[#30352D] text-base font-bold mb-4"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  Search Result Appearances
                </Text>

                {/* Gray info box */}
                <View className="bg-[#F5F5F5] rounded-lg p-4 mb-4">
                  <Text
                    className="text-[#333A31] text-sm mb-3"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Client search appearances:
                  </Text>
                  <Text
                    className="text-[#16A34A] text-lg font-bold"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    - -
                  </Text>
                </View>

                {/* What are search result appearances */}
                <View className="flex-col gap-2">
                  <Text
                    className="text-[#30352D] text-base font-bold"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    What are search result appearances?
                  </Text>
                  <Text
                    className="text-[#30352D] text-sm leading-5"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    This number shows how many times you've appeared in client search results in the past 30
                    days, regardless of task category or ranking. Adding more Availability can help you show up
                    more often.
                  </Text>
                </View>
              </View>

              {/* Opportunity Percentile Card */}
              <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <Text
                  className="text-[#30352D] text-base font-bold mb-4"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  Opportunity Percentile
                </Text>

                <Text
                  className="text-[#30352D] text-sm mb-2"
                  style={{ fontFamily: 'WorkSans_600SemiBold' }}
                >
                  You were shown more than:
                </Text>
                <Text
                  className="text-[#30352D] text-2xl font-bold mb-4"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  {analytics?.opportunityPercentile || 0}%
                </Text>

                {/* Percentile Slider */}
                <View className="mb-4">
                  <View className="flex-row justify-between mb-2">
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      0%
                    </Text>
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      20%
                    </Text>
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      40%
                    </Text>
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      60%
                    </Text>
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      80%+
                    </Text>
                  </View>
                  <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View className="flex-row">
                      <View className="h-full rounded-full bg-[#D1FAE5]" style={{ width: `${Math.min(analytics?.opportunityPercentile || 0, 80)}%` }} />
                      <View className="h-full bg-[#16A34A]" style={{ width: `${Math.max((analytics?.opportunityPercentile || 0) - 80, 0)}%` }} />
                    </View>
                  </View>
                  {/* Dot indicator */}
                  <View className="relative" style={{ marginTop: -8, marginLeft: `${Math.min(analytics?.opportunityPercentile || 0, 95)}%` }}>
                    <View
                      className="w-4 h-4 rounded-full bg-[#30352D]"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                    />
                  </View>
                </View>

                {/* What does this number show me */}
                <View className="flex-col gap-2">
                  <Text
                    className="text-[#30352D] text-base font-bold"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    What does this number show me?
                  </Text>
                  <Text
                    className="text-[#30352D] text-sm leading-5"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    This number shows how often you appear in client search results vs. other Taskers in your
                    city. Accepting and completing tasks while following pricing guidance is key — it can only
                    help you get more task invitations! For example, 50% means been shown in Client search results
                    50% more often than other local Taskers.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Tasks Tab Content */}
          {activeTab === 'tasks' && (
            <View className="px-6">
              {/* Overview Header */}
              <View className="flex-row items-center justify-between mb-4">
                <Text
                  className="text-[#30352D] text-lg font-bold"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  Overview
                </Text>
                <View className="flex-row items-center gap-1">
                  <Calendar size={16} color="#333A31" />
                  <Text
                    className="text-[#333A31] text-[10px] font-medium"
                    style={{ fontFamily: 'WorkSans_500Medium' }}
                  >
                    PAST 30 DAYS
                  </Text>
                </View>
              </View>

              {/* Overview Stats Card */}
              <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <View className="flex-col gap-4">
                  {/* Completed Tasks */}
                  <View className="flex-col">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text
                        className="text-[#30352D] text-base font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        Completed Tasks
                      </Text>
                      <Text
                        className="text-[#30352D] text-lg font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        {analytics?.completedTasks || 0}
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View className="h-px bg-gray-200" />

                  {/* Anticipated Tasks */}
                  <View className="flex-col">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text
                        className="text-[#30352D] text-base font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        Anticipated Tasks
                      </Text>
                      <Text
                        className="text-[#30352D] text-lg font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        {analytics?.anticipatedTasks || 0}
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View className="h-px bg-gray-200" />

                  {/* You completed more tasks than */}
                  <View className="flex-col">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text
                        className="text-[#30352D] text-base font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        You completed more tasks than
                      </Text>
                      <Text
                        className="text-[#30352D] text-lg font-bold"
                        style={{ fontFamily: 'WorkSans_700Bold' }}
                      >
                        {analytics?.taskPercentile || 0}%
                      </Text>
                    </View>
                    <Text
                      className="text-[#333A31] text-[10px] text-right"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      of Taskers
                    </Text>
                  </View>
                </View>
              </View>

              {/* More Details Section */}
              <Text
                className="text-[#30352D] text-lg font-bold mb-4"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                More Details
              </Text>

              {/* Completed Tasks Detail Card */}
              <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <Text
                  className="text-[#30352D] text-base font-bold mb-4"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  Completed Tasks
                </Text>

                {/* Gray info box */}
                <View className="bg-[#F5F5F5] rounded-lg p-4 mb-4">
                  <Text
                    className="text-[#333A31] text-sm mb-3"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Number of completed tasks:
                  </Text>
                  <Text
                    className="text-[#16A34A] text-lg font-bold"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    {analytics?.completedTasks || 0}
                  </Text>
                </View>

                {/* Why does my task count matter */}
                <View className="flex-col gap-2">
                  <Text
                    className="text-[#30352D] text-base font-bold"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    Why does my task count matter?
                  </Text>
                  <Text
                    className="text-[#30352D] text-sm leading-5"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    This is the total number of tasks you've completed and invoiced for. How many tasks
                    you complete is important — the more tasks you do, the higher you'll place in client
                    search results. This will help you get even more bookings.
                  </Text>
                </View>
              </View>

              {/* Anticipated Tasks Card */}
              <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <Text
                  className="text-[#30352D] text-base font-bold mb-4"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  Anticipated Tasks
                </Text>

                {/* Gray info box */}
                <View className="bg-[#F5F5F5] rounded-lg p-4 mb-4">
                  <Text
                    className="text-[#333A31] text-sm mb-3"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    We anticipated you could have done:
                  </Text>
                  <Text
                    className="text-[#16A34A] text-lg font-bold"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    {analytics?.anticipatedTasks || 0} tasks
                  </Text>
                </View>

                {/* How was this calculated */}
                <View className="flex-col gap-2">
                  <Text
                    className="text-[#30352D] text-base font-bold"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    How was this calculated?
                  </Text>
                  <Text
                    className="text-[#30352D] text-sm leading-5"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    We calculate this number based on your Availability, current performance, and the
                    performance of other Taskers in your city. We've personalized it so you can determine
                    your potential on the platform, but we always encourage you to exceed it!
                  </Text>
                </View>
              </View>

              {/* Task Percentile Card */}
              <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <Text
                  className="text-[#30352D] text-base font-bold mb-4"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  Task Percentile
                </Text>

                <Text
                  className="text-[#30352D] text-sm mb-2"
                  style={{ fontFamily: 'WorkSans_600SemiBold' }}
                >
                  You completed more tasks than:
                </Text>
                <Text
                  className="text-[#30352D] text-2xl font-bold mb-4"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  {analytics?.taskPercentile || 0}%
                </Text>

                {/* Percentile Slider */}
                <View className="mb-4">
                  <View className="flex-row justify-between mb-2">
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      0%
                    </Text>
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      20%
                    </Text>
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      40%
                    </Text>
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      60%
                    </Text>
                    <Text
                      className="text-[#6B7280] text-xs"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      80%+
                    </Text>
                  </View>
                  <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View className="flex-row">
                      <View className="h-full rounded-full bg-[#D1FAE5]" style={{ width: `${Math.min(analytics?.taskPercentile || 0, 80)}%` }} />
                      <View className="h-full bg-[#16A34A]" style={{ width: `${Math.max((analytics?.taskPercentile || 0) - 80, 0)}%` }} />
                    </View>
                  </View>
                  {/* Dot indicator */}
                  <View className="relative" style={{ marginTop: -8, marginLeft: `${Math.min(analytics?.taskPercentile || 0, 95)}%` }}>
                    <View
                      className="w-4 h-4 rounded-full bg-[#30352D]"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                    />
                  </View>
                </View>

                {/* What does this number show me */}
                <View className="flex-col gap-2">
                  <Text
                    className="text-[#30352D] text-base font-bold"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    What does this number show me?
                  </Text>
                  <Text
                    className="text-[#30352D] text-sm leading-5"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    This is a snapshot of the competition! This number shows how many tasks you've
                    completed compared to other Taskers in your city. For example, 50% means you've
                    completed 50% more tasks than other local Taskers.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
