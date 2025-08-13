import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Star } from 'lucide-react-native';

interface StarRatingProps {
  rating?: number;
}

export const StarRating = ({ rating = 0 }: StarRatingProps) => (
  <HStack>
    {[...Array(5)].map((_, i) => (
      <Icon
        key={i}
        as={Star}
        fill={i < rating ? '#FBBF24' : '#E5E7EB'}
        size="sm"
        color={i < rating ? '#FBBF24' : '#E5E7EB'}
        className="stroke-none"
      />
    ))}
  </HStack>
);