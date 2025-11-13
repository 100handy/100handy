import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Search } from 'lucide-react-native';

interface SearchAndFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filterChips = ['All', 'Highest Rated', 'Lowest Price', 'Nearest'];

export const SearchAndFilters = ({ activeFilter, onFilterChange }: SearchAndFiltersProps) => {
  return (
    <View className="bg-white pt-2 pb-4 px-4 border-b border-gray-200 flex-col">
      <Input className="bg-gray-100 rounded-lg border-0 mb-4">
        <InputSlot className="pl-3">
          <Search size={20} color="#9CA3AF" />
        </InputSlot>
        <InputField placeholder="Search professionals..." className="font-work-sans text-sm text-gray-400" />
      </Input>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="space-x-2 flex-row">
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
        </View>
      </ScrollView>
    </View>
  );
};