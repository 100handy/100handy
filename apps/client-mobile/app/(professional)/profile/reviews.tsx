import React, { useMemo } from 'react';
import { useProfessionalRating, useHandymanReviews } from '@shared/query';
import { ScrollView, View, Text, Pressable, ActivityIndicator, RefreshControl } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { useRouter } from 'expo-router'; import { ArrowLeft, Star } from 'lucide-react-native'; import { useAuthStore } from '@shared/store';

function formatReviewDate(value?: string) {
  if (!value) return '';

  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getReviewerName(firstName?: string | null, lastName?: string | null) {
  if (!firstName) {
    return 'Customer';
  }

  return `${firstName} ${lastName?.charAt(0) || ''}.`.trim();
}

export default function ProfessionalReviewsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const handyId = user?.id ?? '';

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(professional)/(tabs)/performance');
  };

  const {
    data: ratingSummary,
    isLoading: isLoadingSummary,
    refetch: refetchSummary,
    isRefetching: isRefetchingSummary,
  } = useProfessionalRating(handyId);
  const {
    data: reviews = [],
    isLoading: isLoadingReviews,
    refetch: refetchReviews,
    isRefetching: isRefetchingReviews,
  } = useHandymanReviews(handyId, 100);

  const isLoading = isLoadingSummary || isLoadingReviews;
  const isRefreshing = isRefetchingSummary || isRefetchingReviews;

  const ratingBreakdown = useMemo(() => {
    const totalReviews = reviews.length;

    return [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((review) => Math.round(review.rating) === stars).length;
      const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

      return {
        stars,
        count,
        percentage,
      };
    });
  }, [reviews]);

  const refresh = async () => {
    await Promise.all([refetchSummary(), refetchReviews()]);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
        </View>
      </SafeAreaView>
    );
  }

  const averageRating = ratingSummary?.averageRating ?? 0;
  const totalReviews = ratingSummary?.totalReviews ?? reviews.length;

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
      <View className="bg-white px-5 py-4 border-b border-[#F0F0F0]">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={handleBack} className="w-8">
            <ArrowLeft size={24} color="#30352D" />
          </Pressable>
          <Text className="font-worksans-bold text-[20px] text-brand-dark-alt">
            Reviews
          </Text>
          <View className="w-8" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor="#C1856A" />
        }
      >
        <View className="px-4 py-4 gap-4">
          <View className="bg-white rounded-2xl p-5">
            <Text className="font-worksans-bold text-[18px] text-brand-dark-alt mb-4">
              Overall rating
            </Text>

            <View className="flex-row items-end gap-3 mb-3">
              <Text className="font-worksans-bold text-[40px] text-brand-dark-alt">
                {totalReviews > 0 ? averageRating.toFixed(1) : '--'}
              </Text>
              <Text className="font-worksans text-[18px] text-[#6B6B6B] mb-1">
                / 5
              </Text>
            </View>

            <View className="flex-row gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= Math.round(averageRating);

                return (
                  <Star
                    key={star}
                    size={18}
                    color={filled ? '#C1856A' : '#E5E7EB'}
                    fill={filled ? '#C1856A' : '#E5E7EB'}
                    strokeWidth={1.5}
                  />
                );
              })}
            </View>

            <Text className="font-worksans text-[14px] text-[#6B6B6B] mb-5">
              {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </Text>

            <View className="gap-2">
              {ratingBreakdown.map(({ stars, count, percentage }) => (
                <View key={stars} className="flex-row items-center gap-3">
                  <Text className="font-worksans-medium text-[13px] text-brand-dark-alt w-10">
                    {stars} star
                  </Text>
                  <View className="flex-1 h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                    <View
                      className="h-full rounded-full bg-[#C1856A]"
                      style={{ width: `${percentage}%` }}
                    />
                  </View>
                  <Text className="font-worksans text-[13px] text-[#6B6B6B] w-12 text-right">
                    {count}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="bg-white rounded-2xl p-5">
            <Text className="font-worksans-bold text-[18px] text-brand-dark-alt mb-4">
              All reviews
            </Text>

            {reviews.length === 0 ? (
              <View className="py-10 items-center">
                <Text className="font-worksans-medium text-[16px] text-brand-dark-alt mb-2">
                  No reviews yet
                </Text>
                <Text className="font-worksans text-[14px] text-[#6B6B6B] text-center">
                  Reviews from customers will appear here after completed jobs.
                </Text>
              </View>
            ) : (
              <View>
                {reviews.map((review, index) => {
                  const reviewerName = getReviewerName(
                    review.profiles?.first_name,
                    review.profiles?.last_name,
                  );
                  const initials = reviewerName.charAt(0).toUpperCase();

                  return (
                    <View key={review.id}>
                      <View className="flex-row gap-3 py-4">
                        <View className="w-12 h-12 rounded-full bg-[#F3F4F6] items-center justify-center">
                          <Text className="font-worksans-bold text-[16px] text-brand-dark-alt">
                            {initials}
                          </Text>
                        </View>

                        <View className="flex-1">
                          <View className="flex-row items-start justify-between gap-3 mb-2">
                            <View className="flex-1">
                              <Text className="font-worksans-bold text-[15px] text-brand-dark-alt">
                                {reviewerName}
                              </Text>
                              <Text className="font-worksans text-[12px] text-[#6B6B6B] mt-1">
                                {formatReviewDate(review.created_at)}
                              </Text>
                            </View>

                            <View className="flex-row items-center gap-1">
                              <Star size={14} color="#C1856A" fill="#C1856A" strokeWidth={1.5} />
                              <Text className="font-worksans-semibold text-[13px] text-brand-dark-alt">
                                {review.rating.toFixed(1)}
                              </Text>
                            </View>
                          </View>

                          {review.comment ? (
                            <Text className="font-worksans text-[14px] leading-5 text-brand-dark-alt">
                              {review.comment}
                            </Text>
                          ) : (
                            <Text className="font-worksans text-[14px] text-[#6B6B6B] italic">
                              No written comment
                            </Text>
                          )}
                        </View>
                      </View>

                      {index < reviews.length - 1 ? (
                        <View className="h-px bg-[#F0F0F0]" />
                      ) : null}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
