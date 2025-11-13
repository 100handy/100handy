import React, { useState, useMemo } from 'react';
import { ScrollView, Pressable as RNPressable, View, Text, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
} from '@/components/ui/modal';

interface DateTimeSelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDateTime: (date: string, time: string) => void;
  taskerName: string;
}

export default function DateTimeSelectionSheet({
  isOpen,
  onClose,
  onSelectDateTime,
  taskerName,
}: DateTimeSelectionSheetProps) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedTime, setSelectedTime] = useState('10:00');

  // Generate next 7 days
  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  // Generate time slots
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
  ];

  const formatDisplayDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return {
      month: months[date.getMonth()],
      day: date.getDate(),
      dayOfWeek: days[date.getDay()],
    };
  };

  const formatDatabaseDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const handleConfirm = () => {
    const formattedDate = formatDatabaseDate(selectedDate);
    onSelectDateTime(formattedDate, selectedTime);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent style={{ backgroundColor: '#FFFFFF', maxHeight: '90%' }}>
        {/* Drag Indicator */}
        <View className="w-full items-center pt-2 pb-1">
          <View className="w-12 h-1 rounded-full bg-gray-300" />
        </View>

        <ScrollView className="w-full px-5 pt-4 pb-6" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="mb-6 flex-col">
            <Text className="text-xl font-bold text-[#30352D] mb-3">
              Choose your task date and time
            </Text>
            <Text className="text-sm text-[#30352D]">
              {taskerName}'s Availability
            </Text>
          </View>

          {/* Date Selection */}
          <View className="mb-6 flex-col">
            <Text className="text-base font-semibold text-[#30352D] mb-3">
              Select Date
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="gap-3 flex-row">
                {availableDates.map((date, index) => {
                  const { month, day, dayOfWeek } = formatDisplayDate(date);
                  const isSelected = isSameDay(date, selectedDate);

                  return (
                    <RNPressable
                      key={index}
                      onPress={() => setSelectedDate(date)}
                      className="items-center justify-center rounded-lg border-2 px-4 py-3"
                      style={{
                        borderColor: isSelected ? '#C1856A' : '#E5E7EB',
                        backgroundColor: isSelected ? '#FEF3F0' : '#FFFFFF',
                        minWidth: 70,
                      }}
                    >
                      <Text
                        className="text-xs font-medium mb-1"
                        style={{ color: isSelected ? '#C1856A' : '#6B7280' }}
                      >
                        {dayOfWeek}
                      </Text>
                      <Text
                        className="text-xs font-medium mb-0.5"
                        style={{ color: isSelected ? '#C1856A' : '#6B7280' }}
                      >
                        {month}
                      </Text>
                      <Text
                        className="text-lg font-bold"
                        style={{ color: isSelected ? '#C1856A' : '#30352D' }}
                      >
                        {day}
                      </Text>
                    </RNPressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* Time Selection */}
          <View className="mb-6 flex-col">
            <Text className="text-base font-semibold text-[#30352D] mb-3">
              Select Start Time
            </Text>
            <View className="gap-2 flex-col">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <RNPressable
                    key={time}
                    onPress={() => setSelectedTime(time)}
                    className="flex-row items-center justify-between px-4 py-3 rounded-lg border"
                    style={{
                      borderColor: isSelected ? '#C1856A' : '#E5E7EB',
                      backgroundColor: isSelected ? '#FEF3F0' : '#FFFFFF',
                    }}
                  >
                    <Text
                      className="text-sm font-medium"
                      style={{ color: isSelected ? '#C1856A' : '#30352D' }}
                    >
                      {time}
                    </Text>
                    {isSelected && <Check size={20} color="#C1856A" strokeWidth={2.5} />}
                  </RNPressable>
                );
              })}
            </View>
          </View>

          {/* Selected Summary */}
          <View className="bg-[#F9FAFB] rounded-lg p-4 mb-6 flex-col">
            <Text className="text-xs font-medium text-gray-600 mb-2">
              Request for:
            </Text>
            <Text className="text-base font-semibold text-[#30352D]">
              {formatDisplayDate(selectedDate).month} {selectedDate.getDate()}, {selectedDate.getFullYear()} at {selectedTime}
            </Text>
          </View>

          {/* Confirm Button */}
          <Pressable
            onPress={handleConfirm}
            className="w-full py-4 rounded-full items-center"
            style={{ backgroundColor: '#C1856A' }}
          >
            <Text className="text-base font-semibold text-white">
              Select & Continue
            </Text>
          </Pressable>

          {/* Info Text */}
          <View className="items-start gap-2 mt-4 px-2 flex-row">
            <Check size={18} color="#82BE56" strokeWidth={2} className="mt-0.5" />
            <Text className="flex-1 text-xs text-gray-600 leading-relaxed">
              Next, confirm your details to get connected with your Tasker.
            </Text>
          </View>
        </ScrollView>
      </ModalContent>
    </Modal>
  );
}
