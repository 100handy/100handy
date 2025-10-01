import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  MapPin,
  Search,
  Paintbrush,
  Droplet,
  ShoppingBag,
  Dog,
  Baby,
  Truck,
  Armchair,
  Flower2,
} from 'lucide-react-native';
import { HStack } from '../ui/hstack';
import { Pressable } from '../ui/pressable';
import { Input, InputField, InputSlot, InputIcon } from '../ui/input';
import { SafeAreaView } from 'react-native-safe-area-context';

// Service chip data for horizontal scrollable rows
const serviceChips = [
  ['TV Mounting', 'Wall Paint', 'Repair'],
  ['Assembly', 'Moving', 'Airport Transfer'],
  ['Plumbing', 'Cooking', 'Cleaning'],
  ['Babysitting', 'Delivery', 'Electrical Work'],
  ['Gardening & Lawn Care', 'Grocery Shopping'],
];

// Service cards data with icons and colors (matching Figma design)
// Dark charcoal: #30352d, Terracotta/clay: #BFA28D
const serviceCards = [
  { title: 'Gardening', icon: Flower2, bgColor: '#30352d' },
  { title: 'Painting', icon: Paintbrush, bgColor: '#BFA28D' },
  { title: 'Cleaning', icon: Droplet, bgColor: '#BFA28D' },
  { title: 'Removals', icon: ShoppingBag, bgColor: '#30352d' },
  { title: 'Dog Walker', icon: Dog, bgColor: '#30352d' },
  { title: 'Babysitter', icon: Baby, bgColor: '#BFA28D' },
  { title: 'Moving', icon: Truck, bgColor: '#BFA28D' },
  { title: 'Assembly', icon: Armchair, bgColor: '#30352d' },
];

export function ServicesHomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

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
            <VStack className="items-end gap-0">
              <HStack className="items-center gap-1">
                <Text className="text-xs text-stone-800" style={{ fontWeight: '400' }}>16 Leicester Square, London</Text>
                <MapPin size={16} color="#ff6b35" />
              </HStack>
              <Text className="text-xs text-stone-800" style={{ fontWeight: '400' }}>WC2H 7LE, UK</Text>
            </VStack>
          </HStack>
        </VStack>

        {/* Search Section with Dark Background */}
        <VStack className="px-5 pt-5 pb-4" style={{ backgroundColor: '#30352D' }}>
          <Text className="text-xl font-bold text-white mb-4">
            What task do you need done?
          </Text>
          
          {/* Search Input */}
          <Input
            variant="outline"
            size="md"
            className="rounded-xl"
            style={{ backgroundColor: '#4a4e4d', borderWidth: 1, borderColor: '#5a5e5d' }}
          >
            <InputSlot className="pl-3">
              <Search size={18} color="#8b9199" />
            </InputSlot>
            <InputField
              placeholder="Try: painting, moving, repairs"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8b9199"
              style={{ color: '#ffffff' }}
            />
          </Input>
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
            {[0, 1, 2, 3].map((rowIndex) => (
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