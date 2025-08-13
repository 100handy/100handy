import React from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
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
    <Box className="bg-white rounded-lg border border-gray-custom-200 shadow-sm p-4 mb-4">
      <HStack>
        <Image source={{ uri: professional.avatarUrl }} alt={professional.name} className="w-16 h-16 rounded-full object-cover" />
        <VStack className="flex-1 ml-4">
          <Heading className="font-cardo font-semibold text-base text-gray-custom-900">{professional.name}</Heading>
          <HStack className="items-center mt-1">
            <StarRating rating={professional.rating} />
            <Text className="font-work-sans text-xs text-gray-custom-600 ml-2">{`${professional.rating.toFixed(1)} (${professional.reviews} reviews)`}</Text>
          </HStack>
        </VStack>
        <Heading className="font-cardo font-semibold text-base text-sage">{`$${professional.price}/hr`}</Heading>
      </HStack>
      <Text className="my-3 font-work-sans text-sm text-gray-custom-600 leading-relaxed">{professional.description}</Text>
      <HStack className="flex-wrap">
        {professional.tags.map(tag => {
          const colors = tagColors[professional.category] || tagColors.handyman;
          return (
            <Box key={tag} style={{backgroundColor: colors.bg}} className="rounded-full py-1 px-3 mr-2 mb-2">
              <Text style={{color: colors.text}} className="font-work-sans font-medium text-xs">{tag}</Text>
            </Box>
          )
        })}
      </HStack>
    </Box>
  );
};