import React from 'react';
import { Image, View, Text } from 'react-native';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No Current Tasks",
  description = "Let us help you get the job done.\nBook a task and see it here."
}: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-12 px-8 flex-col">
      {/* Clock illustration */}
      <Image
        source={require('@/assets/tasks-empty-state.png')}
        style={{ width: 238, height: 238, marginBottom: 24 }}
        resizeMode="contain"
      />

      {/* Title */}
      <Text className="text-2xl font-work-sans font-medium text-text-primary text-center mb-2">
        {title}
      </Text>

      {/* Description */}
      <Text className="text-sm font-work-sans text-text-primary text-center leading-5">
        {description}
      </Text>
    </View>
  );
}

export default EmptyState;
