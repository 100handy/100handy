import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

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
    <HStack className={`px-2 py-1 rounded-full items-center font-work-sans ${getStatusClasses(tone)}`}>
      <Text className="text-xs font-medium">
        {label}
      </Text>
    </HStack>
  );
}

export default StatusPill;