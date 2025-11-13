import React from 'react';
import { View } from 'react-native';
import { Input, InputField } from '@/components/ui/input';
import { MapPinIcon, SearchIcon } from 'lucide-react-native';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;

}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <View className="bg-white rounded-xl p-3 mx-4 mb-6 shadow-sm items-center space-x-3 flex-row">

      <Input className="flex-1 border-0">
        <InputField
          placeholder="Search for services..."
          value={searchQuery}
          onChangeText={onSearchChange}
          className="text-sm font-worksans placeholder:text-typography-400"
        />
      </Input>
    </View>
  );
}