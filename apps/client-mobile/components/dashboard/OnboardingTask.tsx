import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight, Check, Lock } from 'lucide-react-native';

interface OnboardingTaskProps {
  icon: React.ReactNode;
  title: string;
  duration: string;
  completed?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

export function OnboardingTask({
  icon,
  title,
  duration,
  completed = false,
  disabled = false,
  onPress,
}: OnboardingTaskProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className={`px-5 py-5 border-b border-[#F0F0F0] ${completed ? 'bg-[#F8FBF8]' : ''} ${disabled ? 'opacity-50' : ''}`}
    >
      <View className="items-center justify-between flex-row">
        <View className="items-center space-x-4 flex-1 flex-row">
          <View className="w-10 h-10 items-center justify-center">{icon}</View>
          <View className="flex-1 flex-col">
            <Text className={`font-worksans-bold text-[16px] mb-0.5 ${completed ? 'text-[#6B7B6B]' : disabled ? 'text-[#999]' : 'text-[#30352D]'}`}>
              {title}
            </Text>
            <Text className={`font-worksans text-[11px] ${completed ? 'text-[#8B9B8B]' : disabled ? 'text-[#BBB]' : 'text-[#333a31]'}`}>
              {completed ? 'Completed' : disabled ? 'Complete verification first' : duration}
            </Text>
          </View>
        </View>
        {completed ? (
          <View className="w-6 h-6 rounded-full bg-[#4A5347] items-center justify-center">
            <Check color="white" size={14} strokeWidth={3} />
          </View>
        ) : disabled ? (
          <Lock color="#BDBDBD" size={18} strokeWidth={2} />
        ) : (
          <ChevronRight color="#BDBDBD" size={22} strokeWidth={2} />
        )}
      </View>
    </Pressable>
  );
}