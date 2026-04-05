import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Calendar, MessageCircle, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react-native';
import type { NotificationItem as NotificationItemType } from '@shared/supabase';

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function BookingIcon({ status }: { status?: string }) {
  switch (status) {
    case 'accepted':
      return <CheckCircle2 size={20} color="#059669" />;
    case 'in_progress':
      return <Clock size={20} color="#2563EB" />;
    case 'completed':
      return <CheckCircle2 size={20} color="#059669" />;
    case 'cancelled':
      return <XCircle size={20} color="#DC2626" />;
    case 'pending':
      return <AlertCircle size={20} color="#D97706" />;
    default:
      return <Calendar size={20} color="#6B7280" />;
  }
}

interface Props {
  item: NotificationItemType;
  onPress: (item: NotificationItemType) => void;
}

export function NotificationItem({ item, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      className="flex-row items-start px-5 py-4 border-b border-gray-100"
      style={!item.read ? { backgroundColor: '#FFF8F5' } : undefined}
    >
      {/* Left icon / avatar */}
      <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{
        backgroundColor: item.type === 'new_message' ? '#FFF0E8' : '#F0F9FF',
      }}>
        {item.type === 'new_message' ? (
          item.senderAvatar ? (
            <Image
              source={{ uri: item.senderAvatar }}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <MessageCircle size={20} color="#C1856A" />
          )
        ) : (
          <BookingIcon status={item.bookingStatus} />
        )}
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="text-sm font-semibold text-[#333A31]" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="text-sm text-gray-600 mt-0.5" numberOfLines={2}>
          {item.body}
        </Text>
        <Text className="text-xs text-gray-400 mt-1">
          {getRelativeTime(item.createdAt)}
        </Text>
      </View>

      {/* Unread dot */}
      {!item.read && (
        <View className="w-2.5 h-2.5 rounded-full mt-1.5" style={{ backgroundColor: '#C1856A' }} />
      )}
    </Pressable>
  );
}
