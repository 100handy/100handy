import React from 'react';
import { View, Text } from 'react-native';

interface StatusPillProps {
  label: string;
  tone?: 'scheduled' | 'progress' | 'neutral';
}

export function StatusPill({ label, tone = 'neutral' }: StatusPillProps) {
  const getStatusClasses = (tone: 'scheduled' | 'progress' | 'neutral') => {
    switch (tone) {
      case 'scheduled':
        return 'bg-status-success-bg text-text-primary';
      case 'progress':
        return 'bg-status-warning-bg text-status-warning';
      default:
        return 'bg-gray-100 text-text-primary';
    }
  };

  return (
    <View className={`px-2 py-1 rounded-full items-center font-work-sans ${getStatusClasses(tone)} flex-row`}>
      <Text className="text-xs font-medium">
        {label}
      </Text>
    </View>
  );
}

export default StatusPill;