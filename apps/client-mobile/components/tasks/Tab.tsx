import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Box } from '@/components/ui/box';

interface TabProps {
  id: string;
  label: string;
  active: boolean;
  onPress: (id: string) => void;
}

export function Tab({ id, label, active, onPress }: TabProps) {
  return (
    <Pressable onPress={() => onPress(id)} className="flex-1 py-3">
      <VStack className="items-center">
        <Text
          className={`text-sm font-work-sans font-medium leading-4 ${
            active ? 'text-primary-brand' : 'text-tertiary-text'
          }`}
        >
          {label}
        </Text>
        <Box
          className={`mt-2 h-0.5 ${
            active ? 'w-4/5 bg-primary-brand' : 'w-0 bg-transparent'
          }`}
        />
      </VStack>
    </Pressable>
  );
}

export default Tab;