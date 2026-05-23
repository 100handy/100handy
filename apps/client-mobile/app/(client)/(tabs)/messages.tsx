import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '@shared/store';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { useRouter } from 'expo-router'; import { MessageCircle } from 'lucide-react-native'; import { useConversations } from '@shared/query'; import { subscribeToConversationList, unsubscribeFromConversation } from '@shared/supabase';
import { ConversationItem } from '../../../components/chat';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

const DEFAULT_CONTENT = {
  'header.title': 'Messages',
  'auth.title': 'Please sign in',
  'auth.body': 'You need to be signed in to view your messages.',
  'auth.cta': 'Sign In',
  'loading.text': 'Loading conversations...',
  'error.title': 'Unable to load messages',
  'error.body': 'Please check your connection and try again',
  'error.cta': 'Try Again',
  'empty.title': 'No messages yet',
  'empty.body': 'Start a conversation with your 100Handy Pro after booking',
} as const;

export default function MessagesScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const { data: conversations, isLoading, error, refetch } = useConversations(!!user?.id);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const content = useAppContent('client_messages', DEFAULT_CONTENT);

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

  // Show sign-in prompt for unauthenticated users (after auth loading completes)
  if (!authLoading && !user?.id) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-5 pt-4 pb-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-brand-dark-alt">
            {getAppContentValue(content, 'header.title', DEFAULT_CONTENT['header.title'])}
          </Text>
        </View>
        <View className="flex-1 items-center justify-center py-12">
          <MessageCircle size={64} color="#C1856A" />
          <Text className="text-lg font-medium text-brand-dark mt-4 mb-2">
            {getAppContentValue(content, 'auth.title', DEFAULT_CONTENT['auth.title'])}
          </Text>
          <Text className="text-sm text-[#666666] text-center px-8 mb-6">
            {getAppContentValue(content, 'auth.body', DEFAULT_CONTENT['auth.body'])}
          </Text>
          <Pressable
            onPress={() => router.push('/(auth)/(client)/sign-in')}
            className="px-8 py-3 rounded-full bg-clay-orange"
          >
            <Text className="text-white font-medium">
              {getAppContentValue(content, 'auth.cta', DEFAULT_CONTENT['auth.cta'])}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text className="text-sm text-gray-600 mt-3">
            {getAppContentValue(content, 'loading.text', DEFAULT_CONTENT['loading.text'])}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <MessageCircle size={64} color="#999999" />
          <Text className="text-lg font-semibold text-brand-dark-alt mt-4 text-center">
            {getAppContentValue(content, 'error.title', DEFAULT_CONTENT['error.title'])}
          </Text>
          <Text className="text-sm text-gray-600 mt-2 text-center">
            {getAppContentValue(content, 'error.body', DEFAULT_CONTENT['error.body'])}
          </Text>
          <Pressable
            onPress={() => refetch()}
            className="mt-6 px-6 py-3 rounded-full"
            style={{ backgroundColor: '#C1856A' }}
          >
            <Text className="text-base font-semibold text-white">
              {getAppContentValue(content, 'error.cta', DEFAULT_CONTENT['error.cta'])}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <MessageCircle size={80} color="#CCCCCC" />
      <Text className="text-xl font-semibold text-brand-dark-alt mt-6 text-center">
        {getAppContentValue(content, 'empty.title', DEFAULT_CONTENT['empty.title'])}
      </Text>
      <Text className="text-base text-gray-600 mt-2 text-center">
        {getAppContentValue(content, 'empty.body', DEFAULT_CONTENT['empty.body'])}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 pt-4 pb-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-brand-dark-alt">
          {getAppContentValue(content, 'header.title', DEFAULT_CONTENT['header.title'])}
        </Text>
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
