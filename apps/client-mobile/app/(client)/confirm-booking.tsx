import React, { useState, useMemo } from 'react';
import { ScrollView, Image, Alert, ActivityIndicator, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Calendar, Clock, Edit, ChevronRight, CreditCard } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useHandymanProfile, useLocationStore, useCreateBooking, type CreateBookingInput, type FormResponse } from '@shared/supabase';
import { useAuthStore } from '@shared/supabase';

export default function ConfirmBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Task details from previous screens
  const taskerId = params.taskerId as string;
  const categoryId = params.categoryId as string;
  const categoryName = params.categoryName as string;
  const selectedDate = params.selectedDate as string;
  const selectedTime = params.selectedTime as string;

  // Parse form responses
  const formResponses: FormResponse = useMemo(() => {
    try {
      return params.formResponses ? JSON.parse(params.formResponses as string) : {};
    } catch {
      return {};
    }
  }, [params.formResponses]);

  // Get user from auth store
  const user = useAuthStore((state) => state.user);

  // Get location from store
  const location = useLocationStore((state) => state.location);

  // Fetch tasker profile
  const { data: profile, isLoading: profileLoading } = useHandymanProfile(taskerId);

  // Create booking mutation
  const createBookingMutation = useCreateBooking();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate estimated price from form responses
  const taskSize = formResponses.task_size as string | undefined;
  const estimatedHours = taskSize === 'small' ? 1 : taskSize === 'large' ? 4 : 2.5; // Default to medium
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
        task_details: (formResponses.additional_details as string) || undefined,
        scheduled_date: selectedDate,
        scheduled_time: selectedTime,
        address_street: location.streetAddress,
        address_apartment: location.unitNumber || undefined,
        address_postcode: location.postalCode || '',
        address_city: location.city || '',
        address_country: location.country || 'UK',
        hourly_rate_cents: profile.hourly_rate_cents,
        estimated_hours: estimatedHours,
        form_responses: formResponses,
      };

      const newBooking = await createBookingMutation.mutateAsync(bookingInput);

      // Navigate to success screen
      router.push({
        pathname: '/(client)/booking-success',
        params: {
          taskerName: profile.display_name || 'Tasker',
          taskerAvatar: profile.avatar_url || '',
          categoryName,
          selectedDate,
          selectedTime,
          bookingId: newBooking.id,
        },
      });
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
        <View className="flex-col flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
          <Text className="text-sm text-gray-600 mt-3">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-col px-5 pt-4 pb-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-4">
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold text-black mr-10">
            Review and confirm
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col px-5 py-6 gap-6">
          {/* Tasker Info */}
          <View className="flex-col bg-white rounded-lg border border-gray-300 p-5">
            <Text className="text-base font-semibold text-[#30352D] mb-4">
              Your Tasker
            </Text>
            <View className="flex-row items-center gap-3">
              <Image
                source={{ uri: profile?.avatar_url || `https://i.pravatar.cc/150?u=${taskerId}` }}
                className="w-16 h-16 rounded-full bg-gray-100"
              />
              <View className="flex-col flex-1">
                <Text className="text-lg font-semibold text-[#30352D]">
                  {profile?.display_name || 'Tasker'}
                </Text>
                {profile?.verified && (
                  <View className="flex-row items-center gap-1 mt-1">
                    <View className="flex-col w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#82BE56' }} />
                    <Text className="text-xs font-medium" style={{ color: '#82BE56' }}>
                      Verified Pro
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-lg font-bold" style={{ color: '#C1856A' }}>
                £{hourlyRate.toFixed(2)}/hr
              </Text>
            </View>
          </View>

          {/* Task Details */}
          <View className="flex-col bg-white rounded-lg border border-gray-300 p-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base font-semibold text-[#30352D]">
                Task Details
              </Text>
              <Pressable onPress={() => router.push({
                pathname: '/(client)/task-form',
                params: {
                  taskerId,
                  categoryId,
                  categoryName,
                  selectedDate,
                  selectedTime,
                  formResponses: JSON.stringify(formResponses),
                },
              })}>
                <Edit size={18} color="#C1856A" />
              </Pressable>
            </View>

            <View className="flex-col gap-3">
              {/* Category */}
              <View className="flex-col">
                <Text className="text-xs font-medium text-gray-600 mb-1">
                  Service
                </Text>
                <Text className="text-sm text-[#30352D]">
                  {categoryName}
                </Text>
              </View>

              {/* Location */}
              <View className="flex-col">
                <Text className="text-xs font-medium text-gray-600 mb-1">
                  Location
                </Text>
                <View className="flex-row items-start gap-2">
                  <MapPin size={14} color="#6B7280" className="mt-0.5" />
                  <Text className="flex-1 text-sm text-[#30352D]">
                    {location?.streetAddress}
                    {location?.unitNumber ? `, ${location.unitNumber}` : ''}
                  </Text>
                </View>
              </View>

              {/* Date & Time */}
              <View className="flex-row gap-4">
                <View className="flex-col flex-1">
                  <Text className="text-xs font-medium text-gray-600 mb-1">
                    Date
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Calendar size={14} color="#6B7280" />
                    <Text className="text-sm text-[#30352D]">
                      {formatDate(selectedDate)}
                    </Text>
                  </View>
                </View>

                <View className="flex-col flex-1">
                  <Text className="text-xs font-medium text-gray-600 mb-1">
                    Time
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Clock size={14} color="#6B7280" />
                    <Text className="text-sm text-[#30352D]">
                      {selectedTime}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Display form responses dynamically */}
              {Object.entries(formResponses).map(([key, value]) => {
                // Skip if empty or null
                if (value === null || value === undefined || value === '') return null;

                // Format the key into a readable label
                const label = key
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');

                // Format the value based on type
                let displayValue: string;
                if (Array.isArray(value)) {
                  displayValue = value.join(', ');
                } else if (typeof value === 'boolean') {
                  displayValue = value ? 'Yes' : 'No';
                } else if (key === 'task_size') {
                  displayValue = `${value} (${estimatedHours} ${estimatedHours === 1 ? 'hour' : 'hours'})`;
                } else if (key === 'vehicle_requirement') {
                  displayValue = value === 'not_needed' ? 'Not needed' : String(value);
                } else {
                  displayValue = String(value);
                }

                return (
                  <View key={key} className="flex-col">
                    <Text className="text-xs font-medium text-gray-600 mb-1">
                      {label}
                    </Text>
                    <Text className="text-sm text-[#30352D] capitalize">
                      {displayValue}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Payment Method */}
          <Pressable
            onPress={() => router.push('/profile/payments')}
            className="flex-row items-center justify-between py-4 border-b border-gray-200"
          >
            <Text className="text-lg font-semibold text-[#30352D]">
              Payment
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-base" style={{ color: '#C1856A' }}>
                Add payment
              </Text>
              <ChevronRight size={20} color="#C1856A" />
            </View>
          </Pressable>

          {/* Promo Code */}
          <Pressable
            onPress={() => router.push('/profile/promotions')}
            className="flex-row items-center justify-between py-4 border-b border-gray-200"
          >
            <Text className="text-lg font-semibold text-[#30352D]">
              Promos
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-base" style={{ color: '#C1856A' }}>
                Add code
              </Text>
              <ChevronRight size={20} color="#C1856A" />
            </View>
          </Pressable>

          {/* Hourly Rate */}
          <View className="flex-row items-center justify-between py-4">
            <Text className="text-lg font-semibold text-[#30352D]">
              Hourly Rate
            </Text>
            <Text className="text-lg font-semibold text-[#30352D]">
              £{hourlyRate.toFixed(2)}/hr
            </Text>
          </View>

          {/* Payment Hold Notice */}
          <View className="flex-col py-6">
            <Text className="text-sm text-gray-600 leading-5 mb-4">
              You may see a temporary hold on your payment method in the amount of £{hourlyRate.toFixed(2)}/hr. Don't worry -- you're only billed when your task is complete!
            </Text>

            <Text className="text-sm text-gray-600 leading-5 mb-4">
              Pricing is inclusive of a{' '}
              <Text style={{ color: '#C1856A' }}>£7.46/hr Trust and Support fee</Text>, as well as VAT, which is billed on the TaskRabbit's fees.
            </Text>

            <Text className="text-sm text-gray-600 leading-5">
              You will not be billed until the task is complete and can cancel at any time. Tasks cancelled less than 24 hours before the start time may be billed a cancellation fee of one hour. Tasks have a one-hour minimum.
            </Text>
          </View>

          {/* Billing Assurance */}
          <View className="flex-row items-center px-4 py-3 rounded-lg mb-4"
            style={{ backgroundColor: '#FFF4ED' }}
          >
            <CreditCard size={20} color="#C1856A" className="mr-3" />
            <Text className="flex-1 text-sm" style={{ color: '#C1856A' }}>
              You won't be billed until your task is complete.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Confirm Button */}
      <View className="flex-col px-5 py-4 bg-white border-t border-gray-200">
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
              Confirm and chat
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
