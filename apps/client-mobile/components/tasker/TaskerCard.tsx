import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Star, Calendar } from 'lucide-react-native';

export interface TaskerData {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  taskCount: number;
  taskType: string;
  description: string;
  isSuperTasker?: boolean;
  /** Next availability info: 'today' | 'tomorrow' | 'Day, Mon DD' | null (no availability) */
  nextAvailability?: string | null;
}

interface TaskerCardProps {
  tasker: TaskerData;
  onPress?: () => void;
  onSeeProfile?: () => void;
}

export function TaskerCard({ tasker, onPress, onSeeProfile }: TaskerCardProps) {
  return (
    <Pressable onPress={onPress}>
      <View
        className="bg-white mb-3 rounded-2xl flex-col"
        style={{
          padding: 14,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        {/* Header: Avatar, Name, Price */}
        <View className="items-start mb-3 flex-row">
          {/* Avatar */}
          <Image
            source={{ uri: tasker.avatarUrl }}
            style={{
              width: 74,
              height: 74,
              borderRadius: 37,
              backgroundColor: '#F3F4F6',
            }}
          />

          {/* Name and Details */}
          <View className="flex-1 ml-3 mr-2 flex-col">
            <Text
              className="text-base mb-2"
              style={{ fontWeight: '600', color: '#1F2937' }}
            >
              {tasker.name}
            </Text>

            {/* Super Tasker Badge */}
            {tasker.isSuperTasker && (
              <View
                className="items-center px-2 py-0.5 rounded mb-2 flex-row"
                style={{ backgroundColor: '#7EC04B', alignSelf: 'flex-start' }}
              >
                <Text
                  className="text-xs"
                  style={{ color: '#FFFFFF', fontWeight: '600' }}
                >
                  ⚡ Super Pro
                </Text>
              </View>
            )}

            {/* Rating */}
            <View className="items-center mb-1 flex-row" style={{ gap: 4 }}>
              <Star size={11} color="#000000" fill="#000000" strokeWidth={0} />
              <Text
                className="text-xs"
                style={{ color: '#000000', fontWeight: '400' }}
              >
                {tasker.rating.toFixed(1)} ({tasker.reviewCount} reviews)
              </Text>
            </View>
            
            {/* Task Count */}
            <Text
              className="text-sm"
              style={{ color: '#000000', fontWeight: '600' }}
            >
              {tasker.taskCount} {tasker.taskType}
            </Text>

            {/* Availability Badge */}
            {tasker.nextAvailability && (
              <View
                className="items-center px-2 py-1 rounded mt-2 flex-row"
                style={{
                  backgroundColor:
                    tasker.nextAvailability === 'today'
                      ? '#DCFCE7' // green-100
                      : tasker.nextAvailability === 'tomorrow'
                        ? '#DBEAFE' // blue-100
                        : '#F3F4F6', // gray-100
                  alignSelf: 'flex-start',
                }}
              >
                <Calendar
                  size={12}
                  color={
                    tasker.nextAvailability === 'today'
                      ? '#16A34A' // green-600
                      : tasker.nextAvailability === 'tomorrow'
                        ? '#2563EB' // blue-600
                        : '#6B7280' // gray-500
                  }
                  strokeWidth={2}
                />
                <Text
                  className="text-xs ml-1"
                  style={{
                    color:
                      tasker.nextAvailability === 'today'
                        ? '#16A34A'
                        : tasker.nextAvailability === 'tomorrow'
                          ? '#2563EB'
                          : '#6B7280',
                    fontWeight: '500',
                  }}
                >
                  {tasker.nextAvailability === 'today'
                    ? 'Available today'
                    : tasker.nextAvailability === 'tomorrow'
                      ? 'Available tomorrow'
                      : `Next: ${tasker.nextAvailability}`}
                </Text>
              </View>
            )}
          </View>

          {/* Price */}
          <Text
            className="text-base"
            style={{ fontWeight: '600', color: '#000000' }}
          >
            £{tasker.pricePerHour.toFixed(2)} /hr
          </Text>
        </View>

        {/* Divider */}
        <View
          style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 }}
        />

        {/* Description */}
        <Text
          className="text-sm mb-3"
          style={{ color: '#6B7280', lineHeight: 18 }}
          numberOfLines={2}
        >
          {tasker.description}
        </Text>

        {/* See Profile Link */}
        <Pressable onPress={onSeeProfile}>
          <Text
            className="text-sm"
            style={{ color: '#C1856A', fontWeight: '500' }}
          >
            See profile
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

