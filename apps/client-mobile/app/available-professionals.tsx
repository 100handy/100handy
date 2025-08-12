import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import gluestack-ui components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { Input, InputField, InputSlot } from '@/components/ui/input';

// Import Header component
import Header from '@/components/Header';

// Import all necessary lucide-react-native icons
import {
  Search,
  Star,
  Home,
  Heart, // Correct icon for "Saved"
  User,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';


// --- Data with Category for color-coding ---
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
  // ... Add other professionals as needed
];

// --- Color mapping for dynamic tag colors ---
const tagColors: { [key: string]: { bg: string; text: string } } = {
    plumbing:    { bg: '#FFE5E5', text: '#C53030' },
    cleaning:    { bg: '#F0FFF4', text: '#2F855A' },
    electrical:  { bg: '#EBF8FF', text: '#2B6CB0' },
    handyman:    { bg: '#FFF7ED', text: '#C2410C' },
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
      <Box className="flex-1 bg-gray-50">
        {/* Header */}
        <Header 
          title="Available Professionals"
          onBackPress={() => router.back()}
          onFilterPress={() => console.log('Filter pressed')}
          showFilterIcon={true}
          showBellIcon={false}
        />

        {/* Search and Filters */}
        <VStack className="bg-white pt-2 pb-4 px-4 border-b border-gray-200">
            <Input className="bg-gray-100 rounded-lg border-0 mb-4">
                <InputSlot className="pl-3">
                    <Icon as={Search} size="lg" color="#9CA3AF" />
                </InputSlot>
                <InputField placeholder="Search professionals..." />
            </Input>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack className="space-x-2">
                    {filterChips.map((chip) => (
                        <Pressable 
                            key={chip}
                            onPress={() => setActiveFilter(chip)}
                            // CORRECTED: Using inline style to force the correct background color
                            style={{
                                backgroundColor: activeFilter === chip ? '#4A5568' : '#F3F4F6'
                            }}
                            className="py-2 px-4 rounded-full"
                        >
                            <Text 
                                className="font-medium"
                                style={{ color: activeFilter === chip ? '#FFFFFF' : '#374151' }}
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
              // CORRECTED: Added a stronger shadow to the card
              <Box key={prof.name} className="bg-white rounded-xl p-4 mb-4 shadow-md">
                <HStack>
                  <Image source={{ uri: prof.avatarUrl }} alt={prof.name} className="w-14 h-14 rounded-full" />
                  <VStack className="flex-1 ml-4">
                    <Heading size="sm">{prof.name}</Heading>
                    <HStack className="items-center mt-1">
                      <StarRating rating={prof.rating} />
                      <Text size="sm" className="text-gray-500 ml-2">{`${prof.rating.toFixed(1)} (${prof.reviews} reviews)`}</Text>
                    </HStack>
                  </VStack>
                  <Heading size="sm" className="text-gray-800">{`$${prof.price}/hr`}</Heading>
                </HStack>
                <Text className="my-3 text-gray-600 text-sm leading-5">{prof.description}</Text>
                <HStack className="flex-wrap">
                  {prof.tags.map(tag => {
                    const colors = tagColors[prof.category] || tagColors.handyman;
                    return (
                        <Box key={tag} style={{backgroundColor: colors.bg}} className="rounded-full py-1 px-3 mr-2 mb-2">
                            <Text size="xs" style={{color: colors.text}} className="font-medium">{tag}</Text>
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