import React from 'react';
import { View, Text, Image } from 'react-native';
import { ConversationMessage } from '@shared/supabase';
import { format } from 'date-fns';

interface ConversationBubbleProps {
  message: ConversationMessage;
  currentUserId: string;
  otherUserName?: string;
  otherUserAvatar?: string;
  showTimestamp?: boolean;
}

export const ConversationBubble = ({
  message,
  currentUserId,
  otherUserName = '100Handy Pro',
  otherUserAvatar,
  showTimestamp = true,
}: ConversationBubbleProps) => {
  const isFromCurrentUser = message.sender_id === currentUserId;
  const isSystemMessage = message.message_type === 'system';

  // Format timestamp
  const timestamp = format(new Date(message.created_at), 'h:mm a');

  // System messages are centered
  if (isSystemMessage) {
    return (
      <View className="px-6 py-2 flex-col">
        <View className="bg-[#F5F5F5] rounded-lg p-4 self-center max-w-[85%]">
          <Text className="text-[14px] text-[#333333] leading-5">{message.message}</Text>
        </View>
        {showTimestamp && (
          <Text className="text-[11px] text-[#999999] text-center mt-1">{timestamp}</Text>
        )}
      </View>
    );
  }

  // Current user messages on right, other user messages on left
  return (
    <View className={`px-6 py-2 flex-col ${isFromCurrentUser ? 'items-end' : 'items-start'}`}>
      {/* Show avatar for other user */}
      {!isFromCurrentUser && otherUserAvatar && (
        <View className="mb-2">
          <Image
            source={{ uri: otherUserAvatar }}
            className="w-8 h-8 rounded-full"
          />
        </View>
      )}

      <View
        className={`rounded-2xl px-4 py-3 max-w-[85%] ${
          isFromCurrentUser ? 'bg-[#C1856A]' : 'bg-[#F5F5F5]'
        }`}
      >
        {/* Other user label */}
        {!isFromCurrentUser && (
          <Text className="text-[12px] text-[#999999] mb-1">{otherUserName}</Text>
        )}

        {/* Message text */}
        <Text className={`text-[15px] leading-5 ${isFromCurrentUser ? 'text-white' : 'text-[#30352D]'}`}>
          {message.message}
        </Text>

        {/* Image attachment if present */}
        {message.message_type === 'image' && message.attachment_url && (
          <Image
            source={{ uri: message.attachment_url }}
            className="mt-2 w-full h-48 rounded-lg"
            resizeMode="cover"
          />
        )}
      </View>

      {/* Timestamp */}
      {showTimestamp && (
        <Text className="text-[11px] text-[#999999] mt-1">
          {timestamp}
          {message.read_at && isFromCurrentUser && ' · Read'}
        </Text>
      )}
    </View>
  );
};
