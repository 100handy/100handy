import React from 'react';
import { Image } from 'react-native';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { Pressable } from '../ui/pressable';
import { Star } from 'lucide-react-native';

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
}

interface TaskerCardProps {
  tasker: TaskerData;
  onPress?: () => void;
  onSeeProfile?: () => void;
}

export function TaskerCard({ tasker, onPress, onSeeProfile }: TaskerCardProps) {
  return (
    <Pressable onPress={onPress}>
      <VStack 
        className="bg-white mb-3 rounded-2xl"
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
        <HStack className="items-start mb-3">
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
          <VStack className="flex-1 ml-3 mr-2">
            <Text
              className="text-base mb-2"
              style={{ fontWeight: '600', color: '#1F2937' }}
            >
              {tasker.name}
            </Text>
            
            {/* Super Tasker Badge */}
            {tasker.isSuperTasker && (
              <HStack
                className="items-center px-2 py-0.5 rounded mb-2"
                style={{ backgroundColor: '#7EC04B', alignSelf: 'flex-start' }}
              >
                <Text
                  className="text-xs"
                  style={{ color: '#FFFFFF', fontWeight: '600' }}
                >
                  ⚡ Super Tasker
                </Text>
              </HStack>
            )}
            
            {/* Rating */}
            <HStack className="items-center mb-1" style={{ gap: 4 }}>
              <Star size={11} color="#000000" fill="#000000" strokeWidth={0} />
              <Text
                className="text-xs"
                style={{ color: '#000000', fontWeight: '400' }}
              >
                {tasker.rating.toFixed(1)} ({tasker.reviewCount} reviews)
              </Text>
            </HStack>
            
            {/* Task Count */}
            <Text
              className="text-sm"
              style={{ color: '#000000', fontWeight: '600' }}
            >
              {tasker.taskCount} {tasker.taskType}
            </Text>
          </VStack>
          
          {/* Price */}
          <Text
            className="text-base"
            style={{ fontWeight: '600', color: '#000000' }}
          >
            £{tasker.pricePerHour.toFixed(2)} /hr
          </Text>
        </HStack>
        
        {/* Divider */}
        <VStack
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
      </VStack>
    </Pressable>
  );
}

