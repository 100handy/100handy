import React from 'react';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
} from '@/components/ui/actionsheet';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
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
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="bg-white">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className="bg-gray-300" />
        </ActionsheetDragIndicatorWrapper>
        
        {/* Header */}
        <VStack className="w-full pb-4 pt-2">
          <Text className="text-center text-base font-semibold text-black">
            Rating & reviews
          </Text>
        </VStack>

        {/* Filter Options */}
        <VStack className="w-full">
          {ratingFilterOptions.map((option) => {
            const isSelected = selectedValue === option;
            return (
              <ActionsheetItem
                key={option}
                onPress={() => onSelectFilter(option)}
                className="border-b border-gray-100"
                style={{ paddingVertical: 16, paddingHorizontal: 20 }}
              >
                <HStack className="flex-1 items-center justify-between">
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
                </HStack>
              </ActionsheetItem>
            );
          })}
          
          {/* More Button */}
          <ActionsheetItem
            onPress={onClose}
            className="pt-4 pb-2"
          >
            <HStack className="flex-1 items-center justify-center gap-2">
              <Text className="text-base font-semibold text-black">
                More
              </Text>
              <ChevronUp size={20} color="#000000" strokeWidth={2} />
            </HStack>
          </ActionsheetItem>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
}
