import React, { useState } from 'react';
import { ScrollView, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { ChevronLeft, Star, SlidersHorizontal, Check, ChevronUp, X } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  RatingFilter,
  RatingFilterSheet,
} from '@/components/tasker';
import LocationSelectionSheet from '@/components/tasker/LocationSelectionSheet';

// Mock data - in production would come from API
const taskerProfile = {
  id: '1',
  name: 'Mike W.',
  avatarUrl: 'https://i.pravatar.cc/150?u=mike',
  rating: 5.0,
  reviewCount: 124,
  pricePerHour: 70.27,
  taskCount: 124,
  taskType: 'tv mounting tasks',
  isSuperTasker: true,
  skillDescription: 'I have 8 years of experience. I come with all the right rawlplugs, fixings and tools and not forgetting my trust…',
  portfolioImages: [
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400',
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
    'https://images.unsplash.com/photo-1586210579191-33b45e38fa8c?w=400',
    'https://images.unsplash.com/photo-1593359863503-7cb5e9d2c9e0?w=400',
    'https://images.unsplash.com/photo-1571690965027-ed0e83c3e444?w=400',
  ],
  ratingBreakdown: {
    5: 99,
    4: 0,
    3: 1,
    2: 0,
    1: 0,
  },
  reviews: [
    {
      id: '1',
      reviewerName: 'Adam A.',
      reviewerAvatar: 'https://i.pravatar.cc/150?u=adam',
      rating: 5.0,
      date: 'Mon 17 Sep',
      taskType: 'TV mounting',
      comment: 'Excellent work and super nice and friendly tasker! We would never have managed without him and his detail!',
    },
    {
      id: '2',
      reviewerName: 'Jake W.',
      reviewerAvatar: 'https://i.pravatar.cc/150?u=jake',
      rating: 5.0,
      date: 'Mon 17 Sep',
      taskType: 'TV mounting',
      comment: 'Amazing job! Friendly, efficient, and really skilled. Made the whole process stress-free for us.',
    },
    {
      id: '3',
      reviewerName: 'Lia M.',
      reviewerAvatar: 'https://i.pravatar.cc/150?u=lia',
      rating: 5.0,
      date: 'Mon 17 Sep',
      taskType: 'TV mounting',
      comment: 'Super reliable and polite tasker. Went above and beyond to make sure the job was perfect.',
    },
    {
      id: '4',
      reviewerName: 'Tom Q.',
      reviewerAvatar: 'https://i.pravatar.cc/150?u=tom',
      rating: 5.0,
      date: 'Mon 17 Sep',
      taskType: 'TV mounting',
      comment: 'Fast, friendly, and high-quality work. Couldn\'t have asked for a better experience.',
    },
  ],
};

export default function TaskerProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<RatingFilter>('All mounting');

  const handleSelect = () => {
    setShowLocationSheet(true);
  };

  const handleFilterSelect = (filter: RatingFilter) => {
    setSelectedFilter(filter);
    setShowFilterSheet(false);
  };

  const renderProgressDots = () => {
    const totalDots = 6;
    const currentStep = 1;
    
    return (
      <HStack className="items-center justify-center gap-2 mb-6">
        {Array.from({ length: totalDots }).map((_, index) => (
          <View
            key={index}
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: index === 0 ? '#C1856A' : '#E5E7EB',
            }}
          />
        ))}
      </HStack>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <VStack className="px-5 pt-4 pb-4 bg-white border-b border-gray-200">
        <HStack className="items-center">
          <Pressable onPress={() => router.back()} className="mr-4">
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </Pressable>
          
          <Text className="flex-1 text-center text-lg font-semibold text-black mr-10">
            Tasker Profile
          </Text>
        </HStack>
      </VStack>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <VStack className="px-5 pt-5 pb-4">
          <HStack className="items-start mb-3">
            {/* Avatar */}
            <Image
              source={{ uri: taskerProfile.avatarUrl }}
              className="w-[72px] h-[72px] rounded-full bg-gray-100 mr-3"
            />
            
            {/* Name and Badge */}
            <VStack>
              <Text className="text-xl font-semibold text-black mb-2">
                {taskerProfile.name}
              </Text>
              
              {taskerProfile.isSuperTasker && (
                <HStack
                  className="items-center px-2 py-1 rounded self-start"
                  style={{ backgroundColor: '#7EC04B' }}
                >
                  <Text className="text-xs font-semibold text-white">
                    ⚡ Super Tasker
                  </Text>
                </HStack>
              )}
            </VStack>
          </HStack>

          {/* Rating */}
          <HStack className="items-center gap-1 mb-1">
            <Star size={14} color="#000000" fill="#000000" strokeWidth={0} />
            <Text className="text-sm font-bold text-black">
              {taskerProfile.rating.toFixed(1)} ({taskerProfile.reviewCount} reviews)
            </Text>
          </HStack>

          {/* Task Count */}
          <Text className="text-xs font-bold text-black">
            {taskerProfile.taskCount} {taskerProfile.taskType}
          </Text>
        </VStack>

        {/* Divider */}
        <VStack style={{ height: 8, backgroundColor: '#F9FAFB' }} />

        {/* Skill & Experience Section */}
        <VStack className="px-5 pt-5 pb-4">
          <Text className="text-base font-semibold text-black mb-2">
            Skill & experience
          </Text>
          
          <Text
            className="text-xs font-light mb-1"
            style={{ color: '#333A31', lineHeight: 16 }}
            numberOfLines={2}
          >
            {taskerProfile.skillDescription}
          </Text>
          
          <Pressable className="mb-3">
            <Text className="text-xs font-bold" style={{ color: '#C1856A' }}>
              See profile
            </Text>
          </Pressable>

          {/* Portfolio Images */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}
          >
            {taskerProfile.portfolioImages.map((imageUrl, index) => (
              <Image
                key={index}
                source={{ uri: imageUrl }}
                className="w-[78px] h-[78px] rounded-md bg-gray-100"
              />
            ))}
          </ScrollView>
        </VStack>

        {/* Divider */}
        <VStack style={{ height: 8, backgroundColor: '#F9FAFB' }} />

        {/* Rating & Reviews Section */}
        <VStack className="px-5 pt-5 pb-4">
          <Text className="text-base font-semibold text-black mb-3">
            Rating & reviews
          </Text>

          {/* Overall Rating with Filter */}
          <HStack className="items-center justify-between mb-3">
            <HStack className="items-center gap-1">
              <Star size={14} color="#000000" fill="#000000" strokeWidth={0} />
              <Text className="text-sm font-bold text-black">
                {taskerProfile.rating.toFixed(1)} ({taskerProfile.reviewCount} reviews)
              </Text>
            </HStack>
            
            <Pressable
              className="px-2 py-1 bg-white border border-gray-300"
              style={{ borderRadius: 4 }}
              onPress={() => setShowFilterSheet(true)}
            >
              <HStack className="items-center gap-[3px]">
                <SlidersHorizontal 
                  size={9} 
                  color="#333A31" 
                  strokeWidth={2}
                  style={{ transform: [{ rotate: '90deg' }] }}
                />
                <Text className="text-xs font-medium" style={{ color: '#333A31' }}>
                  {selectedFilter}
                </Text>
              </HStack>
            </Pressable>
          </HStack>

          {/* Rating Breakdown */}
          <VStack className="mb-5 gap-1.5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const percentage = taskerProfile.ratingBreakdown[stars as keyof typeof taskerProfile.ratingBreakdown];
              return (
                <HStack key={stars} className="items-center gap-2">
                  <Text
                    className="text-xs font-bold w-10"
                    style={{ color: '#C1856A' }}
                  >
                    {stars} star
                  </Text>
                  
                  <VStack
                    className="flex-1 bg-gray-200 overflow-hidden"
                    style={{ height: 5, borderRadius: 2.5 }}
                  >
                    <VStack
                      className="h-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: '#FF6B35',
                      }}
                    />
                  </VStack>
                  
                  <Text
                    className="text-xs text-right w-8"
                    style={{ color: '#333A31' }}
                  >
                    {percentage}%
                  </Text>
                </HStack>
              );
            })}
          </VStack>

          {/* Reviews List */}
          <VStack className="gap-5">
            {taskerProfile.reviews.map((review) => (
              <VStack key={review.id}>
                <HStack className="items-start justify-between mb-2">
                  <HStack className="flex-1 items-start gap-2.5">
                    {/* Reviewer Avatar */}
                    <Image
                      source={{ uri: review.reviewerAvatar }}
                      className="w-10 h-10 rounded-full bg-gray-100"
                    />
                    
                    {/* Reviewer Info */}
                    <VStack className="flex-1">
                      <Text
                        className="text-base font-bold mb-1"
                        style={{ color: '#333A31' }}
                      >
                        {review.reviewerName}
                      </Text>
                      
                      <HStack className="items-center gap-1.5 mb-1">
                        <HStack
                          className="px-2 py-0.5 rounded"
                          style={{ backgroundColor: '#7EC04B' }}
                        >
                          <Text className="text-xs font-medium text-white">
                            {review.taskType}
                          </Text>
                        </HStack>
                        
                        <Text
                          className="text-xs font-light"
                          style={{ color: '#333A31' }}
                        >
                          {review.date}
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                  
                  {/* Review Rating */}
                  <HStack className="items-center gap-0.5">
                    <Star size={12} color="#000000" fill="#000000" strokeWidth={0} />
                    <Text className="text-xs font-medium text-black">
                      {review.rating.toFixed(1)}
                    </Text>
                  </HStack>
                </HStack>
                
                {/* Review Comment */}
                <Text
                  className="text-xs font-light"
                  style={{ color: '#333A31', lineHeight: 16 }}
                >
                  {review.comment}
                </Text>
              </VStack>
            ))}
          </VStack>
        </VStack>

        {/* Bottom spacing for fixed button */}
        <VStack style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Fixed Bar */}
      <VStack className="px-5 py-4 bg-white border-t border-gray-200">
        <HStack className="items-center justify-between">
          <Text
            className="text-base font-bold"
            style={{ color: '#333A31' }}
          >
            £{taskerProfile.pricePerHour.toFixed(2)} /hr
          </Text>
          
          <Pressable
            onPress={handleSelect}
            className="px-20 py-3 rounded-xl"
            style={{ backgroundColor: '#C1856A' }}
          >
            <Text className="text-lg font-bold text-white">
              Select
            </Text>
          </Pressable>
        </HStack>
      </VStack>

      {/* Location Selection Action Sheet */}
      <LocationSelectionSheet 
        isOpen={showLocationSheet} 
        onClose={() => setShowLocationSheet(false)} 
      />

      {/* Rating Filter Action Sheet */}
      <RatingFilterSheet
        isOpen={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        selectedValue={selectedFilter}
        onSelectFilter={handleFilterSelect}
      />
    </SafeAreaView>
  );
}
