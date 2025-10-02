import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeft, SlidersHorizontal, Check } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FilterChip, TaskerCard, type TaskerData } from '@/components/tasker';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';

// Mock data for taskers - in production, this would come from an API
const mockTaskers: TaskerData[] = [
  {
    id: '1',
    name: 'Mike W.',
    avatarUrl: 'https://i.pravatar.cc/150?u=mike',
    rating: 5.0,
    reviewCount: 124,
    pricePerHour: 70.27,
    taskCount: 124,
    taskType: 'tv mounting tasks',
    description: 'I have 8 years of experience. I come with all the right rawlplugs, fixings and tools and not forgetting my trust…',
    isSuperTasker: true,
  },
  {
    id: '2',
    name: 'Sami T.',
    avatarUrl: 'https://i.pravatar.cc/150?u=sami',
    rating: 5.0,
    reviewCount: 124,
    pricePerHour: 65.19,
    taskCount: 54,
    taskType: 'tv mounting tasks',
    description: 'Got years of experience, the right tools, and a steady hand for TV mounting. Let me take care of getting your…',
    isSuperTasker: true,
  },
  {
    id: '3',
    name: 'Maria R.',
    avatarUrl: 'https://i.pravatar.cc/150?u=maria',
    rating: 5.0,
    reviewCount: 124,
    pricePerHour: 64.77,
    taskCount: 90,
    taskType: 'tv mounting tasks',
    description: 'From start to finish, I communicate clearly and work carefully to deliver exactly what you need',
    isSuperTasker: false,
  },
  {
    id: '4',
    name: 'Lucas P.',
    avatarUrl: 'https://i.pravatar.cc/150?u=lucas',
    rating: 5.0,
    reviewCount: 124,
    pricePerHour: 53.17,
    taskCount: 31,
    taskType: 'tv mounting tasks',
    description: 'Friendly, punctual, and experienced—I focus on providing quality service and customer satisfaction every time.',
    isSuperTasker: false,
  },
  {
    id: '5',
    name: 'Lore V.',
    avatarUrl: 'https://i.pravatar.cc/150?u=lore',
    rating: 5.0,
    reviewCount: 124,
    pricePerHour: 60.24,
    taskCount: 64,
    taskType: 'tv mounting tasks',
    description: 'Whether it\'s a quick fix or a larger project, I\'m committed to delivering dependable, professional results.',
    isSuperTasker: false,
  },
  {
    id: '6',
    name: 'Sam O.',
    avatarUrl: 'https://i.pravatar.cc/150?u=samo',
    rating: 5.0,
    reviewCount: 124,
    pricePerHour: 70.27,
    taskCount: 73,
    taskType: 'tv mounting tasks',
    description: 'With over 6 years of experience, I bring the right tools and skills to ensure your job is completed safely and efficiently.',
    isSuperTasker: false,
  },
];

const filterOptions = ['Within a week', 'Flexible', 'Price'];

type SortOption = 
  | 'Recommended'
  | 'Price (Lowest)'
  | 'Price (Highest)'
  | 'Positive Reviews (Highest)'
  | 'Total Reviews (Highest)'
  | 'Completed Tasks (Highest)';

const sortOptions: SortOption[] = [
  'Recommended',
  'Price (Lowest)',
  'Price (Highest)',
  'Positive Reviews (Highest)',
  'Total Reviews (Highest)',
  'Completed Tasks (Highest)',
];

export default function SelectTaskerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('Recommended');

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSortSelect = (option: SortOption) => {
    setSelectedSort(option);
    setShowSortSheet(false);
  };

  const handleTaskerPress = (taskerId: string) => {
    router.push({
      pathname: '/(client)/tasker-profile',
      params: { taskerId },
    });
  };

  const handleSeeProfile = (taskerId: string) => {
    router.push({
      pathname: '/(client)/tasker-profile',
      params: { taskerId },
    });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <VStack
        className="px-5 pt-4 pb-4 bg-white"
        style={{ borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}
      >
        <HStack className="items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </Pressable>
          
          <Text
            className="flex-1 text-center text-lg"
            style={{ fontWeight: '600', color: '#000000' }}
          >
            Select a Tasker
          </Text>
          
          <Pressable onPress={() => setShowSortSheet(true)}>
            <SlidersHorizontal size={24} color="#000000" strokeWidth={2} />
          </Pressable>
        </HStack>
      </VStack>

      {/* Filter Chips */}
      <VStack className="px-5 pt-4 pb-3 bg-white">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {filterOptions.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              isActive={activeFilters.includes(filter)}
              onPress={() => toggleFilter(filter)}
            />
          ))}
        </ScrollView>
      </VStack>

      {/* Sorted By Label */}
      <HStack className="items-center justify-center px-5 pb-4 bg-white">
        <VStack style={{ height: 1, flex: 1, backgroundColor: '#E5E7EB' }} />
        <Text
          className="text-xs px-3"
          style={{ color: '#9CA3AF', fontWeight: '400' }}
        >
          Sorted by: {selectedSort}
        </Text>
        <VStack style={{ height: 1, flex: 1, backgroundColor: '#E5E7EB' }} />
      </HStack>

      {/* Taskers List */}
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: '#F9FAFB' }}
        showsVerticalScrollIndicator={false}
      >
        <VStack className="px-5 pt-2 pb-6">
          {mockTaskers.map((tasker) => (
            <TaskerCard
              key={tasker.id}
              tasker={tasker}
              onPress={() => handleTaskerPress(tasker.id)}
              onSeeProfile={() => handleSeeProfile(tasker.id)}
            />
          ))}
        </VStack>
      </ScrollView>

      {/* Sort Options Action Sheet */}
      <Actionsheet isOpen={showSortSheet} onClose={() => setShowSortSheet(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ backgroundColor: '#FFFFFF' }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator style={{ backgroundColor: '#D1D5DB' }} />
          </ActionsheetDragIndicatorWrapper>
          
          {/* Header */}
          <VStack className="w-full pb-4 pt-2">
            <Text
              className="text-center text-base"
              style={{ fontWeight: '600', color: '#6B7280' }}
            >
              Sort by:
            </Text>
          </VStack>

          {/* Sort Options */}
          <VStack className="w-full">
            {sortOptions.map((option) => {
              const isSelected = selectedSort === option;
              return (
                <ActionsheetItem
                  key={option}
                  onPress={() => handleSortSelect(option)}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F3F4F6',
                  }}
                >
                  <HStack className="flex-1 items-center justify-between">
                    <ActionsheetItemText
                      style={{
                        color: isSelected ? '#0D9488' : '#1F2937',
                        fontWeight: isSelected ? '600' : '400',
                        fontSize: 16,
                      }}
                    >
                      {option}
                    </ActionsheetItemText>
                    {isSelected && (
                      <Check size={20} color="#0D9488" strokeWidth={2.5} />
                    )}
                  </HStack>
                </ActionsheetItem>
              );
            })}
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </SafeAreaView>
  );
}

