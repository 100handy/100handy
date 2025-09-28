import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';

export default function ProfessionalProfile() {
  return (
    <SafeAreaView className="flex-1 bg-bg-secondary">
      <Header 
        title="Profile" 
        onBackPress={() => {}} 
        onBellPress={() => {}} 
        showFilterIcon={false}
        showBellIcon={true}
      />
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg font-worksans text-text-secondary">Professional Profile Screen</Text>
        <Text className="text-sm font-worksans text-text-tertiary mt-2">Coming soon...</Text>
      </View>
    </SafeAreaView>
  );
}
