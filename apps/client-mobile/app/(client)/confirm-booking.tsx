import React, { useState } from 'react';
import { ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeft, MapPin, Calendar, Clock, Edit } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useHandymanProfile, useLocationStore, useCreateBooking, type CreateBookingInput } from '@shared/supabase';
import { useAuthStore } from '@shared/supabase';

export default function ConfirmBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Task details from previous screens
  const taskerId = params.taskerId as string;
  const categoryId = params.categoryId as string;
  const categoryName = params.categoryName as string;
  const taskSize = params.taskSize as string;
  const vehicleRequirement = params.vehicleRequirement as string;
  const taskDetails = params.taskDetails as string;
  const selectedDate = params.selectedDate as string;
  const selectedTime = params.selectedTime as string;

  // Get user from auth store
  const user = useAuthStore((state) => state.user);

  // Get location from store
  const location = useLocationStore((state) => state.location);

  // Fetch tasker profile
  const { data: profile, isLoading: profileLoading } = useHandymanProfile(taskerId);

  // Create booking mutation
  const createBookingMutation = useCreateBooking();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate estimated price
  const estimatedHours = taskSize === 'small' ? 1 : taskSize === 'medium' ? 2.5 : 4;
  const hourlyRate = profile ? profile.hourly_rate_cents / 100 : 0;
  const estimatedPrice = hourlyRate * estimatedHours;

  const handleCreateBooking = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to create a booking');
      return;
    }

    if (!profile) {
      Alert.alert('Error', 'Tasker profile not loaded');
      return;
    }

    if (!location?.streetAddress) {
      Alert.alert('Error', 'Location information missing');
      return;
    }

    try {
      setIsSubmitting(true);

      const bookingInput: CreateBookingInput = {
        customer_id: user.id,
        handy_id: profile.user_id,
        category_id: categoryId,
        task_title: categoryName,
        task_details: taskDetails || null,
        scheduled_date: selectedDate,
        scheduled_time: selectedTime,
        address_street: location.streetAddress,
        address_apartment: location.unitNumber || null,
        address_postcode: location.postalCode || '',
        address_city: location.city || '',
        address_country: location.country || 'UK',
        hourly_rate_cents: profile.hourly_rate_cents,
        estimated_hours: estimatedHours,
      };

      await createBookingMutation.mutateAsync(bookingInput);

      Alert.alert(
        'Success!',
        'Your booking has been created successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to bookings or home
              router.push('/(tabs)/home');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', error.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (profileLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <VStack className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
          <Text className="text-sm text-gray-600 mt-3">Loading...</Text>
        </VStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <VStack className="px-5 pt-4 pb-4 bg-white border-b border-gray-200">
        <HStack className="items-center">
          <Pressable onPress={() => router.back()} className="mr-4">
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </Pressable>
          <Text className="flex-1 text-lg font-semibold text-black">
            Confirm Booking
          </Text>
        </HStack>
      </VStack>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <VStack className="px-5 py-6 gap-6">
          {/* Tasker Info */}
          <VStack className="bg-white rounded-lg border border-gray-300 p-5">
            <Text className="text-base font-semibold text-[#30352D] mb-4">
              Your Tasker
            </Text>
            <HStack className="items-center gap-3">
              <Image
                source={{ uri: profile?.avatar_url || `https://i.pravatar.cc/150?u=${taskerId}` }}
                className="w-16 h-16 rounded-full bg-gray-100"
              />
              <VStack className="flex-1">
                <Text className="text-lg font-semibold text-[#30352D]">
                  {profile?.display_name || 'Tasker'}
                </Text>
                {profile?.verified && (
                  <HStack className="items-center gap-1 mt-1">
                    <VStack className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#82BE56' }} />
                    <Text className="text-xs font-medium" style={{ color: '#82BE56' }}>
                      Verified Pro
                    </Text>
                  </HStack>
                )}
              </VStack>
              <Text className="text-lg font-bold" style={{ color: '#C1856A' }}>
                £{hourlyRate.toFixed(2)}/hr
              </Text>
            </HStack>
          </VStack>

          {/* Task Details */}
          <VStack className="bg-white rounded-lg border border-gray-300 p-5">
            <HStack className="items-center justify-between mb-4">
              <Text className="text-base font-semibold text-[#30352D]">
                Task Details
              </Text>
              <Pressable onPress={() => router.back()}>
                <Edit size={18} color="#C1856A" />
              </Pressable>
            </HStack>

            <VStack className="gap-3">
              {/* Category */}
              <VStack>
                <Text className="text-xs font-medium text-gray-600 mb-1">
                  Service
                </Text>
                <Text className="text-sm text-[#30352D]">
                  {categoryName}
                </Text>
              </VStack>

              {/* Location */}
              <VStack>
                <Text className="text-xs font-medium text-gray-600 mb-1">
                  Location
                </Text>
                <HStack className="items-start gap-2">
                  <MapPin size={14} color="#6B7280" className="mt-0.5" />
                  <Text className="flex-1 text-sm text-[#30352D]">
                    {location?.streetAddress}
                    {location?.unitNumber ? `, ${location.unitNumber}` : ''}
                  </Text>
                </HStack>
              </VStack>

              {/* Date & Time */}
              <HStack className="gap-4">
                <VStack className="flex-1">
                  <Text className="text-xs font-medium text-gray-600 mb-1">
                    Date
                  </Text>
                  <HStack className="items-center gap-2">
                    <Calendar size={14} color="#6B7280" />
                    <Text className="text-sm text-[#30352D]">
                      {formatDate(selectedDate)}
                    </Text>
                  </HStack>
                </VStack>

                <VStack className="flex-1">
                  <Text className="text-xs font-medium text-gray-600 mb-1">
                    Time
                  </Text>
                  <HStack className="items-center gap-2">
                    <Clock size={14} color="#6B7280" />
                    <Text className="text-sm text-[#30352D]">
                      {selectedTime}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              {/* Task Size */}
              <VStack>
                <Text className="text-xs font-medium text-gray-600 mb-1">
                  Task Size
                </Text>
                <Text className="text-sm text-[#30352D] capitalize">
                  {taskSize} ({estimatedHours} {estimatedHours === 1 ? 'hour' : 'hours'})
                </Text>
              </VStack>

              {/* Vehicle */}
              <VStack>
                <Text className="text-xs font-medium text-gray-600 mb-1">
                  Vehicle Requirement
                </Text>
                <Text className="text-sm text-[#30352D] capitalize">
                  {vehicleRequirement === 'not-needed' ? 'Not needed' : vehicleRequirement}
                </Text>
              </VStack>

              {/* Additional Details */}
              {taskDetails && (
                <VStack>
                  <Text className="text-xs font-medium text-gray-600 mb-1">
                    Additional Details
                  </Text>
                  <Text className="text-sm text-[#30352D]">
                    {taskDetails}
                  </Text>
                </VStack>
              )}
            </VStack>
          </VStack>

          {/* Price Estimate */}
          <VStack className="bg-[#F9FAFB] rounded-lg border border-gray-300 p-5">
            <Text className="text-base font-semibold text-[#30352D] mb-4">
              Price Estimate
            </Text>

            <VStack className="gap-2">
              <HStack className="items-center justify-between">
                <Text className="text-sm text-gray-600">
                  Hourly Rate
                </Text>
                <Text className="text-sm text-[#30352D]">
                  £{hourlyRate.toFixed(2)}/hr
                </Text>
              </HStack>

              <HStack className="items-center justify-between">
                <Text className="text-sm text-gray-600">
                  Estimated Hours
                </Text>
                <Text className="text-sm text-[#30352D]">
                  {estimatedHours} {estimatedHours === 1 ? 'hour' : 'hours'}
                </Text>
              </HStack>

              <VStack className="h-px bg-gray-300 my-2" />

              <HStack className="items-center justify-between">
                <Text className="text-base font-semibold text-[#30352D]">
                  Estimated Total
                </Text>
                <Text className="text-xl font-bold" style={{ color: '#C1856A' }}>
                  £{estimatedPrice.toFixed(2)}
                </Text>
              </HStack>
            </VStack>

            <Text className="text-xs text-gray-600 mt-3">
              Final price will be calculated based on actual time spent
            </Text>
          </VStack>
        </VStack>
      </ScrollView>

      {/* Bottom Confirm Button */}
      <VStack className="px-5 py-4 bg-white border-t border-gray-200">
        <Pressable
          onPress={handleCreateBooking}
          disabled={isSubmitting}
          className="w-full py-4 rounded-full items-center"
          style={{ backgroundColor: isSubmitting ? '#D1D5DB' : '#C1856A' }}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-base font-semibold text-white">
              Confirm & Book
            </Text>
          )}
        </Pressable>

        <Text className="text-xs text-center text-gray-600 mt-3">
          By confirming, you agree to our Terms of Service
        </Text>
      </VStack>
    </SafeAreaView>
  );
}
