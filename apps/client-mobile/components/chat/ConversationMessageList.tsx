import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View, Text } from 'react-native';
import { ConversationMessage } from '@shared/supabase';
import { ConversationBubble } from './ConversationBubble';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';

interface ConversationMessageListProps {
  messages: ConversationMessage[];
  currentUserId: string;
  otherUserName?: string;
  otherUserAvatar?: string;
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
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
  loadingMore = false,
  hasMore = false,
  onRefresh,
  onLoadMore,
}: ConversationMessageListProps) => {
  const flatListRef = useRef<FlatList>(null);
  const latestMessageIdRef = useRef<string | null>(null);
  const loadMoreTriggeredRef = useRef(false);

  // Auto-scroll only when the latest message changes, not when older history is prepended.
  useEffect(() => {
    const latestMessageId = messages[messages.length - 1]?.id ?? null;

    if (latestMessageId && latestMessageId !== latestMessageIdRef.current && flatListRef.current) {
      // Small delay to ensure render is complete
      const timeout = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      latestMessageIdRef.current = latestMessageId;
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  useEffect(() => {
    if (!loadingMore) {
      loadMoreTriggeredRef.current = false;
    }
  }, [loadingMore]);

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

  const renderListHeader = () => {
    if (!loadingMore) return null;

    return (
      <View className="py-3 items-center">
        <ActivityIndicator size="small" color="#C1856A" />
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={messagesWithDates}
      renderItem={renderMessage}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingVertical: 8 }}
      ListHeaderComponent={renderListHeader}
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
      onScroll={({ nativeEvent }) => {
        if (!hasMore || !onLoadMore || loadingMore) return;

        if (nativeEvent.contentOffset.y <= 48 && !loadMoreTriggeredRef.current) {
          loadMoreTriggeredRef.current = true;
          onLoadMore();
          return;
        }

        if (nativeEvent.contentOffset.y > 96) {
          loadMoreTriggeredRef.current = false;
        }
      }}
      scrollEventThrottle={16}
    />
  );
};
