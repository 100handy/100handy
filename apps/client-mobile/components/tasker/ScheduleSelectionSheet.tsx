import React, { useState, useMemo, useEffect } from 'react';
import { useAvailabilityByUserId, type AvailabilitySlot } from '@shared/query';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native'; import { ChevronDown, Check, AlertCircle } from 'lucide-react-native'; import {   Modal, ModalBackdrop, ModalContent, } from '@/components/ui/modal'; import { doesAvailabilitySlotApplyToDate } from '@shared/query';

interface ScheduleSelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSchedule: (date: string, time: string) => void;
  taskerName: string;
  taskerId: string;
}

interface DateOption {
  label: string;
  value: string;
}

/**
 * Generate hourly time slots between start and end times
 * @param startTime - Start time in "HH:MM:SS" or "HH:MM" format
 * @param endTime - End time in "HH:MM:SS" or "HH:MM" format
 * @returns Array of time strings in "HH:MM" format
 */
function generateHourlySlots(startTime: string, endTime: string): string[] {
  const slots: string[] = [];
  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);

  // Generate slots from start hour to end hour (exclusive)
  for (let hour = startHour!; hour < endHour!; hour++) {
    slots.push(`${hour}:00`);
  }

  return slots;
}

export function ScheduleSelectionSheet({
  isOpen,
  onClose,
  onSelectSchedule,
  taskerName,
  taskerId,
}: ScheduleSelectionSheetProps) {
  // Fetch tasker's availability from database
  const { data: availability, isLoading: availabilityLoading } = useAvailabilityByUserId(taskerId);

  // Generate date options with availability info
  const dateOptions = useMemo(() => {
    const options: DateOption[] = [];

    for (let i = 0; i < 14; i++) { // Show 2 weeks
      const date = new Date();
      date.setDate(date.getDate() + i);

      let label: string;
      if (i === 0) {
        label = 'Today';
      } else if (i === 1) {
        label = 'Tomorrow';
      } else {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const day = date.getDate();
        label = `${dayName}, ${monthName} ${day}`;
      }

      // Format as YYYY-MM-DD for database
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const value = `${year}-${month}-${day}`;

      options.push({ label, value });
    }

    return options;
  }, []);

  // Get time slots for the selected date based on tasker's availability
  const getTimeSlotsForDate = (dateStr: string): string[] => {
    if (!availability || availability.length === 0) {
      // No availability set - show no time slots
      return [];
    }

    const daySlots = availability.filter((slot: AvailabilitySlot) =>
      doesAvailabilitySlotApplyToDate(slot, dateStr),
    );

    if (daySlots.length === 0) {
      return [];
    }

    // Generate all hourly slots from all availability windows
    const allSlots: string[] = [];
    daySlots.forEach((slot: AvailabilitySlot) => {
      const hourlySlots = generateHourlySlots(slot.start_time, slot.end_time);
      allSlots.push(...hourlySlots);
    });

    // Remove duplicates and sort
    return [...new Set(allSlots)].sort((a, b) => {
      const hourA = parseInt(a.split(':')[0]!, 10);
      const hourB = parseInt(b.split(':')[0]!, 10);
      return hourA - hourB;
    });
  };

  // Check if a date has any availability
  const hasAvailabilityForDate = (dateStr: string): boolean => {
    return getTimeSlotsForDate(dateStr).length > 0;
  };

  // Find the first available date
  const firstAvailableDate = useMemo(() => {
    if (!availability || availability.length === 0) {
      return null;
    }
    for (const option of dateOptions) {
      if (hasAvailabilityForDate(option.value)) {
        return option.value;
      }
    }
    return null;
  }, [dateOptions, availability]);

  // Default to first available date, or tomorrow if no availability
  const defaultDate = useMemo(() => {
    if (firstAvailableDate) {
      return firstAvailableDate;
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [firstAvailableDate]);

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Get time slots for selected date
  const timeSlots = useMemo(() => {
    return getTimeSlotsForDate(selectedDate);
  }, [selectedDate, availability]);

  // Auto-select first available time when date changes
  useEffect(() => {
    if (timeSlots.length > 0 && (!selectedTime || !timeSlots.includes(selectedTime))) {
      setSelectedTime(timeSlots[0]!);
    } else if (timeSlots.length === 0) {
      setSelectedTime(null);
    }
  }, [timeSlots]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && firstAvailableDate) {
      setSelectedDate(firstAvailableDate);
    }
  }, [isOpen, firstAvailableDate]);

  const handleConfirm = () => {
    if (!selectedTime) return; // Prevent confirmation without time
    onSelectSchedule(selectedDate, selectedTime);
    onClose();
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowTimePicker(false);
  };

  // Find the label for the selected date
  const selectedDateLabel = dateOptions.find(opt => opt.value === selectedDate)?.label || 'Tomorrow';

  // Check if we have no availability at all
  const hasNoAvailability = !availabilityLoading && (!availability || availability.length === 0);
  const noSlotsForSelectedDate = !availabilityLoading && timeSlots.length === 0 && !hasNoAvailability;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent
        size="full"
        style={{
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '60%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          margin: 0,
          marginHorizontal: 0,
          padding: 0,
        }}
      >
        {availabilityLoading ? (
          // Loading state
          <View className="w-full px-5 py-12 flex-col items-center justify-center">
            <ActivityIndicator size="large" color="#C1856A" />
            <Text className="text-sm text-gray-600 mt-3">Loading availability...</Text>
          </View>
        ) : hasNoAvailability ? (
          // No availability set by tasker
          <View className="w-full px-5 py-8 flex-col items-center">
            <AlertCircle size={48} color="#9CA3AF" strokeWidth={1.5} />
            <Text className="text-lg font-semibold text-[#30352D] mt-4 text-center">
              No Availability Set
            </Text>
            <Text className="text-sm text-gray-600 mt-2 text-center">
              {taskerName} hasn't set their availability yet. Please try another pro or contact them directly.
            </Text>
            <Pressable
              onPress={onClose}
              className="mt-6 px-8 py-3 rounded-full"
              style={{ backgroundColor: '#E5E7EB' }}
            >
              <Text className="text-base font-medium text-[#30352D]">Go Back</Text>
            </Pressable>
          </View>
        ) : !showDatePicker && !showTimePicker ? (
          <View className="w-full px-5 pt-6 pb-6 flex-col">
            {/* Header */}
            <View className="mb-6 flex-col">
              <Text className="text-xl font-bold text-[#30352D]">
                {taskerName}'s Schedule
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Showing available times only
              </Text>
            </View>

            {/* Date and Time Selects */}
            <View className="gap-3 mb-4 flex-row">
              {/* Date Select */}
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="flex-1"
                style={{
                  height: 48,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text className="text-sm font-medium text-[#30352D]">
                  {selectedDateLabel}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </Pressable>

              {/* Time Select */}
              <Pressable
                onPress={() => timeSlots.length > 0 && setShowTimePicker(true)}
                className="flex-1"
                style={{
                  height: 48,
                  backgroundColor: timeSlots.length > 0 ? '#FFFFFF' : '#F3F4F6',
                  borderWidth: 1,
                  borderColor: timeSlots.length > 0 ? '#D1D5DB' : '#E5E7EB',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: timeSlots.length > 0 ? 1 : 0.7,
                }}
              >
                <Text className={`text-sm font-medium ${timeSlots.length > 0 ? 'text-[#30352D]' : 'text-gray-400'}`}>
                  {selectedTime || 'No times'}
                </Text>
                <ChevronDown size={20} color={timeSlots.length > 0 ? '#6B7280' : '#9CA3AF'} />
              </Pressable>
            </View>

            {/* No availability message for selected date */}
            {noSlotsForSelectedDate && (
              <View className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200 flex-row items-center">
                <AlertCircle size={18} color="#D97706" strokeWidth={2} />
                <Text className="text-sm text-amber-700 ml-2 flex-1">
                  {taskerName} is not available on this day. Please select another date.
                </Text>
              </View>
            )}

            {/* Select & Continue Button */}
            <Pressable
              onPress={handleConfirm}
              disabled={!selectedTime}
              className="w-full py-4 rounded-full items-center"
              style={{
                backgroundColor: selectedTime ? '#C1856A' : '#E5E7EB',
              }}
            >
              <Text className={`text-base font-semibold ${selectedTime ? 'text-white' : 'text-gray-400'}`}>
                Select & Continue
              </Text>
            </Pressable>
          </View>
        ) : showDatePicker ? (
          <View className="w-full flex-col">
            {/* Date Picker Header */}
            <View className="px-5 pt-6 pb-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-[#30352D]">
                Select Date
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Green dot = Available times
              </Text>
            </View>

            {/* Date Options */}
            <ScrollView className="flex-1" style={{ maxHeight: 350 }}>
              {dateOptions.map((option) => {
                const isSelected = selectedDate === option.value;
                const isAvailable = hasAvailabilityForDate(option.value);
                const slotsCount = getTimeSlotsForDate(option.value).length;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => handleDateSelect(option.value)}
                    style={{
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E5E7EB',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isSelected ? '#F9FAFB' : 'transparent',
                    }}
                  >
                    <View className="flex-row items-center flex-1">
                      {/* Availability indicator */}
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: isAvailable ? '#22C55E' : '#E5E7EB',
                          marginRight: 12,
                        }}
                      />
                      <View className="flex-1">
                        <Text
                          className="text-base"
                          style={{
                            color: isAvailable ? '#333A31' : '#9CA3AF',
                            fontWeight: isSelected ? '600' : '400',
                          }}
                        >
                          {option.label}
                        </Text>
                        {isAvailable && (
                          <Text className="text-xs text-gray-500 mt-0.5">
                            {slotsCount} {slotsCount === 1 ? 'slot' : 'slots'} available
                          </Text>
                        )}
                        {!isAvailable && (
                          <Text className="text-xs text-gray-400 mt-0.5">
                            Not available
                          </Text>
                        )}
                      </View>
                    </View>
                    {isSelected && (
                      <Check size={20} color="#333A31" strokeWidth={2.5} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View className="w-full flex-col">
            {/* Time Picker Header */}
            <View className="px-5 pt-6 pb-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-[#30352D]">
                Select Time
              </Text>
            </View>

            {/* Time Options */}
            <ScrollView className="flex-1" style={{ maxHeight: 300 }}>
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <Pressable
                    key={time}
                    onPress={() => handleTimeSelect(time)}
                    style={{
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E5E7EB',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      className="text-base"
                      style={{
                        color: '#333A31',
                        fontWeight: isSelected ? '600' : '400',
                      }}
                    >
                      {time}
                    </Text>
                    {isSelected && (
                      <Check size={20} color="#333A31" strokeWidth={2.5} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}
      </ModalContent>
    </Modal>
  );
}
