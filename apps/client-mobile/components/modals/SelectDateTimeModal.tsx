import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
// You would install this library: npm install react-native-calendars
import { Calendar } from 'react-native-calendars';

// Import modal components
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';

// Import lucide-react-native icons
import { X } from 'lucide-react-native';
import { Button, ButtonText } from '@/components/ui/button';

// CORRECTED: Time slots now match the image
const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', 
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

// CORRECTED: Colors from the image
const colors = {
    sageGreen: '#A3B899',
    clayOrange: '#D9896C',
    darkGrey: '#4A5568',
    lightGrey: '#E2E8F0',
};


// --- Main Screen Component ---
export default function SelectDateTimeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // State for selected date and time
  const [selectedDate, setSelectedDate] = useState('2024-12-12');
  // CORRECTED: Logic updated for single time selection
  const [selectedTime, setSelectedTime] = useState('2:00 PM');

  const handleTimePress = (time: string) => {
    setSelectedTime(time);
  };

  return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="full"
      >
        <ModalBackdrop />
        <ModalContent className="w-full rounded-t-2xl bottom-0 absolute h-auto">
          {/* CORRECTED: Header now has no border and updated title */}
          <ModalHeader className="border-b-0">
            <Text className="text-gray-800 text-lg font-semibold">Select date & time</Text>
            <ModalCloseButton>
              <X size={24} className="text-gray-500" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {/* CORRECTED: Calendar theme updated to match the image */}
            <Calendar
              current={'2024-12-12'}
              onDayPress={day => {
                setSelectedDate(day.dateString);
              }}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: colors.sageGreen }
              }}
              theme={{
                arrowColor: colors.darkGrey,
                selectedDayBackgroundColor: colors.sageGreen,
                selectedDayTextColor: '#ffffff',
                monthTextColor: colors.darkGrey,
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: 'normal',
                dayTextColor: colors.darkGrey,
                textDisabledColor: colors.lightGrey,
                ...(({
                    'stylesheet.calendar.header': {
                        week: {
                            marginTop: 5,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }
                    }
                }) as any)
              }}
            />
            
            {/* Time Slots Section */}
            <View className="mt-6 flex-col">
                <Text className="mb-4 text-gray-800 text-base font-medium">Available times</Text>
                <View className="flex-row flex-wrap justify-between">
                    {timeSlots.map(time => {
                        const isSelected = selectedTime === time;
                        // CORRECTED: Styling now uses the new colors
                        return (
                            <Pressable
                                key={time}
                                onPress={() => handleTimePress(time)}
                                style={{
                                    backgroundColor: isSelected ? colors.sageGreen : 'white',
                                    borderColor: isSelected ? colors.sageGreen : colors.lightGrey,
                                }}
                                className="w-[48%] border rounded-lg py-3 mb-3"
                            >
                                <Text
                                    style={{ color: isSelected ? 'white' : colors.darkGrey }}
                                    className="text-center font-semibold"
                                >
                                    {time}
                                </Text>
                            </Pressable>
                        )
                    })}
                </View>
            </View>

          </ModalBody>
          {/* CORRECTED: Footer now has two buttons */}
          <ModalFooter className="border-t-0">
             <View className="w-full flex-row space-x-4">
                <Button variant="outline" className="flex-1 border-gray-300" size="lg" onPress={onClose}>
                    <ButtonText className="text-gray-700">Cancel</ButtonText>
                </Button>
                <Button
                    className="flex-1"
                    size="lg"
                    style={{backgroundColor: colors.clayOrange}}
                    onPress={onClose}
                >
                    <ButtonText className="text-center">Select &{'\n'}Continue</ButtonText>
                </Button>
             </View>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
}