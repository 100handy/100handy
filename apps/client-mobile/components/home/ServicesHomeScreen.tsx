import React, { useMemo, useCallback } from 'react';
import { useGroupedSubcategories, type Category } from '@shared/query';
import { ScrollView, TouchableOpacity, ActivityIndicator, View, Text, Pressable } from 'react-native'; import AuthLogo from '@/components/auth/AuthLogo'; import {   MapPin, Search, ChevronRight, } from 'lucide-react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { useRouter } from 'expo-router'; import { useLocationStore } from '@shared/store';
import LocationSelectionSheet from '@/components/tasker/LocationSelectionSheet';
import { getCategoryIcon } from '@/lib/category-icons';

// Subcategory card component for horizontal scroll
interface SubcategoryCardProps {
  category: Category;
  index: number;
  onPress: () => void;
}

const SubcategoryCard = React.memo(function SubcategoryCard({ category, index, onPress }: SubcategoryCardProps) {
  const Icon = getCategoryIcon(category.name);
  // Alternating colors matching original design
  const bgColor = index % 2 === 0 ? '#30352d' : '#BFA28D';

  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center mr-3 rounded-2xl"
      style={{
        width: 120,
        height: 100,
        backgroundColor: bgColor,
        padding: 12,
      }}
    >
      <Icon size={32} color="white" strokeWidth={1.5} />
      <Text
        className="text-xs text-center text-white mt-2"
        style={{ fontWeight: '500' }}
        numberOfLines={2}
      >
        {category.name}
      </Text>
    </Pressable>
  );
});

// Section component for horizontal category row
interface CategorySectionProps {
  title: string;
  subcategories: Category[];
  onSelectCategory: (id: string, name: string) => void;
}

const CategorySection = React.memo(function CategorySection({ title, subcategories, onSelectCategory }: CategorySectionProps) {
  if (subcategories.length === 0) return null;

  return (
    <View className="mb-6">
      {/* Section Header */}
      <View className="px-5 mb-3 flex-row items-center justify-between">
        <Text className="text-lg text-stone-900" style={{ fontWeight: '700' }}>
          {title}
        </Text>
        <ChevronRight size={20} color="#9CA3AF" />
      </View>

      {/* Horizontal Scroll of Subcategories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {subcategories.map((subcategory, index) => (
          <SubcategoryCard
            key={subcategory.id}
            category={subcategory}
            index={index}
            onPress={() => onSelectCategory(subcategory.id, subcategory.name)}
          />
        ))}
      </ScrollView>
    </View>
  );
});

export function ServicesHomeScreen() {
  const router = useRouter();
  const { location } = useLocationStore();
  const { data: groupedCategories, isLoading } = useGroupedSubcategories();
  const [showBookingSheet, setShowBookingSheet] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState({ id: '', name: '' });

  // Parse location for display
  const getLocationDisplay = () => {
    if (!location || !location.streetAddress) {
      return {
        line1: 'Set your location',
        line2: ''
      };
    }

    // Extract main address and postal code
    const parts = location.streetAddress.split(',').map(p => p.trim());

    if (parts.length >= 2) {
      // Show first part (street) + city
      const line1 = `${parts[0]}${parts[1] ? ', ' + parts[1] : ''}`;
      // Show remaining parts (postal code, country)
      const line2 = parts.slice(2).join(', ') || location.country || '';
      return { line1, line2 };
    }

    return {
      line1: location.streetAddress,
      line2: location.country || ''
    };
  };

  const locationDisplay = getLocationDisplay();

  const chipRows = useMemo(() => {
    if (!groupedCategories || groupedCategories.length === 0) return [];
    const allSubcategories = groupedCategories
      .filter(group => group.name.toLowerCase() !== 'experiences')
      .flatMap(group => group.subcategories);
    const chipsPerRow = 3;
    const rows: Category[][] = [];
    for (let i = 0; i < Math.min(allSubcategories.length, 15); i += chipsPerRow) {
      rows.push(allSubcategories.slice(i, i + chipsPerRow));
    }
    return rows;
  }, [groupedCategories]);

  const handleServicePress = useCallback((categoryId: string, categoryName: string) => {
    if (!categoryId || !categoryName) {
      // If no category info, navigate to search instead
      router.push('/(client)/search-services');
      return;
    }
    setSelectedCategory({ id: categoryId, name: categoryName });
    setShowBookingSheet(true);
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        <View className="flex-1 flex-col">
          {/* Header Section */}
          <View className="bg-white px-5 pt-4 pb-4 flex-col">
            <View className="items-center justify-between flex-row">
              <AuthLogo size="compact" variant="green" />
              <Pressable onPress={() => router.push('/(client)/location')}>
                <View className="items-end gap-0 flex-col">
                  <View className="items-center gap-1 flex-row">
                    <Text className="text-xs text-stone-800" style={{ fontWeight: '400' }} numberOfLines={1}>
                      {locationDisplay.line1}
                    </Text>
                    <MapPin size={16} color="#ff6b35" />
                  </View>
                  <Text className="text-xs text-stone-800" style={{ fontWeight: '400' }} numberOfLines={1}>
                    {locationDisplay.line2}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Search Section with Dark Background */}
          <View className="px-5 pt-5 pb-5 flex-col" style={{ backgroundColor: '#30352D' }}>
            <Text className="text-xl font-bold text-white mb-4">
              What task do you need done?
            </Text>

            {/* Search Input - Navigate to Search Screen */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                router.push('/(client)/search-services');
              }}
            >
              <View
                className="rounded-xl px-4 py-3 items-center gap-3 flex-row"
                style={{ backgroundColor: '#4a4e4d', borderWidth: 1, borderColor: '#5a5e5d' }}
              >
                <Search size={18} color="#8b9199" />
                <Text style={{ color: '#8b9199', fontSize: 15 }}>
                  Try: painting, moving, repairs
                </Text>
              </View>
            </TouchableOpacity>

            {/* Quick-Select Chips - Multiple horizontal scrollable rows */}
            {chipRows.length > 0 && (
              <View className="mt-4" style={{ gap: 10 }}>
                {chipRows.map((row, rowIndex) => (
                  <ScrollView
                    key={rowIndex}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8 }}
                  >
                    {row.map((subcategory) => (
                      <Pressable
                        key={subcategory.id}
                        onPress={() => handleServicePress(subcategory.id, subcategory.name)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: '#6b7280',
                          backgroundColor: 'transparent',
                        }}
                      >
                        <Text style={{ color: '#f3e3d3', fontSize: 14, fontWeight: '500' }}>
                          {subcategory.name}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                ))}
              </View>
            )}
          </View>

          {/* Section Title */}
          <View className="px-5 pt-5 pb-4 bg-white flex-col">
            <Text className="text-xl text-stone-900 mb-1" style={{ fontWeight: '700' }}>
              Need Something done?
            </Text>
            <Text className="text-sm text-gray-600" style={{ fontWeight: '400' }}>
              Browse our top trending categories
            </Text>
          </View>

          {/* Categories Sections */}
          <View className="pb-6 bg-white flex-col">
            {isLoading ? (
              <View className="items-center justify-center py-12 flex-col">
                <ActivityIndicator size="large" color="#30352d" />
                <Text className="text-sm text-gray-600 mt-3">Loading categories...</Text>
              </View>
            ) : groupedCategories && groupedCategories.length > 0 ? (
              groupedCategories
                .filter((group) => group.name.toLowerCase() !== 'experiences')
                .map((group) => (
                  <CategorySection
                    key={group.id}
                    title={group.name.toLowerCase() === 'clean' ? 'Domestic Cleaning' : group.name}
                    subcategories={group.subcategories}
                    onSelectCategory={handleServicePress}
                  />
                ))
            ) : (
              <View className="items-center justify-center py-12 px-6 flex-col">
                <Text className="text-base font-semibold text-gray-900 mb-2 text-center">
                  No services available
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Please check back later
                </Text>
              </View>
            )}
          </View>
        </View>
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
