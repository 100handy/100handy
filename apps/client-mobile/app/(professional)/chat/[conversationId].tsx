import React, { useCallback, useEffect, useRef } from 'react';
import { useAuthStore } from '@shared/store';
import { useConversationMessages, useSendConversationMessage, useMarkAsRead } from '@shared/query';
import { View, Text, Image, ActivityIndicator, Pressable, Alert } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { useRouter, useLocalSearchParams } from 'expo-router'; import { ChevronLeft, MoreVertical } from 'lucide-react-native'; import { useConversation } from '@shared/query'; import { subscribeToConversation, unsubscribeFromConversation } from '@shared/supabase';
import { ConversationMessageList } from '@/components/chat';
import { MessageInput } from '@/components/support/MessageInput';

export default function ProfessionalConversationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const conversationId = params.conversationId as string;

  // Get current user
  const user = useAuthStore((state) => state.user);

  // Fetch conversation details
  const {
    data: conversation,
    isLoading: conversationLoading,
    isError: conversationError,
  } = useConversation(conversationId);

  // Fetch messages
  const {
    data: messagesData,
    isLoading: messagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchMessages,
    isError: messagesError,
  } = useConversationMessages(conversationId);

  // Mutations
  const sendMessage = useSendConversationMessage();
  const { mutate: markAsRead } = useMarkAsRead();
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Determine other user (for professional, it's the client)
  const isTasker = user?.id === conversation?.tasker_id;
  const otherUser = isTasker ? conversation?.client : conversation?.tasker;
  const otherUserName = otherUser
    ? `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() || 'Client'
    : 'Client';
  const otherUserAvatar = otherUser?.avatar_url ?? undefined;

  const markConversationAsRead = useCallback(() => {
    if (conversationId) {
      markAsRead(conversationId);
    }
  }, [conversationId, markAsRead]);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) return;

    refreshTimeoutRef.current = setTimeout(() => {
      refreshTimeoutRef.current = null;
      refetchMessages();
    }, 120);
  }, [refetchMessages]);

  // Mark messages as read when screen loads
  useEffect(() => {
    if (conversationId) {
      markConversationAsRead();
    }
  }, [conversationId, markConversationAsRead]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId || !user?.id) return;

    // Capture userId in closure to avoid dependency on user object changes
    const userId = user.id;
    const channel = subscribeToConversation(conversationId, (event, newMessage) => {
      scheduleRefresh();

      // Only mark newly inserted messages from the other user as read.
      if (event === 'INSERT' && newMessage.sender_id !== userId) {
        markConversationAsRead();
      }
    });

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
      unsubscribeFromConversation(channel);
    };
  }, [conversationId, markConversationAsRead, scheduleRefresh, user?.id]);

  const handleSendMessage = async (message: string, attachment?: any) => {
    if (!conversationId || !message.trim()) return;

    try {
      await sendMessage.mutateAsync({
        conversation_id: conversationId,
        message: message.trim(),
        message_type: 'text',
        attachment_url: attachment?.uri,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleViewProfile = useCallback(() => {
    if (!otherUser?.user_id) {
      Alert.alert('Profile unavailable', 'This profile cannot be opened right now.');
      return;
    }

    router.push({
      pathname: '/(professional)/profile/client-profile',
      params: {
        userId: otherUser.user_id,
        name: otherUserName,
      },
    });
  }, [otherUser?.user_id, otherUserName, router]);

  const handleReportUser = useCallback(() => {
    Alert.alert(
      'Report user',
      `Need help with ${otherUserName}? Contact support and include this conversation if needed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Support',
          onPress: () => router.push('/(professional)/profile/support'),
        },
      ]
    );
  }, [otherUserName, router]);

  const handleMoreOptions = useCallback(() => {
    Alert.alert(
      otherUserName,
      'Choose an action',
      [
        { text: 'View profile', onPress: handleViewProfile },
        { text: 'Report user', onPress: handleReportUser },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [handleReportUser, handleViewProfile, otherUserName]);

  if (conversationLoading || messagesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A5347" />
          <Text className="font-worksans text-[14px] text-[#666] mt-3">Loading conversation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (conversationError || messagesError || !conversation) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="font-worksans-semibold text-[16px] text-[#30352D] mb-2 text-center">
            Conversation unavailable
          </Text>
          <Text className="font-worksans text-[14px] text-[#666] text-center mb-4">
            This conversation could not be loaded right now.
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="px-6 py-3 rounded-full"
            style={{ backgroundColor: '#4A5347' }}
          >
            <Text className="text-white font-semibold">Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-[#F0F0F0]">
        {/* Back Button */}
        <Pressable onPress={() => router.back()} className="mr-3">
          <ChevronLeft size={24} color="#30352D" strokeWidth={2} />
        </Pressable>

        {/* User Info */}
        <View className="flex-1 flex-row items-center">
          <Image
            source={otherUserAvatar ? { uri: otherUserAvatar } : require('@/assets/images/icon.png')}
            className="w-10 h-10 rounded-full bg-gray-100"
          />
          <View className="flex-1 ml-3">
            <Text className="font-worksans-semibold text-[16px] text-[#30352D]">
              {otherUserName}
            </Text>
          </View>
        </View>

        {/* More Options */}
        <Pressable className="ml-2" onPress={handleMoreOptions}>
          <MoreVertical size={20} color="#666666" />
        </Pressable>
      </View>

      {/* Messages List */}
      <View className="flex-1">
        <ConversationMessageList
          messages={messagesData?.messages ?? []}
          currentUserId={user?.id || ''}
          otherUserName={otherUserName}
          otherUserAvatar={otherUserAvatar}
          loading={messagesLoading}
          loadingMore={isFetchingNextPage}
          hasMore={!!hasNextPage}
          onRefresh={refetchMessages}
          onLoadMore={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
        />
      </View>

      {/* Message Input - already has KeyboardAvoidingView */}
      <MessageInput
        onSend={handleSendMessage}
        placeholder={`Message ${otherUserName.split(' ')[0]}...`}
        disabled={sendMessage.isPending}
      />
    </SafeAreaView>
  );
}
