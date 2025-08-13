import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { MapPinIcon, SearchIcon } from 'lucide-react-native';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;

}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <HStack className="bg-white rounded-xl p-3 mx-4 mb-6 shadow-sm items-center space-x-3">
      
      <Input className="flex-1 border-0">
        <InputField
          placeholder="Search for services..."
          value={searchQuery}
          onChangeText={onSearchChange}
          className="text-sm font-worksans placeholder:text-typography-400"
        />
      </Input>
    </HStack>
  );
}