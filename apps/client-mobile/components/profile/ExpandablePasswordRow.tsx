import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Eye, EyeOff, X } from 'lucide-react-native';

export type ExpandablePasswordRowProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  isOpen: boolean;
  onToggleOpen: () => void;
  onClearAndCollapse: () => void;
  isPasswordVisible: boolean;
  onTogglePasswordVisible: () => void;
};

export function ExpandablePasswordRow({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  isOpen,
  onToggleOpen,
  onClearAndCollapse,
  isPasswordVisible,
  onTogglePasswordVisible,
}: ExpandablePasswordRowProps) {
  return (
    <View className="border-b border-[#E5E7EB]">
      {/* Label row */}
      <Pressable
        onPress={onToggleOpen}
        className="flex-row items-center justify-between px-6 py-5"
      >
        <Text className="text-[18px] font-worksans-medium text-[#333A31]">
          {label}
        </Text>

        <Pressable
          onPress={(e: { stopPropagation?: () => void }) => {
            e.stopPropagation?.();
            onClearAndCollapse();
          }}
          hitSlop={10}
          className="w-8 h-8 items-center justify-center"
        >
          <X size={20} color="#94A3B8" />
        </Pressable>
      </Pressable>

      {/* Expandable input */}
      {isOpen ? (
        <View className="px-6 pb-5 -mt-2">
          <Input variant="underlined" size="lg" className="border-[#E5E7EB]">
            <InputField
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#94A3B8"
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              className="px-0 text-[17px] font-worksans text-[#333A31]"
            />
            <InputSlot className="pl-3 pr-0" onPress={onTogglePasswordVisible}>
              <InputIcon as={isPasswordVisible ? EyeOff : Eye} className="text-[#94A3B8]" />
            </InputSlot>
          </Input>

          {helperText ? (
            <Text className="mt-2 text-[13px] font-worksans text-[#64748B]">
              {helperText}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}


