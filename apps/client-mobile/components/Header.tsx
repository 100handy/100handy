import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { ArrowLeft, BellIcon, SlidersHorizontal } from 'lucide-react-native';

// Using Tailwind design tokens - colors are now defined in tailwind.config.js

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  onBellPress?: () => void;
  showBackButton?: boolean;
  showBellIcon?: boolean;
  showFilterIcon?: boolean;
  onFilterPress?: () => void;
}

export default function Header({
  title,
  onBackPress,
  onBellPress,
  showBackButton = true,
  showBellIcon = true,
  showFilterIcon = true,
  onFilterPress,
}: HeaderProps) {
  return (
    <HStack className="items-center justify-between px-4 py-4 bg-bg-primary">
      <HStack className="items-center space-x-3">
        {showBackButton && (
          <ArrowLeft size={18} color="#333A31" onPress={onBackPress || (() => {})} />
        )}
        <Text className="text-lg font-work-sans font-semibold ml-2 text-text-primary leading-7">
          {title}
        </Text>
      </HStack>
      {showBellIcon && (
        <Pressable className="w-8 h-8 rounded-full items-center justify-center bg-bg-primary">
          <BellIcon size={15} color="#333A31" onPress={onBellPress || (() => {})} />
        </Pressable>
      )}
      {showFilterIcon && (
        <Pressable onPress={onFilterPress}>
         <Icon as={SlidersHorizontal} size="xl" color="#333A31" />
       </Pressable>
     )}
     
    </HStack>
  );
}