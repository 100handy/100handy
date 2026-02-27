import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Send,
  Search,
} from 'lucide-react-native';
import { useAuthStore } from '@shared/supabase';
import {
  useOpenTaskPosts,
  useCreateBid,
  type TaskPostWithCategory,
} from '@shared/supabase';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';

export default function BrowseTasksScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: tasks, isLoading, refetch } = useOpenTaskPosts();
  const { mutateAsync: submitBid, isPending: isSubmittingBid } = useCreateBid();

  const [refreshing, setRefreshing] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskPostWithCategory | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidHours, setBidHours] = useState('');
  const [bidMessage, setBidMessage] = useState('');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleOpenBidModal = (task: TaskPostWithCategory) => {
    setSelectedTask(task);
    setBidAmount('');
    setBidHours('');
    setBidMessage('');
    setShowBidModal(true);
  };

  const handleSubmitBid = async () => {
    if (!user?.id || !selectedTask) return;
    if (!bidAmount.trim() || !bidHours.trim()) {
      Alert.alert('Required', 'Please enter your bid amount and estimated hours.');
      return;
    }

    const amountCents = Math.round(parseFloat(bidAmount) * 100);
    const hours = parseFloat(bidHours);

    if (isNaN(amountCents) || amountCents <= 0) {
      Alert.alert('Invalid', 'Please enter a valid bid amount.');
      return;
    }
    if (isNaN(hours) || hours <= 0) {
      Alert.alert('Invalid', 'Please enter valid estimated hours.');
      return;
    }

    try {
      await submitBid({
        task_post_id: selectedTask.id,
        handy_id: user.id,
        amount_cents: amountCents,
        estimated_hours: hours,
        message: bidMessage.trim() || undefined,
      });
      setShowBidModal(false);
      Alert.alert('Bid Submitted', 'Your bid has been sent to the client.');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit bid. You may have already bid on this task.');
    }
  };

  const formatBudget = (minCents: number | null, maxCents: number | null) => {
    if (minCents && maxCents) {
      return `£${(minCents / 100).toFixed(0)} - £${(maxCents / 100).toFixed(0)}`;
    }
    if (minCents) return `From £${(minCents / 100).toFixed(0)}`;
    if (maxCents) return `Up to £${(maxCents / 100).toFixed(0)}`;
    return 'Open budget';
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const timeAgo = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const renderTaskCard = useCallback(({ item }: { item: TaskPostWithCategory }) => (
    <Pressable
      className="bg-white mx-4 mb-3 p-4 rounded-2xl border border-[#F0F0F0]"
      onPress={() => handleOpenBidModal(item)}
    >
      {/* Category Badge */}
      {item.category && (
        <View className="self-start px-2 py-1 rounded-full bg-brand-taupe mb-2">
          <Text className="font-worksans-medium text-[10px] text-white uppercase">
            {item.category.name}
          </Text>
        </View>
      )}

      {/* Title */}
      <Text className="font-worksans-bold text-[16px] text-brand-dark-alt mb-1">
        {item.title}
      </Text>

      {/* Description preview */}
      {item.description && (
        <Text className="font-worksans text-[13px] text-[#6B6B6B] mb-3" numberOfLines={2}>
          {item.description}
        </Text>
      )}

      {/* Budget */}
      <View className="flex-row items-center mb-2">
        <DollarSign color="#B29D88" size={16} strokeWidth={1.5} />
        <Text className="font-worksans-medium text-[14px] text-brand-dark-alt ml-2">
          {formatBudget(item.budget_min_cents, item.budget_max_cents)}
        </Text>
      </View>

      {/* Date & Time */}
      {item.preferred_date && (
        <View className="flex-row items-center mb-2">
          <Calendar color="#B29D88" size={16} strokeWidth={1.5} />
          <Text className="font-worksans text-[14px] text-[#6B6B6B] ml-2">
            {formatDate(item.preferred_date)}
            {item.preferred_time ? ` at ${item.preferred_time}` : ''}
          </Text>
        </View>
      )}

      {/* Location */}
      {item.address_postcode && (
        <View className="flex-row items-center mb-2">
          <MapPin color="#B29D88" size={16} strokeWidth={1.5} />
          <Text className="font-worksans text-[14px] text-[#6B6B6B] ml-2">
            {item.address_city ? `${item.address_city}, ` : ''}{item.address_postcode}
          </Text>
        </View>
      )}

      {/* Divider */}
      <View className="h-[1px] bg-[#F0F0F0] my-3" />

      {/* Bottom Row */}
      <View className="flex-row items-center justify-between">
        <Text className="font-worksans text-[12px] text-[#9CA3AF]">
          {timeAgo(item.created_at)}
        </Text>
        <View className="flex-row items-center gap-2">
          <Send size={16} color="#C1856A" />
          <Text className="font-worksans-bold text-[14px] text-[#C1856A]">
            Submit Bid
          </Text>
        </View>
      </View>
    </Pressable>
  ), []);

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#F5F5F5]">
        {/* Header */}
        <View className="bg-white flex-row items-center px-5 py-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="mr-3">
            <ChevronLeft size={24} color="#30352D" />
          </Pressable>
          <Text className="text-lg font-worksans-semibold" style={{ color: '#30352D' }}>
            Browse Open Tasks
          </Text>
        </View>

        {/* Task List */}
        {isLoading && !refreshing ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#C1856A" />
            <Text className="font-worksans text-[14px] text-[#6B6B6B] mt-3">
              Loading tasks...
            </Text>
          </View>
        ) : (
          <FlatList
            data={tasks || []}
            renderItem={renderTaskCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-16 px-8">
                <Search size={48} color="#B29D88" strokeWidth={1.5} />
                <Text className="font-worksans-bold text-[18px] text-brand-dark-alt mt-4 text-center">
                  No open tasks
                </Text>
                <Text className="font-worksans text-[14px] text-[#6B6B6B] mt-2 text-center">
                  Check back later for new task postings from clients
                </Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#B29D88"
              />
            }
          />
        )}
      </SafeAreaView>

      {/* Bid Submission Modal */}
      <Modal isOpen={showBidModal} onClose={() => setShowBidModal(false)}>
        <ModalBackdrop />
        <ModalContent className="bg-white" style={{ minHeight: '45%' }}>
          <View className="w-full items-center pt-2 pb-1">
            <View className="w-12 h-1 rounded-full bg-gray-400" />
          </View>
          <ModalBody>
            <View className="px-4 py-4">
              <Text className="text-lg font-worksans-bold text-[#30352D] mb-1">
                Submit Your Bid
              </Text>
              {selectedTask && (
                <Text className="text-sm font-worksans text-[#6B6B6B] mb-4" numberOfLines={2}>
                  {selectedTask.title}
                </Text>
              )}

              {/* Budget hint */}
              {selectedTask && (selectedTask.budget_min_cents || selectedTask.budget_max_cents) && (
                <View className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
                  <Text className="text-xs font-worksans text-[#6B6B6B]">
                    Client budget: {formatBudget(selectedTask.budget_min_cents, selectedTask.budget_max_cents)}
                  </Text>
                </View>
              )}

              {/* Bid Amount */}
              <Text className="text-sm font-worksans-medium mb-2" style={{ color: '#6B7280' }}>
                Your Price (£) *
              </Text>
              <TextInput
                value={bidAmount}
                onChangeText={setBidAmount}
                placeholder="e.g., 50"
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm font-worksans mb-4"
                style={{ color: '#30352D' }}
              />

              {/* Estimated Hours */}
              <Text className="text-sm font-worksans-medium mb-2" style={{ color: '#6B7280' }}>
                Estimated Hours *
              </Text>
              <TextInput
                value={bidHours}
                onChangeText={setBidHours}
                placeholder="e.g., 2.5"
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm font-worksans mb-4"
                style={{ color: '#30352D' }}
              />

              {/* Message */}
              <Text className="text-sm font-worksans-medium mb-2" style={{ color: '#6B7280' }}>
                Message to Client
              </Text>
              <TextInput
                value={bidMessage}
                onChangeText={setBidMessage}
                placeholder="Introduce yourself and explain your approach..."
                multiline
                numberOfLines={3}
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm font-worksans mb-6"
                style={{ color: '#30352D', textAlignVertical: 'top', minHeight: 80 }}
              />

              {/* Submit Button */}
              <Pressable
                onPress={handleSubmitBid}
                disabled={isSubmittingBid}
                className="w-full py-4 rounded-full items-center flex-row justify-center gap-2"
                style={{ backgroundColor: isSubmittingBid ? '#D1D5DB' : '#C1856A' }}
              >
                {isSubmittingBid ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Send size={18} color="white" />
                    <Text className="text-base font-worksans-semibold text-white">Submit Bid</Text>
                  </>
                )}
              </Pressable>
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
