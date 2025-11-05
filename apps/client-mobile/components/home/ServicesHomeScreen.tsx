import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  MapPin,
  Search,
  Armchair,
  Sparkles,
  Wrench,
  Truck,
  Flower2,
  ShoppingBag,
  Baby,
  Music,
  Scissors,
  HeartPulse,
  Coffee,
  Camera,
  Monitor,
  Briefcase,
} from 'lucide-react-native';
import { HStack } from '../ui/hstack';
import { Pressable } from '../ui/pressable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocationStore } from '@shared/supabase';

// Service chip data for horizontal scrollable rows
const serviceChips = [
  ['Furniture Assembly', 'Home Cleaning', 'Handyman'],
  ['Moving & Lifting', 'TV Mounting', 'Yard Work'],
  ['Grocery Shopping', 'Delivery', 'Virtual Assistant'],
  ['Babysitting', 'Office Services', 'Seasonal Help'],
  ['Event Planning', 'Photography', 'Personal Chef'],
];

// Service cards data with icons and colors (matching Figma design)
// Dark charcoal: #30352d, Terracotta/clay: #BFA28D
const serviceCards = [
  { title: 'Furniture & Assembly', icon: Armchair, bgColor: '#30352d' },
  { title: 'Home Cleaning', icon: Sparkles, bgColor: '#BFA28D' },
  { title: 'Handyman & Repairs', icon: Wrench, bgColor: '#BFA28D' },
  { title: 'Moving & Lifting', icon: Truck, bgColor: '#30352d' },
  { title: 'Yard & Outdoor', icon: Flower2, bgColor: '#30352d' },
  { title: 'Shopping & Delivery', icon: ShoppingBag, bgColor: '#BFA28D' },
  { title: 'Family & Baby Prep', icon: Baby, bgColor: '#BFA28D' },
  { title: 'Entertainment', icon: Music, bgColor: '#30352d' },
  { title: 'Hair Services', icon: Scissors, bgColor: '#30352d' },
  { title: 'Massage & Wellness', icon: HeartPulse, bgColor: '#BFA28D' },
  { title: 'Food & Dining', icon: Coffee, bgColor: '#BFA28D' },
  { title: 'Photography', icon: Camera, bgColor: '#30352d' },
  { title: 'Mounting & Installation', icon: Monitor, bgColor: '#30352d' },
  { title: 'Virtual Assistant', icon: Briefcase, bgColor: '#BFA28D' },
];

export function ServicesHomeScreen() {
  const router = useRouter();
  const { location } = useLocationStore();

  // Parse location for display
  const getLocationDisplay = () => {
    if (!location || !location.streetAddress) {
      return {
        line1: '16 Leicester Square, London',
        line2: 'WC2H 7LE, UK'
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

  const handleServicePress = (serviceName: string) => {
    router.push({
      pathname: '/(client)/select-tasker',
      params: { service: serviceName },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        <VStack className="flex-1">
        {/* Header Section */}
        <VStack className="bg-white px-5 pt-4 pb-4">
          <HStack className="items-center justify-between">
            <VStack className="gap-0">
              <Text className="text-xs text-gray-500" style={{ fontWeight: '400' }}>100</Text>
              <Text className="text-2xl text-stone-900" style={{ fontWeight: '700', letterSpacing: 0.5 }}>HANDY</Text>
            </VStack>
            <Pressable onPress={() => router.push('/(client)/location')}>
              <VStack className="items-end gap-0">
                <HStack className="items-center gap-1">
                  <Text className="text-xs text-stone-800" style={{ fontWeight: '400' }} numberOfLines={1}>
                    {locationDisplay.line1}
                  </Text>
                  <MapPin size={16} color="#ff6b35" />
                </HStack>
                <Text className="text-xs text-stone-800" style={{ fontWeight: '400' }} numberOfLines={1}>
                  {locationDisplay.line2}
                </Text>
              </VStack>
            </Pressable>
          </HStack>
        </VStack>

        {/* Search Section with Dark Background */}
        <VStack className="px-5 pt-5 pb-4" style={{ backgroundColor: '#30352D' }}>
          <Text className="text-xl font-bold text-white mb-4">
            What task do you need done?
          </Text>

          {/* Search Input - Navigate to Search Screen */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              console.log('Search pressed!');
              router.push('/(client)/search-services');
            }}
          >
            <HStack
              className="rounded-xl px-4 py-3 items-center gap-3"
              style={{ backgroundColor: '#4a4e4d', borderWidth: 1, borderColor: '#5a5e5d' }}
            >
              <Search size={18} color="#8b9199" />
              <Text style={{ color: '#8b9199', fontSize: 15 }}>
                Try: painting, moving, repairs
              </Text>
            </HStack>
          </TouchableOpacity>
        </VStack>

        {/* Horizontal Scrollable Service Chips */}
        <VStack className="py-3 gap-2.5" style={{ backgroundColor: '#30352D' }}>
          {serviceChips.map((row, rowIndex) => (
            <ScrollView
              key={rowIndex}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
            >
              {row.map((service, index) => (
                <Pressable
                  key={index}
                  className="px-6 py-2.5 rounded-full"
                  style={{ 
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: '#ffffff'
                  }}
                  onPress={() => handleServicePress(service)}
                >
                  <Text className="text-white text-sm" style={{ fontWeight: '500' }}>
                    {service}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ))}
        </VStack>

        {/* Section Title */}
        <VStack className="px-5 pt-5 pb-4 bg-white">
          <Text className="text-xl text-stone-900 mb-1" style={{ fontWeight: '700' }}>
            Need Something done?
          </Text>
          <Text className="text-sm text-gray-600" style={{ fontWeight: '400' }}>
            Browse our top trending categories
          </Text>
        </VStack>

        {/* Service Cards Grid */}
        <VStack className="px-5 pb-6 bg-white">
          <VStack className="gap-3">
            {Array.from({ length: Math.ceil(serviceCards.length / 2) }).map((_, rowIndex) => (
              <HStack key={rowIndex} className="gap-3">
                {serviceCards.slice(rowIndex * 2, rowIndex * 2 + 2).map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Pressable
                      key={index}
                      className="flex-1 rounded-2xl items-center justify-center"
                      style={{
                        backgroundColor: service.bgColor,
                        height: 140,
                        padding: 16
                      }}
                      onPress={() => handleServicePress(service.title)}
                    >
                      <VStack className="items-center gap-2">
                        <Icon size={36} color="white" strokeWidth={1.5} />
                        <Text className="text-white font-medium text-sm text-center">
                          {service.title}
                        </Text>
                      </VStack>
                    </Pressable>
                  );
                })}
              </HStack>
            ))}
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
    </SafeAreaView>
  );
}