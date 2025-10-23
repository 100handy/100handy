import React, { useState } from 'react';
import { ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeft } from 'lucide-react-native';

export default function CalendarSettingsScreen() {
  const [syncCalendarsEnabled, setSyncCalendarsEnabled] = useState(true);

  const handleToggle = (value: boolean) => {
    setSyncCalendarsEnabled(value);
    // Save setting to backend/context
    console.log('Sync calendars:', value);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <HStack className="items-center px-5 py-4">
        <Pressable onPress={() => {/* Navigate back */}}>
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text 
          className="flex-1 text-center text-lg font-semibold text-[#333A31] pr-6" 
          style={{ fontFamily: 'WorkSans_600SemiBold' }}
        >
          Calendar Settings
        </Text>
      </HStack>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <VStack className="px-5 py-6">
          {/* Sync Calendars Setting */}
          <HStack className="items-center justify-between py-4 border-b border-[#E5E5E5]">
            <Text 
              className="text-base text-[#333A31]" 
              style={{ fontFamily: 'WorkSans_400Regular' }}
            >
              Sycn calendars
            </Text>
            <Switch
              value={syncCalendarsEnabled}
              onValueChange={handleToggle}
              trackColor={{ 
                false: '#E5E5E5', 
                true: '#D17852' 
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E5E5"
            />
          </HStack>

          {/* Add more settings items here if needed */}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}