import React from 'react';
import { View } from 'react-native';
import { Star } from 'lucide-react-native';

interface StarRatingProps {
  rating?: number;
}

export const StarRating = ({ rating = 0 }: StarRatingProps) => (
  <View className="flex-row">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        fill={i < rating ? '#FBBF24' : '#E5E7EB'}
        size={16}
        color={i < rating ? '#FBBF24' : '#E5E7EB'}
        strokeWidth={0}
      />
    ))}
  </View>
);