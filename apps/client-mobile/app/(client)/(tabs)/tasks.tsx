import React from 'react';
import { ScrollView, RefreshControl, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loader } from '@/components/ui/loader';
import { ClipboardList, ChevronRight, PenSquare, DollarSign, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { TaskCard, Tab, EmptyState } from '@/components/tasks';
import { useUserBookings } from '@shared/supabase/query';
import { useAuthStore } from '@shared/supabase';
import { bookingToTaskCardProps } from '@/lib/bookings';
import { useMyTaskPosts, type TaskPostWithCategory } from '@shared/supabase';

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

  // Fetch posted tasks
  const { data: myTaskPosts, isLoading: isLoadingPosts, refetch: refetchPosts } = useMyTaskPosts();

  // Show loading only if we have a user ID and are actually loading
  const showLoading = isLoading && !!user?.id;

  const onRefresh = React.useCallback(() => {
    refetch();
    refetchPosts();
  }, [refetch, refetchPosts]);

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
          <Tab id="posted" label="Posted" active={activeTab === 'posted'} onPress={setActiveTab} />
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
          ) : activeTab === 'posted' ? (
            isLoadingPosts ? (
              <Loader text="Loading posted tasks..." />
            ) : !myTaskPosts || myTaskPosts.length === 0 ? (
              <View className="flex-col items-center justify-center py-12">
                <PenSquare size={48} color="#B29D88" />
                <Text className="text-lg font-medium text-[#333A31] mt-4 mb-2">
                  No posted tasks
                </Text>
                <Text className="text-sm text-[#666666] text-center px-8 mb-6">
                  Post a task and let professionals bid on it
                </Text>
                <Pressable
                  onPress={() => router.push('/(client)/post-task')}
                  className="px-8 py-3 rounded-full"
                  style={{ backgroundColor: '#C1856A' }}
                >
                  <Text className="text-white font-medium">Post a Task</Text>
                </Pressable>
              </View>
            ) : (
              <View className="flex-col space-y-2">
                {myTaskPosts.map((post) => (
                  <PostedTaskCard
                    key={post.id}
                    post={post}
                    onPress={() => router.push(`/(client)/task-post-details/${post.id}`)}
                  />
                ))}
              </View>
            )
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

function PostedTaskCard({ post, onPress }: { post: TaskPostWithCategory; onPress: () => void }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    open: { bg: '#E8F5E9', text: '#2E7D32' },
    assigned: { bg: '#E3F2FD', text: '#1565C0' },
    completed: { bg: '#F5F5F5', text: '#6B7B6B' },
    cancelled: { bg: '#FFEBEE', text: '#C62828' },
  };
  const status = statusColors[post.status] || statusColors.open;

  return (
    <Pressable
      onPress={onPress}
      className="bg-white mx-4 mt-3 p-4 rounded-2xl border border-gray-100"
    >
      <View className="flex-row items-center justify-between mb-2">
        {post.category && (
          <Text className="text-xs font-medium text-[#C1856A] uppercase">
            {post.category.name}
          </Text>
        )}
        <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: status.bg }}>
          <Text className="text-[10px] font-bold uppercase" style={{ color: status.text }}>
            {post.status}
          </Text>
        </View>
      </View>

      <Text className="text-[15px] font-bold text-[#30352D] mb-1">
        {post.title}
      </Text>

      {post.description && (
        <Text className="text-[13px] text-[#6B6B6B] mb-2" numberOfLines={2}>
          {post.description}
        </Text>
      )}

      {(post.budget_min_cents || post.budget_max_cents) && (
        <View className="flex-row items-center mb-1">
          <DollarSign size={14} color="#B29D88" />
          <Text className="text-[13px] text-[#30352D] ml-1 font-medium">
            {post.budget_min_cents && post.budget_max_cents
              ? `£${(post.budget_min_cents / 100).toFixed(0)} - £${(post.budget_max_cents / 100).toFixed(0)}`
              : post.budget_max_cents
                ? `Up to £${(post.budget_max_cents / 100).toFixed(0)}`
                : `From £${((post.budget_min_cents || 0) / 100).toFixed(0)}`}
          </Text>
        </View>
      )}

      <View className="flex-row items-center justify-between mt-2">
        <Text className="text-[11px] text-[#9CA3AF]">
          {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </Text>
        <View className="flex-row items-center gap-1">
          <MessageSquare size={14} color="#B29D88" />
          <Text className="text-[12px] text-[#6B6B6B]">View bids</Text>
          <ChevronRight size={14} color="#B29D88" />
        </View>
      </View>
    </Pressable>
  );
}
