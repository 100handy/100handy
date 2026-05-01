import React from 'react';
import { ScrollView, RefreshControl, View, Text, Pressable } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { Loader } from '@/components/ui/loader'; import { ClipboardList, Trash2 } from 'lucide-react-native'; import { useRouter } from 'expo-router'; import { Swipeable } from 'react-native-gesture-handler'; import { TaskCard, Tab, EmptyState } from '@/components/tasks'; import { useUserBookings } from '@shared/supabase/query'; import { useAuthStore } from '@shared/store';
import { bookingToTaskCardProps } from '@/lib/bookings';
import { CancelBookingModal } from '@/components/booking/CancelBookingModal';

type BookingItem = ReturnType<typeof useUserBookings>['upcoming'][number];

function SwipeableTaskRow({
  booking,
  activeTab,
  onPress,
  onDelete,
  isCancelled,
  onSwipeableOpen,
}: {
  booking: BookingItem;
  activeTab: string;
  onPress: () => void;
  onDelete: () => void;
  isCancelled: boolean;
  onSwipeableOpen: (swipeable: Swipeable | null) => void;
}) {
  const swipeableRef = React.useRef<Swipeable | null>(null);
  const taskCardProps = bookingToTaskCardProps(booking);
  const isCancellable = activeTab === 'upcoming' && (booking.status === 'pending' || booking.status === 'accepted');

  const card = (
    <View style={isCancelled ? { opacity: 0.6 } : undefined}>
      <TaskCard
        {...taskCardProps}
        onPress={onPress}
      />
    </View>
  );

  if (!isCancellable) {
    return card;
  }

  return (
    <Swipeable
      ref={swipeableRef}
      overshootRight={false}
      rightThreshold={40}
      friction={2}
      renderRightActions={() => (
        <Pressable
          onPress={onDelete}
          className="mx-4 my-2 w-[92px] rounded-xl bg-[#D84C3F] items-center justify-center"
        >
          <Trash2 size={20} color="#FFFFFF" />
          <Text className="mt-1 text-xs font-work-sans font-semibold text-white">
            Delete
          </Text>
        </Pressable>
      )}
      onSwipeableWillOpen={() => onSwipeableOpen(swipeableRef.current)}
    >
      {card}
    </Swipeable>
  );
}

// Using Tailwind design tokens - colors are now defined in tailwind.config.js

export default function TasksScreen() {
  const [activeTab, setActiveTab] = React.useState('upcoming');
  const [selectedBookingForCancel, setSelectedBookingForCancel] = React.useState<{
    id: string;
    taskTitle: string;
    scheduledDate?: string;
    scheduledTime?: string;
    recurringSeriesId?: string | null;
  } | null>(null);
  const router = useRouter();
  const openSwipeableRef = React.useRef<Swipeable | null>(null);
  
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

  const handleTaskCardPress = (bookingId?: string | number) => {
    if (!bookingId) return;
    router.push(`/(client)/booking-details/${bookingId}`);
  };

  const handleOpenCancel = (booking: BookingItem) => {
    openSwipeableRef.current?.close();
    openSwipeableRef.current = null;
    setSelectedBookingForCancel({
      id: booking.id,
      taskTitle: booking.task_title,
      scheduledDate: booking.scheduled_date,
      scheduledTime: booking.scheduled_time,
      recurringSeriesId: booking.recurring_series_id,
    });
  };

  const handleSwipeableOpen = (swipeable: Swipeable | null) => {
    if (openSwipeableRef.current && openSwipeableRef.current !== swipeable) {
      openSwipeableRef.current.close();
    }
    openSwipeableRef.current = swipeable;
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
              <ClipboardList size={64} color="#C1856A" />
              <Text className="text-lg font-medium text-[#333A31] mt-4 mb-2">
                Please sign in
              </Text>
              <Text className="text-sm text-[#666666] text-center px-8 mb-6">
                You need to be signed in to view your tasks.
              </Text>
              <Pressable
                onPress={() => router.push('/(auth)/(client)/sign-in')}
                className="px-8 py-3 rounded-full bg-clay-orange"
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
                className="bg-brand-terracotta px-6 py-2.5 rounded-full"
              >
                <Text className="text-white font-medium">Retry</Text>
              </Pressable>
            </View>
          ) : getCurrentBookings().length === 0 ? (
            <EmptyState />
          ) : (
            <View className="flex-col space-y-2">
              {getCurrentBookings().map((booking, index) => (
                <SwipeableTaskRow
                  key={`${activeTab}-${booking.id || index}`}
                  booking={booking}
                  activeTab={activeTab}
                  isCancelled={booking.status === 'cancelled'}
                  onPress={() => handleTaskCardPress(booking.id)}
                  onDelete={() => handleOpenCancel(booking)}
                  onSwipeableOpen={handleSwipeableOpen}
                />
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

      {selectedBookingForCancel && (
        <CancelBookingModal
          isOpen={true}
          onClose={() => setSelectedBookingForCancel(null)}
          bookingId={selectedBookingForCancel.id}
          taskTitle={selectedBookingForCancel.taskTitle}
          scheduledDate={selectedBookingForCancel.scheduledDate}
          scheduledTime={selectedBookingForCancel.scheduledTime}
          recurringSeriesId={selectedBookingForCancel.recurringSeriesId}
        />
      )}
    </SafeAreaView>
  );
}
