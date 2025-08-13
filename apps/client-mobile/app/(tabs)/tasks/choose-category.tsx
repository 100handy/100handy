import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import gluestack-ui components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { Input, InputField, InputSlot } from '@/components/ui/input';

// Import lucide-react-native icons
import {
  ArrowLeft,
  Search,
  ChevronRight,
  Wrench,
  Sparkles,
  Leaf,
  Truck,
  PaintRoller,
  Hammer,
  Laptop,
  Car,
  Home,
  Heart,
  User,
} from 'lucide-react-native';

// --- Data for the screen ---
const categoryData = [
    { title: 'Home Repair & Maintenance', description: 'Plumbing, electrical, HVAC, general repairs', icon: Wrench, color: '#A3B899' },
    { title: 'Cleaning Services', description: 'House cleaning, deep cleaning, commercial cleaning', icon: Sparkles, color: '#D9896C' },
    { title: 'Landscaping & Lawn Care', description: 'Lawn maintenance, tree service, garden design', icon: Leaf, color: '#A3B899' },
    { title: 'Moving & Delivery', description: 'Local moving, furniture delivery, packing', icon: Truck, color: '#D9896C' },
    { title: 'Painting & Decorating', description: 'Interior painting, exterior painting, wallpaper', icon: PaintRoller, color: '#A3B899' },
    { title: 'Assembly & Installation', description: 'Furniture assembly, TV mounting, shelving', icon: Hammer, color: '#D9896C' },
    { title: 'Tech Support', description: 'Computer repair, smart home setup, networking', icon: Laptop, color: '#A3B899' },
    { title: 'Automotive Services', description: 'Car detailing, oil changes, minor repairs', icon: Car, color: '#D9896C' },
];

const navItems = [
    { icon: Home, label: 'Home', active: true},
    { icon: Search, label: 'Search'},
    { icon: Heart, label: 'Saved'},
    { icon: User, label: 'Profile'},
];

// --- Main Screen Component ---
export default function ChooseCategoryScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box className="flex-1 bg-gray-50">
        {/* Header */}
        <HStack className="items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <Pressable>
            <Icon as={ArrowLeft} size="xl" color="#1F2937" />
          </Pressable>
          <Heading size="md" className="font-semibold">Choose Category</Heading>
          {/* Spacer to keep title centered */}
          <Box className="w-6" />
        </HStack>

        {/* Search Bar */}
        <Box className="p-4 bg-white">
            <Input className="bg-gray-100 rounded-lg border-0" size="lg">
                <InputField placeholder="Search categories..." />
                <InputSlot className="pr-3">
                    <Icon as={Search} size="lg" color="#9CA3AF" />
                </InputSlot>
            </Input>
        </Box>

        {/* Category List */}
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <VStack className="space-y-3">
            {categoryData.map((category) => (
              <Pressable key={category.title} className='my-2'>
                <HStack className="bg-white p-4 rounded-xl items-center">
                    <Box style={{ backgroundColor: category.color }} className="w-14 h-14 rounded-xl items-center justify-center">
                        <Icon as={category.icon} color="white" size="xl"/>
                    </Box>
                    <VStack className="flex-1 ml-4">
                        <Heading size="sm">{category.title}</Heading>
                        <Text size="sm" className="text-gray-500 mt-1">{category.description}</Text>
                    </VStack>
                    <Icon as={ChevronRight} size="lg" color="#CBD5E0" />
                </HStack>
              </Pressable>
            ))}
          </VStack>
        </ScrollView>
        
      
      </Box>
    </SafeAreaView>
  );
}