import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';

interface LoaderProps {
  text?: string;
  size?: 'small' | 'large';
  className?: string;
}

export function Loader({ 
  text = 'Loading...', 
  size = 'large',
  className = 'flex-1 justify-center items-center bg-background'
}: LoaderProps) {
  return (
    <View className={className}>
      <ActivityIndicator size={size} className="mb-4" />
      <Text className="text-font text-lg">{text}</Text>
    </View>
  );
}