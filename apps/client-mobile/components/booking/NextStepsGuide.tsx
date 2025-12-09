import React from 'react';
import { View, Text } from 'react-native';
import type { BookingStatus } from '@shared/supabase/bookings';

interface NextStepsGuideProps {
  status: BookingStatus;
}

export function NextStepsGuide({ status }: NextStepsGuideProps) {
  // Only show for pending bookings
  if (status !== 'pending') {
    return null;
  }

  const steps = [
    'The handyman will review your booking request',
    "You'll receive a notification when they accept",
    'You can message them to discuss any details',
    "They'll arrive at the scheduled time to complete your task",
  ];

  return (
    <View className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <Text className="text-base font-worksans-semibold mb-3" style={{ color: '#30352D' }}>
        What happens next?
      </Text>

      <View className="gap-2">
        {steps.map((step, index) => (
          <View key={index} className="flex-row gap-2">
            <Text className="text-sm font-worksans-semibold" style={{ color: '#30352D' }}>
              {index + 1}.
            </Text>
            <Text className="text-sm font-worksans flex-1" style={{ color: '#4B5563' }}>
              {step}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
