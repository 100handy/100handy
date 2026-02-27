import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  User,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';
import { useAuthStore } from '@shared/supabase';
import {
  useTaskPostById,
  useBidsForTaskPost,
  useAcceptBid,
  useCancelTaskPost,
  type TaskBidWithProfile,
} from '@shared/supabase';

export default function TaskPostDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: post, isLoading: isLoadingPost, refetch: refetchPost } = useTaskPostById(id || null);
  const { data: bids, isLoading: isLoadingBids, refetch: refetchBids } = useBidsForTaskPost(id || null);
  const { mutateAsync: doAcceptBid, isPending: isAccepting } = useAcceptBid();
  const { mutateAsync: doCancel, isPending: isCancelling } = useCancelTaskPost();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchPost(), refetchBids()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchPost, refetchBids]);

  const handleAcceptBid = (bid: TaskBidWithProfile) => {
    if (!user?.id || !id) return;
    const name = bid.handy_profile
      ? `${bid.handy_profile.first_name || ''} ${bid.handy_profile.last_name?.charAt(0) || ''}.`.trim()
      : 'this professional';

    Alert.alert(
      'Accept Bid',
      `Accept ${name}'s bid for £${(bid.amount_cents / 100).toFixed(2)}? All other bids will be declined.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              await doAcceptBid({ postId: id, bidId: bid.id, customerId: user.id });
              Alert.alert('Bid Accepted', `${name} has been assigned to your task.`);
            } catch {
              Alert.alert('Error', 'Failed to accept bid. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleCancelPost = () => {
    if (!id) return;
    Alert.alert(
      'Cancel Task',
      'Are you sure you want to cancel this task posting? All pending bids will be lost.',
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Cancel Task',
          style: 'destructive',
          onPress: async () => {
            try {
              await doCancel(id);
              Alert.alert('Cancelled', 'Your task posting has been cancelled.');
              router.back();
            } catch {
              Alert.alert('Error', 'Failed to cancel task.');
            }
          },
        },
      ]
    );
  };

  const formatBudget = (minCents: number | null, maxCents: number | null) => {
    if (minCents && maxCents) {
      return `£${(minCents / 100).toFixed(0)} - £${(maxCents / 100).toFixed(0)}`;
    }
    if (minCents) return `From £${(minCents / 100).toFixed(0)}`;
    if (maxCents) return `Up to £${(maxCents / 100).toFixed(0)}`;
    return 'Open budget';
  };

  if (isLoadingPost) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center px-5 py-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="mr-3">
            <ChevronLeft size={24} color="#30352D" />
          </Pressable>
          <Text className="text-lg font-worksans-semibold" style={{ color: '#30352D' }}>
            Task Details
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-gray-500 text-center">Task not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isOpen = post.status === 'open';
  const pendingBids = bids?.filter((b) => b.status === 'pending') || [];
  const acceptedBid = bids?.find((b) => b.status === 'accepted');

  const statusLabel = {
    open: 'Open',
    assigned: 'Assigned',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }[post.status];

  const statusColor = {
    open: '#2E7D32',
    assigned: '#1565C0',
    completed: '#6B7B6B',
    cancelled: '#C62828',
  }[post.status];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-gray-200">
        <Pressable onPress={() => router.back()} className="mr-3">
          <ChevronLeft size={24} color="#30352D" />
        </Pressable>
        <Text className="text-lg font-worksans-semibold flex-1" style={{ color: '#30352D' }}>
          Task Details
        </Text>
        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: statusColor + '20' }}>
          <Text className="text-xs font-worksans-bold" style={{ color: statusColor }}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C1856A" />
        }
      >
        {/* Task Info */}
        <View className="px-5 py-5">
          {post.category && (
            <Text className="text-xs font-worksans-medium text-[#C1856A] mb-1 uppercase">
              {post.category.name}
            </Text>
          )}
          <Text className="text-xl font-worksans-bold text-[#30352D] mb-3">
            {post.title}
          </Text>

          {post.description && (
            <Text className="text-sm font-worksans text-[#6B6B6B] mb-4 leading-5">
              {post.description}
            </Text>
          )}

          {/* Details Row */}
          <View className="gap-3">
            {(post.budget_min_cents || post.budget_max_cents) && (
              <View className="flex-row items-center">
                <DollarSign color="#B29D88" size={18} strokeWidth={1.5} />
                <Text className="font-worksans-medium text-[14px] text-[#30352D] ml-2">
                  Budget: {formatBudget(post.budget_min_cents, post.budget_max_cents)}
                </Text>
              </View>
            )}

            {post.preferred_date && (
              <View className="flex-row items-center">
                <Calendar color="#B29D88" size={18} strokeWidth={1.5} />
                <Text className="font-worksans text-[14px] text-[#6B6B6B] ml-2">
                  {new Date(post.preferred_date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                  {post.preferred_time ? ` at ${post.preferred_time}` : ''}
                </Text>
              </View>
            )}

            {post.address_postcode && (
              <View className="flex-row items-center">
                <MapPin color="#B29D88" size={18} strokeWidth={1.5} />
                <Text className="font-worksans text-[14px] text-[#6B6B6B] ml-2">
                  {[post.address_street, post.address_city, post.address_postcode]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Divider */}
        <View className="h-2 bg-[#F5F5F5]" />

        {/* Bids Section */}
        <View className="px-5 py-5">
          <Text className="text-base font-worksans-bold text-[#30352D] mb-4">
            Bids ({pendingBids.length})
          </Text>

          {isLoadingBids ? (
            <ActivityIndicator size="small" color="#C1856A" />
          ) : pendingBids.length === 0 && !acceptedBid ? (
            <View className="items-center py-8">
              <Clock size={40} color="#D1D5DB" strokeWidth={1.5} />
              <Text className="font-worksans text-[14px] text-[#9CA3AF] mt-3 text-center">
                No bids yet. Professionals will submit bids as they see your task.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {/* Accepted bid shown first */}
              {acceptedBid && (
                <BidCard bid={acceptedBid} status="accepted" />
              )}

              {/* Pending bids */}
              {pendingBids.map((bid) => (
                <BidCard
                  key={bid.id}
                  bid={bid}
                  status="pending"
                  onAccept={isOpen ? () => handleAcceptBid(bid) : undefined}
                  isAccepting={isAccepting}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {isOpen && (
        <View className="px-5 py-4 border-t border-gray-200">
          <Pressable
            onPress={handleCancelPost}
            disabled={isCancelling}
            className="w-full py-3 rounded-full items-center border border-red-300"
          >
            <Text className="text-base font-worksans-medium text-red-500">
              {isCancelling ? 'Cancelling...' : 'Cancel Task Posting'}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

function BidCard({
  bid,
  status,
  onAccept,
  isAccepting,
}: {
  bid: TaskBidWithProfile;
  status: 'pending' | 'accepted';
  onAccept?: () => void;
  isAccepting?: boolean;
}) {
  const name = bid.handy_profile
    ? `${bid.handy_profile.first_name || ''} ${bid.handy_profile.last_name || ''}`.trim()
    : 'Professional';

  return (
    <View
      className={`rounded-xl border p-4 ${
        status === 'accepted' ? 'border-green-300 bg-green-50' : 'border-[#F0F0F0] bg-white'
      }`}
    >
      {/* Status Badge */}
      {status === 'accepted' && (
        <View className="flex-row items-center gap-1 mb-2">
          <CheckCircle2 size={14} color="#2E7D32" />
          <Text className="text-xs font-worksans-bold text-[#2E7D32] uppercase">Accepted</Text>
        </View>
      )}

      {/* Profile Row */}
      <View className="flex-row items-center mb-3">
        {bid.handy_profile?.avatar_url ? (
          <Image
            source={{ uri: bid.handy_profile.avatar_url }}
            className="w-10 h-10 rounded-full"
            transition={200}
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-[#F5F5F5] items-center justify-center">
            <User size={20} color="#9CA3AF" />
          </View>
        )}
        <View className="ml-3 flex-1">
          <Text className="font-worksans-bold text-[15px] text-[#30352D]">{name}</Text>
          <Text className="font-worksans text-[12px] text-[#9CA3AF]">
            {bid.estimated_hours}h estimated
          </Text>
        </View>
        <Text className="font-worksans-bold text-[18px] text-[#30352D]">
          £{(bid.amount_cents / 100).toFixed(0)}
        </Text>
      </View>

      {/* Message */}
      {bid.message && (
        <Text className="font-worksans text-[13px] text-[#6B6B6B] mb-3 leading-5">
          "{bid.message}"
        </Text>
      )}

      {/* Accept Button */}
      {onAccept && status === 'pending' && (
        <Pressable
          onPress={onAccept}
          disabled={isAccepting}
          className="py-3 rounded-full items-center"
          style={{ backgroundColor: isAccepting ? '#D1D5DB' : '#4A5347' }}
        >
          <Text className="font-worksans-bold text-[14px] text-white">
            {isAccepting ? 'Accepting...' : 'Accept Bid'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
