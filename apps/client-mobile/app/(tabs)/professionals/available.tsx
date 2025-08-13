import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Home, Search, Heart, User, Star } from 'lucide-react-native';
import Header from '@/components/Header';
import { SearchAndFilters, ProfessionalCard } from '@/components/available';
import { useRouter } from 'expo-router';


const professionalsData = [
  {
    name: 'Michael Rodriguez',
    avatarUrl: 'https://i.pravatar.cc/150?u=michael',
    rating: 4.9,
    reviews: 127,
    price: 45,
    description: 'Licensed plumber with 8+ years experience. Specializes in emergency repairs and bathroom renovations.',
    tags: ['Plumbing', 'Emergency Service', 'Licensed'],
    category: 'plumbing'
  },
  {
    name: 'Sarah Chen',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
    rating: 4.7,
    reviews: 89,
    price: 35,
    description: 'Professional house cleaner offering eco-friendly cleaning solutions for homes and offices.',
    tags: ['House Cleaning', 'Eco-Friendly', 'Deep Clean'],
    category: 'cleaning'
  },
  {
      name: 'David Thompson',
      avatarUrl: 'https://i.pravatar.cc/150?u=david',
      rating: 5.0,
      reviews: 156,
      price: 55,
      description: 'Certified electrician with expertise in smart home installations and electrical troubleshooting.',
      tags: ['Electrical', 'Smart Home', 'Certified'],
      category: 'electrical'
  }
];

// --- Color mapping for dynamic tag colors ---
const tagColors: { [key: string]: { bg: string; text: string } } = {
    plumbing:    { bg: 'rgba(163, 184, 153, 0.1)', text: '#A3B899' }, // sage/10 background
    cleaning:    { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' }, // emerald-custom/10 background
    electrical:  { bg: 'rgba(163, 184, 153, 0.1)', text: '#A3B899' }, // sage/10 background
    handyman:    { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' }, // emerald-custom/10 background
};

const filterChips = ['All', 'Highest Rated', 'Lowest Price', 'Nearest'];

// CORRECTED: This now matches the target image's bottom navigation
const navItems = [
    { icon: Home, label: 'Home', active: true},
    { icon: Search, label: 'Search'},
    { icon: Heart, label: 'Saved'},
    { icon: User, label: 'Profile'},
];

// --- Helper Component for Star Rating ---
const StarRating = ({ rating = 0 }) => (
  <HStack>
    {[...Array(5)].map((_, i) => (
      <Icon
        key={i}
        as={Star}
        fill={i < rating ? '#FBBF24' : '#E5E7EB'} // Fill logic corrected for solid stars
        size="sm"
        color={i < rating ? '#FBBF24' : '#E5E7EB'}
        className="stroke-none" // Prevents border on filled stars
      />
    ))}
  </HStack>
);


// --- Main Screen Component ---
export default function AvailableProfessionalsScreen() {
  const [activeFilter, setActiveFilter] = React.useState('All');
  const router = useRouter()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box className="flex-1 bg-gray-custom-50">
        {/* Header */}
        <Header 
          title="Available Professionals"
          onBackPress={() => router.back()}
          onFilterPress={() => console.log('Filter pressed')}
          showFilterIcon={true}
          showBellIcon={false}
        />

        {/* Search and Filters */}
        <VStack className="bg-white pt-2 pb-4 px-4 border-b border-gray-custom-200">
            <Input className="bg-gray-custom-100 rounded-lg border-0 mb-4">
                <InputSlot className="pl-3">
                    <Icon as={Search} size="lg" color="#9CA3AF" />
                </InputSlot>
                <InputField placeholder="Search professionals..." className="font-work-sans text-sm text-gray-custom-400" />
            </Input>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack className="space-x-2">
                    {filterChips.map((chip) => (
                        <Pressable 
                            key={chip}
                            onPress={() => setActiveFilter(chip)}
                            style={{
                                backgroundColor: activeFilter === chip ? '#A3B899' : '#F3F4F6'
                            }}
                            className="py-2 px-4 rounded-full"
                        >
                            <Text 
                                className="font-work-sans font-medium text-sm"
                                style={{ color: activeFilter === chip ? '#FFFFFF' : '#4B5563' }}
                            >
                                {chip}
                            </Text>
                        </Pressable>
                    ))}
                </HStack>
            </ScrollView>
        </VStack>

        {/* Professionals List */}
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <VStack className="p-4">
            {professionalsData.map((prof) => (
              <Box key={prof.name} className="bg-white rounded-lg border border-gray-custom-200 shadow-sm p-4 mb-4">
                <HStack>
                  <Image source={{ uri: prof.avatarUrl }} alt={prof.name} className="w-16 h-16 rounded-full object-cover" />
                  <VStack className="flex-1 ml-4">
                    <Heading className="font-cardo font-semibold text-base text-gray-custom-900">{prof.name}</Heading>
                    <HStack className="items-center mt-1">
                      <StarRating rating={prof.rating} />
                      <Text className="font-work-sans text-xs text-gray-custom-600 ml-2">{`${prof.rating.toFixed(1)} (${prof.reviews} reviews)`}</Text>
                    </HStack>
                  </VStack>
                  <Heading className="font-cardo font-semibold text-base text-sage">{`$${prof.price}/hr`}</Heading>
                </HStack>
                <Text className="my-3 font-work-sans text-sm text-gray-custom-600 leading-relaxed">{prof.description}</Text>
                <HStack className="flex-wrap">
                  {prof.tags.map(tag => {
                    const colors = tagColors[prof.category] || tagColors.handyman;
                    return (
                        <Box key={tag} style={{backgroundColor: colors.bg}} className="rounded-full py-1 px-3 mr-2 mb-2">
                            <Text style={{color: colors.text}} className="font-work-sans font-medium text-xs">{tag}</Text>
                        </Box>
                    )
                  })}
                </HStack>
              </Box>
            ))}
          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}