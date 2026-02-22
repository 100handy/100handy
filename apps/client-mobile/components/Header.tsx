import React from 'react';
import { View, Text, Pressable } from 'react-native';
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
    <View className="items-center justify-between px-4 py-4 bg-bg-primary flex-row">
      <View className="items-center space-x-3 flex-row">
        {showBackButton && (
          <Pressable onPress={onBackPress || (() => {})} accessibilityLabel="Go back" accessibilityRole="button">
            <ArrowLeft size={18} color="#333A31" />
          </Pressable>
        )}
        <Text className="text-lg font-work-sans font-semibold ml-2 text-text-primary leading-7">
          {title}
        </Text>
      </View>
      {showBellIcon && (
        <Pressable
          className="w-8 h-8 rounded-full items-center justify-center bg-bg-primary"
          onPress={onBellPress || (() => {})}
          accessibilityLabel="Notifications"
          accessibilityRole="button"
        >
          <BellIcon size={15} color="#333A31" />
        </Pressable>
      )}
      {showFilterIcon && (
        <Pressable onPress={onFilterPress} accessibilityLabel="Filters" accessibilityRole="button">
         <SlidersHorizontal size={24} color="#333A31" />
       </Pressable>
     )}

    </View>
  );
}