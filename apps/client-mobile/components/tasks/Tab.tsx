import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface TabProps {
  id: string;
  label: string;
  active: boolean;
  onPress: (id: string) => void;
}

export function Tab({ id, label, active, onPress }: TabProps) {
  return (
    <Pressable onPress={() => onPress(id)} className="flex-1 py-3">
      <View className="items-center flex-col">
        <Text
          className={`text-sm font-work-sans font-medium leading-4 ${
            active ? 'text-clay-orange' : 'text-text-tertiary'
          }`}
        >
          {label}
        </Text>
        <View
          className={`mt-2 h-0.5 ${
            active ? 'w-4/5 bg-clay-orange' : 'w-0 bg-transparent'
          }`}
        />
      </View>
    </Pressable>
  );
}

export default Tab;