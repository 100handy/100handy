import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MessageCircle } from 'lucide-react-native';

interface HandymanCardProps {
  name: string;
  hourlyRateCents: number;
  avatar?: string | null;
  onContactPress?: () => void;
}

export function HandymanCard({ name, hourlyRateCents, avatar, onContactPress }: HandymanCardProps) {
  const hourlyRate = (hourlyRateCents / 100).toFixed(2);
  const initials = name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View className="bg-white rounded-lg border border-gray-200 p-4">
      <Text className="text-xs font-worksans-medium text-gray-500 mb-3">HANDYMAN</Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4 flex-1">
          {/* Avatar */}
          <View
            className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center"
            style={{ backgroundColor: '#E5E7EB' }}
          >
            <Text className="text-lg font-worksans-medium" style={{ color: '#4B5563' }}>
              {initials}
            </Text>
          </View>

          {/* Info */}
          <View className="flex-1">
            <Text className="text-base font-worksans-semibold mb-1" style={{ color: '#30352D' }}>
              {name}
            </Text>
            <Text className="text-sm font-worksans" style={{ color: '#6B7280' }}>
              £{hourlyRate}/hr
            </Text>
          </View>
        </View>

        {/* Contact Button */}
        {onContactPress && (
          <Pressable
            onPress={onContactPress}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: '#C1856A' }}
          >
            <MessageCircle size={20} color="white" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
