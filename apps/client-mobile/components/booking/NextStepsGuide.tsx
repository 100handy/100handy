import React from 'react';
import { View, Text } from 'react-native';
import type { BookingStatus } from '@shared/supabase/bookings';

interface NextStepsGuideProps {
  status: BookingStatus;
}

const stepsByStatus: Record<string, { title: string; steps: string[] }> = {
  pending: {
    title: 'What happens next?',
    steps: [
      'The handyman will review your booking request',
      "You'll receive a notification when they accept",
      'You can message them to discuss any details',
      "They'll arrive at the scheduled time to complete your task",
    ],
  },
  accepted: {
    title: 'Your tasker has accepted!',
    steps: [
      "They'll arrive at the scheduled time",
      'You can message them to coordinate details',
      "You'll be notified when they start work",
    ],
  },
  in_progress: {
    title: 'Your task is underway!',
    steps: [
      'The tasker is working on your job',
      "You'll be notified when the task is complete",
      'You can message them if you have any questions',
    ],
  },
  completed: {
    title: 'Task complete!',
    steps: [
      'Your task has been finished successfully',
      'Leave a review to help other customers',
      'Your payment will be processed shortly',
    ],
  },
  cancelled: {
    title: 'Booking cancelled',
    steps: [
      'Any authorized payment has been released',
      'You can book another tasker anytime',
    ],
  },
};

export function NextStepsGuide({ status }: NextStepsGuideProps) {
  const config = stepsByStatus[status];
  if (!config) {
    return null;
  }

  return (
    <View className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <Text className="text-base font-worksans-semibold mb-3" style={{ color: '#30352D' }}>
        {config.title}
      </Text>

      <View className="gap-2">
        {config.steps.map((step, index) => (
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
