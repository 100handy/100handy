import React from 'react';
import { View, Text } from 'react-native'; import { SupportMessage } from '@shared/supabase';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: SupportMessage;
  showTimestamp?: boolean;
}

export const MessageBubble = ({ message, showTimestamp = true }: MessageBubbleProps) => {
  const isFromUser = message.from_user;
  const isSystemMessage = message.message_type === 'system';
  const isAIGenerated = message.metadata?.ai_generated === true;

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

  // User messages on right, support messages on left
  return (
    <View className={`px-6 py-2 flex-col ${isFromUser ? 'items-end' : 'items-start'}`}>
      <View
        className={`rounded-2xl px-4 py-3 max-w-[85%] ${
          isFromUser ? 'bg-white border border-gray-200' : 'bg-[#F5F5F5]'
        }`}
      >
        {/* Support team label with AI indicator */}
        {!isFromUser && (
          <View className="flex-row items-center mb-1">
            <Text className="text-[12px] text-[#999999]">
              {isAIGenerated ? '🤖 AI Assistant' : '100Handy Support'}
            </Text>
          </View>
        )}

        {/* Message text */}
        <Text className="text-[15px] text-[#30352D] leading-5">{message.message}</Text>

        {/* Attachment if present */}
        {message.attachment_url && (
          <View className="mt-2 p-2 bg-gray-100 rounded">
            <Text className="text-[13px] text-[#666666]">
              📎 {message.attachment_name || 'Attachment'}
            </Text>
          </View>
        )}

        {/* Interactive elements from metadata */}
        {message.message_type === 'interactive' && Array.isArray(message.metadata?.options) && (
          <View className="mt-2">
            {(message.metadata.options as string[]).map((option: string, index: number) => (
              <View
                key={index}
                className="mt-1 p-2 bg-white border border-gray-300 rounded"
              >
                <Text className="text-[14px] text-[#333333]">{option}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Timestamp */}
      {showTimestamp && (
        <Text className={`text-[11px] text-[#999999] mt-1`}>
          {timestamp}
          {message.read_at && isFromUser && ' · Read'}
        </Text>
      )}
    </View>
  );
};
