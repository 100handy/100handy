import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { ArrowLeft, BellIcon, SlidersHorizontal } from 'lucide-react-native';

const colors = {
  clayOrange: '#D9896C',
  sageGreen: '#A3B899',
  warmTaupe: '#BFA28D',
  themeBackground: '#F6E4D8',
  themeFont: '#333A31',
};

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
    <HStack className="items-center justify-between px-4 py-2">
      <HStack className="items-center space-x-3">
        {showBackButton && (
          <ArrowLeft size={25} color={colors.themeFont} onPress={onBackPress || (() => {})} />
        )}
        <Text className="text-lg font-semibold ml-2" style={{ color: colors.themeFont }}>
          {title}
        </Text>
      </HStack>
      {showBellIcon && (
        <Pressable className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: 'white' }}>
          <BellIcon size={16} color={colors.themeFont} onPress={onBellPress || (() => {})} />
        </Pressable>
      )}
      {showFilterIcon && (
         <Pressable onPress={onFilterPress}>
          <Icon as={SlidersHorizontal} size="xl" color="#1F2937" />
        </Pressable>
      )}
     
    </HStack>
  );
}