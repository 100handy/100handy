import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
} from '@/components/ui/modal';
import { Check, ChevronUp } from 'lucide-react-native';

export type RatingFilter = 'All ratings' | 'All mounting' | 'Only TV Mounting';

export const ratingFilterOptions: RatingFilter[] = [
  'All ratings',
  'All mounting',
  'Only TV Mounting',
];

interface RatingFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedValue: RatingFilter;
  onSelectFilter: (filter: RatingFilter) => void;
}

export default function RatingFilterSheet({
  isOpen,
  onClose,
  selectedValue,
  onSelectFilter,
}: RatingFilterSheetProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="bg-white">
        {/* Drag Indicator */}
        <View className="w-full items-center pt-2 pb-1">
          <View className="w-12 h-1 rounded-full bg-gray-300" />
        </View>

        {/* Header */}
        <View className="w-full pb-4 pt-2 flex-col">
          <Text className="text-center text-base font-semibold text-black">
            Rating & reviews
          </Text>
        </View>

        {/* Filter Options */}
        <View className="w-full flex-col">
          {ratingFilterOptions.map((option) => {
            const isSelected = selectedValue === option;
            return (
              <Pressable
                key={option}
                onPress={() => onSelectFilter(option)}
                className="border-b border-gray-100"
                style={{ paddingVertical: 16, paddingHorizontal: 20 }}
              >
                <View className="flex-1 items-center justify-between flex-row">
                  <Text
                    className="text-base"
                    style={{
                      color: isSelected ? '#333A31' : '#4B5563',
                      fontWeight: isSelected ? '600' : '400',
                    }}
                  >
                    {option}
                  </Text>
                  {isSelected && (
                    <Check size={20} color="#333A31" strokeWidth={2.5} />
                  )}
                </View>
              </Pressable>
            );
          })}

          {/* More Button */}
          <Pressable
            onPress={onClose}
            className="pt-4 pb-2"
          >
            <View className="flex-1 items-center justify-center gap-2 flex-row">
              <Text className="text-base font-semibold text-black">
                More
              </Text>
              <ChevronUp size={20} color="#000000" strokeWidth={2} />
            </View>
          </Pressable>
        </View>
      </ModalContent>
    </Modal>
  );
}
