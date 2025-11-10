import React, { useState } from 'react';
import { ScrollView, ActivityIndicator, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import {
  ChevronLeft,
  Search,
  Armchair,
  Sparkles,
  Wrench,
  Truck,
  Monitor,
  Flower2,
  ShoppingBag,
  Briefcase,
  Baby,
  Building,
  Snowflake,
  Wifi,
  Music,
  Palette,
  Heart,
  Coffee,
  Users,
  Dumbbell,
  Calendar,
  Camera,
  Scissors,
  Wind,
  Smile,
  Hand,
  Droplets,
  HeartPulse,
  UserCircle,
  ChevronRight,
  Home,
  PaintRoller,
  Hammer,
  Laptop,
  Car,
  LucideIcon,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useCategories } from '@shared/supabase';
import LocationSelectionSheet from '@/components/tasker/LocationSelectionSheet';

// Icon mapping function - maps category names/keywords to icons
const getCategoryIcon = (categoryName: string): LucideIcon => {
  const name = categoryName.toLowerCase();

  // Map based on keywords in category name
  if (name.includes('furniture') || name.includes('assembly')) return Armchair;
  if (name.includes('clean')) return Sparkles;
  if (name.includes('handyman') || name.includes('repair') || name.includes('maintenance')) return Wrench;
  if (name.includes('moving') || name.includes('lifting') || name.includes('delivery')) return Truck;
  if (name.includes('mount') || name.includes('installation') || name.includes('tv')) return Monitor;
  if (name.includes('yard') || name.includes('lawn') || name.includes('garden') || name.includes('outdoor') || name.includes('landscaping')) return Flower2;
  if (name.includes('shopping') || name.includes('errand')) return ShoppingBag;
  if (name.includes('assistant') || name.includes('virtual') || name.includes('office')) return Briefcase;
  if (name.includes('baby') || name.includes('family') || name.includes('child')) return Baby;
  if (name.includes('seasonal') || name.includes('holiday')) return Snowflake;
  if (name.includes('contactless') || name.includes('online') || name.includes('tech')) return Wifi;
  if (name.includes('entertainment') || name.includes('music') || name.includes('event')) return Music;
  if (name.includes('creative') || name.includes('artistic') || name.includes('art')) return Palette;
  if (name.includes('relaxation') || name.includes('luxury') || name.includes('spa')) return Heart;
  if (name.includes('food') || name.includes('dining') || name.includes('cook') || name.includes('chef')) return Coffee;
  if (name.includes('group') || name.includes('social')) return Users;
  if (name.includes('fitness') || name.includes('gym') || name.includes('workout')) return Dumbbell;
  if (name.includes('themed') || name.includes('experience')) return Calendar;
  if (name.includes('photography') || name.includes('photo') || name.includes('media')) return Camera;
  if (name.includes('hair') || name.includes('salon') || name.includes('barber')) return Scissors;
  if (name.includes('removal') || name.includes('wax')) return Wind;
  if (name.includes('face') || name.includes('beauty') || name.includes('facial') || name.includes('makeup')) return Smile;
  if (name.includes('nail') || name.includes('manicure') || name.includes('pedicure')) return Hand;
  if (name.includes('body') || name.includes('treatment')) return Droplets;
  if (name.includes('massage') || name.includes('wellness') || name.includes('spa')) return HeartPulse;
  if (name.includes('men') || name.includes('grooming')) return UserCircle;
  if (name.includes('paint')) return PaintRoller;
  if (name.includes('building') || name.includes('construction')) return Hammer;
  if (name.includes('computer') || name.includes('laptop')) return Laptop;
  if (name.includes('car') || name.includes('automotive') || name.includes('vehicle')) return Car;

  // Default icon
  return Home;
};

// Determine group based on category name
const getCategoryGroup = (categoryName: string): string => {
  const name = categoryName.toLowerCase();

  // Beauty & Grooming keywords
  if (
    name.includes('hair') ||
    name.includes('nail') ||
    name.includes('face') ||
    name.includes('beauty') ||
    name.includes('massage') ||
    name.includes('spa') ||
    name.includes('grooming') ||
    name.includes('wax') ||
    name.includes('treatment')
  ) {
    return 'Beauty & Grooming';
  }

  // Experiences keywords
  if (
    name.includes('entertainment') ||
    name.includes('music') ||
    name.includes('creative') ||
    name.includes('art') ||
    name.includes('relaxation') ||
    name.includes('luxury') ||
    name.includes('dining') ||
    name.includes('food') ||
    name.includes('fitness') ||
    name.includes('event') ||
    name.includes('photography') ||
    name.includes('experience')
  ) {
    return 'Experiences';
  }

  // Default to Services
  return 'Services';
};

export default function SearchServicesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ id: '', name: '' });
  const { data: categories, isLoading, isError } = useCategories();

  // Transform database categories to include icon and group
  const transformedCategories = React.useMemo(() => {
    if (!categories) return [];

    return categories.map(category => ({
      ...category,
      icon: getCategoryIcon(category.name),
      group: getCategoryGroup(category.name),
    }));
  }, [categories]);

  // Filter categories based on search query
  const filteredCategories = searchQuery.trim()
    ? transformedCategories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transformedCategories;

  // Group categories by their group
  const groupedCategories = filteredCategories.reduce((acc, category) => {
    if (!acc[category.group]) {
      acc[category.group] = [];
    }
    acc[category.group].push(category);
    return acc;
  }, {} as Record<string, typeof transformedCategories>);

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
        ) : Object.keys(groupedCategories).length > 0 ? (
          <View className="flex-col py-4">
            {Object.entries(groupedCategories).map(([group, categoryList]) => (
              <View className="flex-col" key={group} className="mb-6">
                {/* Group Header */}
                <Text className="font-worksans-bold text-[16px] text-[#30352D] px-5 mb-3">
                  {group}
                </Text>

                {/* Category Items */}
                <View className="flex-col">
                  {categoryList.map((category) => {
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
              </View>
            ))}
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
