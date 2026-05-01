import React from 'react';
import { View, Text, Image, Pressable } from 'react-native'; import { ConversationWithProfiles } from '@shared/query';
import { formatDistanceToNow } from 'date-fns'; import { useAuthStore } from '@shared/store';

interface ConversationItemProps {
  conversation: ConversationWithProfiles;
  onPress: () => void;
}

export const ConversationItem = ({ conversation, onPress }: ConversationItemProps) => {
  const user = useAuthStore((state) => state.user);

  // Determine the other participant (client or tasker)
  const isClient = user?.id === conversation.client_id;
  const otherUser = isClient ? conversation.tasker : conversation.client;

  // Get unread count for current user
  const unreadCount = isClient
    ? conversation.client_unread_count
    : conversation.tasker_unread_count;

  // Format last message time
  const lastMessageTime = conversation.last_message_at
    ? formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })
    : '';

  // Get display name
  const displayName = otherUser
    ? `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() || 'User'
    : 'User';

  // Get avatar
  const avatarUrl = otherUser?.avatar_url ?? undefined;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-5 py-4 bg-white border-b border-gray-200 active:bg-gray-50"
    >
      {/* Avatar */}
      <View className="relative">
        <Image
          source={avatarUrl ? { uri: avatarUrl } : require('@/assets/images/icon.png')}
          className="w-14 h-14 rounded-full bg-gray-100"
        />
        {unreadCount > 0 && (
          <View
            className="absolute -top-1 -right-1 bg-[#C1856A] rounded-full min-w-[20px] h-5 items-center justify-center px-1.5"
          >
            <Text className="text-[11px] font-semibold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </View>

      {/* Conversation Info */}
      <View className="flex-1 ml-3">
        {/* Name and Time */}
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-base font-semibold text-[#30352D]">
            {displayName}
          </Text>
          {lastMessageTime && (
            <Text className="text-[12px] text-[#999999]">
              {lastMessageTime}
            </Text>
          )}
        </View>

        {/* No booking info shown here - it's per-message now */}
      </View>
    </Pressable>
  );
};
