import React from 'react';
import { Pressable } from '@/components/ui/pressable';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

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
    <VStack>
      <Pressable
        className="py-3.5 px-6"
        onPress={onPress}
      >
        <HStack className="items-center gap-4">
          {/* Icon */}
          <Box className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: '#C1856A' }}>
            {icon}
          </Box>
          
          {/* Label */}
          <Text className="text-[16px] font-worksans-medium" style={{ color: '#30352D' }}>
            {label}
          </Text>
        </HStack>
      </Pressable>
      
      {/* Divider Line */}
      <Box className="h-[1px] ml-6" style={{ backgroundColor: '#E5E5E5' }} />
    </VStack>
  );
};
