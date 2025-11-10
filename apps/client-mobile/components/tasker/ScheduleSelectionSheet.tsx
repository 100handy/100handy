import React, { useState, useMemo } from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ChevronDown } from 'lucide-react-native';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
} from '@/components/ui/actionsheet';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from '@/components/ui/select';

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

  const handleConfirm = () => {
    onSelectSchedule(selectedDate, selectedTime);
    onClose();
  };

  // Find the label for the selected date
  const selectedDateLabel = dateOptions.find(opt => opt.value === selectedDate)?.label || 'Tomorrow';

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent style={{ backgroundColor: '#FFFFFF', maxHeight: '60%' }}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator style={{ backgroundColor: '#D1D5DB' }} />
        </ActionsheetDragIndicatorWrapper>

        <VStack className="w-full px-5 pt-4 pb-6">
          {/* Header */}
          <VStack className="mb-6">
            <Text className="text-xl font-bold text-[#30352D] mb-2">
              {taskerName}'s Schedule, GMT
            </Text>
          </VStack>

          {/* Date and Time Selects */}
          <HStack className="gap-3 mb-6">
            {/* Date Select */}
            <VStack className="flex-1">
              <Select selectedValue={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger
                  variant="outline"
                  className="h-12 bg-white border-gray-300 rounded-lg flex-row items-center justify-between px-4"
                >
                  <SelectInput
                    placeholder="Select date"
                    value={selectedDateLabel}
                    className="text-sm font-medium text-[#30352D] flex-1"
                    editable={false}
                  />
                  <SelectIcon className="ml-2">
                    <ChevronDown size={20} color="#6B7280" />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent style={{ backgroundColor: '#FFFFFF' }}>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator style={{ backgroundColor: '#D1D5DB' }} />
                    </SelectDragIndicatorWrapper>
                    {dateOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        label={option.label}
                        value={option.value}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </VStack>

            {/* Time Select */}
            <VStack className="flex-1">
              <Select selectedValue={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger
                  variant="outline"
                  className="h-12 bg-white border-gray-300 rounded-lg flex-row items-center justify-between px-4"
                >
                  <SelectInput
                    placeholder="Select time"
                    className="text-sm font-medium text-[#30352D] flex-1"
                    editable={false}
                  />
                  <SelectIcon className="ml-2">
                    <ChevronDown size={20} color="#6B7280" />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent style={{ backgroundColor: '#FFFFFF' }}>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator style={{ backgroundColor: '#D1D5DB' }} />
                    </SelectDragIndicatorWrapper>
                    {timeSlots.map((time) => (
                      <SelectItem
                        key={time}
                        label={time}
                        value={time}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </VStack>
          </HStack>

          {/* Select & Continue Button */}
          <Pressable
            onPress={handleConfirm}
            className="w-full py-4 rounded-full items-center"
            style={{ backgroundColor: '#2C5F5D' }}
          >
            <Text className="text-base font-semibold text-white">
              Select & Continue
            </Text>
          </Pressable>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
}
