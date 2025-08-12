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
import { Button, ButtonText } from '@/components/ui/button';

// Import lucide-react-native icons
import {
  ArrowLeft,
  Share2,
  MapPin,
  Heart,
  Star,
  MessageSquare,
} from 'lucide-react-native';

// --- Main Screen Component ---
export default function ProviderDetailsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box className="flex-1 bg-gray-50">
        {/* Section 1: Header */}
        <HStack className="items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <Pressable>
            <Icon as={ArrowLeft} size="xl" color="#1F2937" />
          </Pressable>
          <Heading size="md" className="font-semibold">Provider Details</Heading>
          <Pressable>
            <Icon as={Share2} size="xl" color="#1F2937" />
          </Pressable>
        </HStack>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Section 2: Provider Info */}
         <VStack className="bg-white p-4 space-y-4">
    {/* Top Row: Avatar, Name, and Favorite Icon */}
    <HStack className="justify-between items-start">
        <HStack className="items-start flex-1">
            {/* Avatar with Online Indicator */}
            <Box className="w-20 h-20">
                <Image
                    source={{ uri: 'https://i.pravatar.cc/150?u=marcus' }}
                    alt="Provider Avatar"
                    className="w-full h-full rounded-full"
                />
                <Box className="w-5 h-5 bg-green-500 rounded-full border-2 border-white absolute top-0 right-0" />
            </Box>
            {/* Name and Location */}
            <VStack className="ml-4 mt-1">
                <Heading size="xl">Marcus Johnson</Heading>
                <HStack className="items-center mt-1">
                    <Icon as={MapPin} size="sm" color="#6B7280" />
                    <Text className="text-gray-500 ml-1">0.8 miles away</Text>
                </HStack>
            </VStack>
        </HStack>
        <Pressable className="pl-2">
            <Icon as={Heart} size="xl" color="#CBD5E0" />
        </Pressable>
    </HStack>

    {/* CORRECTED: Stats Row with more accurate structure */}
    <HStack className="items-center">
        {/* Rating Block */}
        <HStack className="items-center">
            <Icon as={Star} size="md" color="#FBBF24" fill="#FBBF24" />
            <Text className="ml-1">
                <Text className="font-bold">4.9</Text>
                <Text className="text-gray-500"> (127 reviews)</Text>
            </Text>
        </HStack>
        {/* Jobs Completed Block */}
        <HStack className="items-center ml-6">
             <Text className="font-bold">89</Text>
             <Text className="text-gray-500 ml-1">jobs completed</Text>
        </HStack>
    </HStack>
    
    {/* Price and Availability Row */}
    <VStack>
        <Heading size="lg">$45/hour</Heading>
        <Text className="text-green-600 font-semibold text-sm">Available today at 2:00 PM</Text>
    </VStack>
</VStack>
          
          {/* Section 3: Professional Description & Skills */}
          <VStack className="bg-white px-4 pb-4 border-t border-gray-100">
              <Text className="text-gray-700 leading-6 mt-4">
                  Professional handyman with 8+ years of experience in home repairs, furniture assembly, and electrical work. Certified IKEA installer with excellent customer service record.
              </Text>
              <VStack className="mt-4">
                  <Heading size="md" className="mb-3">Skills & Specialties</Heading>
                  <HStack className="flex-wrap">
                      <Box className="bg-gray-100 rounded-full py-2 px-4 mr-2 mb-2">
                          <Text className="text-gray-800 font-medium">Furniture assembly</Text>
                      </Box>
                      <Box className="bg-gray-100 rounded-full py-2 px-4 mr-2 mb-2">
                          <Text className="text-gray-800 font-medium">IKEA certified</Text>
                      </Box>
                      <Box className="bg-gray-100 rounded-full py-2 px-4 mr-2 mb-2">
                          <Text className="text-gray-800 font-medium">Electrical basics</Text>
                      </Box>
                      <Box className="bg-gray-100 rounded-full py-2 px-4 mr-2 mb-2">
                          <Text className="text-gray-800 font-medium">Plumbing repair</Text>
                      </Box>
                      <Box className="bg-gray-100 rounded-full py-2 px-4 mr-2 mb-2">
                          <Text className="text-gray-800 font-medium">Wall mounting</Text>
                      </Box>
                  </HStack>
              </VStack>
          </VStack>

          {/* Section 4: Reviews */}
          <VStack className="p-4 mt-4 space-y-5 bg-white">
              <HStack className="justify-between items-center">
                  <Heading size="md">Reviews</Heading>
                  <Pressable>
                      <Text className="text-blue-500 font-semibold">See all</Text>
                  </Pressable>
              </HStack>

              {/* Review 1 */}
              <VStack className="border-b border-gray-100 pb-4">
                  <HStack className="justify-between items-start">
                      <HStack className="items-center space-x-3">
                          <Image source={{ uri: 'https://i.pravatar.cc/150?u=sarah' }} alt="Sarah M." className="w-10 h-10 rounded-full" />
                          <VStack>
                              <Text className="font-semibold">Sarah M.</Text>
                              <HStack>
                                  {[...Array(5)].map((_, i) => <Icon key={i} as={Star} fill={'#FBBF24'} color="#FBBF24" size="sm" className="stroke-none"/>)}
                              </HStack>
                          </VStack>
                      </HStack>
                      <Text className="text-gray-500 text-sm">2 days ago</Text>
                  </HStack>
                  <Text className="mt-2 text-gray-700 leading-5">Excellent work assembling my IKEA wardrobe. Very professional and cleaned up after himself. Would definitely book again!</Text>
              </VStack>

              {/* Review 2 */}
              <VStack className="border-b border-gray-100 pb-4">
                  <HStack className="justify-between items-start">
                      <HStack className="items-center space-x-3">
                          <Image source={{ uri: 'https://i.pravatar.cc/150?u=david' }} alt="David R." className="w-10 h-10 rounded-full" />
                          <VStack>
                              <Text className="font-semibold">David R.</Text>
                              <HStack>
                                  {[...Array(5)].map((_, i) => <Icon key={i} as={Star} fill={'#FBBF24'} color="#FBBF24" size="sm" className="stroke-none"/>)}
                              </HStack>
                          </VStack>
                      </HStack>
                      <Text className="text-gray-500 text-sm">1 week ago</Text>
                  </HStack>
                  <Text className="mt-2 text-gray-700 leading-5">Fixed my kitchen sink leak quickly and efficiently. Great communication and fair pricing.</Text>
              </VStack>

              {/* Review 3 */}
              <VStack>
                  <HStack className="justify-between items-start">
                      <HStack className="items-center space-x-3">
                          <Image source={{ uri: 'https://i.pravatar.cc/150?u=lisa' }} alt="Lisa K." className="w-10 h-10 rounded-full" />
                          <VStack>
                              <Text className="font-semibold">Lisa K.</Text>
                              <HStack>
                                  {[...Array(5)].map((_, i) => <Icon key={i} as={Star} fill={i < 4 ? '#FBBF24' : '#E5E7EB'} color={i < 4 ? '#FBBF24' : '#E5E7EB'} size="sm" className="stroke-none"/>)}
                              </HStack>
                          </VStack>
                      </HStack>
                      <Text className="text-gray-500 text-sm">2 weeks ago</Text>
                  </HStack>
                  <Text className="mt-2 text-gray-700 leading-5">Mounted my TV perfectly and helped organize cables. Very neat and professional work.</Text>
              </VStack>
          </VStack>
        </ScrollView>
        
        {/* Section 5: Bottom Action Bar */}
        <HStack className="absolute bottom-0 w-full p-4 bg-white border-t border-gray-200 space-x-4">
            <Button className="flex-1 bg-gray-200" action="secondary">
                <Icon as={MessageSquare} size="lg" color="#374151" className="mr-2"/>
                <ButtonText className="text-gray-800 font-bold">Message</ButtonText>
            </Button>
            <Button className="flex-1" style={{ backgroundColor: '#D9896C' }}>
                <ButtonText className="font-bold">Select Provider</ButtonText>
            </Button>
        </HStack>
      </Box>
    </SafeAreaView>
  );
}