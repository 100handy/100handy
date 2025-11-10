import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import gluestack-ui components

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
import { AnalyticsWelcome } from '@/components/analytics';

const ANALYTICS_WELCOME_KEY = '@hasSeenAnalyticsWelcome';

export default function AnalyticsScreen() {
  const router = useRouter();
  const [showError, setShowError] = React.useState(true);
  const [showWelcome, setShowWelcome] = React.useState(false);
  const [isCheckingWelcome, setIsCheckingWelcome] = React.useState(true);

  React.useEffect(() => {
    checkWelcomeStatus();
  }, []);

  const checkWelcomeStatus = async () => {
    try {
      const hasSeenWelcome = await AsyncStorage.getItem(ANALYTICS_WELCOME_KEY);
      if (hasSeenWelcome !== 'true') {
        setShowWelcome(true);
      }
    } catch (error) {
      console.error('Error checking analytics welcome status:', error);
      // On error, show welcome to be safe
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
            <Text className="text-[#30352D] text-lg font-bold">Analytics</Text>
            
            {/* Help icon */}
            <Pressable>
              <HelpCircle size={24} color="#30352D" />
            </Pressable>
          </View>
        </View>

        {/* Error Message Banner */}
        {showError && (
          <View className="bg-[#E8D4CC] px-6 py-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-col flex-1 mr-3">
                <Text className="text-[#30352D] text-sm font-bold">
                  Sorry! There seems to be a problem on our end.
                </Text>
                <Text className="text-[#30352D] text-sm font-bold">
                  Please check back later.
                </Text>
              </View>
              <Pressable onPress={() => setShowError(false)}>
                <X size={20} color="#30352D" />
              </Pressable>
            </View>
          </View>
        )}

        {/* Main Content */}
        <ScrollView className="flex-1">
          {/* Category Cards Row */}
          <View className="flex-row px-6 py-6 gap-3">
            {/* Opportunity Card */}
            <View className="flex-col items-center flex-1">
              <View className="bg-[#30352D] rounded-lg p-6 mb-2 w-full items-center justify-center aspect-square">
                <TrendingUp size={32} color="white" strokeWidth={2.5} />
              </View>
              <Text className="text-[#30352D] text-xs font-bold">Opportunity</Text>
              <View className="h-0.5 w-12 bg-[#C1856A] mt-1" />
            </View>

            {/* Earnings Card */}
            <Pressable
              onPress={() => router.push('/profile/earnings')}
              className="items-center flex-1"
            >
              <View className="flex-col items-center flex-1">
                <View className="bg-[#F5F5F5] rounded-lg p-6 mb-2 w-full items-center justify-center aspect-square">
                  <CreditCard size={32} color="#30352D" strokeWidth={2.5} />
                </View>
                <Text className="text-[#30352D] text-xs font-bold">Earnings</Text>
              </View>
            </Pressable>

            {/* Tasks Card */}
            <View className="flex-col items-center flex-1">
              <View className="bg-[#F5F5F5] rounded-lg p-6 mb-2 w-full items-center justify-center aspect-square">
                <Briefcase size={32} color="#30352D" strokeWidth={2.5} />
              </View>
              <Text className="text-[#30352D] text-xs font-bold">Tasks</Text>
            </View>
          </View>

          {/* Overview Section */}
          <View className="px-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[#30352D] text-lg font-bold">Overview</Text>
              <View className="flex-row items-center gap-1">
                <Calendar size={16} color="#333A31" />
                <Text className="text-[#333A31] text-[10px] font-medium">PAST 30 DAYS</Text>
              </View>
            </View>

            {/* Overview Stats Card */}
            <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
              <View className="flex-col gap-4">
                {/* Average Search Position */}
                <View className="flex-col">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-[#30352D] text-base font-bold">
                      Average Search Position
                    </Text>
                    <Text className="text-[#30352D] text-lg font-bold">- -</Text>
                  </View>
                  <View className="flex-row items-center justify-end">
                    <Text className="text-[#333A31] text-[10px]">- -</Text>
                  </View>
                  <Text className="text-[#333A31] text-[10px] text-right mt-1">
                    Taskers in a search
                  </Text>
                </View>

                {/* Divider */}
                <View className="h-px bg-gray-200" />

                {/* Search Result Appearances */}
                <View className="flex-col">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-[#30352D] text-base font-bold">
                      Search Result Appearances
                    </Text>
                    <Text className="text-[#30352D] text-lg font-bold">- -</Text>
                  </View>
                </View>

                {/* Divider */}
                <View className="h-px bg-gray-200" />

                {/* You've shown more than */}
                <View className="flex-col">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-[#30352D] text-base font-bold">
                      You've shown more than
                    </Text>
                    <Text className="text-[#30352D] text-lg font-bold">- -</Text>
                  </View>
                  <Text className="text-[#333A31] text-[10px] text-right">
                    of Taskers
                  </Text>
                </View>
              </View>
            </View>

            {/* More Details Section */}
            <Text className="text-[#30352D] text-lg font-bold mb-4">More Details</Text>

            {/* Average Search Position Detail Card */}
            <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
              <View className="flex-col gap-4">
                <Text className="text-[#30352D] text-base font-bold">
                  Average Search Position
                </Text>

                {/* Gray info box */}
                <View className="bg-[#F5F5F5] rounded-lg p-4">
                  <Text className="text-[#333A31] text-[10px] mb-3">
                    During an average search, you appeared:
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-[#C1856A] text-lg font-bold">- -</Text>
                    <Text className="text-[#30352D] text-lg font-bold">- -</Text>
                  </View>
                </View>

                {/* How can I place higher */}
                <View className="flex-col gap-2">
                  <Text className="text-[#30352D] text-base font-bold">
                    How can I place higher in search results?
                  </Text>
                  <Text className="text-[#30352D] text-sm leading-5">
                    There's always room to grow as a Tasker! The more
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

