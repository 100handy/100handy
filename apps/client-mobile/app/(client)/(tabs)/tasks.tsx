import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Divider } from '@/components/ui/divider';
import { Loader } from '@/components/ui/loader';
import { WrenchIcon, PaintbrushIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { TaskCard, Tab, EmptyState } from '@/components/tasks';
import { useUserBookings } from '@shared/supabase/query';
import { useAuthStore } from '@shared/supabase/store';
import { bookingToTaskCardProps } from '@/lib/bookings';

// Using Tailwind design tokens - colors are now defined in tailwind.config.js

export default function TasksScreen() {
  const [activeTab, setActiveTab] = React.useState('redemptions');
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
    redemptions: [
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
    complated: []
  };

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const getCurrentBookings = () => {
    const realBookings = (() => {
      switch (activeTab) {
        case 'redemptions':
          return upcoming;
        case 'complated':
          return [...past, ...cancelled];
        default:
          return [];
      }
    })();

    // If no real bookings, use fallback data
    if (realBookings.length === 0) {
      switch (activeTab) {
        case 'redemptions':
          return fallbackBookings.redemptions as any[];
        case 'complated':
          return fallbackBookings.complated as any[];
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
      <Box className="flex-1">
        {/* Top App Bar */}
        <Header 
          title="Tasks" 
          onBackPress={() => {}} 
          onBellPress={() => {}} 
          showFilterIcon={false}
          showBellIcon={true}
        />

        <Divider className="h-px bg-border opacity-80" />

        {/* Segmented Tabs */}
        <HStack className="bg-bg-primary">
          <Tab id="redemptions" label="Redemptions" active={activeTab === 'redemptions'} onPress={setActiveTab} />
          <Tab id="complated" label="Complated" active={activeTab === 'complated'} onPress={setActiveTab} />
        </HStack>

        <Divider className="h-px bg-border opacity-80" />

        {/* Content */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={showLoading} onRefresh={onRefresh} />
          }
        >
          {user?.id ? (
            <VStack className="items-center justify-center py-12">
              <Text className="text-lg font-work-sans font-medium text-text-secondary mb-2">
                Please sign in
              </Text>
              <Text className="text-sm font-work-sans text-text-tertiary text-center px-8">
                You need to be signed in to view your tasks.
              </Text>
            </VStack>
          ) : showLoading ? (
            <Loader text="Loading tasks..." />
          ) : isError ? (
            <VStack className="items-center justify-center py-12">
              <Text className="text-lg font-work-sans font-medium text-text-secondary mb-2">
                Error loading tasks
              </Text>
              <Text className="text-sm font-work-sans text-text-tertiary text-center px-8">
                {error?.message || 'Something went wrong. Please try again.'}
              </Text>
            </VStack>
          ) : getCurrentBookings().length === 0 ? (
            <EmptyState />
          ) : (
            <VStack className="space-y-2">
              {getCurrentTaskCards().map((taskCardProps, index) => (
                <TaskCard
                  key={`${activeTab}-${taskCardProps.bookingId || taskCardProps.id || index}`}
                  {...taskCardProps}
                  onPress={() => {}}
                />
              ))}

              {/* Helper text when there are tasks */}
              <HStack className="justify-center pt-6">
                <Text className="text-xs font-work-sans text-text-tertiary leading-4">
                  Tap to view details
                </Text>
              </HStack>
            </VStack>
          )}
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
