import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CalendarIcon, MapPinIcon, StarIcon, UserIcon } from 'lucide-react-native';

interface TaskCardProps {
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  iconTone?: 'sage' | 'orange' | 'taupe';
  title: string;
  dateTime: string;
  taskerName: string;
  taskerRating: number;
  taskerReviews: number;
  location: string;
  statusLabel: string;
  price: string;
  bookingId?: number;
  onPress?: () => void;
}

export function TaskCard({
  title,
  dateTime,
  taskerName,
  taskerRating,
  taskerReviews,
  location,
  statusLabel,
  price,
  onPress,
}: TaskCardProps) {

  return (
    <Pressable
      onPress={onPress}
      className="bg-white border border-gray-200 rounded-xl mx-4 my-2 p-4"
    >
      <View className="gap-2.5 flex-col">
        {/* Title */}
        <Text className="text-lg font-work-sans font-normal text-[#D9896C]">
          {title}
        </Text>

        {/* Date & Time */}
        <View className="items-center gap-2 flex-row">
          <CalendarIcon size={16} color="#333A31" />
          <Text className="text-sm font-work-sans text-text-primary">
            {dateTime}
          </Text>
        </View>

        {/* Tasker Info with inline rating */}
        <View className="items-center gap-1.5 flex-row">
          <UserIcon size={16} color="#333A31" />
          <Text className="text-sm font-work-sans text-text-primary">
            {taskerName}
          </Text>
          <StarIcon size={12} color="#333A31" fill="#333A31" />
          <Text className="text-sm font-work-sans text-text-primary">
            {taskerRating.toFixed(1)} ({taskerReviews} reviews)
          </Text>
        </View>

        {/* Location */}
        <View className="items-center gap-2 flex-row">
          <MapPinIcon size={16} color="#333A31" />
          <Text className="text-sm font-work-sans font-semibold text-text-primary">
            {location}
          </Text>
        </View>

        {/* Price */}
        <Text className="text-lg font-work-sans font-bold text-text-primary mt-1">
          {price}
        </Text>

        {/* Status */}
        <Text className="text-sm font-work-sans text-[#D9896C]">
          {statusLabel}
        </Text>
      </View>
    </Pressable>
  );
}

export default TaskCard;