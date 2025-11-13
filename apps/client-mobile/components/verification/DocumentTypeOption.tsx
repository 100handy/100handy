import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface DocumentTypeOptionProps {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const DocumentTypeOption: React.FC<DocumentTypeOptionProps> = ({
  icon,
  label,
  selected,
  onPress,
}) => {
  return (
    <View className="flex-col">
      <Pressable
        className="py-3.5 px-6"
        onPress={onPress}
      >
        <View className="items-center gap-4 flex-row">
          {/* Icon */}
          <View className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: '#C1856A' }}>
            {icon}
          </View>

          {/* Label */}
          <Text className="text-[16px] font-worksans-medium" style={{ color: '#30352D' }}>
            {label}
          </Text>
        </View>
      </Pressable>

      {/* Divider Line */}
      <View className="h-[1px] ml-6" style={{ backgroundColor: '#E5E5E5' }} />
    </View>
  );
};
