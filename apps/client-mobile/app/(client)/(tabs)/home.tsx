import React from 'react';
import { View } from 'react-native';
import { InlineAppAnnouncements } from '@/components/announcements/AppAnnouncements';
import { ServicesHomeScreen } from '@/components/home';

export default function HomeScreen() {
  return (
    <View className="flex-1">
      <InlineAppAnnouncements placement="dashboard" />
      <ServicesHomeScreen />
    </View>
  );
}
