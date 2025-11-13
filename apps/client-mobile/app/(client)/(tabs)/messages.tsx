import React from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { useConversations } from '@shared/supabase';
import { ConversationItem } from '../../../components/chat';

export default function MessagesScreen() {
  const router = useRouter();
  const { data: conversations, isLoading, error, refetch } = useConversations();

  const handleConversationPress = (conversationId: string) => {
    router.push({
      pathname: '/(client)/chat/conversation',
      params: { conversationId },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
          <Text className="text-sm text-gray-600 mt-3">Loading conversations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <MessageCircle size={64} color="#999999" />
          <Text className="text-lg font-semibold text-[#30352D] mt-4 text-center">
            Unable to load messages
          </Text>
          <Text className="text-sm text-gray-600 mt-2 text-center">
            Please check your connection and try again
          </Text>
          <Pressable
            onPress={() => refetch()}
            className="mt-6 px-6 py-3 rounded-full"
            style={{ backgroundColor: '#C1856A' }}
          >
            <Text className="text-base font-semibold text-white">
              Try Again
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <MessageCircle size={80} color="#CCCCCC" />
      <Text className="text-xl font-semibold text-[#30352D] mt-6 text-center">
        No messages yet
      </Text>
      <Text className="text-base text-gray-600 mt-2 text-center">
        Start a conversation with your tasker after booking
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 pt-4 pb-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-[#30352D]">Messages</Text>
      </View>

      {/* Conversations List */}
      <FlatList
        data={conversations || []}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => handleConversationPress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        onRefresh={refetch}
        refreshing={isLoading}
        contentContainerStyle={
          !conversations || conversations.length === 0
            ? { flex: 1 }
            : undefined
        }
      />
    </SafeAreaView>
  );
}
