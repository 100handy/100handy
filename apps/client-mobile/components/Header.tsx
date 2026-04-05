import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ArrowLeft, ChevronLeft, BellIcon, SlidersHorizontal } from 'lucide-react-native';

// Using Tailwind design tokens - colors are now defined in tailwind.config.js

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  onBellPress?: () => void;
  showBackButton?: boolean;
  showBellIcon?: boolean;
  showFilterIcon?: boolean;
  onFilterPress?: () => void;
  backIcon?: 'arrow' | 'chevron';
}

export default function Header({
  title,
  onBackPress,
  onBellPress,
  showBackButton = true,
  showBellIcon = false,
  showFilterIcon = false,
  onFilterPress,
  backIcon = 'chevron',
}: HeaderProps) {
  const BackIcon = backIcon === 'arrow' ? ArrowLeft : ChevronLeft;

  return (
    <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-200">
      <View className="flex-row items-center" style={{ width: 40 }}>
        {showBackButton && (
          <Pressable onPress={onBackPress || (() => {})} accessibilityLabel="Go back" accessibilityRole="button">
            <BackIcon size={24} color="#333A31" />
          </Pressable>
        )}
      </View>
      <Text className="flex-1 text-center text-lg font-semibold text-text-primary">
        {title}
      </Text>
      <View className="flex-row items-center" style={{ width: 40 }}>
        {showBellIcon && (
          <Pressable
            className="w-8 h-8 rounded-full items-center justify-center"
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
    </View>
  );
}
