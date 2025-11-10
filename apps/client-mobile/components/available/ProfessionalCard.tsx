import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { StarRating } from './StarRating';

interface Professional {
  name: string;
  avatarUrl: string;
  rating: number;
  reviews: number;
  price: number;
  description: string;
  tags: string[];
  category: string;
}

interface ProfessionalCardProps {
  professional: Professional;
}

const tagColors: { [key: string]: { bg: string; text: string } } = {
  plumbing: { bg: 'rgba(163, 184, 153, 0.1)', text: '#A3B899' },
  cleaning: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
  electrical: { bg: 'rgba(163, 184, 153, 0.1)', text: '#A3B899' },
  handyman: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
};

export const ProfessionalCard = ({ professional }: ProfessionalCardProps) => {
  return (
    <View className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
      <View className="flex-row">
        <Image source={{ uri: professional.avatarUrl }} alt={professional.name} className="w-16 h-16 rounded-full" contentFit="cover" />
        <View className="flex-1 ml-4 flex-col">
          <Text className="font-cardo font-semibold text-base text-gray-900">{professional.name}</Text>
          <View className="items-center mt-1 flex-row">
            <StarRating rating={professional.rating} />
            <Text className="font-work-sans text-xs text-gray-600 ml-2">{`${professional.rating.toFixed(1)} (${professional.reviews} reviews)`}</Text>
          </View>
        </View>
        <Text className="font-cardo font-semibold text-base text-sage">{`$${professional.price}/hr`}</Text>
      </View>
      <Text className="my-3 font-work-sans text-sm text-gray-600 leading-relaxed">{professional.description}</Text>
      <View className="flex-wrap flex-row">
        {professional.tags.map(tag => {
          const colors = tagColors[professional.category] || tagColors.handyman;
          return (
            <View key={tag} style={{backgroundColor: colors.bg}} className="rounded-full py-1 px-3 mr-2 mb-2">
              <Text style={{color: colors.text}} className="font-work-sans font-medium text-xs">{tag}</Text>
            </View>
          )
        })}
      </View>
    </View>
  );
};