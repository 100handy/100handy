import React, { useState, useEffect } from 'react';
import { ScrollView, Switch, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useProfessionalProfileStore } from '@shared/supabase';

export default function CalendarSettingsScreen() {
  const { syncCalendars, setSyncCalendars, loadProfile } = useProfessionalProfileStore();
  const [syncCalendarsEnabled, setSyncCalendarsEnabled] = useState(true);

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Sync local state with store
  useEffect(() => {
    setSyncCalendarsEnabled(syncCalendars);
  }, [syncCalendars]);

  const handleToggle = async (value: boolean) => {
    setSyncCalendarsEnabled(value);
    await setSyncCalendars(value);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text 
          className="flex-1 text-center text-lg font-semibold text-brand-dark pr-6" 
          style={{ fontFamily: 'WorkSans_600SemiBold' }}
        >
          Calendar Settings
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col px-5 py-6">
          {/* Sync Calendars Setting */}
          <View className="flex-row items-center justify-between py-4 border-b border-[#E5E5E5]">
            <Text 
              className="text-base text-brand-dark" 
              style={{ fontFamily: 'WorkSans_400Regular' }}
            >
              Sync calendars
            </Text>
            <Switch
              value={syncCalendarsEnabled}
              onValueChange={handleToggle}
              trackColor={{ 
                false: '#E5E5E5', 
                true: '#C1856A'
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E5E5"
            />
          </View>

          {/* Add more settings items here if needed */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}