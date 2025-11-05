import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
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
  ChevronRight
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Category {
  id: string;
  name: string;
  icon: any;
  group: string;
}

const ALL_CATEGORIES: Category[] = [
  // Main Services
  { id: '1', name: 'Furniture & Assembly', icon: Armchair, group: 'Services' },
  { id: '2', name: 'Home Cleaning & Maintenance', icon: Sparkles, group: 'Services' },
  { id: '3', name: 'Handyman & Home Repairs', icon: Wrench, group: 'Services' },
  { id: '4', name: 'Moving & Heavy Lifting', icon: Truck, group: 'Services' },
  { id: '5', name: 'Mounting & Installation', icon: Monitor, group: 'Services' },
  { id: '6', name: 'Yard & Outdoor Services', icon: Flower2, group: 'Services' },
  { id: '7', name: 'Errands, Shopping & Delivery', icon: ShoppingBag, group: 'Services' },
  { id: '8', name: 'Personal & Virtual Assistance', icon: Briefcase, group: 'Services' },
  { id: '9', name: 'Family & Baby Prep', icon: Baby, group: 'Services' },
  { id: '10', name: 'Office Services', icon: Building, group: 'Services' },
  { id: '11', name: 'Seasonal Services', icon: Snowflake, group: 'Services' },
  { id: '12', name: 'Contactless & Online Tasks', icon: Wifi, group: 'Services' },

  // Experiences
  { id: '13', name: 'Personal & Social Entertainment', icon: Music, group: 'Experiences' },
  { id: '14', name: 'Creative & Artistic Experiences', icon: Palette, group: 'Experiences' },
  { id: '15', name: 'Relaxation & Luxury', icon: Heart, group: 'Experiences' },
  { id: '16', name: 'Food & Dining Experiences', icon: Coffee, group: 'Experiences' },
  { id: '17', name: 'Family & Group Entertainment', icon: Users, group: 'Experiences' },
  { id: '18', name: 'Fitness & Interactive Fun', icon: Dumbbell, group: 'Experiences' },
  { id: '19', name: 'Seasonal & Themed Experiences', icon: Calendar, group: 'Experiences' },
  { id: '20', name: 'Photography & Media', icon: Camera, group: 'Experiences' },

  // Beauty & Grooming
  { id: '21', name: 'Hair Services', icon: Scissors, group: 'Beauty & Grooming' },
  { id: '22', name: 'Hair Removal', icon: Wind, group: 'Beauty & Grooming' },
  { id: '23', name: 'Face & Beauty', icon: Smile, group: 'Beauty & Grooming' },
  { id: '24', name: 'Nails', icon: Hand, group: 'Beauty & Grooming' },
  { id: '25', name: 'Body Treatments', icon: Droplets, group: 'Beauty & Grooming' },
  { id: '26', name: 'Massage & Wellness', icon: HeartPulse, group: 'Beauty & Grooming' },
  { id: '27', name: 'Men\'s Grooming', icon: UserCircle, group: 'Beauty & Grooming' },
  { id: '28', name: 'Shared & Unisex Treatments', icon: Users, group: 'Beauty & Grooming' },
];

export default function SearchServicesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = searchQuery.trim()
    ? ALL_CATEGORIES.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ALL_CATEGORIES;

  const groupedCategories = filteredCategories.reduce((acc, category) => {
    if (!acc[category.group]) {
      acc[category.group] = [];
    }
    acc[category.group].push(category);
    return acc;
  }, {} as Record<string, Category[]>);

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: '/(client)/select-tasker',
      params: { service: categoryName },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header with Search */}
      <VStack className="px-5 py-3 bg-white border-b border-gray-200">
        <HStack className="items-center gap-3">
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
        </HStack>
      </VStack>

      {/* Categories List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {Object.keys(groupedCategories).length > 0 ? (
          <VStack className="py-4">
            {Object.entries(groupedCategories).map(([group, categories]) => (
              <VStack key={group} className="mb-6">
                {/* Group Header */}
                <Text className="font-worksans-bold text-[16px] text-[#30352D] px-5 mb-3">
                  {group}
                </Text>

                {/* Category Items */}
                <VStack>
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Pressable
                        key={category.id}
                        className="px-5 py-4 border-b border-gray-100"
                        onPress={() => handleCategoryPress(category.name)}
                      >
                        <HStack className="items-center justify-between">
                          <HStack className="items-center gap-3 flex-1">
                            <Box className="w-10 h-10 bg-[#F5F5F5] rounded-full items-center justify-center">
                              <Icon size={20} color="#30352D" strokeWidth={1.5} />
                            </Box>
                            <Text className="font-worksans text-[15px] text-[#30352D] flex-1">
                              {category.name}
                            </Text>
                          </HStack>
                          <ChevronRight size={20} color="#BDBDBD" strokeWidth={2} />
                        </HStack>
                      </Pressable>
                    );
                  })}
                </VStack>
              </VStack>
            ))}
          </VStack>
        ) : (
          <VStack className="items-center justify-center py-20 px-6">
            <Box className="w-16 h-16 bg-[#F5F5F5] rounded-full items-center justify-center mb-4">
              <Search size={32} color="#6B6B6B" strokeWidth={1.5} />
            </Box>
            <Text className="font-worksans-semibold text-[16px] text-[#30352D] mb-2 text-center">
              No services found
            </Text>
            <Text className="font-worksans text-[14px] text-[#6B6B6B] text-center">
              Try searching with different keywords
            </Text>
          </VStack>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
