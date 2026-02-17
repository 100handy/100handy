import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
} from '@/components/ui/modal';
import { Plus, Trash2 } from 'lucide-react-native';
import { toast } from 'sonner-native';
import { TimePickerWheel } from '@/components/availability';
import {
  useWeeklyAvailability,
  useSaveDayAvailability,
  type TimeSlotInput,
  type AvailabilitySlot,
} from '@shared/supabase';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface DayAvailability {
  [dayIndex: number]: TimeSlot[];
}

// Day names for weekly availability (index matches day_of_week in database: 0=Sunday)
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

export default function BookingsTab() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [showAddModal, setShowAddModal] = useState(false);
  const [startHour, setStartHour] = useState('18');
  const [startMinute, setStartMinute] = useState('15');
  const [endHour, setEndHour] = useState('20');
  const [endMinute, setEndMinute] = useState('45');
  const [availability, setAvailability] = useState<DayAvailability>({});
  const [deletingSlots, setDeletingSlots] = useState<Set<string>>(new Set());

  // Get current week dates
  const daysOfWeek = useMemo(() => getCurrentWeekDates(), []);

  // Query hooks for persistence
  const { data: weeklyData, isLoading: isLoadingAvailability } = useWeeklyAvailability();
  const { mutate: saveDayMutation, isPending: isSaving } = useSaveDayAvailability();

  // Load existing availability from database
  useEffect(() => {
    if (weeklyData) {
      const transformed: DayAvailability = {};

      Object.entries(weeklyData).forEach(([dayIndex, slots]) => {
        transformed[parseInt(dayIndex)] = (slots as AvailabilitySlot[]).map((slot: AvailabilitySlot) => ({
          id: slot.id,
          startTime: slot.start_time.slice(0, 5), // "HH:MM:SS" -> "HH:MM"
          endTime: slot.end_time.slice(0, 5),
        }));
      });

      setAvailability(transformed);
    }
  }, [weeklyData]);

  const currentDaySlots = availability[selectedDay] || [];

  // Calculate current selection in minutes
  const selectionStart = parseInt(startHour) * 60 + parseInt(startMinute);
  const selectionEnd = parseInt(endHour) * 60 + parseInt(endMinute);

  // Check for overlaps
  const overlappingSlots = useMemo(() => {
    if (!showAddModal) return [];
    return currentDaySlots.filter(slot => {
      const slotStart = timeToMinutes(slot.startTime);
      const slotEnd = timeToMinutes(slot.endTime);
      return isOverlapping(selectionStart, selectionEnd, slotStart, slotEnd);
    });
  }, [showAddModal, currentDaySlots, selectionStart, selectionEnd]);

  const isMerge = overlappingSlots.length > 0;

  const handleSave = () => {
    if (selectionEnd <= selectionStart) {
      toast.error('End time must be after start time. Overnight slots are not supported.');
      return;
    }

    // Minimum 30-minute slot
    if (selectionEnd - selectionStart < 30) {
      toast.error('Availability must be at least 30 minutes');
      return;
    }

    // Capture previous state for rollback
    const previousSlots = [...currentDaySlots];
    let newSlots = [...currentDaySlots];

    if (isMerge) {
      // Merge logic: Find min start and max end of all overlapping slots + new slot
      let minStart = selectionStart;
      let maxEnd = selectionEnd;

      overlappingSlots.forEach(slot => {
        minStart = Math.min(minStart, timeToMinutes(slot.startTime));
        maxEnd = Math.max(maxEnd, timeToMinutes(slot.endTime));
      });

      // Remove overlapping slots
      newSlots = newSlots.filter(slot => !overlappingSlots.includes(slot));

      // Add merged slot
      const formatTime = (mins: number) => {
        const h = Math.floor(mins / 60).toString().padStart(2, '0');
        const m = (mins % 60).toString().padStart(2, '0');
        return `${h}:${m}`;
      };

      newSlots.push({
        id: Date.now().toString(),
        startTime: formatTime(minStart),
        endTime: formatTime(maxEnd),
      });
    } else {
      // Add new slot
      newSlots.push({
        id: Date.now().toString(),
        startTime: `${startHour}:${startMinute}`,
        endTime: `${endHour}:${endMinute}`,
      });
    }

    // Update local state immediately for UI (optimistic update)
    setAvailability((prev) => ({
      ...prev,
      [selectedDay]: newSlots,
    }));

    // Persist to database
    const slotsForDB: TimeSlotInput[] = newSlots.map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    saveDayMutation(
      { dayIndex: selectedDay, slots: slotsForDB },
      {
        onSuccess: () => {
          toast.success(isMerge ? 'Availability merged' : 'Availability added');
        },
        onError: (error) => {
          console.error('Failed to save availability:', error);
          toast.error('Failed to save. Please try again.');
          // Rollback to previous state on error
          setAvailability((prev) => ({
            ...prev,
            [selectedDay]: previousSlots,
          }));
        },
      }
    );

    setShowAddModal(false);
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

    // Persist to database
    const slotsForDB: TimeSlotInput[] = newSlots.map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    saveDayMutation(
      { dayIndex: selectedDay, slots: slotsForDB },
      {
        onSuccess: () => {
          toast.success('Slot removed');
        },
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
          toast.error('Failed to remove slot');
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
    setShowAddModal(true);
  };

  if (isLoadingAvailability) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#047857" />
          <Text className="text-[#30352D] text-lg mt-4 font-worksans">Loading availability...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <SafeAreaView edges={['top']} className="bg-white z-10">
        <View className="px-6 py-4 flex-row items-center justify-center">
          <Text className="text-[#30352D] text-lg font-worksans-bold">
            Set Availability
          </Text>
        </View>
      </SafeAreaView>

      {/* Days Selector */}
      <View className="flex-row px-5 py-4 gap-2 bg-white z-10">
        {daysOfWeek.map((day, index) => (
          <Pressable
            key={day.short}
            onPress={() => setSelectedDay(index)}
            className={`flex-1 items-center py-3 rounded-lg ${selectedDay === index ? 'bg-[#047857]' : 'bg-transparent'
              }`}
          >
            <Text
              className={`font-worksans text-[11px] mb-1 ${selectedDay === index ? 'text-white' : 'text-[#6B6B6B]'
                }`}
            >
              {day.short}
            </Text>
            <Text
              className={`font-worksans-semibold text-[14px] ${selectedDay === index ? 'text-white' : 'text-[#30352D]'
                }`}
            >
              {day.date}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Timeline View */}
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT + 50, paddingBottom: 100 }}>
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
                  className="bg-[#5FA08E] rounded-lg p-2 overflow-hidden shadow-sm"
                >
                  <View className="flex-row justify-between items-start">
                    <View>
                      <Text className="text-white font-worksans-bold text-sm">Available</Text>
                      <Text className="text-white font-worksans text-xs opacity-90">
                        {slot.startTime} - {slot.endTime}
                      </Text>
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
                <Text className="text-[#047857] font-worksans-bold">
                  {isMerge ? 'Merging...' : 'New Slot'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Button - positioned above tab bar */}
      <Pressable
        onPress={handleOpenModal}
        className="absolute bottom-[100px] right-6 w-[56px] h-[56px] bg-[#047857] rounded-full items-center justify-center shadow-lg"
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
              <Text className="font-worksans-bold text-[20px] text-[#30352D]">
                Add Availability
              </Text>
            </View>

            {/* Time Display */}
            <View className="flex-row items-center justify-center gap-3 mb-6">
              <View className="px-6 py-3 rounded-lg bg-[#F5E6DC]">
                <Text className="font-worksans-semibold text-[20px] text-[#30352D]">
                  {startHour}:{startMinute}
                </Text>
              </View>
              <Text className="font-worksans text-[16px] text-[#6B6B6B]">to</Text>
              <View className="px-6 py-3 rounded-lg bg-[#F5F5F5]">
                <Text className="font-worksans-semibold text-[20px] text-[#30352D]">
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

            {/* Buttons */}
            <View className="flex-col gap-4">
              <Button
                onPress={handleSave}
                className={`rounded-full ${isMerge ? 'bg-[#047857]' : 'bg-[#D17852]'}`}
              >
                <ButtonText className="font-worksans-semibold text-white text-[16px]">
                  {isMerge ? 'Merge availability' : 'Add Availability'}
                </ButtonText>
              </Button>

              <Pressable
                onPress={() => setShowAddModal(false)}
                className="items-center py-3"
              >
                <Text className="font-worksans-semibold text-[16px] text-[#D17852]">
                  Discard
                </Text>
              </Pressable>
            </View>
          </View>
        </ModalContent>
      </Modal>
    </View>
  );
}
