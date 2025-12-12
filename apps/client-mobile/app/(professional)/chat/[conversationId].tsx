import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MoreVertical } from 'lucide-react-native';
import {
  useConversation,
  useConversationMessages,
  useSendConversationMessage,
  useMarkAsRead,
  useAuthStore,
  subscribeToConversation,
  unsubscribeFromConversation,
} from '@shared/supabase';
import { ConversationMessageList } from '@/components/chat';
import { MessageInput } from '@/components/support/MessageInput';

export default function ProfessionalConversationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const conversationId = params.conversationId as string;

  // Get current user
  const user = useAuthStore((state) => state.user);

  // Fetch conversation details
  const { data: conversation, isLoading: conversationLoading } = useConversation(conversationId);

  // Fetch messages
  const {
    data: messages,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useConversationMessages(conversationId);

  // Mutations
  const sendMessage = useSendConversationMessage();
  const markAsRead = useMarkAsRead();

  // Determine other user (for professional, it's the client)
  const isTasker = user?.id === conversation?.tasker_id;
  const otherUser = isTasker ? conversation?.client : conversation?.tasker;
  const otherUserName = otherUser
    ? `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() || 'Client'
    : 'Client';
  const otherUserAvatar = otherUser?.avatar_url || `https://i.pravatar.cc/150?u=${otherUser?.user_id}`;

  // Mark messages as read when screen loads
  useEffect(() => {
    if (conversationId) {
      markAsRead.mutate(conversationId);
    }
  }, [conversationId]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId || !user?.id) return;

    // Capture userId in closure to avoid dependency on user object changes
    const userId = user.id;
    const channel = subscribeToConversation(conversationId, (newMessage) => {
      // Refetch messages to update UI
      refetchMessages();

      // Mark as read if message is from other user
      if (newMessage.sender_id !== userId) {
        markAsRead.mutate(conversationId);
      }
    });

    return () => {
      unsubscribeFromConversation(channel);
    };
  }, [conversationId]); // Removed user?.id to avoid subscription recreation

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
            source={{ uri: otherUserAvatar }}
            className="w-10 h-10 rounded-full bg-gray-100"
          />
          <View className="flex-1 ml-3">
            <Text className="font-worksans-semibold text-[16px] text-[#30352D]">
              {otherUserName}
            </Text>
          </View>
        </View>

        {/* More Options */}
        <Pressable className="ml-2">
          <MoreVertical size={20} color="#666666" />
        </Pressable>
      </View>

      {/* Messages List */}
      <View className="flex-1">
        <ConversationMessageList
          messages={messages || []}
          currentUserId={user?.id || ''}
          otherUserName={otherUserName}
          otherUserAvatar={otherUserAvatar}
          loading={messagesLoading}
          onRefresh={refetchMessages}
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
