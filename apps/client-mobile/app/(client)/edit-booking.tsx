import React, { useState } from 'react';
import { useAuthStore } from '@shared/store';
import { useUpdateBookingDetails, doesAvailabilitySlotApplyToDate } from '@shared/query';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { useLocalSearchParams, useRouter } from 'expo-router'; import { ChevronLeft, Calendar, Clock, Save, Edit, MapPin } from 'lucide-react-native'; import { useBookingById } from '@shared/query'; import { checkBookingConflict, getAvailabilityByUserId, type FormResponse } from '@shared/supabase';
import { ScheduleSelectionSheet } from '@/components/tasker/ScheduleSelectionSheet';
import { DynamicFormRenderer } from '@/components/booking/DynamicFormRenderer';
import { BookingStatusBadge } from '@/components/booking/BookingStatusBadge';
import { useToast } from '@/components/ui/toast';
import { goBackOrReplace } from '@/lib/navigation';

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(timeStr: string) {
  const [hours, minutes] = timeStr.split(':');
  if (!hours || !minutes) return timeStr;
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatFormResponseLabel(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatFormResponseValue(key: string, value: unknown, estimatedHours?: number): string {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (key === 'task_size' && estimatedHours) {
    return `${value} (${estimatedHours} ${estimatedHours === 1 ? 'hour' : 'hours'})`;
  }
  if (key === 'vehicle_requirement') {
    return value === 'not_needed' ? 'Not needed' : String(value);
  }
  return String(value);
}

export default function EditBookingScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: booking, isLoading } = useBookingById(bookingId || null);
  const updateMutation = useUpdateBookingDetails();
  const toast = useToast();

  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [formResponses, setFormResponses] = useState<FormResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [isEditingForm, setIsEditingForm] = useState(false);

  // Initialize form values from booking data
  React.useEffect(() => {
    if (booking) {
      setScheduledDate(booking.scheduled_date);
      setScheduledTime(booking.scheduled_time?.slice(0, 5) || '');
      setFormResponses(booking.form_responses || {});
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
          <Pressable onPress={() => goBackOrReplace(router, '/(client)/(tabs)/tasks')} className="mr-3">
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

  const taskerName = booking.handy_profile
    ? `${booking.handy_profile.first_name ?? ''} ${booking.handy_profile.last_name ?? ''}`.trim()
    : '100Handy Pro';

  const taskSize = (formResponses?.task_size ?? booking.form_responses?.task_size) as string | undefined;
  const estimatedHours = taskSize === 'small' ? 1 : taskSize === 'large' ? 4 : 2.5;
  const currentFormResponses = formResponses ?? booking.form_responses ?? {};

  const handleScheduleSelect = (date: string, time: string) => {
    setScheduledDate(date);
    setScheduledTime(time);
    setShowSchedulePicker(false);
  };

  const handleFormSubmit = (responses: FormResponse) => {
    setFormResponses(responses);
    setIsEditingForm(false);
  };

  const handleSave = async () => {
    if (!user?.id || !bookingId) return;

    setIsSaving(true);
    try {
      const dateChanged = scheduledDate !== booking.scheduled_date;
      const timeChanged = scheduledTime !== booking.scheduled_time?.slice(0, 5);
      const formChanged = JSON.stringify(formResponses) !== JSON.stringify(booking.form_responses);

      // Validate date is not in the past
      if (dateChanged || timeChanged) {
        const today = new Date().toISOString().split('T')[0]!;
        if (scheduledDate < today) {
          setIsSaving(false);
          toast.error('Invalid Date', 'The selected date is in the past. Please choose a future date.');
          return;
        }
      }

      if (dateChanged || timeChanged) {
        // Check availability
        if (booking.handy_id) {
          const availability = await getAvailabilityByUserId(booking.handy_id);
          if (availability && availability.length > 0) {
            const daySlots = availability.filter((slot) =>
              doesAvailabilitySlotApplyToDate(slot, scheduledDate),
            );

            if (daySlots.length === 0) {
              setIsSaving(false);
              toast.error('Not Available', 'The 100Handy Pro is not available on this day.');
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
              setIsSaving(false);
              toast.error('Time Not Available', 'The selected time does not fit within the 100Handy Pro\'s availability.');
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
            setIsSaving(false);
            toast.error('Time Conflict', 'The 100Handy Pro has another booking at this time.');
            return;
          }
        }
      }

      const updates: {
        scheduled_date?: string;
        scheduled_time?: string;
        task_details?: string;
        form_responses?: FormResponse;
      } = {};
      if (dateChanged) updates.scheduled_date = scheduledDate;
      if (timeChanged) updates.scheduled_time = scheduledTime + ':00';
      if (formChanged && formResponses) {
        updates.form_responses = formResponses;
        // Update task_details from form if additional_details changed
        const newDetails = formResponses.additional_details as string | undefined;
        const oldDetails = booking.form_responses?.additional_details as string | undefined;
        if (newDetails !== oldDetails) {
          updates.task_details = newDetails || '';
        }
      }

      if (Object.keys(updates).length === 0) {
        goBackOrReplace(router, '/(client)/(tabs)/tasks');
        return;
      }

      const success = await updateMutation.mutateAsync({
        bookingId,
        customerId: user.id,
        updates,
      });

      if (success) {
        toast.success('Updated', 'Your booking has been updated.');
        goBackOrReplace(router, '/(client)/(tabs)/tasks');
      } else {
        toast.error('Error', 'Could not update booking. It may no longer be pending.');
      }
    } catch (error) {
      toast.error('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // If editing form responses, show full-screen DynamicFormRenderer
  if (isEditingForm && booking.category_id) {
    return (
      <DynamicFormRenderer
        categoryId={booking.category_id}
        categoryName={booking.task_title}
        initialValues={currentFormResponses}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsEditingForm(false)}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-gray-200 bg-white">
        <Pressable onPress={() => goBackOrReplace(router, '/(client)/(tabs)/tasks')} className="mr-3">
          <ChevronLeft size={24} color="#30352D" />
        </Pressable>
        <Text className="text-lg font-worksans-semibold flex-1" style={{ color: '#30352D' }}>
          Edit Booking
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-6 gap-4">
          {/* Booking Summary */}
          <View className="bg-white rounded-lg border border-gray-200 p-4">
            <Text className="text-lg font-worksans-bold mb-1" style={{ color: '#30352D' }}>
              {booking.task_title}
            </Text>
            <Text className="text-sm font-worksans mb-3" style={{ color: '#6B7280' }}>
              with {taskerName}
            </Text>
            <BookingStatusBadge status={booking.status} />
          </View>

          {/* Schedule - Tappable */}
          <Pressable
            onPress={() => setShowSchedulePicker(true)}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-worksans-medium text-gray-500">SCHEDULE</Text>
              <Edit size={16} color="#C1856A" />
            </View>
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <Calendar size={20} color="#9CA3AF" />
                <Text className="text-sm font-worksans" style={{ color: '#30352D' }}>
                  {formatDate(scheduledDate)}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Clock size={20} color="#9CA3AF" />
                <Text className="text-sm font-worksans" style={{ color: '#30352D' }}>
                  {formatTime(scheduledTime)}
                </Text>
              </View>
            </View>
          </Pressable>

          {/* Location (read-only) */}
          {booking.address && (
            <View className="bg-white rounded-lg border border-gray-200 p-4">
              <Text className="text-xs font-worksans-medium text-gray-500 mb-3">LOCATION</Text>
              <View className="flex-row gap-2">
                <MapPin size={20} color="#9CA3AF" />
                <View className="flex-1">
                  <Text className="text-sm font-worksans" style={{ color: '#30352D' }}>
                    {booking.address.street}
                    {booking.address.apartment ? `, ${booking.address.apartment}` : ''}
                  </Text>
                  <Text className="text-sm font-worksans" style={{ color: '#30352D' }}>
                    {booking.address.city}, {booking.address.postcode}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Form Responses - Read-only with edit button */}
          {Object.keys(currentFormResponses).length > 0 && (
            <View className="bg-white rounded-lg border border-gray-200 p-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-xs font-worksans-medium text-gray-500">TASK DETAILS</Text>
                {booking.category_id && (
                  <Pressable onPress={() => setIsEditingForm(true)}>
                    <Edit size={16} color="#C1856A" />
                  </Pressable>
                )}
              </View>
              <View className="gap-3">
                {Object.entries(currentFormResponses).map(([key, value]) => {
                  if (value === null || value === undefined || value === '') return null;
                  return (
                    <View key={key} className="flex-col">
                      <Text className="text-xs font-worksans-medium text-gray-500 mb-1">
                        {formatFormResponseLabel(key)}
                      </Text>
                      <Text className="text-sm font-worksans capitalize" style={{ color: '#30352D' }}>
                        {formatFormResponseValue(key, value, estimatedHours)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Pricing (read-only) */}
          <View className="bg-white rounded-lg border border-gray-200 p-4">
            <Text className="text-xs font-worksans-medium text-gray-500 mb-3">PRICING</Text>
            <View className="flex-row justify-between mb-1">
              <Text className="text-sm font-worksans" style={{ color: '#6B7280' }}>Hourly Rate:</Text>
              <Text className="text-sm font-worksans" style={{ color: '#30352D' }}>
                £{(booking.hourly_rate_cents / 100).toFixed(2)}/hr
              </Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-sm font-worksans" style={{ color: '#6B7280' }}>Estimated Hours:</Text>
              <Text className="text-sm font-worksans" style={{ color: '#30352D' }}>
                {booking.estimated_hours}h
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="px-5 py-4 border-t border-gray-200 bg-white">
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

      {/* Schedule Picker Modal */}
      {booking.handy_id && (
        <ScheduleSelectionSheet
          isOpen={showSchedulePicker}
          onClose={() => setShowSchedulePicker(false)}
          onSelectSchedule={handleScheduleSelect}
          taskerName={taskerName}
          taskerId={booking.handy_id}
        />
      )}
    </SafeAreaView>
  );
}
