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
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent
        size="full"
        className="bg-white"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '50%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          margin: 0,
          marginHorizontal: 0,
          padding: 0,
        }}
      >
        {/* Header */}
        <View className="w-full pb-4 pt-6 px-5 flex-col border-b border-gray-200">
          <Text className="text-center text-xl font-medium" style={{ color: '#333A31' }}>
            Rating & reviews
          </Text>
        </View>

        {/* Filter Options */}
        <View className="w-full flex-col">
          {ratingFilterOptions.map((option, index) => {
            const isSelected = selectedValue === option;
            return (
              <Pressable
                key={option}
                onPress={() => onSelectFilter(option)}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderBottomWidth: index < ratingFilterOptions.length - 1 ? 1 : 0,
                  borderBottomColor: '#E5E7EB',
                }}
              >
                <View className="flex-1 items-center justify-between flex-row">
                  <Text
                    className="text-base"
                    style={{
                      color: '#333A31',
                      fontWeight: '400',
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
            style={{
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB',
            }}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-xs font-bold text-black">
                More
              </Text>
              <ChevronUp size={16} color="#000000" strokeWidth={2} />
            </View>
          </Pressable>
        </View>
      </ModalContent>
    </Modal>
  );
}
