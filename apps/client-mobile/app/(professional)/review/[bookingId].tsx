import React, { useState, useEffect } from 'react';
import { useCreateProfessionalReview, useHasReviewedBooking } from '@shared/query';
import { ScrollView, View, Text, Pressable, TextInput, ActivityIndicator, Alert, } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { useLocalSearchParams, useRouter } from 'expo-router'; import { ArrowLeft, Star, X, Lock } from 'lucide-react-native'; import { toast } from 'sonner-native'; import { useBookingById } from '@shared/query';

export default function ProfessionalReviewScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [privateNotes, setPrivateNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: booking, isLoading: loadingBooking } = useBookingById(bookingId || null);
  const { data: hasReviewed, isLoading: loadingReview } = useHasReviewedBooking(
    bookingId || '',
    'handy'
  );
  const createReview = useCreateProfessionalReview();

  // Guard: only allow review for completed bookings
  useEffect(() => {
    if (!loadingBooking && booking && booking.status !== 'completed') {
      Alert.alert(
        'Cannot Review',
        'You can only review completed bookings.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  }, [loadingBooking, booking?.status]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!bookingId) return;

    setIsSubmitting(true);
    try {
      const review = await createReview.mutateAsync({
        bookingId,
        rating,
        privateNotes: privateNotes.trim() || undefined,
      });

      if (review) {
        toast.success('Review saved!');
        router.back();
      } else {
        toast.error('Failed to save review');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.back();
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
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft color="#30352D" size={24} />
          </Pressable>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="font-worksans-bold text-[18px] text-[#30352D]">
            Booking not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasReviewed) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5]">
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-[#F0F0F0]">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft color="#30352D" size={24} />
          </Pressable>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <Star color="#B29D88" size={48} fill="#B29D88" />
          <Text className="font-worksans-bold text-[18px] text-[#30352D] mt-4">
            Already reviewed
          </Text>
          <Text className="font-worksans text-[14px] text-[#6B6B6B] mt-2 text-center">
            You've already rated this client.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-[#F0F0F0]">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft color="#30352D" size={24} />
        </Pressable>
        <Text className="font-worksans-bold text-[18px] text-[#30352D]">
          Rate Client
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

        {/* Privacy Notice */}
        <View className="bg-[#F0F8F5] mx-4 mt-3 p-4 rounded-2xl flex-row items-start">
          <Lock color="#2E7D32" size={18} strokeWidth={1.5} />
          <View className="flex-1 ml-3">
            <Text className="font-worksans-medium text-[14px] text-[#2E7D32]">
              Private Rating
            </Text>
            <Text className="font-worksans text-[12px] text-[#2E7D32] mt-1">
              This rating is private and only visible to you. It helps you remember
              your experience with this client for future bookings.
            </Text>
          </View>
        </View>

        {/* Rating */}
        <View className="bg-white mx-4 mt-3 p-4 rounded-2xl">
          <Text className="font-worksans-bold text-[16px] text-[#30352D] mb-4 text-center">
            How was this client?
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
            {rating === 0 && 'Tap to rate'}
            {rating === 1 && 'Would not work with again'}
            {rating === 2 && 'Below average'}
            {rating === 3 && 'Average'}
            {rating === 4 && 'Good client'}
            {rating === 5 && 'Excellent client'}
          </Text>
        </View>

        {/* Private Notes */}
        <View className="bg-white mx-4 mt-3 p-4 rounded-2xl">
          <Text className="font-worksans-bold text-[16px] text-[#30352D] mb-3">
            Private notes (optional)
          </Text>
          <TextInput
            value={privateNotes}
            onChangeText={setPrivateNotes}
            placeholder="Add notes about this client for your reference..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-[#F5F5F5] p-4 rounded-xl font-worksans text-[14px] text-[#30352D] min-h-[120px]"
          />
          <Text className="font-worksans text-[12px] text-[#6B6B6B] mt-2">
            Only you can see these notes
          </Text>
        </View>

        {/* Skip prompt */}
        <Pressable onPress={handleSkip} className="py-4">
          <Text className="font-worksans text-[14px] text-[#6B6B6B] text-center underline">
            Maybe later
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
              Save Rating
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
