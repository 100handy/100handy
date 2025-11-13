import React, { useState } from 'react';
import { ScrollView, Pressable as RNPressable, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button, ButtonText } from '@/components/ui/button';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Plus, X, ChevronLeft, Trash2, Calendar } from 'lucide-react-native';
import { TimePickerWheel } from '@/components/availability';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface DayAvailability {
  [dayIndex: number]: TimeSlot[];
}

const DAYS_OF_WEEK = [
  { short: 'Sun', date: '21' },
  { short: 'Mon', date: '22' },
  { short: 'Tue', date: '23' },
  { short: 'Wed', date: '24' },
  { short: 'Thu', date: '25' },
  { short: 'Fri', date: '26' },
];

const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 to 18

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

export default function SetAvailability() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [startHour, setStartHour] = useState('18');
  const [startMinute, setStartMinute] = useState('15');
  const [endHour, setEndHour] = useState('20');
  const [endMinute, setEndMinute] = useState('45');
  const [availability, setAvailability] = useState<DayAvailability>({});

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: `${startHour}:${startMinute}`,
      endTime: `${endHour}:${endMinute}`,
    };

    setAvailability((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newSlot],
    }));

    setShowAddModal(false);
  };

  const removeTimeSlot = (slotId: string) => {
    setAvailability((prev) => ({
      ...prev,
      [selectedDay]: (prev[selectedDay] || []).filter((slot) => slot.id !== slotId),
    }));
  };

  const currentDaySlots = availability[selectedDay] || [];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
        <Pressable onPress={() => router.push('/(professional)/(tabs)/dashboard')}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-[18px] text-[#30352D]">
          Set Availability
        </Text>
        <View className="w-7" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Days Selector */}
        <View className="flex-row px-5 py-4 gap-2">
          {DAYS_OF_WEEK.map((day, index) => (
            <Pressable
              key={day.short}
              onPress={() => setSelectedDay(index)}
              className={`flex-1 items-center py-3 rounded-lg ${
                selectedDay === index ? 'bg-[#4A5347]' : 'bg-transparent'
              }`}
            >
              <Text
                className={`font-worksans text-[11px] mb-1 ${
                  selectedDay === index ? 'text-white' : 'text-[#6B6B6B]'
                }`}
              >
                {day.short}
              </Text>
              <Text
                className={`font-worksans-semibold text-[14px] ${
                  selectedDay === index ? 'text-white' : 'text-[#30352D]'
                }`}
              >
                {day.date}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Time Slots Display */}
        <View className="flex-col px-5 py-4">
          {currentDaySlots.length > 0 ? (
            <>
              <Text className="font-worksans-bold text-[14px] text-[#30352D] mb-3">
                Available Time Slots
              </Text>
              {currentDaySlots.map((slot) => (
                <View className="flex-row"
                  key={slot.id}
                  className="items-center justify-between py-4 px-4 mb-3 bg-[#F5F5F5] rounded-lg"
                >
                  <View className="flex-row items-center gap-2">
                    <View className="w-1 h-12 bg-[#4A5347] rounded-full" />
                    <View className="flex-col">
                      <Text className="font-worksans-semibold text-[16px] text-[#30352D]">
                        {slot.startTime} - {slot.endTime}
                      </Text>
                      <Text className="font-worksans text-[12px] text-[#6B6B6B]">
                        {DAYS_OF_WEEK[selectedDay].short}, {DAYS_OF_WEEK[selectedDay].date}
                      </Text>
                    </View>
                  </View>
                  <Pressable onPress={() => removeTimeSlot(slot.id)} className="p-2">
                    <Trash2 color="#D17852" size={20} strokeWidth={2} />
                  </Pressable>
                </View>
              ))}
            </>
          ) : (
            <View className="flex-col items-center justify-center py-16">
              <View className="w-16 h-16 items-center justify-center bg-[#F5F5F5] rounded-full mb-4">
                <Calendar color="#6B6B6B" size={32} strokeWidth={1.5} />
              </View>
              <Text className="font-worksans-semibold text-[16px] text-[#30352D] mb-2">
                No availability set
              </Text>
              <Text className="font-worksans text-[14px] text-[#6B6B6B] text-center">
                Tap the + button to add your{'\n'}available time slots
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <Pressable
        onPress={() => setShowAddModal(true)}
        className="absolute bottom-24 right-6 w-[56px] h-[56px] bg-[#4A5347] rounded-2xl items-center justify-center shadow-lg"
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
                onPress={addTimeSlot}
                className="bg-[#D17852] rounded-full"
              >
                <ButtonText className="font-worksans-semibold text-white text-[16px]">
                  Add Availability
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
    </SafeAreaView>
  );
}
