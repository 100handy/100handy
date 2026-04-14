import React, { useState } from 'react';
import { ScrollView, ActivityIndicator, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import {
  ChevronLeft,
  Search,
  ChevronRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useCategoriesByLevel } from '@shared/supabase';
import LocationSelectionSheet from '@/components/tasker/LocationSelectionSheet';
import { getCategoryIcon } from '@/lib/category-icons';

export default function SearchServicesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ id: '', name: '' });
  const { data: categories, isLoading, isError } = useCategoriesByLevel(1);

  // Attach icon and filter by search query
  const filteredCategories = React.useMemo(() => {
    if (!categories) return [];
    const withIcon = categories.map(category => ({
      ...category,
      icon: getCategoryIcon(category.name),
    }));
    if (!searchQuery.trim()) return withIcon;
    return withIcon.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    setSelectedCategory({ id: categoryId, name: categoryName });
    setShowBookingSheet(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header with Search */}
      <View className="flex-col px-5 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => router.back()}>
            <ChevronLeft size={24} color="#30352D" strokeWidth={2} />
          </Pressable>

          <Input
            variant="outline"
            size="md"
            className="flex-1 rounded-xl bg-[#F5F5F5] border-0"
          >
            <InputSlot className="pl-3">
              <Search size={18} color="#6B6B6B" />
            </InputSlot>
            <InputField
              placeholder="Search for services..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#6B6B6B"
              style={{ color: '#30352D' }}
              autoFocus
            />
          </Input>
        </View>
      </View>

      {/* Categories List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View className="flex-col items-center justify-center py-20">
            <ActivityIndicator size="large" color="#30352D" />
            <Text className="font-worksans text-[14px] text-[#6B6B6B] mt-3">Loading categories...</Text>
          </View>
        ) : isError ? (
          <View className="flex-col items-center justify-center py-20 px-6">
            <Text className="font-worksans-semibold text-[16px] text-[#30352D] mb-2 text-center">
              Error loading categories
            </Text>
            <Text className="font-worksans text-[14px] text-[#6B6B6B] text-center">
              Please try again later
            </Text>
          </View>
        ) : filteredCategories.length > 0 ? (
          <View className="flex-col py-2">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Pressable
                  key={category.id}
                  className="px-5 py-4 border-b border-gray-100"
                  onPress={() => handleCategoryPress(category.id, category.name)}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="w-10 h-10 bg-[#F5F5F5] rounded-full items-center justify-center">
                        <Icon size={20} color="#30352D" strokeWidth={1.5} />
                      </View>
                      <Text className="font-worksans text-[15px] text-[#30352D] flex-1">
                        {category.name}
                      </Text>
                    </View>
                    <ChevronRight size={20} color="#BDBDBD" strokeWidth={2} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View className="flex-col items-center justify-center py-20 px-6">
            <View className="w-16 h-16 bg-[#F5F5F5] rounded-full items-center justify-center mb-4">
              <Search size={32} color="#6B6B6B" strokeWidth={1.5} />
            </View>
            <Text className="font-worksans-semibold text-[16px] text-[#30352D] mb-2 text-center">
              No services found
            </Text>
            <Text className="font-worksans text-[14px] text-[#6B6B6B] text-center">
              Try searching with different keywords
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Booking Action Sheet */}
      <LocationSelectionSheet
        isOpen={showBookingSheet}
        onClose={() => setShowBookingSheet(false)}
        categoryId={selectedCategory.id}
        categoryName={selectedCategory.name}
      />
    </SafeAreaView>
  );
}
