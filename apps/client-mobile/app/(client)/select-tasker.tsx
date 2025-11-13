import React, { useState } from 'react';
import { ScrollView, ActivityIndicator, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, SlidersHorizontal, Check } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FilterChip, TaskerCard, type TaskerData } from '@/components/tasker';
import { useHandymenByCategory, type HandymanFilters } from '@shared/supabase';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';

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
  const categoryId = params.categoryId as string;
  const categoryName = params.categoryName as string;
  const serviceName = params.service as string;

  // Task details from task-form screen
  const taskSize = params.taskSize as string;
  const vehicleRequirement = params.vehicleRequirement as string;
  const taskDetails = params.taskDetails as string;

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('Recommended');

  // Map sort option to API filter
  const sortByMap: Record<SortOption, HandymanFilters['sortBy']> = {
    'Recommended': 'recommended',
    'Price (Lowest)': 'price_low',
    'Price (Highest)': 'price_high',
    'Positive Reviews (Highest)': 'rating',
    'Total Reviews (Highest)': 'reviews',
    'Completed Tasks (Highest)': 'reviews',
  };

  // Fetch handymen data
  const { data: handymen, isLoading, isError } = useHandymenByCategory(categoryId, {
    sortBy: sortByMap[selectedSort],
  });

  // Transform handymen data to TaskerData format
  const taskers: TaskerData[] = React.useMemo(() => {
    if (!handymen) return mockTaskers; // Fallback to mock data if no real data

    return handymen.map((handyman) => ({
      id: handyman.user_id,
      name: handyman.display_name || 'Handyman',
      avatarUrl: handyman.avatar_url || `https://i.pravatar.cc/150?u=${handyman.user_id}`,
      rating: handyman.rating,
      reviewCount: handyman.review_count || 0,
      pricePerHour: handyman.hourly_rate_cents / 100,
      taskCount: handyman.jobs_completed,
      taskType: `${serviceName || 'tasks'}`,
      description: handyman.bio || 'Experienced professional ready to help.',
      isSuperTasker: handyman.verified,
    }));
  }, [handymen, serviceName]);

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
      params: {
        taskerId,
        categoryId,
        categoryName,
        taskSize,
        vehicleRequirement,
        taskDetails: taskDetails || '',
      },
    });
  };

  const handleSeeProfile = (taskerId: string) => {
    router.push({
      pathname: '/(client)/tasker-profile',
      params: {
        taskerId,
        categoryId,
        categoryName,
        taskSize,
        vehicleRequirement,
        taskDetails: taskDetails || '',
      },
    });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View className="flex-col px-5 pt-4 pb-4 bg-white"
        style={{ borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}
      >
        <View className="flex-row items-center justify-between">
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
        </View>
      </View>

      {/* Filter Chips */}
      <View className="flex-col px-5 pt-4 pb-3 bg-white">
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
      </View>

      {/* Sorted By Label */}
      <View className="flex-row items-center justify-center px-5 pb-4 bg-white">
        <View className="flex-col" style={{ height: 1, flex: 1, backgroundColor: '#E5E7EB' }} />
        <Text
          className="text-xs px-3"
          style={{ color: '#9CA3AF', fontWeight: '400' }}
        >
          Sorted by: {selectedSort}
        </Text>
        <View className="flex-col" style={{ height: 1, flex: 1, backgroundColor: '#E5E7EB' }} />
      </View>

      {/* Taskers List */}
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: '#F9FAFB' }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View className="flex-col items-center justify-center py-20">
            <ActivityIndicator size="large" color="#000000" />
            <Text className="text-sm text-gray-600 mt-3">Loading taskers...</Text>
          </View>
        ) : isError ? (
          <View className="flex-col items-center justify-center py-20 px-6">
            <Text className="text-base font-semibold text-gray-900 mb-2 text-center">
              Error loading taskers
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              Please try again later
            </Text>
          </View>
        ) : taskers.length === 0 ? (
          <View className="flex-col items-center justify-center py-20 px-6">
            <Text className="text-base font-semibold text-gray-900 mb-2 text-center">
              No taskers found
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              Try adjusting your filters or search in a different category
            </Text>
          </View>
        ) : (
          <View className="flex-col px-5 pt-2 pb-6">
            {taskers.map((tasker) => (
              <TaskerCard
                key={tasker.id}
                tasker={tasker}
                onPress={() => handleTaskerPress(tasker.id)}
                onSeeProfile={() => handleSeeProfile(tasker.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Sort Options Modal */}
      <Modal isOpen={showSortSheet} onClose={() => setShowSortSheet(false)} size="full">
        <ModalBackdrop />
        <ModalContent
          size="full"
          style={{
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '60%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            margin: 0,
            marginHorizontal: 0,
            padding: 0,
          }}
        >
          <ModalBody style={{ padding: 0 }}>
            {/* Header */}
            <View className="w-full pb-4 pt-6 px-5 border-b border-gray-200">
              <Text
                className="text-center text-xl"
                style={{ fontWeight: '500', color: '#333A31' }}
              >
                Sort by
              </Text>
            </View>

            {/* Sort Options */}
            <View className="flex-col w-full">
              {sortOptions.map((option, index) => {
                const isSelected = selectedSort === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => handleSortSelect(option)}
                    style={{
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      borderBottomWidth: index < sortOptions.length - 1 ? 1 : 0,
                      borderBottomColor: '#E5E7EB',
                    }}
                  >
                    <View className="flex-row flex-1 items-center justify-between">
                      <Text
                        style={{
                          color: '#333A31',
                          fontWeight: '400',
                          fontSize: 16,
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
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}

