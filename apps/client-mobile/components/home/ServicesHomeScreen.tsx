import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { SearchBar } from './SearchBar';
import { ServiceSection } from './ServiceSection';
import {
  HomeIcon,
  WrenchIcon,
  CarIcon,
  HeartIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  ShirtIcon,
  UtensilsIcon,
  CameraIcon,
  PaintbrushIcon,
  ScissorsIcon,
  DumbbellIcon,
  MapPinIcon,
  SearchIcon,
  ZapIcon,
  DropletIcon,
  TreePineIcon,
  SparklesIcon,
} from 'lucide-react-native';
import ScreenWrapper from '../ui/ScreenWrapper';
import { HStack } from '../ui/hstack';
import { Pressable } from '../ui/pressable';
import { useCategories, Category } from '../../../../packages/shared/query';

// Icon mapping for categories
const categoryIcons: { [key: string]: any } = {
  'Cleaning': SparklesIcon,
  'Electrical': ZapIcon,
  'Furniture Assembly': WrenchIcon,
  'Gardening': TreePineIcon,
  'Handyman': WrenchIcon,
  'Painting': PaintbrushIcon,
  'Plumbing': DropletIcon,
  'TV Mounting': CarIcon,
};

// Color mapping based on Figma design
const getCategoryColor = (categoryName: string): string => {
  const colorMap: { [key: string]: string } = {
    // Sage Green (#A3B899)
    'Handyman': 'bg-sage-green',
    'Plumbing': 'bg-sage-green',
    'Electrical': 'bg-sage-green',
    'Pest Control': 'bg-sage-green',
    'Appliance Repair': 'bg-sage-green',
    'Digital Marketing': 'bg-sage-green',
    'Legal Services': 'bg-sage-green',
    'Graphic Design': 'bg-sage-green',
    'Auto Repair': 'bg-sage-green',
    'Towing': 'bg-sage-green',
    
    // Warm Taupe (#BFA28D)
    'Cleaning': 'bg-warm-taupe',
    'Painting': 'bg-warm-taupe',
    'Carpentry': 'bg-warm-taupe',
    'Gardening': 'bg-warm-taupe',
    'Massage Therapy': 'bg-warm-taupe',
    'Nutrition': 'bg-warm-taupe',
    'Beauty Services': 'bg-warm-taupe',
    'Yoga': 'bg-warm-taupe',
    'Car Detailing': 'bg-warm-taupe',
    
    // Clay Orange (#D9896C)
    'Accounting': 'bg-clay-orange',
    'Web Development': 'bg-clay-orange',
    'Business Consulting': 'bg-clay-orange',
    'Personal Training': 'bg-clay-orange',
    'Mental Health': 'bg-clay-orange',
  };
  
  return colorMap[categoryName] || 'bg-sage-green'; // Default to sage green
};

// Helper function to convert category to service format
const categoryToService = (category: Category) => ({
  bg: getCategoryColor(category.name),
  icon: categoryIcons[category.name] || WrenchIcon,
  title: category.name,
  subtitle: category.description || `Professional ${category.name.toLowerCase()} services`,
});

export function ServicesHomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: categories = [], isLoading: loading, error } = useCategories();

  if (error) {
    console.error('Error fetching categories:', error);
  }

  // Organize categories into sections
  const homeServices = categories
    .filter(cat => ['Cleaning', 'Handyman', 'Plumbing'].includes(cat.name))
    .map(categoryToService);
  
  const personalServices = categories
    .filter(cat => ['Electrical', 'TV Mounting'].includes(cat.name))
    .map(categoryToService);
  
  const lifestyleServices = categories
    .filter(cat => ['Furniture Assembly', 'Painting', 'Gardening'].includes(cat.name))
    .map(categoryToService);

  const handleLocationPress = () => {
    console.log('Location pressed');
  };

  const handleSearchPress = () => {
    console.log('Search pressed with query:', searchQuery);
  };

  return (
    <ScreenWrapper>
    <ScrollView className="flex-1 bg-theme-background" showsVerticalScrollIndicator={false}>
      <VStack className="pt-4">
          <HStack className="items-center justify-between mb-4">
              <Pressable className="w-10 h-10 rounded-full items-center justify-center shadow-sm"
                style={{ backgroundColor: 'white' }}>
                <MapPinIcon size={20} color="black" />
              </Pressable>
              <Pressable className="w-10 h-10 rounded-full items-center justify-center shadow-sm"
                style={{ backgroundColor: 'white' }}>
                <SearchIcon size={20} color="black" />
              </Pressable>
            </HStack>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
    
        />
        
        <VStack className="px-4">
          {loading ? (
            <VStack className="items-center justify-center py-8">
              <Text className="text-gray-500">Loading services...</Text>
            </VStack>
          ) : (
            <>
              <ServiceSection title="Home Services" services={homeServices} />
              <ServiceSection title="Personal Services" services={personalServices} />
              <ServiceSection title="Lifestyle Services" services={lifestyleServices} />
            </>
          )}
        </VStack>
      </VStack>
    </ScrollView>
    </ScreenWrapper>
  );
}