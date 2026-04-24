import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button, ButtonText } from '@/components/ui/button';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
} from '@/components/ui/modal';
import { Plus, ChevronLeft, Trash2 } from 'lucide-react-native';
import { TimePickerWheel } from '@/components/availability';
import {
  useWeeklyAvailability,
  useDeleteAvailabilitySlot,
  useReplaceAvailabilitySlots,
  type AvailabilitySlot,
  type RecurrenceType,
} from '@shared/supabase';
import { useToast } from '@/components/ui/toast';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  recurrenceType: RecurrenceType;
  startsOn: string;
}

interface DayAvailability {
  [dayIndex: number]: TimeSlot[];
}

// Day names for weekly availability (index matches day_of_week in database: 0=Sunday)
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const REPEAT_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

function formatDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get current week dates dynamically
const getCurrentWeekDates = () => {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  return DAY_NAMES.map((short, i) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    return {
      short,
      date: date.getDate().toString(),
      dateValue: formatDateOnly(date),
    };
  });
};

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

const HOUR_HEIGHT = 60;
const START_HOUR = 0; // 12 AM
const END_HOUR = 24; // 12 AM next day

// Helper to convert time string "HH:MM" to minutes from start of day
const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// Helper to check if two time ranges overlap
const isOverlapping = (start1: number, end1: number, start2: number, end2: number) => {
  return Math.max(start1, start2) < Math.min(end1, end2);
};

export default function SetAvailability() {
  const toast = useToast();
  const [selectedDay, setSelectedDay] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [startHour, setStartHour] = useState('18');
  const [startMinute, setStartMinute] = useState('15');
  const [endHour, setEndHour] = useState('20');
  const [endMinute, setEndMinute] = useState('45');
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [repeatDays, setRepeatDays] = useState<Set<number>>(
    () => new Set([0]),
  );
  const [availability, setAvailability] = useState<DayAvailability>({});
  const [deletingSlots, setDeletingSlots] = useState<Set<string>>(new Set());

  // Get current week dates
  const daysOfWeek = useMemo(() => getCurrentWeekDates(), []);

  // Query hooks for persistence
  const { data: weeklyData, isLoading: isLoadingAvailability } = useWeeklyAvailability();
  const deleteAvailabilityMutation = useDeleteAvailabilitySlot();
  const replaceAvailabilityMutation = useReplaceAvailabilitySlots();

  // Load existing availability from database
  useEffect(() => {
    if (weeklyData) {
      const transformed: DayAvailability = {};

      Object.entries(weeklyData).forEach(([dayIndex, slots]) => {
        transformed[parseInt(dayIndex)] = (slots as AvailabilitySlot[]).map((slot: AvailabilitySlot) => ({
          id: slot.id,
          startTime: slot.start_time.slice(0, 5), // "HH:MM:SS" -> "HH:MM"
          endTime: slot.end_time.slice(0, 5),
          recurrenceType: slot.recurrence_type ?? 'weekly',
          startsOn: slot.starts_on ?? daysOfWeek[parseInt(dayIndex)]?.dateValue ?? formatDateOnly(new Date()),
        }));
      });

      setAvailability(transformed);
    }
  }, [daysOfWeek, weeklyData]);

  const currentDaySlots = useMemo(
    () => availability[selectedDay] || [],
    [availability, selectedDay],
  );

  // Calculate current selection in minutes
  const selectionStart = parseInt(startHour) * 60 + parseInt(startMinute);
  const selectionEnd = parseInt(endHour) * 60 + parseInt(endMinute);
  const selectedDateValue =
    daysOfWeek[selectedDay]?.dateValue ?? formatDateOnly(new Date());

  // Check for overlaps
  const overlappingSlots = useMemo(() => {
    if (!showAddModal) return [];
    return currentDaySlots.filter(slot => {
      const slotStart = timeToMinutes(slot.startTime);
      const slotEnd = timeToMinutes(slot.endTime);
      const sameScope = repeatWeekly
        ? slot.recurrenceType === 'weekly'
        : slot.recurrenceType !== 'weekly' && slot.startsOn === selectedDateValue;
      return (
        sameScope &&
        isOverlapping(selectionStart, selectionEnd, slotStart, slotEnd)
      );
    });
  }, [showAddModal, currentDaySlots, repeatWeekly, selectedDateValue, selectionStart, selectionEnd]);

  const isMerge = overlappingSlots.length > 0;

  const handleRepeatWeeklyChange = (value: boolean) => {
    setRepeatWeekly(value);
    if (value) {
      setRepeatDays((prev) =>
        prev.size > 0 ? prev : new Set([selectedDay]),
      );
    }
  };

  const toggleRepeatDay = (dayIndex: number) => {
    setRepeatDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayIndex)) {
        next.delete(dayIndex);
      } else {
        next.add(dayIndex);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (selectionEnd <= selectionStart) {
      toast.error('Invalid time', 'End time must be after start time');
      return;
    }

    const targetDays = repeatWeekly
      ? REPEAT_DAY_ORDER.filter((dayIndex) => repeatDays.has(dayIndex))
      : [selectedDay];

    if (repeatWeekly && targetDays.length === 0) {
      toast.error('Missing weekdays', 'Select at least one weekday');
      return;
    }

    const formatTime = (mins: number) => {
      const h = Math.floor(mins / 60).toString().padStart(2, '0');
      const m = (mins % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    const previousByDay: DayAvailability = {};
    const nextByDay: DayAvailability = {};
    const slotsToDelete: TimeSlot[] = [];
    const slotsToCreate: {
      dayIndex: number;
      slot: TimeSlot;
    }[] = [];

    targetDays.forEach((dayIndex) => {
      const daySlots = availability[dayIndex] || [];
      previousByDay[dayIndex] = [...daySlots];

      let newStart = selectionStart;
      let newEnd = selectionEnd;
      const dayOverlaps = daySlots.filter((slot) => {
        const slotStart = timeToMinutes(slot.startTime);
        const slotEnd = timeToMinutes(slot.endTime);
        const sameScope = repeatWeekly
          ? slot.recurrenceType === 'weekly'
          : slot.recurrenceType !== 'weekly' && slot.startsOn === selectedDateValue;
        return (
          sameScope &&
          isOverlapping(selectionStart, selectionEnd, slotStart, slotEnd)
        );
      });

      dayOverlaps.forEach(slot => {
        newStart = Math.min(newStart, timeToMinutes(slot.startTime));
        newEnd = Math.max(newEnd, timeToMinutes(slot.endTime));
      });

      const optimisticSlot: TimeSlot = {
        id: `pending-${Date.now()}-${dayIndex}`,
        startTime: formatTime(newStart),
        endTime: formatTime(newEnd),
        recurrenceType: repeatWeekly ? 'weekly' : 'none',
        startsOn:
          daysOfWeek[dayIndex]?.dateValue ?? selectedDateValue,
      };

      nextByDay[dayIndex] = [
        ...daySlots.filter(slot => !dayOverlaps.includes(slot)),
        optimisticSlot,
      ];
      slotsToDelete.push(...dayOverlaps);
      slotsToCreate.push({ dayIndex, slot: optimisticSlot });
    });

    setAvailability((prev) => ({
      ...prev,
      ...nextByDay,
    }));

    setShowAddModal(false);

    try {
      await replaceAvailabilityMutation.mutateAsync({
        deleteSlotIds: slotsToDelete.map((slot) => slot.id),
        slots: slotsToCreate.map(({ dayIndex, slot }) => ({
          dayIndex,
          slot: {
            startTime: slot.startTime,
            endTime: slot.endTime,
          },
          startsOn: slot.startsOn,
          recurrenceType: slot.recurrenceType,
        })),
      });
      toast.success('Saved', 'Availability updated');
    } catch (error) {
      console.error('Failed to save availability:', error);
      setAvailability((prev) => ({
        ...prev,
        ...previousByDay,
      }));
      toast.error(
        'Save failed',
        error instanceof Error ? error.message : 'Please try again'
      );
    }
  };

  const removeTimeSlot = (slotId: string) => {
    // Track loading state for this slot
    setDeletingSlots(prev => new Set(prev).add(slotId));

    // Capture previous state for rollback
    const previousSlots = availability[selectedDay] || [];
    const newSlots = previousSlots.filter((slot) => slot.id !== slotId);

    // Update local state (optimistic update)
    setAvailability((prev) => ({
      ...prev,
      [selectedDay]: newSlots,
    }));

    deleteAvailabilityMutation.mutate(
      slotId,
      {
        onSettled: () => {
          // Clear loading state when done (success or error)
          setDeletingSlots(prev => {
            const next = new Set(prev);
            next.delete(slotId);
            return next;
          });
        },
        onError: (error) => {
          console.error('Failed to remove slot:', error);
          // Rollback to previous state on error
          setAvailability((prev) => ({
            ...prev,
            [selectedDay]: previousSlots,
          }));
        },
      }
    );
  };

  const handleOpenModal = () => {
    setStartHour('09');
    setStartMinute('00');
    setEndHour('17');
    setEndMinute('00');
    setRepeatWeekly(false);
    setRepeatDays(new Set([selectedDay]));
    setShowAddModal(true);
  };

  if (isLoadingAvailability) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#047857" />
          <Text className="text-brand-dark-alt text-lg mt-4">Loading availability...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#F0F0F0] bg-white z-10">
        <Pressable onPress={() => router.push('/(professional)/(tabs)/dashboard')}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-[18px] text-brand-dark-alt">
          Set Availability
        </Text>
        <View className="w-7" />
      </View>

      {/* Days Selector */}
      <View className="flex-row px-5 py-4 gap-2 bg-white z-10">
        {daysOfWeek.map((day, index) => (
          <Pressable
            key={day.short}
            onPress={() => setSelectedDay(index)}
            className={`flex-1 items-center py-3 rounded-lg ${selectedDay === index ? 'bg-emerald-700' : 'bg-transparent'
              }`}
          >
            <Text
              className={`font-worksans text-[11px] mb-1 ${selectedDay === index ? 'text-white' : 'text-[#6B6B6B]'
                }`}
            >
              {day.short}
            </Text>
            <Text
              className={`font-worksans-semibold text-[14px] ${selectedDay === index ? 'text-white' : 'text-brand-dark-alt'
                }`}
            >
              {day.date}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Timeline View */}
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT + 50 }}>
        <View className="flex-row flex-1">
          {/* Time Labels */}
          <View className="w-16 border-r border-gray-100 bg-white">
            {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => {
              const hour = i + START_HOUR;
              const displayHour = hour === 0 || hour === 24 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
              return (
                <View key={i} style={{ height: HOUR_HEIGHT, justifyContent: 'flex-start' }} className="items-end pr-2 pt-2">
                  <Text className="text-xs text-gray-400 font-worksans">{displayHour}</Text>
                </View>
              );
            })}
          </View>

          {/* Grid and Slots */}
          <View className="flex-1 relative">
            {/* Horizontal Grid Lines */}
            {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  top: i * HOUR_HEIGHT,
                  left: 0,
                  right: 0,
                  height: 1,
                  backgroundColor: '#F3F4F6',
                  borderStyle: 'dashed',
                  borderWidth: 1,
                  borderColor: '#E5E7EB'
                }}
              />
            ))}

            {/* Existing Slots */}
            {currentDaySlots.map((slot) => {
              const startMins = timeToMinutes(slot.startTime);
              const endMins = timeToMinutes(slot.endTime);
              const top = (startMins / 60) * HOUR_HEIGHT;
              const height = ((endMins - startMins) / 60) * HOUR_HEIGHT;
              const durationMins = Math.max(0, endMins - startMins);
              const isCompact = durationMins < 45 || height < 48;

              return (
                <View
                  key={slot.id}
                  style={{
                    position: 'absolute',
                    top,
                    height,
                    left: 10,
                    right: 10,
                  }}
                  className={`bg-[#5FA08E] rounded-lg overflow-hidden shadow-sm ${isCompact ? 'px-2 py-1' : 'p-2'}`}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 min-w-0 pr-2">
                      {isCompact ? (
                        <Text
                          className="text-white font-worksans-bold text-sm"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          Available · {slot.startTime}–{slot.endTime}
                        </Text>
                      ) : (
                        <>
                          <Text className="text-white font-worksans-bold text-sm">Available</Text>
                          <Text className="text-white font-worksans text-xs opacity-90">
                            {slot.startTime} - {slot.endTime}
                          </Text>
                          <Text className="text-white font-worksans text-[10px] opacity-80">
                            {slot.recurrenceType === 'weekly' ? 'Repeats weekly' : 'One-time'}
                          </Text>
                        </>
                      )}
                    </View>
                    <Pressable
                      onPress={() => removeTimeSlot(slot.id)}
                      disabled={deletingSlots.has(slot.id)}
                      className="bg-white/20 rounded-full p-1"
                    >
                      {deletingSlots.has(slot.id) ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Trash2 size={14} color="white" />
                      )}
                    </Pressable>
                  </View>
                </View>
              );
            })}

            {/* Preview Slot (when modal is open) */}
            {showAddModal && selectionEnd > selectionStart && (
              <View
                style={{
                  position: 'absolute',
                  top: (selectionStart / 60) * HOUR_HEIGHT,
                  height: ((selectionEnd - selectionStart) / 60) * HOUR_HEIGHT,
                  left: 10,
                  right: 10,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  borderColor: '#047857',
                  backgroundColor: 'rgba(4, 120, 87, 0.1)',
                }}
                className="rounded-lg justify-center items-center"
              >
                <Text className="text-emerald-700 font-worksans-bold">
                  {isMerge ? 'Merging...' : 'New Slot'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <Pressable
        onPress={handleOpenModal}
        className="absolute bottom-8 right-6 w-[56px] h-[56px] bg-emerald-700 rounded-full items-center justify-center shadow-lg"
      >
        <Plus color="white" size={28} strokeWidth={2} />
      </Pressable>

      {/* Add Availability Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} size="full">
        <ModalBackdrop />
        <ModalContent className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-0 m-0 max-w-none w-full">
          <View className="flex-col p-6">
            {/* Modal Header */}
            <View className="flex-col items-center mb-6">
              <View className="w-12 h-1 bg-[#E5E5E5] rounded-full mb-4" />
              <Text className="font-worksans-bold text-[20px] text-brand-dark-alt">
                Add Availability
              </Text>
            </View>

            {/* Time Display */}
            <View className="flex-row items-center justify-center gap-3 mb-6">
              <View className="px-6 py-3 rounded-lg bg-brand-cream">
                <Text className="font-worksans-semibold text-[20px] text-brand-dark-alt">
                  {startHour}:{startMinute}
                </Text>
              </View>
              <Text className="font-worksans text-[16px] text-[#6B6B6B]">to</Text>
              <View className="px-6 py-3 rounded-lg bg-[#F5F5F5]">
                <Text className="font-worksans-semibold text-[20px] text-brand-dark-alt">
                  {endHour}:{endMinute}
                </Text>
              </View>
            </View>

            {/* Time Picker Wheels */}
            <View className="flex-row items-center justify-center gap-6 mb-8">
              {/* Start Time Pickers */}
              <View className="flex-col items-center gap-2">
                <TimePickerWheel
                  values={HOURS}
                  selectedValue={startHour}
                  onValueChange={setStartHour}
                />
              </View>
              <View className="flex-col items-center gap-2">
                <TimePickerWheel
                  values={MINUTES}
                  selectedValue={startMinute}
                  onValueChange={setStartMinute}
                />
              </View>

              {/* End Time Pickers */}
              <View className="flex-col items-center gap-2">
                <TimePickerWheel
                  values={HOURS}
                  selectedValue={endHour}
                  onValueChange={setEndHour}
                />
              </View>
              <View className="flex-col items-center gap-2">
                <TimePickerWheel
                  values={MINUTES}
                  selectedValue={endMinute}
                  onValueChange={setEndMinute}
                />
              </View>
            </View>

            {/* Recurrence */}
            <View className="mb-6 rounded-xl border border-[#E5E7EB] px-4 py-3">
              <View className="flex-row items-center justify-between gap-4">
                <View className="flex-1">
                  <Text className="font-worksans-semibold text-[15px] text-brand-dark-alt">
                    Repeat weekly
                  </Text>
                  <Text className="font-worksans text-[13px] text-[#6B6B6B] mt-1">
                    {repeatWeekly
                      ? 'This availability will repeat every week on the selected days.'
                      : 'This availability will only be added for this date.'}
                  </Text>
                </View>
                <Switch
                  value={repeatWeekly}
                  onValueChange={handleRepeatWeeklyChange}
                  trackColor={{ false: '#D1D5DB', true: '#A7D8C8' }}
                  thumbColor={repeatWeekly ? '#047857' : '#F9FAFB'}
                />
              </View>
              {repeatWeekly && (
                <View className="flex-row flex-wrap gap-2 mt-4">
                  {REPEAT_DAY_ORDER.map((dayIndex) => {
                    const selected = repeatDays.has(dayIndex);
                    return (
                      <Pressable
                        key={dayIndex}
                        onPress={() => toggleRepeatDay(dayIndex)}
                        className={`px-3 py-2 rounded-full border ${
                          selected
                            ? 'bg-emerald-700 border-emerald-700'
                            : 'bg-white border-[#D1D5DB]'
                        }`}
                      >
                        <Text
                          className={`font-worksans-semibold text-[13px] ${
                            selected ? 'text-white' : 'text-brand-dark-alt'
                          }`}
                        >
                          {DAY_NAMES[dayIndex]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Buttons */}
            <View className="flex-col gap-4">
              <Button
                onPress={handleSave}
                disabled={replaceAvailabilityMutation.isPending}
                className={`rounded-full ${isMerge ? 'bg-emerald-700' : 'bg-brand-terracotta'}`}
              >
                <ButtonText className="font-worksans-semibold text-white text-[16px]">
                  {replaceAvailabilityMutation.isPending
                    ? 'Saving...'
                    : isMerge
                      ? 'Merge availability'
                      : 'Add Availability'}
                </ButtonText>
              </Button>

              <Pressable
                onPress={() => setShowAddModal(false)}
                className="items-center py-3"
              >
                <Text className="font-worksans-semibold text-[16px] text-brand-terracotta">
                  Discard
                </Text>
              </Pressable>
            </View>
          </View>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
