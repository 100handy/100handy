import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
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
import { ConversationMessageList } from '../../../components/chat';
import { MessageInput } from '../../../components/support/MessageInput';

export default function ConversationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const conversationId = typeof params.conversationId === 'string' ? params.conversationId : '';

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

  // Determine other user
  const isClient = user?.id === conversation?.client_id;
  const otherUser = isClient ? conversation?.tasker : conversation?.client;
  const otherUserName = otherUser
    ? `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() || 'User'
    : 'User';
  const otherUserAvatar = otherUser?.avatar_url ?? undefined;

  // Mark messages as read when screen loads
  useEffect(() => {
    if (conversationId) {
      markAsRead.mutate(conversationId);
    }
  }, [conversationId]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = subscribeToConversation(conversationId, (newMessage) => {
      // Refetch messages to update UI
      refetchMessages();

      // Mark as read if message is from other user
      if (newMessage.sender_id !== user?.id) {
        markAsRead.mutate(conversationId);
      }
    });

    return () => {
      unsubscribeFromConversation(channel);
    };
  }, [conversationId, user?.id]);

  const handleSendMessage = async (message: string, attachment?: { uri?: string; name?: string }) => {
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
          <ActivityIndicator size="large" color="#C1856A" />
          <Text className="text-sm text-gray-600 mt-3">Loading conversation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          {/* Back Button */}
          <Pressable onPress={() => router.back()} className="mr-3">
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </Pressable>

          {/* User Info */}
          <View className="flex-1 flex-row items-center">
            <Image
              source={otherUserAvatar ? { uri: otherUserAvatar } : require('@/assets/images/icon.png')}
              className="w-10 h-10 rounded-full bg-gray-100"
            />
            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold text-[#30352D]">
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

        {/* Message Input */}
        <MessageInput
          onSend={handleSendMessage}
          placeholder={`Message ${otherUserName.split(' ')[0]}...`}
          disabled={sendMessage.isPending}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
