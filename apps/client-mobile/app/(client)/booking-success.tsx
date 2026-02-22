import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, MessageCircle, Calendar } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useConversationByBooking } from '@shared/supabase';

export default function BookingSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const taskerName = params.taskerName as string;
  const taskerAvatar = params.taskerAvatar as string;
  const categoryName = params.categoryName as string;
  const selectedDate = params.selectedDate as string;
  const selectedTime = params.selectedTime as string;
  const bookingId = params.bookingId as string;

  // Fetch or create conversation for this booking
  const {
    data: conversation,
    isLoading: conversationLoading,
  } = useConversationByBooking(bookingId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const handleChatWithTasker = () => {
    // Navigate to chat conversation if available
    if (conversation?.id) {
      router.push({
        pathname: '/(client)/chat/conversation',
        params: { conversationId: conversation.id },
      });
    } else {
      // Fallback to messages tab
      router.replace('/(client)/(tabs)/messages');
    }
  };

  const handleViewBookings = () => {
    // Navigate to bookings tab
    router.replace('/(client)/(tabs)/tasks');
  };

  const handleGoHome = () => {
    router.replace('/(client)/(tabs)/home');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 flex-col items-center justify-center px-6">
        {/* Success Icon */}
        <View className="mb-6">
          <CheckCircle2 size={80} color="#82BE56" strokeWidth={2} />
        </View>

        {/* Success Message */}
        <Text className="text-2xl font-bold text-[#30352D] mb-2 text-center">
          Booking Confirmed!
        </Text>
        <Text className="text-base text-gray-600 mb-8 text-center">
          Your task has been booked successfully
        </Text>

        {/* Booking Summary Card */}
        <View className="w-full bg-white rounded-lg border border-gray-300 p-5 mb-8">
          {/* Tasker Info */}
          <View className="flex-row items-center mb-4 pb-4 border-b border-gray-200">
            <Image
              source={taskerAvatar ? { uri: taskerAvatar } : undefined}
              placeholder={require('@/assets/images/icon.png')}
              className="w-12 h-12 rounded-full bg-gray-100 mr-3"
            />
            <View className="flex-col flex-1">
              <Text className="text-sm text-gray-600 mb-1">
                Your Tasker
              </Text>
              <Text className="text-base font-semibold text-[#30352D]">
                {taskerName || 'Tasker'}
              </Text>
            </View>
          </View>

          {/* Service */}
          <View className="flex-col mb-3">
            <Text className="text-sm text-gray-600 mb-1">
              Service
            </Text>
            <Text className="text-base text-[#30352D]">
              {categoryName || 'Service'}
            </Text>
          </View>

          {/* Date & Time */}
          <View className="flex-col">
            <Text className="text-sm text-gray-600 mb-1">
              Scheduled
            </Text>
            <Text className="text-base text-[#30352D]">
              {formatDate(selectedDate)} at {selectedTime}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="w-full gap-3">
          {/* Chat Button */}
          <Pressable
            onPress={handleChatWithTasker}
            disabled={conversationLoading}
            className="w-full py-4 rounded-full items-center flex-row justify-center gap-2"
            style={{ backgroundColor: conversationLoading ? '#D1D5DB' : '#C1856A' }}
          >
            {conversationLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MessageCircle size={20} color="#FFFFFF" strokeWidth={2} />
                <Text className="text-base font-semibold text-white">
                  Chat with {taskerName?.split(' ')[0] || 'Tasker'}
                </Text>
              </>
            )}
          </Pressable>

          {/* View Bookings Button */}
          <Pressable
            onPress={handleViewBookings}
            className="w-full py-4 rounded-full items-center flex-row justify-center gap-2 border-2"
            style={{ borderColor: '#C1856A', backgroundColor: 'transparent' }}
          >
            <Calendar size={20} color="#C1856A" strokeWidth={2} />
            <Text className="text-base font-semibold" style={{ color: '#C1856A' }}>
              View My Bookings
            </Text>
          </Pressable>

          {/* Go Home Link */}
          <Pressable onPress={handleGoHome} className="w-full py-3 items-center">
            <Text className="text-base" style={{ color: '#6B7280' }}>
              Go to Home
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
