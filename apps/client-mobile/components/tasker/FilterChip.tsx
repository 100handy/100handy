import React from 'react';
import { Pressable, Text } from 'react-native';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export function FilterChip({ label, isActive, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-1.5 rounded-full"
      style={{
        backgroundColor: isActive ? '#C1856A' : 'transparent',
        borderWidth: 1.5,
        borderColor: isActive ? '#C1856A' : '#D1D5DB',
      }}
    >
      <Text
        className="text-xs"
        style={{
          color: isActive ? '#FFFFFF' : '#000000',
          fontWeight: '500',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

