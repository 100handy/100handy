import React, { useEffect, useRef } from 'react';
import { FlatList, RefreshControl, View, Text } from 'react-native';
import { ConversationMessage } from '@shared/supabase';
import { ConversationBubble } from './ConversationBubble';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';

interface ConversationMessageListProps {
  messages: ConversationMessage[];
  currentUserId: string;
  otherUserName?: string;
  otherUserAvatar?: string;
  loading?: boolean;
  onRefresh?: () => void;
}

interface MessageWithDate extends ConversationMessage {
  showDateSeparator?: boolean;
  dateLabel?: string;
}

const DateSeparator = ({ label }: { label: string }) => (
  <View className="items-center py-3">
    <View className="bg-gray-200 rounded-full px-3 py-1">
      <Text className="text-[12px] text-[#666666]">{label}</Text>
    </View>
  </View>
);

export const ConversationMessageList = ({
  messages,
  currentUserId,
  otherUserName,
  otherUserAvatar,
  loading = false,
  onRefresh,
}: ConversationMessageListProps) => {
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      // Small delay to ensure render is complete
      const timeout = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [messages.length]);

  // Add date separators to messages
  const messagesWithDates: MessageWithDate[] = messages.map((message, index) => {
    const currentDate = new Date(message.created_at);
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const previousDate = previousMessage ? new Date(previousMessage.created_at) : null;

    let showDateSeparator = false;
    let dateLabel = '';

    // Show separator if first message or different day
    if (!previousDate || !isSameDay(currentDate, previousDate)) {
      showDateSeparator = true;

      if (isToday(currentDate)) {
        dateLabel = 'Today';
      } else if (isYesterday(currentDate)) {
        dateLabel = 'Yesterday';
      } else {
        dateLabel = format(currentDate, 'MMMM d, yyyy');
      }
    }

    return {
      ...message,
      showDateSeparator,
      dateLabel,
    };
  });

  const renderMessage = ({ item }: { item: MessageWithDate }) => (
    <View>
      {item.showDateSeparator && item.dateLabel && (
        <DateSeparator label={item.dateLabel} />
      )}
      <ConversationBubble
        message={item}
        currentUserId={currentUserId}
        otherUserName={otherUserName}
        otherUserAvatar={otherUserAvatar}
        showTimestamp={true}
      />
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-[16px] text-[#999999] text-center">
        No messages yet. Start the conversation!
      </Text>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={messagesWithDates}
      renderItem={renderMessage}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingVertical: 8 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor="#C1856A"
          />
        ) : undefined
      }
      ListEmptyComponent={!loading ? renderEmpty : null}
    />
  );
};
