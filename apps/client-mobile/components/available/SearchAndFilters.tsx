import React from 'react';
import { ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Search } from 'lucide-react-native';

interface SearchAndFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filterChips = ['All', 'Highest Rated', 'Lowest Price', 'Nearest'];

export const SearchAndFilters = ({ activeFilter, onFilterChange }: SearchAndFiltersProps) => {
  return (
    <VStack className="bg-white pt-2 pb-4 px-4 border-b border-gray-custom-200">
      <Input className="bg-gray-custom-100 rounded-lg border-0 mb-4">
        <InputSlot className="pl-3">
          <Icon as={Search} size="lg" color="#9CA3AF" />
        </InputSlot>
        <InputField placeholder="Search professionals..." className="font-work-sans text-sm text-gray-custom-400" />
      </Input>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack className="space-x-2">
          {filterChips.map((chip) => (
            <Pressable 
              key={chip}
              onPress={() => onFilterChange(chip)}
              style={{
                backgroundColor: activeFilter === chip ? '#A3B899' : '#F3F4F6'
              }}
              className="py-2 px-4 rounded-full"
            >
              <Text 
                className="font-work-sans font-medium text-sm"
                style={{ color: activeFilter === chip ? '#FFFFFF' : '#4B5563' }}
              >
                {chip}
              </Text>
            </Pressable>
          ))}
        </HStack>
      </ScrollView>
    </VStack>
  );
};