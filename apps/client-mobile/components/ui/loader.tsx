import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

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