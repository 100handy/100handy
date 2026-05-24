import React, { useState, useEffect, useMemo } from 'react';
import { useLocationStore } from '@shared/store';
import { type HandymanFilters, type Coordinate, type WorkArea, doesAvailabilitySlotApplyToDate, type AvailabilitySlot } from '@shared/query';
import { ScrollView, ActivityIndicator, View, Text, Pressable } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { ChevronLeft, SlidersHorizontal, Check } from 'lucide-react-native'; import { useRouter, useLocalSearchParams } from 'expo-router'; import { FilterChip, TaskerCard, type TaskerData } from '@/components/tasker'; import { useHandymenByCategory } from '@shared/query'; import { getWorkAreaByUserId, isLocationInWorkArea, getAvailabilityByUserId } from '@shared/supabase';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';
import { goBackOrReplace } from '@/lib/navigation';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

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

function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function SelectTaskerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const content = useAppContent('client_select_tasker', {
    'header.title': 'Select a Tasker',
    'sort.prefix': 'Sorted by:',
    'sort.modal_title': 'Sort by',
    'loading.text': 'Loading taskers...',
    'error.title': 'Error loading taskers',
    'error.body': 'Please try again later',
    'empty.title': 'No pros found',
    'empty.body': 'Try adjusting your filters or search in a different category',
  });
  const categoryId = params.categoryId as string;
  const categoryName = params.categoryName as string;
  const serviceName = params.service as string;

  // Form responses from dynamic form in LocationSelectionSheet
  const formResponses = params.formResponses as string | undefined;

  // Legacy params for backwards compatibility
  const taskSize = params.taskSize as string | undefined;
  const vehicleRequirement = params.vehicleRequirement as string | undefined;
  const taskDetails = params.taskDetails as string | undefined;

  // Get client location from store
  const location = useLocationStore((state) => state.location);

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('Recommended');

  // State for work area filtering
  const [workAreaCache, setWorkAreaCache] = useState<Record<string, WorkArea | null>>({});
  const [isFilteringByWorkArea, setIsFilteringByWorkArea] = useState(false);

  // State for availability caching
  const [availabilityCache, setAvailabilityCache] = useState<Record<string, AvailabilitySlot[]>>({});

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

  // Fetch work areas and availability for all handymen (when handymen data is available)
  useEffect(() => {
    const fetchWorkAreasAndAvailability = async () => {
      if (!handymen || handymen.length === 0) return;

      setIsFilteringByWorkArea(true);
      const workAreas: Record<string, WorkArea | null> = {};
      const availability: Record<string, AvailabilitySlot[]> = {};

      // Fetch work areas and availability in parallel (with a limit to avoid too many concurrent requests)
      const batchSize = 5;
      for (let i = 0; i < handymen.length; i += batchSize) {
        const batch = handymen.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map(async (h) => {
            try {
              const [workArea, slots] = await Promise.all([
                location?.latitude && location?.longitude
                  ? getWorkAreaByUserId(h.user_id)
                  : Promise.resolve(null),
                getAvailabilityByUserId(h.user_id),
              ]);
              return { userId: h.user_id, workArea, slots: slots || [] };
            } catch (error) {
              console.error(`Error fetching data for ${h.user_id}:`, error);
              return { userId: h.user_id, workArea: null, slots: [] };
            }
          })
        );
        results.forEach(({ userId, workArea, slots }) => {
          workAreas[userId] = workArea;
          availability[userId] = slots;
        });
      }

      setWorkAreaCache(workAreas);
      setAvailabilityCache(availability);
      setIsFilteringByWorkArea(false);
    };

    fetchWorkAreasAndAvailability();
  }, [handymen, location?.latitude, location?.longitude]);

  // Filter handymen by work area coverage
  const filteredHandymen = useMemo(() => {
    if (!handymen) return null;
    if (!location?.latitude || !location?.longitude) return handymen; // No location, show all

    // If we're still loading work areas, show all (they'll be filtered once loaded)
    if (Object.keys(workAreaCache).length === 0 && isFilteringByWorkArea) {
      return handymen;
    }

    const clientLocation: Coordinate = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    return handymen.filter((h) => {
      const workArea = workAreaCache[h.user_id];

      // If no work area is set, include the handyman (they service all areas)
      if (!workArea) return true;

      // Check if client location is in the work area
      try {
        return isLocationInWorkArea(clientLocation, workArea);
      } catch (error) {
        console.error(`Error checking work area for ${h.user_id}:`, error);
        return true; // Include on error
      }
    });
  }, [handymen, workAreaCache, location?.latitude, location?.longitude, isFilteringByWorkArea]);

  // Helper function to calculate next available date for a tasker
  const getNextAvailability = (slots: AvailabilitySlot[]): string | null => {
    if (!slots || slots.length === 0) return null;

    // Check up to 14 days ahead
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateValue = formatDateOnly(date);
      const hasAvailability = slots.some((slot) =>
        doesAvailabilitySlotApplyToDate(slot, dateValue),
      );
      if (hasAvailability) {
        if (i === 0) return 'today';
        if (i === 1) return 'tomorrow';
        // Format as "Tue, Dec 24"
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const day = date.getDate();
        return `${dayName}, ${monthName} ${day}`;
      }
    }
    return null; // No availability in next 14 days
  };

  // Transform handymen data to TaskerData format
  const taskers: TaskerData[] = useMemo(() => {
    if (!filteredHandymen) return []; // No data available yet

    return filteredHandymen.map((handyman) => {
      const slots = availabilityCache[handyman.user_id] || [];
      const nextAvailability = getNextAvailability(slots);

      return {
        id: handyman.user_id,
        name: handyman.display_name || 'Handyman',
        avatarUrl: handyman.avatar_url || '',
        rating: handyman.rating,
        reviewCount: handyman.review_count || 0,
        pricePerHour: handyman.hourly_rate_cents / 100,
        taskCount: handyman.jobs_completed,
        taskType: `${serviceName || 'tasks'}`,
        description: handyman.bio || 'Experienced professional ready to help.',
        isSuperTasker: handyman.verified,
        nextAvailability,
      };
    });
  }, [filteredHandymen, serviceName, availabilityCache]);

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
        // Pass formResponses (new) or legacy params
        ...(formResponses ? { formResponses } : {}),
        ...(taskSize ? { taskSize } : {}),
        ...(vehicleRequirement ? { vehicleRequirement } : {}),
        ...(taskDetails ? { taskDetails } : {}),
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
        // Pass formResponses (new) or legacy params
        ...(formResponses ? { formResponses } : {}),
        ...(taskSize ? { taskSize } : {}),
        ...(vehicleRequirement ? { vehicleRequirement } : {}),
        ...(taskDetails ? { taskDetails } : {}),
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
          <Pressable onPress={() => goBackOrReplace(router, '/(client)/(tabs)/home')}>
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </Pressable>
          
          <Text
            className="flex-1 text-center text-lg"
            style={{ fontWeight: '600', color: '#000000' }}
          >
            {getAppContentValue(content, 'header.title', 'Select a Tasker')}
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
          {getAppContentValue(content, 'sort.prefix', 'Sorted by:')} {selectedSort}
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
            <Text className="text-sm text-gray-600 mt-3">
              {getAppContentValue(content, 'loading.text', 'Loading taskers...')}
            </Text>
          </View>
        ) : isError ? (
          <View className="flex-col items-center justify-center py-20 px-6">
            <Text className="text-base font-semibold text-gray-900 mb-2 text-center">
              {getAppContentValue(content, 'error.title', 'Error loading taskers')}
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              {getAppContentValue(content, 'error.body', 'Please try again later')}
            </Text>
          </View>
        ) : taskers.length === 0 ? (
          <View className="flex-col items-center justify-center py-20 px-6">
            <Text className="text-base font-semibold text-gray-900 mb-2 text-center">
              {getAppContentValue(content, 'empty.title', 'No pros found')}
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              {getAppContentValue(content, 'empty.body', 'Try adjusting your filters or search in a different category')}
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
                {getAppContentValue(content, 'sort.modal_title', 'Sort by')}
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
