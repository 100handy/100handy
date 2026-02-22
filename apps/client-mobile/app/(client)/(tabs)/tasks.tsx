import React from 'react';
import { ScrollView, RefreshControl, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loader } from '@/components/ui/loader';
import { ClipboardList } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { TaskCard, Tab, EmptyState } from '@/components/tasks';
import { useUserBookings } from '@shared/supabase/query';
import { useAuthStore } from '@shared/supabase';
import { bookingToTaskCardProps } from '@/lib/bookings';

// Using Tailwind design tokens - colors are now defined in tailwind.config.js

export default function TasksScreen() {
  const [activeTab, setActiveTab] = React.useState('upcoming');
  const router = useRouter();
  
  // Get user from auth store
  const { user } = useAuthStore();
  
  // Fetch bookings data using React Query
  const { 
    upcoming, 
    past, 
    cancelled, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useUserBookings(user?.id || '');

  // Show loading only if we have a user ID and are actually loading
  const showLoading = isLoading && !!user?.id;

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const getCurrentBookings = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcoming;
      case 'completed':
        return [...past, ...cancelled];
      default:
        return [];
    }
  };

  // Transform bookings to TaskCard props with cancelled status info
  const getCurrentTaskCardsWithStatus = () => {
    const bookings = getCurrentBookings();
    return bookings.map(booking => ({
      props: bookingToTaskCardProps(booking),
      isCancelled: booking.status === 'cancelled',
    }));
  };

  const handleTaskCardPress = (bookingId?: string | number) => {
    if (!bookingId) return;
    router.push(`/(client)/booking-details/${bookingId}`);
  };



  return (
    <SafeAreaView className="flex-1 bg-bg-secondary">
      <View className="flex-1">
        {/* Header */}
        <View className="items-center py-4 border-b border-gray-200">
          <Text className="text-lg font-bold text-[#30352d]">Tasks</Text>
        </View>

        {/* Segmented Tabs */}
        <View className="flex-row bg-bg-primary">
          <Tab id="upcoming" label="Upcoming" active={activeTab === 'upcoming'} onPress={setActiveTab} />
          <Tab id="completed" label="Completed" active={activeTab === 'completed'} onPress={setActiveTab} />
        </View>

        <View className="h-px bg-border opacity-80" />

        {/* Content */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={showLoading} onRefresh={onRefresh} />
          }
        >
          {!user?.id ? (
            <View className="flex-col items-center justify-center py-12">
              <ClipboardList size={64} color="#D17852" />
              <Text className="text-lg font-medium text-[#333A31] mt-4 mb-2">
                Please sign in
              </Text>
              <Text className="text-sm text-[#666666] text-center px-8 mb-6">
                You need to be signed in to view your tasks.
              </Text>
              <Pressable
                onPress={() => router.push('/(auth)/(client)')}
                className="bg-[#D17852] px-8 py-3 rounded-full"
              >
                <Text className="text-white font-medium">Sign In</Text>
              </Pressable>
            </View>
          ) : showLoading ? (
            <Loader text="Loading tasks..." />
          ) : isError ? (
            <View className="flex-col items-center justify-center py-12">
              <Text className="text-lg font-work-sans font-medium text-text-secondary mb-2">
                Error loading tasks
              </Text>
              <Text className="text-sm font-work-sans text-text-tertiary text-center px-8 mb-4">
                {error?.message || 'Something went wrong. Please try again.'}
              </Text>
              <Pressable
                onPress={() => refetch()}
                className="bg-[#D17852] px-6 py-2.5 rounded-full"
              >
                <Text className="text-white font-medium">Retry</Text>
              </Pressable>
            </View>
          ) : getCurrentBookings().length === 0 ? (
            <EmptyState />
          ) : (
            <View className="flex-col space-y-2">
              {getCurrentTaskCardsWithStatus().map(({ props: taskCardProps, isCancelled }, index) => (
                <View
                  key={`${activeTab}-${taskCardProps.bookingId || index}`}
                  style={isCancelled ? { opacity: 0.6 } : undefined}
                >
                  <TaskCard
                    {...taskCardProps}
                    onPress={() => handleTaskCardPress(taskCardProps.bookingId)}
                  />
                </View>
              ))}

              {/* Helper text when there are tasks */}
              <View className="flex-row justify-center pt-6">
                <Text className="text-xs font-work-sans text-text-tertiary leading-4">
                  Tap to view booking details
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
