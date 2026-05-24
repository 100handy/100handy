import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDeleteAvailabilitySlot, useReplaceAvailabilitySlots, type AvailabilitySlot, type RecurrenceType } from '@shared/query';
import { ScrollView, View, Text, Pressable, Dimensions, ActivityIndicator, Switch, NativeSyntheticEvent, NativeScrollEvent, PanResponder } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { router } from 'expo-router'; import { Button, ButtonText } from '@/components/ui/button'; import {   Modal, ModalBackdrop, ModalContent, } from '@/components/ui/modal'; import { Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react-native'; import { TimePickerWheel } from '@/components/availability'; import { useWeeklyAvailability } from '@shared/query';
import { useToast } from '@/components/ui/toast';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

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
const SCREEN_WIDTH = Dimensions.get('window').width;
const WEEK_OFFSETS = Array.from({ length: 105 }, (_, index) => index - 52);

function formatDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfWeek(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function getWeekDates(weekOffset: number) {
  const baseSunday = startOfWeek(new Date());
  const sunday = addDays(baseSunday, weekOffset * 7);

  return DAY_NAMES.map((short, i) => {
    const date = addDays(sunday, i);
    return {
      short,
      date: date.getDate().toString(),
      dateValue: formatDateOnly(date),
      fullDate: date,
      key: `${formatDateOnly(date)}-${short}`,
    };
  });
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

const HOUR_HEIGHT = 60;
const START_HOUR = 0; // 12 AM
const END_HOUR = 24; // 12 AM next day
const MIN_SLOT_MINUTES = 15;

// Helper to convert time string "HH:MM" to minutes from start of day
const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const formatTime = (mins: number) => {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const snapMinutes = (mins: number) => Math.round(mins / MIN_SLOT_MINUTES) * MIN_SLOT_MINUTES;

const clampMinutes = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const DEFAULT_CONTENT = {
  'header.title': 'Set Availability',
  'loading.text': 'Loading availability...',
  'slot.available': 'Available',
  'slot.repeats_weekly': 'Repeats weekly',
  'slot.one_time': 'One-time',
  'preview.merging': 'Merging...',
  'preview.new_slot': 'New Slot',
  'modal.title': 'Add Availability',
  'modal.to': 'to',
  'repeat.title': 'Repeat weekly',
  'repeat.enabled_body': 'This availability will repeat every week on the selected days.',
  'repeat.disabled_body': 'This availability will only be added for this date.',
  'actions.saving': 'Saving...',
  'actions.merge': 'Merge availability',
  'actions.add': 'Add Availability',
  'actions.discard': 'Discard',
  'errors.invalid_time_title': 'Invalid time',
  'errors.invalid_time_body': 'End time must be after start time',
  'errors.missing_days_title': 'Missing weekdays',
  'errors.missing_days_body': 'Select at least one weekday',
  'toasts.saved_title': 'Saved',
  'toasts.saved_body': 'Availability updated',
  'toasts.save_failed_title': 'Save failed',
  'toasts.retry_body': 'Please try again',
  'toasts.resize_failed_title': 'Resize failed',
} as const;

// Helper to check if two time ranges overlap
const isOverlapping = (start1: number, end1: number, start2: number, end2: number) => {
  return Math.max(start1, start2) < Math.min(end1, end2);
};

export default function SetAvailability() {
  const toast = useToast();
  const content = useAppContent('professional_set_availability', DEFAULT_CONTENT);
  const weekPagerRef = useRef<ScrollView>(null);
  const timelineScrollRef = useRef<ScrollView>(null);
  const hasAutoSelectedAvailabilityDay = useRef(false);

  useEffect(() => {
    return () => {
      hasAutoSelectedAvailabilityDay.current = false;
    };
  }, []);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [visibleWeekOffset, setVisibleWeekOffset] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [startHour, setStartHour] = useState('18');
  const [startMinute, setStartMinute] = useState('15');
  const [endHour, setEndHour] = useState('20');
  const [endMinute, setEndMinute] = useState('45');
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [repeatDays, setRepeatDays] = useState<Set<number>>(
    () => new Set([new Date().getDay()]),
  );
  const [availability, setAvailability] = useState<DayAvailability>({});
  const [deletingSlots, setDeletingSlots] = useState<Set<string>>(new Set());
  const [resizingSlots, setResizingSlots] = useState<Set<string>>(new Set());

  const selectedDay = selectedDate.getDay();
  const weekPagerIndex = useMemo(
    () => WEEK_OFFSETS.indexOf(visibleWeekOffset),
    [visibleWeekOffset],
  );
  const daysOfWeek = useMemo(
    () => getWeekDates(visibleWeekOffset),
    [visibleWeekOffset],
  );
  const weekLabel = useMemo(() => {
    const firstDay = daysOfWeek[0]?.fullDate;
    const lastDay = daysOfWeek[6]?.fullDate;

    if (!firstDay || !lastDay) {
      return '';
    }

    const sameMonth = firstDay.getMonth() === lastDay.getMonth();
    const firstLabel = firstDay.toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
    });
    const lastLabel = lastDay.toLocaleDateString('en-GB', {
      ...(sameMonth ? { day: 'numeric' } : { month: 'short', day: 'numeric' }),
    });

    return `${firstLabel} - ${lastLabel}`;
  }, [daysOfWeek]);

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

      if (!hasAutoSelectedAvailabilityDay.current) {
        const firstAvailableDate = daysOfWeek.find(
          ({ fullDate }) => (transformed[fullDate.getDay()] || []).length > 0,
        )?.fullDate;

        if (firstAvailableDate) {
          setSelectedDate(new Date(firstAvailableDate));
        }

        hasAutoSelectedAvailabilityDay.current = true;
      }
    }
  }, [daysOfWeek, weeklyData]);

  const currentDaySlots = useMemo(
    () => availability[selectedDay] || [],
    [availability, selectedDay],
  );

  useEffect(() => {
    if (showAddModal || currentDaySlots.length === 0) {
      return;
    }

    const earliestStart = Math.min(
      ...currentDaySlots.map((slot) => timeToMinutes(slot.startTime)),
    );
    const offset = Math.max(0, (earliestStart / 60) * HOUR_HEIGHT - 120);

    requestAnimationFrame(() => {
      timelineScrollRef.current?.scrollTo({ y: offset, animated: false });
    });
  }, [currentDaySlots, selectedDay, showAddModal]);

  // Calculate current selection in minutes
  const selectionStart = parseInt(startHour) * 60 + parseInt(startMinute);
  const selectionEnd = parseInt(endHour) * 60 + parseInt(endMinute);
  const selectedDateValue = formatDateOnly(selectedDate);

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

  const syncWeekOffset = (nextWeekOffset: number) => {
    const nextWeek = getWeekDates(nextWeekOffset);
    const nextSelectedDate = nextWeek[selectedDay]?.fullDate;

    setVisibleWeekOffset(nextWeekOffset);
    if (nextSelectedDate) {
      setSelectedDate(new Date(nextSelectedDate));
    }
  };

  const changeWeek = (direction: -1 | 1) => {
    const nextIndex = Math.min(
      WEEK_OFFSETS.length - 1,
      Math.max(0, weekPagerIndex + direction),
    );
    const nextWeekOffset = WEEK_OFFSETS[nextIndex];

    if (typeof nextWeekOffset !== 'number') {
      return;
    }

    weekPagerRef.current?.scrollTo({ x: nextIndex * SCREEN_WIDTH, animated: true });
    syncWeekOffset(nextWeekOffset);
  };

  const handleWeekMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
    );
    const nextWeekOffset = WEEK_OFFSETS[nextIndex];

    if (typeof nextWeekOffset === 'number' && nextWeekOffset !== visibleWeekOffset) {
      syncWeekOffset(nextWeekOffset);
    }
  };

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
      toast.error(
        getAppContentValue(content, 'errors.invalid_time_title', DEFAULT_CONTENT['errors.invalid_time_title']),
        getAppContentValue(content, 'errors.invalid_time_body', DEFAULT_CONTENT['errors.invalid_time_body']),
      );
      return;
    }

    const targetDays = repeatWeekly
      ? REPEAT_DAY_ORDER.filter((dayIndex) => repeatDays.has(dayIndex))
      : [selectedDay];

    if (repeatWeekly && targetDays.length === 0) {
      toast.error(
        getAppContentValue(content, 'errors.missing_days_title', DEFAULT_CONTENT['errors.missing_days_title']),
        getAppContentValue(content, 'errors.missing_days_body', DEFAULT_CONTENT['errors.missing_days_body']),
      );
      return;
    }

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
      toast.success(
        getAppContentValue(content, 'toasts.saved_title', DEFAULT_CONTENT['toasts.saved_title']),
        getAppContentValue(content, 'toasts.saved_body', DEFAULT_CONTENT['toasts.saved_body']),
      );
    } catch (error) {
      console.error('Failed to save availability:', error);
      setAvailability((prev) => ({
        ...prev,
        ...previousByDay,
      }));
      toast.error(
        getAppContentValue(content, 'toasts.save_failed_title', DEFAULT_CONTENT['toasts.save_failed_title']),
        error instanceof Error
          ? error.message
          : getAppContentValue(content, 'toasts.retry_body', DEFAULT_CONTENT['toasts.retry_body']),
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

  const updateSlotTimes = (slotId: string, startMinutes: number, endMinutes: number) => {
    setAvailability((prev) => ({
      ...prev,
      [selectedDay]: (prev[selectedDay] || []).map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              startTime: formatTime(startMinutes),
              endTime: formatTime(endMinutes),
            }
          : slot,
      ),
    }));
  };

  const createResizeResponder = (slot: TimeSlot, edge: 'start' | 'end') => {
    const siblingSlots = [...currentDaySlots]
      .filter((candidate) => candidate.id !== slot.id)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    const originalStart = timeToMinutes(slot.startTime);
    const originalEnd = timeToMinutes(slot.endTime);
    const previousCandidates = siblingSlots.filter(
      (candidate) => timeToMinutes(candidate.endTime) <= originalStart,
    );
    const previousSlot = previousCandidates[previousCandidates.length - 1];
    const nextSlot = siblingSlots.find(
      (candidate) => timeToMinutes(candidate.startTime) >= originalEnd,
    );
    const minStart = previousSlot ? timeToMinutes(previousSlot.endTime) : 0;
    const maxEnd = nextSlot ? timeToMinutes(nextSlot.startTime) : END_HOUR * 60;
    const previousDaySlots = [...currentDaySlots];

    const getResizedRange = (distanceY: number) => {
      const minuteDelta = snapMinutes((distanceY / HOUR_HEIGHT) * 60);

      if (edge === 'start') {
        return {
          nextStart: clampMinutes(
            originalStart + minuteDelta,
            minStart,
            originalEnd - MIN_SLOT_MINUTES,
          ),
          nextEnd: originalEnd,
        };
      }

      return {
        nextStart: originalStart,
        nextEnd: clampMinutes(
          originalEnd + minuteDelta,
          originalStart + MIN_SLOT_MINUTES,
          maxEnd,
        ),
      };
    };

    const commitResize = async (distanceY: number) => {
      const { nextStart, nextEnd } = getResizedRange(distanceY);

      if (nextStart === originalStart && nextEnd === originalEnd) {
        return;
      }

      setResizingSlots((prev) => new Set(prev).add(slot.id));

      try {
        await replaceAvailabilityMutation.mutateAsync({
          deleteSlotIds: [slot.id],
          slots: [
            {
              dayIndex: selectedDay,
              slot: {
                startTime: formatTime(nextStart),
                endTime: formatTime(nextEnd),
              },
              startsOn: slot.startsOn,
              recurrenceType: slot.recurrenceType,
            },
          ],
        });
      } catch (error) {
        console.error('Failed to resize slot:', error);
        setAvailability((prev) => ({
          ...prev,
          [selectedDay]: previousDaySlots,
        }));
        toast.error(
          getAppContentValue(content, 'toasts.resize_failed_title', DEFAULT_CONTENT['toasts.resize_failed_title']),
          error instanceof Error
            ? error.message
            : getAppContentValue(content, 'toasts.retry_body', DEFAULT_CONTENT['toasts.retry_body']),
        );
      } finally {
        setResizingSlots((prev) => {
          const next = new Set(prev);
          next.delete(slot.id);
          return next;
        });
      }
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => !deletingSlots.has(slot.id),
      onMoveShouldSetPanResponder: () => !deletingSlots.has(slot.id),
      onPanResponderMove: (_, gestureState) => {
        const { nextStart, nextEnd } = getResizedRange(gestureState.dy);
        updateSlotTimes(slot.id, nextStart, nextEnd);
      },
      onPanResponderRelease: (_, gestureState) => {
        void commitResize(gestureState.dy);
      },
      onPanResponderTerminate: (_, gestureState) => {
        void commitResize(gestureState.dy);
      },
    });
  };

  if (isLoadingAvailability) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#047857" />
          <Text className="text-brand-dark-alt text-lg mt-4">
            {getAppContentValue(content, 'loading.text', DEFAULT_CONTENT['loading.text'])}
          </Text>
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
          {getAppContentValue(content, 'header.title', DEFAULT_CONTENT['header.title'])}
        </Text>
        <View className="w-7" />
      </View>

      {/* Days Selector */}
      <View className="bg-white z-10">
        <View className="flex-row items-center justify-between px-5 pt-4">
          <Pressable
            onPress={() => changeWeek(-1)}
            className="w-9 h-9 items-center justify-center rounded-full bg-[#F7F7F7]"
          >
            <ChevronLeft color="#30352D" size={18} strokeWidth={2} />
          </Pressable>
          <Text className="font-worksans-semibold text-[14px] text-brand-dark-alt">
            {weekLabel}
          </Text>
          <Pressable
            onPress={() => changeWeek(1)}
            className="w-9 h-9 items-center justify-center rounded-full bg-[#F7F7F7]"
          >
            <ChevronRight color="#30352D" size={18} strokeWidth={2} />
          </Pressable>
        </View>

        <ScrollView
          ref={weekPagerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: weekPagerIndex * SCREEN_WIDTH, y: 0 }}
          onMomentumScrollEnd={handleWeekMomentumEnd}
        >
          {WEEK_OFFSETS.map((weekOffset) => {
            const weekDays = getWeekDates(weekOffset);

            return (
              <View
                key={weekOffset}
                style={{ width: SCREEN_WIDTH }}
                className="flex-row px-5 py-4 gap-2 bg-white"
              >
                {weekDays.map((day) => {
                  const isSelected = day.dateValue === selectedDateValue;

                  return (
                    <Pressable
                      key={day.key}
                      onPress={() => setSelectedDate(new Date(day.fullDate))}
                      className={`flex-1 items-center py-3 rounded-lg ${isSelected ? 'bg-emerald-700' : 'bg-transparent'}`}
                    >
                      <Text
                        className={`font-worksans text-[11px] mb-1 ${isSelected ? 'text-white' : 'text-[#6B6B6B]'}`}
                      >
                        {day.short}
                      </Text>
                      <Text
                        className={`font-worksans-semibold text-[14px] ${isSelected ? 'text-white' : 'text-brand-dark-alt'}`}
                      >
                        {day.date}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Timeline View */}
      <ScrollView
        ref={timelineScrollRef}
        className="flex-1 bg-white"
        contentContainerStyle={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT + 50 }}
      >
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
              const topResizeResponder = createResizeResponder(slot, 'start');
              const bottomResizeResponder = createResizeResponder(slot, 'end');
              const isBusy = deletingSlots.has(slot.id) || resizingSlots.has(slot.id);

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
                  <View
                    {...topResizeResponder.panHandlers}
                    className="absolute top-0 left-0 right-0 h-6 z-10"
                  >
                    <View className="absolute top-1 self-center w-10 h-1.5 rounded-full bg-white/90" />
                  </View>
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 min-w-0 pr-2">
                      {isCompact ? (
                        <Text
                          className="text-white font-worksans-bold text-sm"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {slot.startTime} - {slot.endTime}
                        </Text>
                      ) : (
                        <>
                          <Text className="text-white font-worksans-bold text-base">
                            {getAppContentValue(content, 'slot.available', DEFAULT_CONTENT['slot.available'])}
                          </Text>
                          <Text className="text-white font-worksans text-xs opacity-90">
                            {slot.startTime} - {slot.endTime}
                          </Text>
                          <Text className="text-white font-worksans text-[10px] opacity-80">
                            {slot.recurrenceType === 'weekly'
                              ? getAppContentValue(content, 'slot.repeats_weekly', DEFAULT_CONTENT['slot.repeats_weekly'])
                              : getAppContentValue(content, 'slot.one_time', DEFAULT_CONTENT['slot.one_time'])}
                          </Text>
                        </>
                      )}
                    </View>
                    <Pressable
                      onPress={() => removeTimeSlot(slot.id)}
                      disabled={isBusy}
                      className="bg-white/20 rounded-full p-1"
                    >
                      {isBusy ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Trash2 size={14} color="white" />
                      )}
                    </Pressable>
                  </View>
                  <View
                    {...bottomResizeResponder.panHandlers}
                    className="absolute bottom-0 left-0 right-0 h-6 z-10"
                  >
                    <View className="absolute bottom-1 self-center w-10 h-1.5 rounded-full bg-white/90" />
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
                className="rounded-lg justify-center items-center px-3"
              >
                <Text className="text-emerald-700 font-worksans-bold">
                  {isMerge
                    ? getAppContentValue(content, 'preview.merging', DEFAULT_CONTENT['preview.merging'])
                    : getAppContentValue(content, 'preview.new_slot', DEFAULT_CONTENT['preview.new_slot'])}
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
                {getAppContentValue(content, 'modal.title', DEFAULT_CONTENT['modal.title'])}
              </Text>
            </View>

            {/* Time Display */}
            <View className="flex-row items-center justify-center gap-3 mb-6">
              <View className="px-6 py-3 rounded-lg bg-brand-cream">
                <Text className="font-worksans-semibold text-[20px] text-brand-dark-alt">
                  {startHour}:{startMinute}
                </Text>
              </View>
              <Text className="font-worksans text-[16px] text-[#6B6B6B]">
                {getAppContentValue(content, 'modal.to', DEFAULT_CONTENT['modal.to'])}
              </Text>
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
                    {getAppContentValue(content, 'repeat.title', DEFAULT_CONTENT['repeat.title'])}
                  </Text>
                  <Text className="font-worksans text-[13px] text-[#6B6B6B] mt-1">
                    {repeatWeekly
                      ? getAppContentValue(content, 'repeat.enabled_body', DEFAULT_CONTENT['repeat.enabled_body'])
                      : getAppContentValue(content, 'repeat.disabled_body', DEFAULT_CONTENT['repeat.disabled_body'])}
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
                    ? getAppContentValue(content, 'actions.saving', DEFAULT_CONTENT['actions.saving'])
                    : isMerge
                      ? getAppContentValue(content, 'actions.merge', DEFAULT_CONTENT['actions.merge'])
                      : getAppContentValue(content, 'actions.add', DEFAULT_CONTENT['actions.add'])}
                </ButtonText>
              </Button>

              <Pressable
                onPress={() => setShowAddModal(false)}
                className="items-center py-3"
              >
                <Text className="font-worksans-semibold text-[16px] text-brand-terracotta">
                  {getAppContentValue(content, 'actions.discard', DEFAULT_CONTENT['actions.discard'])}
                </Text>
              </Pressable>
            </View>
          </View>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
