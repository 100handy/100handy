import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import gluestack-ui components
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
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <Pressable>
            <ArrowLeft size={28} color="#1F2937" />
          </Pressable>
          <Text className="text-base font-semibold">Choose Category</Text>
          {/* Spacer to keep title centered */}
          <View className="w-6" />
        </View>

        {/* Search Bar */}
        <View className="p-4 bg-white">
            <Input className="bg-gray-100 rounded-lg border-0" size="lg">
                <InputField placeholder="Search categories..." />
                <InputSlot className="pr-3">
                    <Search size={24} color="#9CA3AF" />
                </InputSlot>
            </Input>
        </View>

        {/* Category List */}
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <View className="flex-col space-y-3">
            {categoryData.map((category) => (
              <Pressable key={category.title} className='my-2'>
                <View className="flex-row bg-white p-4 rounded-xl items-center">
                    <View style={{ backgroundColor: category.color }} className="w-14 h-14 rounded-xl items-center justify-center">
                        {React.createElement(category.icon, { size: 28, color: 'white' })}
                    </View>
                    <View className="flex-col flex-1 ml-4">
                        <Text className="text-sm font-semibold">{category.title}</Text>
                        <Text className="text-sm text-gray-500 mt-1">{category.description}</Text>
                    </View>
                    <ChevronRight size={24} color="#CBD5E0" />
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
        
      
      </View>
    </SafeAreaView>
  );
}