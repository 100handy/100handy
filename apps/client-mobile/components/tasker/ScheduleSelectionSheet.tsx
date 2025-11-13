import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
} from '@/components/ui/modal';

interface ScheduleSelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSchedule: (date: string, time: string) => void;
  taskerName: string;
}

interface DateOption {
  label: string;
  value: string;
}

export function ScheduleSelectionSheet({
  isOpen,
  onClose,
  onSelectSchedule,
  taskerName,
}: ScheduleSelectionSheetProps) {
  // Generate date options
  const dateOptions = useMemo(() => {
    const options: DateOption[] = [];

    for (let i = 0; i < 7; i++) {
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

  // Time slots in 24-hour format
  const timeSlots = [
    '8:00', '9:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  // Default to tomorrow
  const defaultDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedTime, setSelectedTime] = useState('17:00');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleConfirm = () => {
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
          maxHeight: '50%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          margin: 0,
          marginHorizontal: 0,
          padding: 0,
        }}
      >
        {!showDatePicker && !showTimePicker ? (
          <View className="w-full px-5 pt-6 pb-6 flex-col">
            {/* Header */}
            <View className="mb-6 flex-col">
              <Text className="text-xl font-bold text-[#30352D]">
                {taskerName}'s Schedule, GMT
              </Text>
            </View>

            {/* Date and Time Selects */}
            <View className="gap-3 mb-6 flex-row">
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
                onPress={() => setShowTimePicker(true)}
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
                  {selectedTime}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </Pressable>
            </View>

            {/* Select & Continue Button */}
            <Pressable
              onPress={handleConfirm}
              className="w-full py-4 rounded-full items-center"
              style={{ backgroundColor: '#C1856A' }}
            >
              <Text className="text-base font-semibold text-white">
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
            </View>

            {/* Date Options */}
            <ScrollView className="flex-1" style={{ maxHeight: 300 }}>
              {dateOptions.map((option) => {
                const isSelected = selectedDate === option.value;
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
                    }}
                  >
                    <Text
                      className="text-base"
                      style={{
                        color: '#333A31',
                        fontWeight: isSelected ? '600' : '400',
                      }}
                    >
                      {option.label}
                    </Text>
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
