import React, { useState } from 'react';
import { useCategoryById, useHandymanReviews, type HandymanReview } from '@shared/query';
import { ScrollView, Image, ActivityIndicator, View, Text, Pressable } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { ChevronLeft, Star, SlidersHorizontal } from 'lucide-react-native'; import { useRouter, useLocalSearchParams } from 'expo-router'; import {   RatingFilter, RatingFilterSheet, ScheduleSelectionSheet, } from '@/components/tasker'; import { useHandymanProfile } from '@shared/query';
import { goBackOrReplace } from '@/lib/navigation';

export default function TaskerProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskerId = params.taskerId as string;

  const categoryId = params.categoryId as string;
  const categoryName = params.categoryName as string;
  const { data: selectedCategory, isLoading: categoryLoading } = useCategoryById(categoryId);
  const formResponses = params.formResponses as string | undefined;
  const taskSize = params.taskSize as string | undefined;
  const vehicleRequirement = params.vehicleRequirement as string | undefined;

  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showScheduleSheet, setShowScheduleSheet] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<RatingFilter>('All mounting');

  // Fetch tasker profile and reviews
  // Pass categoryId to get skill-specific pricing
  const { data: profile, isLoading: profileLoading, isError: profileError } = useHandymanProfile(taskerId, selectedCategory?.id);
  const { data: apiReviews, isLoading: reviewsLoading } = useHandymanReviews(taskerId, 10);

  // Use API reviews only - no mock data fallback
  const reviews = apiReviews || [];

  const isLoading = profileLoading || reviewsLoading;
  const showSelectActions = !!categoryId;

  const handleSelect = () => {
    setShowScheduleSheet(true);
  };

  const handleScheduleSelect = (date: string, time: string) => {
    router.push({
      pathname: '/(client)/task-details',
      params: {
        taskerId,
        categoryId: selectedCategory?.id || categoryId,
        categoryName: selectedCategory?.name || categoryName,
        selectedDate: date,
        selectedTime: time,
        ...(formResponses ? { formResponses } : {}),
        ...(taskSize ? { taskSize } : {}),
        ...(vehicleRequirement ? { vehicleRequirement } : {}),
      },
    });
  };

  const handleFilterSelect = (filter: RatingFilter) => {
    setSelectedFilter(filter);
    setShowFilterSheet(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-col px-5 pt-4 pb-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center">
            <Pressable onPress={() => goBackOrReplace(router, '/(client)/(tabs)/home')} className="mr-4">
              <ChevronLeft size={24} color="#000000" strokeWidth={2} />
            </Pressable>
            <Text className="flex-1 text-center text-lg font-semibold text-black mr-10">
              Pro Profile
            </Text>
          </View>
        </View>
        <View className="flex-col flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000000" />
          <Text className="text-sm text-gray-600 mt-3">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (profileError || !profile) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-col px-5 pt-4 pb-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center">
            <Pressable onPress={() => goBackOrReplace(router, '/(client)/(tabs)/home')} className="mr-4">
              <ChevronLeft size={24} color="#000000" strokeWidth={2} />
            </Pressable>
            <Text className="flex-1 text-center text-lg font-semibold text-black mr-10">
              Pro Profile
            </Text>
          </View>
        </View>
        <View className="flex-col flex-1 items-center justify-center px-6">
          <Text className="text-base font-semibold text-gray-900 mb-2 text-center">
            Profile not found
          </Text>
          <Text className="text-sm text-gray-600 text-center">
            This pro&apos;s profile could not be loaded
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (categoryId && !categoryLoading && !selectedCategory) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-col px-5 pt-4 pb-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center">
            <Pressable onPress={() => goBackOrReplace(router, '/(client)/(tabs)/home')} className="mr-4">
              <ChevronLeft size={24} color="#000000" strokeWidth={2} />
            </Pressable>
            <Text className="flex-1 text-center text-lg font-semibold text-black mr-10">
              Pro Profile
            </Text>
          </View>
        </View>
        <View className="flex-col flex-1 items-center justify-center px-6">
          <Text className="text-base font-semibold text-gray-900 mb-2 text-center">
            Service unavailable
          </Text>
          <Text className="text-sm text-gray-600 text-center">
            This service category is currently turned off. Please choose another service.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-col px-5 pt-4 pb-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center">
          <Pressable onPress={() => goBackOrReplace(router, '/(client)/(tabs)/home')} className="mr-4">
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </Pressable>

          <Text className="flex-1 text-center text-lg font-semibold text-black mr-10">
            Pro Profile
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View className="flex-col px-5 pt-5 pb-4">
          <View className="flex-row items-start mb-3">
            {/* Avatar */}
            <Image
              source={profile.avatar_url ? { uri: profile.avatar_url } : require('@/assets/images/icon.png')}
              className="w-[72px] h-[72px] rounded-full bg-gray-100 mr-3"
            />

            {/* Name and Badge */}
            <View className="flex-col">
              <Text className="text-xl font-semibold text-black mb-2">
                {profile.display_name}
              </Text>

              {profile.verified && (
                <View className="flex-row items-center px-2 py-1 rounded self-start"
                  style={{ backgroundColor: '#7EC04B' }}
                >
                  <Text className="text-xs font-semibold text-white">
                    ⚡ Top Provider
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Rating */}
          <View className="flex-row items-center gap-1 mb-1">
            <Star size={14} color="#000000" fill="#000000" strokeWidth={0} />
            <Text className="text-sm font-bold text-black">
              {profile.rating.toFixed(1)} ({profile.review_count} reviews)
            </Text>
          </View>

          {/* Task Count */}
          <Text className="text-xs font-bold text-black">
            {profile.jobs_completed} tasks completed
          </Text>
        </View>

        {/* Divider */}
        <View className="flex-col" style={{ height: 8, backgroundColor: '#F9FAFB' }} />

        {/* Skill & Experience Section */}
        <View className="flex-col px-5 pt-5 pb-4">
          <Text className="text-base font-semibold text-black mb-2">
            Skill & experience
          </Text>

          {profile.bio ? (
            <Text
              className="text-xs font-light mb-1"
              style={{ color: '#333A31', lineHeight: 16 }}
              numberOfLines={2}
            >
              {profile.bio}
            </Text>
          ) : (
            <Text
              className="text-xs font-light mb-1"
              style={{ color: '#6B6B6B', lineHeight: 16 }}
            >
              {profile.experience_years} years of experience as a professional 100Handy Pro.
            </Text>
          )}

          <Pressable className="mb-3">
            <Text className="text-xs font-bold" style={{ color: '#C1856A' }}>
              See full profile
            </Text>
          </Pressable>

          {/* Portfolio Images - would need separate endpoint */}
          {/* For now, showing placeholder */}
        </View>

        {/* Divider */}
        <View className="flex-col" style={{ height: 8, backgroundColor: '#F9FAFB' }} />

        {/* Rating & Reviews Section */}
        <View className="flex-col px-5 pt-5 pb-4">
          <Text className="text-base font-semibold text-black mb-3">
            Rating & reviews
          </Text>

          {/* Overall Rating with Filter */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-1">
              <Star size={14} color="#000000" fill="#000000" strokeWidth={0} />
              <Text className="text-sm font-bold text-black">
                {profile.rating.toFixed(1)} ({reviews?.length || 0} reviews)
              </Text>
            </View>

            <Pressable
              className="px-2 py-1 bg-white border border-gray-300"
              style={{ borderRadius: 4 }}
              onPress={() => setShowFilterSheet(true)}
            >
              <View className="flex-row items-center gap-[3px]">
                <SlidersHorizontal
                  size={9}
                  color="#333A31"
                  strokeWidth={2}
                  style={{ transform: [{ rotate: '90deg' }] }}
                />
                <Text className="text-xs font-medium" style={{ color: '#333A31' }}>
                  {selectedFilter}
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Rating Breakdown */}
          <View className="flex-col mb-5 gap-1.5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const totalReviews = reviews.length;
              const starCount = totalReviews > 0
                ? reviews.filter((r: HandymanReview) => Math.round(r.rating) === stars).length
                : 0;
              const percentage = totalReviews > 0 ? Math.round((starCount / totalReviews) * 100) : 0;
              return (
                <View key={stars} className="flex-row items-center gap-2">
                  <Text
                    className="text-xs font-bold w-10"
                    style={{ color: '#C1856A' }}
                  >
                    {stars} star
                  </Text>

                  <View className="flex-col flex-1 bg-gray-200 overflow-hidden"
                    style={{ height: 5, borderRadius: 2.5 }}
                  >
                    <View className="flex-col h-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: '#FF6B35',
                      }}
                    />
                  </View>

                  <Text
                    className="text-xs text-right w-8"
                    style={{ color: '#333A31' }}
                  >
                    {percentage}%
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Reviews List */}
          <View className="flex-col">
            {reviews && reviews.length > 0 ? (
              reviews.map((review: HandymanReview, index: number) => {
                const reviewerName = review.profiles
                  ? `${review.profiles.first_name} ${review.profiles.last_name?.charAt(0) || ''}.`
                  : 'Customer';
                const reviewDate = review.created_at
                  ? new Date(review.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : '';

                return (
                  <View key={review.id}>
                    <View className="flex-col py-4">
                      <View className="flex-row items-start justify-between mb-2">
                        <View className="flex-row flex-1 items-start gap-2.5">
                          {/* Reviewer Avatar */}
                          <Image
                            source={require('@/assets/images/icon.png')}
                            className="w-12 h-12 rounded-full bg-gray-100"
                          />

                          {/* Reviewer Info */}
                          <View className="flex-col flex-1">
                            <Text
                              className="text-base font-bold mb-2"
                              style={{ color: '#333A31' }}
                            >
                              {reviewerName}
                            </Text>

                            {/* Task Type Badge and Date */}
                            <View className="flex-row items-center gap-2 mb-1">
                              {/* Green Task Type Badge */}
                              <View
                                className="px-2 py-0.5 rounded"
                                style={{ backgroundColor: '#7EC04B' }}
                              >
                                <Text className="text-[9px] font-medium text-white">
                                  {categoryName || 'TV mounting'}
                                </Text>
                              </View>

                              {/* Date */}
                              <Text
                                className="text-xs font-light"
                                style={{ color: '#333A31' }}
                              >
                                {reviewDate}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Review Rating */}
                        <View className="flex-row items-center gap-0.5">
                          <Star size={12} color="#000000" fill="#000000" strokeWidth={0} />
                          <Text className="text-xs font-medium text-black">
                            {review.rating.toFixed(1)}
                          </Text>
                        </View>
                      </View>

                      {/* Review Comment */}
                      {review.comment && (
                        <Text
                          className="text-xs font-light pl-[62px]"
                          style={{ color: '#333A31', lineHeight: 16 }}
                        >
                          {review.comment}
                        </Text>
                      )}
                    </View>

                    {/* Divider Line (except for last item) */}
                    {index < reviews.length - 1 && (
                      <View
                        className="w-full"
                        style={{ height: 1, backgroundColor: '#E5E7EB' }}
                      />
                    )}
                  </View>
                );
              })
            ) : (
              <Text className="text-sm text-gray-600 text-center py-4">
                No reviews yet
              </Text>
            )}
          </View>
        </View>

        {showSelectActions ? (
          <View className="flex-col" style={{ height: 100 }} />
        ) : null}
      </ScrollView>

      {showSelectActions ? (
        <View className="flex-col px-5 py-4 bg-white border-t border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-base font-bold"
              style={{ color: '#333A31' }}
            >
              £{(profile.hourly_rate_cents / 100).toFixed(2)} /hr
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
          </View>
        </View>
      ) : null}

      {showSelectActions ? (
        <ScheduleSelectionSheet
          isOpen={showScheduleSheet}
          onClose={() => setShowScheduleSheet(false)}
          onSelectSchedule={handleScheduleSelect}
          taskerName={profile?.display_name || '100Handy Pro'}
          taskerId={taskerId}
        />
      ) : null}

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
