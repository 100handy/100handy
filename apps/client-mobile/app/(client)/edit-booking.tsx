import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Clock, Save } from 'lucide-react-native';
import {
  useBookingById,
  useUpdateBookingDetails,
  useAuthStore,
  checkBookingConflict,
  getAvailabilityByUserId,
} from '@shared/supabase';

export default function EditBookingScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: booking, isLoading } = useBookingById(bookingId || null);
  const updateMutation = useUpdateBookingDetails();

  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form values from booking data
  React.useEffect(() => {
    if (booking) {
      setScheduledDate(booking.scheduled_date);
      setScheduledTime(booking.scheduled_time?.slice(0, 5) || '');
      setTaskDetails(booking.task_details || '');
    }
  }, [booking]);

  if (isLoading || !booking) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#C1856A" />
      </SafeAreaView>
    );
  }

  if (booking.status !== 'pending') {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center px-5 py-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="mr-3">
            <ChevronLeft size={24} color="#30352D" />
          </Pressable>
          <Text className="text-lg font-worksans-semibold" style={{ color: '#30352D' }}>
            Edit Booking
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-base font-worksans text-center" style={{ color: '#6B7280' }}>
            Only pending bookings can be edited.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    if (!user?.id || !bookingId) return;

    setIsSaving(true);
    try {
      // Validate date/time if changed
      const dateChanged = scheduledDate !== booking.scheduled_date;
      const timeChanged = scheduledTime !== booking.scheduled_time?.slice(0, 5);

      if (dateChanged || timeChanged) {
        // Check availability
        if (booking.handy_id) {
          const availability = await getAvailabilityByUserId(booking.handy_id);
          if (availability && availability.length > 0) {
            const dateObj = new Date(scheduledDate + 'T00:00:00');
            const dayOfWeek = dateObj.getDay();
            const daySlots = availability.filter((s) => s.day_of_week === dayOfWeek);

            if (daySlots.length === 0) {
              Alert.alert('Not Available', 'The tasker is not available on this day.');
              return;
            }

            const parseTime = (t: string) => {
              const parts = t.split(':').map(Number);
              return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
            };
            const selectedMin = parseTime(scheduledTime);
            const taskEndMin = selectedMin + (booking.estimated_hours || 1) * 60;
            const fits = daySlots.some((slot) => {
              const start = parseTime(slot.start_time);
              const end = parseTime(slot.end_time);
              return selectedMin >= start && taskEndMin <= end;
            });

            if (!fits) {
              Alert.alert('Time Not Available', 'The selected time does not fit within the tasker\'s availability.');
              return;
            }
          }

          // Check for conflicts
          const hasConflict = await checkBookingConflict(
            booking.handy_id,
            scheduledDate,
            scheduledTime,
            booking.estimated_hours || 1
          );
          if (hasConflict) {
            Alert.alert('Time Conflict', 'The tasker has another booking at this time.');
            return;
          }
        }
      }

      const updates: Record<string, string> = {};
      if (dateChanged) updates.scheduled_date = scheduledDate;
      if (timeChanged) updates.scheduled_time = scheduledTime + ':00';
      if (taskDetails !== (booking.task_details || '')) updates.task_details = taskDetails;

      if (Object.keys(updates).length === 0) {
        router.back();
        return;
      }

      const success = await updateMutation.mutateAsync({
        bookingId,
        customerId: user.id,
        updates,
      });

      if (success) {
        Alert.alert('Updated', 'Your booking has been updated.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Error', 'Could not update booking. It may no longer be pending.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 py-4 border-b border-gray-200">
        <Pressable onPress={() => router.back()} className="mr-3">
          <ChevronLeft size={24} color="#30352D" />
        </Pressable>
        <Text className="text-lg font-worksans-semibold flex-1" style={{ color: '#30352D' }}>
          Edit Booking
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 py-6" showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Date */}
          <View>
            <View className="flex-row items-center gap-2 mb-2">
              <Calendar size={16} color="#6B7280" />
              <Text className="text-sm font-worksans-medium" style={{ color: '#6B7280' }}>
                Date (YYYY-MM-DD)
              </Text>
            </View>
            <TextInput
              value={scheduledDate}
              onChangeText={setScheduledDate}
              placeholder="2025-01-15"
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm font-worksans"
              style={{ color: '#30352D' }}
            />
          </View>

          {/* Time */}
          <View>
            <View className="flex-row items-center gap-2 mb-2">
              <Clock size={16} color="#6B7280" />
              <Text className="text-sm font-worksans-medium" style={{ color: '#6B7280' }}>
                Time (HH:MM)
              </Text>
            </View>
            <TextInput
              value={scheduledTime}
              onChangeText={setScheduledTime}
              placeholder="14:00"
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm font-worksans"
              style={{ color: '#30352D' }}
            />
          </View>

          {/* Task Details */}
          <View>
            <Text className="text-sm font-worksans-medium mb-2" style={{ color: '#6B7280' }}>
              Additional Details
            </Text>
            <TextInput
              value={taskDetails}
              onChangeText={setTaskDetails}
              placeholder="Any additional information..."
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm font-worksans"
              style={{ color: '#30352D', textAlignVertical: 'top', minHeight: 100 }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="px-5 py-4 border-t border-gray-200">
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          className="w-full py-4 rounded-full items-center flex-row justify-center gap-2"
          style={{ backgroundColor: isSaving ? '#D1D5DB' : '#C1856A' }}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Save size={18} color="white" />
              <Text className="text-base font-worksans-semibold text-white">Save Changes</Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
