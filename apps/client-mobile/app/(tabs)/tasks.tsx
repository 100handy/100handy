import React from 'react';
import { ScrollView, RefreshControl, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loader } from '@/components/ui/loader';
import { WrenchIcon, PaintbrushIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { TaskCard, Tab } from '@/components/tasks';
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

  // Fallback data for when no real bookings exist
  const fallbackBookings = {
    upcoming: [
      {
        id: 1,
        title: 'Deep Cleaning (1 Bedroom Flat)',
        dateTime: '21 Oct 2025, 14:00',
        taskerName: 'Sam O.',
        taskerRating: 5.0,
        taskerReviews: 124,
        location: 'Wanstead, London E11',
        statusLabel: 'In Progress',
        price: '£70.27 /hr',
        icon: PaintbrushIcon,
        iconTone: 'sage' as const,
      },
      {
        id: 2,
        title: 'Furniture Assembly',
        dateTime: '22 Oct 2025, 10:30',
        taskerName: 'Maria T.',
        taskerRating: 5.0,
        taskerReviews: 124,
        location: 'Leytonstone, E11',
        statusLabel: 'Scheduled',
        price: '£60.67 /hr',
        icon: WrenchIcon,
        iconTone: 'orange' as const,
      }
    ],
    past: [
      {
        id: 3,
        title: 'Plumbing Repair',
        dateTime: '10 Oct 2025, 10:00',
        taskerName: 'John D.',
        taskerRating: 4.8,
        taskerReviews: 89,
        location: '789 Pine Street, London E1',
        statusLabel: 'Completed',
        price: '£55.00 /hr',
        icon: WrenchIcon,
        iconTone: 'orange' as const,
      }
    ],
    cancelled: []
  };

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const getCurrentBookings = () => {
    const realBookings = (() => {
      switch (activeTab) {
        case 'upcoming':
          return upcoming;
        case 'past':
          return past;
        case 'cancelled':
          return cancelled;
        default:
          return [];
      }
    })();

    // If no real bookings, use fallback data
    if (realBookings.length === 0) {
      switch (activeTab) {
        case 'upcoming':
          return fallbackBookings.upcoming as any[];
        case 'past':
          return fallbackBookings.past as any[];
        case 'cancelled':
          return fallbackBookings.cancelled as any[];
        default:
          return [];
      }
    }

    return realBookings;
  };

  // Transform bookings to TaskCard props
  const getCurrentTaskCards = () => {
    const bookings = getCurrentBookings();
    
    // If using fallback data, return it directly (already in correct format)
    // Fallback data has 'id' while real data has 'bookingId'
    if (bookings.length > 0 && 'dateTime' in bookings[0] && !('category' in bookings[0])) {
      return bookings as any[];
    }
    
    // Otherwise transform real booking data
    return bookings.map(booking => bookingToTaskCardProps(booking));
  };



  return (
    <SafeAreaView className="flex-1 bg-bg-secondary">
      <View className="flex-1">
        {/* Top App Bar */}
        <Header 
          title="My Tasks" 
          onBackPress={() => {}} 
          onBellPress={() => {}} 
          showFilterIcon={false}
          showBellIcon={true}
        />

        <View className="h-px bg-border" className="h-px bg-border opacity-80" />

        {/* Segmented Tabs */}
        <View className="flex-row bg-bg-primary">
          <Tab id="upcoming" label="Upcoming" active={activeTab === 'upcoming'} onPress={setActiveTab} />
          <Tab id="past" label="Past" active={activeTab === 'past'} onPress={setActiveTab} />
          <Tab id="cancelled" label="Cancelled" active={activeTab === 'cancelled'} onPress={setActiveTab} />
        </View>

        <View className="h-px bg-border" className="h-px bg-border opacity-80" />

        {/* Content */}
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={showLoading} onRefresh={onRefresh} />
          }
        >
          {!user?.id ? (
            <View className="flex-col items-center justify-center py-12">
              <Text className="text-lg font-work-sans font-medium text-text-secondary mb-2">
                Please sign in
              </Text>
              <Text className="text-sm font-work-sans text-text-tertiary text-center px-8">
                You need to be signed in to view your tasks.
              </Text>
            </View>
          ) : showLoading ? (
            <Loader text="Loading tasks..." />
          ) : isError ? (
            <View className="flex-col items-center justify-center py-12">
              <Text className="text-lg font-work-sans font-medium text-text-secondary mb-2">
                Error loading tasks
              </Text>
              <Text className="text-sm font-work-sans text-text-tertiary text-center px-8">
                {error?.message || 'Something went wrong. Please try again.'}
              </Text>
            </View>
          ) : (
            <View className="flex-col space-y-2">
              {getCurrentTaskCards().map((taskCardProps, index) => (
                <TaskCard
                  key={`${activeTab}-${taskCardProps.bookingId || taskCardProps.id || index}`}
                  {...taskCardProps}
                  onPress={() => {}}
                />
              ))}

              {/* Empty state */}
              {getCurrentBookings().length === 0 && !showLoading && (
                <View className="flex-col items-center justify-center py-12">
                  <Text className="text-lg font-work-sans font-medium text-text-secondary mb-2">
                    No {activeTab} tasks
                  </Text>
                  <Text className="text-sm font-work-sans text-text-tertiary text-center px-8">
                    {activeTab === 'upcoming' && "You don't have any upcoming tasks scheduled."}
                    {activeTab === 'past' && "You don't have any completed tasks yet."}
                    {activeTab === 'cancelled' && "You don't have any cancelled tasks."}
                  </Text>
                </View>
              )}

              {/* Helper text when there are tasks */}
              {getCurrentBookings().length > 0 && (
                <View className="flex-row justify-center pt-6">
                  <Text className="text-xs font-work-sans text-text-tertiary leading-4">
                    Tap to view details
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}