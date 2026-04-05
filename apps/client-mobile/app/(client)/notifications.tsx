import React, { useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import Header from '@/components/Header';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { useAuthStore, type NotificationItem as NotificationItemType } from '@shared/supabase';
import { useNotifications } from '@shared/query';

export default function ClientNotificationsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const {
    data: notifications,
    isLoading,
    refetch,
    isRefetching,
  } = useNotifications(user?.id || '', 'customer');

  const handlePress = useCallback((item: NotificationItemType) => {
    router.push(item.route as any);
  }, [router]);

  const renderItem = useCallback(({ item }: { item: NotificationItemType }) => (
    <NotificationItem item={item} onPress={handlePress} />
  ), [handlePress]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Notifications" onBackPress={() => router.back()} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
        </View>
      ) : !notifications || notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Bell size={48} color="#D1D5DB" strokeWidth={1.5} />
          <Text className="text-lg font-semibold text-[#333A31] mt-4 mb-2">
            No notifications yet
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            You&apos;ll see booking updates and messages here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
