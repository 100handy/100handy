import React, { useState, useEffect } from 'react';
import { useCreateCustomerReview, useHasReviewedBooking } from '@shared/query';
import { ScrollView, View, Text, Pressable, TextInput, ActivityIndicator, Alert, } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { useLocalSearchParams, useRouter } from 'expo-router'; import { ArrowLeft, Star, X } from 'lucide-react-native'; import { toast } from 'sonner-native'; import { useBookingById } from '@shared/query';
import { goBackOrReplace } from '@/lib/navigation';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

export default function ClientReviewScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const content = useAppContent('client_review', {
    'header.title': 'Leave a Review',
    'errors.cannot_review_title': 'Cannot Review',
    'errors.cannot_review_body': 'Reviews can only be submitted for completed bookings.',
    'errors.missing_booking': 'Booking not found',
    'status.already_title': 'Already reviewed',
    'status.already_body': "You've already left a review for this booking.",
    'rating.prompt': 'How was your experience?',
    'rating.tap': 'Tap to rate',
    'rating.poor': 'Poor',
    'rating.fair': 'Fair',
    'rating.good': 'Good',
    'rating.very_good': 'Very Good',
    'rating.excellent': 'Excellent',
    'review.title': 'Write a review (optional)',
    'review.placeholder': 'Share your experience with this pro...',
    'review.footer': "Your review will be visible on the pro's profile",
    'actions.skip': 'Maybe later',
    'actions.submit': 'Submit Review',
    'toasts.missing_rating': 'Please select a rating',
    'toasts.success': 'Review submitted!',
    'toasts.failed': 'Failed to submit review',
    'toasts.generic_error': 'Something went wrong',
  });

  const { data: booking, isLoading: loadingBooking } = useBookingById(bookingId || null);
  const { data: hasReviewed, isLoading: loadingReview } = useHasReviewedBooking(
    bookingId || '',
    'customer'
  );
  const createReview = useCreateCustomerReview();

  // Validate booking status - only allow reviews for completed bookings
  useEffect(() => {
    if (booking && booking.status !== 'completed') {
      Alert.alert(
        getAppContentValue(content, 'errors.cannot_review_title', 'Cannot Review'),
        getAppContentValue(content, 'errors.cannot_review_body', 'Reviews can only be submitted for completed bookings.'),
        [{ text: 'OK', onPress: () => goBackOrReplace(router, '/(client)/(tabs)/tasks') }]
      );
    }
  }, [booking, router]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error(getAppContentValue(content, 'toasts.missing_rating', 'Please select a rating'));
      return;
    }

    if (!bookingId) return;

    setIsSubmitting(true);
    try {
      const review = await createReview.mutateAsync({
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      });

      if (review) {
        toast.success(getAppContentValue(content, 'toasts.success', 'Review submitted!'));
        goBackOrReplace(router, '/(client)/(tabs)/tasks');
      } else {
        toast.error(getAppContentValue(content, 'toasts.failed', 'Failed to submit review'));
      }
    } catch (error) {
      toast.error(getAppContentValue(content, 'toasts.generic_error', 'Something went wrong'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    goBackOrReplace(router, '/(client)/(tabs)/tasks');
  };

  if (loadingBooking || loadingReview) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5] items-center justify-center">
        <ActivityIndicator size="large" color="#B29D88" />
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5]">
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-[#F0F0F0]">
          <Pressable onPress={() => goBackOrReplace(router, '/(client)/(tabs)/tasks')} className="p-2 -ml-2">
            <ArrowLeft color="#30352D" size={24} />
          </Pressable>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="font-worksans-bold text-[18px] text-[#30352D]">
            {getAppContentValue(content, 'errors.missing_booking', 'Booking not found')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasReviewed) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5]">
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-[#F0F0F0]">
          <Pressable onPress={() => goBackOrReplace(router, '/(client)/(tabs)/tasks')} className="p-2 -ml-2">
            <ArrowLeft color="#30352D" size={24} />
          </Pressable>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <Star color="#B29D88" size={48} fill="#B29D88" />
          <Text className="font-worksans-bold text-[18px] text-[#30352D] mt-4">
            {getAppContentValue(content, 'status.already_title', 'Already reviewed')}
          </Text>
          <Text className="font-worksans text-[14px] text-[#6B6B6B] mt-2 text-center">
            {getAppContentValue(content, 'status.already_body', "You've already left a review for this booking.")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-[#F0F0F0]">
        <Pressable onPress={() => goBackOrReplace(router, '/(client)/(tabs)/tasks')} className="p-2 -ml-2">
          <ArrowLeft color="#30352D" size={24} />
        </Pressable>
        <Text className="font-worksans-bold text-[18px] text-[#30352D]">
          {getAppContentValue(content, 'header.title', 'Leave a Review')}
        </Text>
        <Pressable onPress={handleSkip} className="p-2 -mr-2">
          <X color="#6B6B6B" size={24} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Booking Info */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-2xl">
          <Text className="font-worksans-bold text-[16px] text-[#30352D]">
            {booking.task_title}
          </Text>
          {booking.category && (
            <Text className="font-worksans text-[14px] text-[#6B6B6B] mt-1">
              {booking.category.name}
            </Text>
          )}
        </View>

        {/* Rating */}
        <View className="bg-white mx-4 mt-3 p-4 rounded-2xl">
          <Text className="font-worksans-bold text-[16px] text-[#30352D] mb-4 text-center">
            {getAppContentValue(content, 'rating.prompt', 'How was your experience?')}
          </Text>
          <View className="flex-row justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Star
                  color="#B29D88"
                  size={40}
                  fill={star <= rating ? '#B29D88' : 'transparent'}
                  strokeWidth={1.5}
                />
              </Pressable>
            ))}
          </View>
          <Text className="font-worksans text-[13px] text-[#6B6B6B] mt-3 text-center">
            {rating === 0 && getAppContentValue(content, 'rating.tap', 'Tap to rate')}
            {rating === 1 && getAppContentValue(content, 'rating.poor', 'Poor')}
            {rating === 2 && getAppContentValue(content, 'rating.fair', 'Fair')}
            {rating === 3 && getAppContentValue(content, 'rating.good', 'Good')}
            {rating === 4 && getAppContentValue(content, 'rating.very_good', 'Very Good')}
            {rating === 5 && getAppContentValue(content, 'rating.excellent', 'Excellent')}
          </Text>
        </View>

        {/* Comment */}
        <View className="bg-white mx-4 mt-3 p-4 rounded-2xl">
          <Text className="font-worksans-bold text-[16px] text-[#30352D] mb-3">
            {getAppContentValue(content, 'review.title', 'Write a review (optional)')}
          </Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder={getAppContentValue(content, 'review.placeholder', 'Share your experience with this pro...')}
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-[#F5F5F5] p-4 rounded-xl font-worksans text-[14px] text-[#30352D] min-h-[120px]"
          />
          <Text className="font-worksans text-[12px] text-[#6B6B6B] mt-2">
            {getAppContentValue(content, 'review.footer', "Your review will be visible on the pro's profile")}
          </Text>
        </View>

        {/* Skip prompt */}
        <Pressable onPress={handleSkip} className="py-4">
          <Text className="font-worksans text-[14px] text-[#6B6B6B] text-center underline">
            {getAppContentValue(content, 'actions.skip', 'Maybe later')}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Submit Button */}
      <View className="bg-white px-4 py-4 border-t border-[#F0F0F0]">
        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting || rating === 0}
          className={`py-4 rounded-xl items-center ${
            rating > 0 ? 'bg-brand-taupe' : 'bg-[#E5E5E5]'
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              className={`font-worksans-bold text-[16px] ${
                rating > 0 ? 'text-white' : 'text-[#9CA3AF]'
              }`}
            >
              {getAppContentValue(content, 'actions.submit', 'Submit Review')}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
