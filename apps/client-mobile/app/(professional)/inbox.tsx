import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '@shared/store';
import { useConversations } from '@shared/query';
import { View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { ChevronLeft, Mail, MessageCircle } from 'lucide-react-native'; import { useRouter } from 'expo-router'; import { useProfileStore } from '@shared/store'; import { subscribeToConversationList, unsubscribeFromConversation } from '@shared/supabase';
import { ConversationItem } from '@/components/chat';

export default function InboxScreen() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const { user } = useAuthStore();
  const { data: conversations, isLoading, error, refetch } = useConversations(!!user?.id);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const channel = subscribeToConversationList(() => {
      if (refreshTimeoutRef.current) return;

      refreshTimeoutRef.current = setTimeout(() => {
        refreshTimeoutRef.current = null;
        refetch();
      }, 120);
    });

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
      unsubscribeFromConversation(channel);
    };
  }, [refetch, user?.id]);

  // Filter conversations where current user is the tasker (professional)
  const myConversations = conversations?.filter(c => c.tasker_id === user?.id) || [];

  const handleConversationPress = (conversationId: string) => {
    router.push({
      pathname: '/(professional)/chat/[conversationId]',
      params: { conversationId },
    });
  };

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
        <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-[#F0F0F0]">
          <Pressable onPress={() => router.back()}>
            <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
          </Pressable>
          <Text className="font-worksans-bold text-[18px] text-[#30352D]">
            {profile?.first_name ? `${profile.first_name}'s inbox` : 'Inbox'}
          </Text>
          <View className="w-7" />
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A5347" />
          <Text className="font-worksans text-[14px] text-[#666] mt-3">Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error State
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
        <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-[#F0F0F0]">
          <Pressable onPress={() => router.back()}>
            <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
          </Pressable>
          <Text className="font-worksans-bold text-[18px] text-[#30352D]">
            {profile?.first_name ? `${profile.first_name}'s inbox` : 'Inbox'}
          </Text>
          <View className="w-7" />
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <MessageCircle size={64} color="#999999" />
          <Text className="font-worksans-semibold text-[16px] text-[#30352D] mt-4 text-center">
            Unable to load messages
          </Text>
          <Text className="font-worksans text-[14px] text-[#666] mt-2 text-center">
            Please check your connection and try again
          </Text>
          <Pressable
            onPress={() => refetch()}
            className="mt-6 px-6 py-3 rounded-full bg-[#4A5347]"
          >
            <Text className="font-worksans-semibold text-[14px] text-white">Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Empty State
  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-32 px-6">
      <View className="w-20 h-20 rounded-full bg-brand-taupe items-center justify-center mb-4">
        <Mail color="white" size={36} strokeWidth={1.5} />
      </View>
      <Text className="font-worksans-semibold text-[16px] text-[#30352D] text-center">
        No messages yet
      </Text>
      <Text className="font-worksans text-[14px] text-[#666] mt-2 text-center">
        Messages from clients will appear here
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-[#F0F0F0]">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-[18px] text-[#30352D]">
          {profile?.first_name ? `${profile.first_name}'s inbox` : 'Inbox'}
        </Text>
        <View className="w-7" />
      </View>

      {/* Conversations List */}
      <FlatList
        data={myConversations}
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
          myConversations.length === 0 ? { flex: 1 } : undefined
        }
        className="bg-white"
      />
    </SafeAreaView>
  );
}
