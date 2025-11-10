import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface OnboardingTaskProps {
  icon: React.ReactNode;
  title: string;
  duration: string;
  onPress?: () => void;
}

export function OnboardingTask({
  icon,
  title,
  duration,
  onPress,
}: OnboardingTaskProps) {
  return (
    <Pressable onPress={onPress} className="px-5 py-5 border-b border-[#F0F0F0]">
      <View className="items-center justify-between flex-row">
        <View className="items-center space-x-4 flex-1 flex-row">
          <View className="w-10 h-10 items-center justify-center">{icon}</View>
          <View className="flex-1 flex-col">
            <Text className="font-worksans-bold text-[16px] text-[#30352D] mb-0.5">
              {title}
            </Text>
            <Text className="font-worksans text-[11px] text-[#333a31]">
              {duration}
            </Text>
          </View>
        </View>
        <ChevronRight color="#BDBDBD" size={22} strokeWidth={2} />
      </View>
    </Pressable>
  );
}