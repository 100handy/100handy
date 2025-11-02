import React from 'react';
import { Pressable } from '@/components/ui/pressable';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
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
      <HStack className="items-center justify-between">
        <HStack className="items-center space-x-4 flex-1">
          <Box className="w-10 h-10 items-center justify-center">{icon}</Box>
          <VStack className="flex-1">
            <Text className="font-worksans-bold text-[16px] text-[#30352D] mb-0.5">
              {title}
            </Text>
            <Text className="font-worksans text-[11px] text-[#333a31]">
              {duration}
            </Text>
          </VStack>
        </HStack>
        <ChevronRight color="#BDBDBD" size={22} strokeWidth={2} />
      </HStack>
    </Pressable>
  );
}