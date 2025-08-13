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
import { Divider } from '@/components/ui/divider';

// Import lucide-react-native icons
import {
  ArrowLeft,
  MoreVertical,
  CheckCircle2,
  Clock,
  Edit,
  Wrench,
  MapPin,
  Star,
} from 'lucide-react-native';

// --- Helper Component for Star Rating ---
const StarRating = ({ rating = 0, reviews = 0 }) => (
  <HStack className="items-center">
    {[...Array(5)].map((_, i) => (
      <Icon
        key={i}
        as={Star}
        fill={i < rating ? '#FBBF24' : 'transparent'}
        size="sm"
        color={i < rating ? '#FBBF24' : '#CBD5E0'}
        className="stroke-none"
      />
    ))}
    <Text size="sm" className="text-gray-500 ml-2">{`${rating.toFixed(1)} (${reviews} reviews)`}</Text>
  </HStack>
);

// --- Helper Component for Calendar Icon ---
const CalendarIcon = ({ month, day }: { month: string; day: string | number }) => (
    <VStack className="items-center">
        <Box className="bg-red-500 rounded-t-md w-14 py-1">
            <Text className="text-white text-xs font-bold text-center">{month}</Text>
        </Box>
        <Box className="bg-gray-100 rounded-b-md w-14 py-1 items-center justify-center h-10">
            <Heading size="lg" className="text-gray-800">{day}</Heading>
        </Box>
    </VStack>
);

// --- Helper Component for Visa Icon ---
const VisaIcon = () => (
    <Box className="bg-[#1a1f71] rounded-sm w-10 h-6 justify-center items-center">
      <Text className="text-white font-bold italic text-[10px]">VISA</Text>
    </Box>
);

// --- Main Screen Component ---
export default function ManageBookingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box className="flex-1 bg-gray-50">
        {/* Header */}
        <HStack className="items-center justify-between px-4 py-3 bg-white">
          <Pressable>
            <Icon as={ArrowLeft} size="xl" color="#1F2937" />
          </Pressable>
          <Heading size="md" className="font-semibold">Manage Booking</Heading>
          <Pressable>
            <Icon as={MoreVertical} size="xl" color="#1F2937" />
          </Pressable>
        </HStack>
        

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
            {/* Booking Confirmed Card */}
            <VStack className="bg-white rounded-lg p-4 mb-4">
                <HStack className="items-center space-x-3">
                    <Box className="bg-green-100 rounded-full p-2">
                        <Icon as={CheckCircle2} size="xl" color="#48BB78" />
                    </Box>
                    <VStack>
                        <Heading size="sm" className="font-semibold">Booking Confirmed</Heading>
                        <Text size="sm" className="text-gray-500">Booking ID: #HND-2024-001</Text>
                    </VStack>
                </HStack>
                <HStack className="items-center space-x-3 bg-yellow-50 border border-yellow-300 rounded-lg p-3 mt-3">
                    <Icon as={Clock} size="lg" color="#D97706" />
                    <VStack className="flex-1">
                        <Text className="text-yellow-700 font-bold text-sm">Free cancellation until 6:00 PM today</Text>
                        <Text className="text-yellow-600 text-xs">After this time, cancellation fees may apply</Text>
                    </VStack>
                </HStack>
            </VStack>

            {/* Date & Time Card */}
            <VStack className="bg-white rounded-lg p-4 mb-4">
                <HStack className="items-center justify-between mb-3">
                    <Heading size="sm">Date & Time</Heading>
                    <Pressable>
                        <HStack className="items-center space-x-1">
                            <Icon as={Edit} size="sm" color="#EF4444" />
                            <Text className="text-red-500 font-semibold">Edit</Text>
                        </HStack>
                    </Pressable>
                </HStack>
                <HStack className="items-center space-x-3">
                    <VStack className="items-center bg-gray-100 rounded-lg p-2">
                        <Text className="font-bold text-red-500">FEB</Text>
                        <Text className="font-bold text-lg">15</Text>
                    </VStack>
                    <VStack>
                        <Text className="font-semibold">Tomorrow</Text>
                        <Text className="text-gray-500">2:00 PM - 4:00 PM (2 hours)</Text>
                    </VStack>
                </HStack>
            </VStack>

            {/* Task Details Card */}
            <VStack className="bg-white rounded-lg p-4 mb-4">
                <HStack className="items-center justify-between mb-3">
                    <Heading size="sm">Task Details</Heading>
                    <Pressable>
                        <HStack className="items-center space-x-1">
                            <Icon as={Edit} size="sm" color="#EF4444" />
                            <Text className="text-red-500 font-semibold">Edit</Text>
                        </HStack>
                    </Pressable>
                </HStack>
                <HStack className="items-start space-x-3">
                    <Icon as={Wrench} size="lg" color="#6B7280" />
                    <VStack className="flex-1">
                        <Text className="font-semibold">General handyman tasks</Text>
                        <Text className="text-gray-500">Fix leaky kitchen faucet and replace bathroom light fixture. Tools available in garage.</Text>
                    </VStack>
                </HStack>
            </VStack>

            {/* Location Card */}
            <VStack className="bg-white rounded-lg p-4 mb-4">
                <HStack className="items-center justify-between mb-3">
                    <Heading size="sm">Location</Heading>
                    <Pressable>
                        <HStack className="items-center space-x-1">
                            <Icon as={Edit} size="sm" color="#EF4444" />
                            <Text className="text-red-500 font-semibold">Edit</Text>
                        </HStack>
                    </Pressable>
                </HStack>
                <HStack className="items-start space-x-3">
                    <Icon as={MapPin} size="lg" color="#6B7280" />
                    <VStack>
                        <Text className="font-semibold">123 Main Street</Text>
                        <Text className="text-gray-500">London SW1A 1AA</Text>
                        <Text className="text-gray-500">Apartment 4B, buzz #4</Text>
                    </VStack>
                </HStack>
            </VStack>

            {/* Your Handy Card */}
            <Box className="bg-white rounded-lg p-4 mb-4">
                <HStack className="items-center justify-between">
                    <HStack className="items-center space-x-4">
                        <Image source={{ uri: 'https://i.pravatar.cc/150?u=mike' }} alt="Handyman" className="w-12 h-12 rounded-full" />
                        <VStack>
                            <Heading size="sm" className="font-semibold">Mike Johnson</Heading>
                            <StarRating rating={4.9} reviews={127}/>
                        </VStack>
                    </HStack>
                    <Pressable>
                        <Text className="text-red-600 font-semibold text-sm">Message</Text>
                    </Pressable>
                </HStack>
            </Box>

             {/* Payment Summary Card */}
             <Box className="bg-white rounded-lg p-4 mb-4">
                <VStack className="space-y-3">
                    <Heading size="sm" className="font-semibold">Payment Summary</Heading>
                    <VStack className="space-y-2 border-b border-gray-200 pb-3">
                        <HStack className="justify-between items-center">
                            <Text className="text-gray-600 text-sm">Service (2 hours)</Text>
                            <Text className="text-gray-800 text-sm font-medium">£40.00</Text>
                        </HStack>
                         <HStack className="justify-between items-center">
                            <Text className="text-gray-600 text-sm">Platform fee</Text>
                            <Text className="text-gray-800 text-sm font-medium">£5.00</Text>
                        </HStack>
                    </VStack>
                    <Divider />
                    <HStack className="justify-between items-center">
                        <Heading size="sm" className="font-semibold">Total</Heading>
                        <Heading size="sm" className="font-semibold">£45.00</Heading>
                    </HStack>
                     {/* FIX: Re-added the Visa/Card info section */}
                     <HStack className="items-center space-x-3 border-t border-gray-200 pt-3 mt-1">
                        <VisaIcon/>
                        <Text className="text-gray-600 text-sm tracking-wider">•••• 4242</Text>
                    </HStack>
                </VStack>
             </Box>
        </ScrollView>

        {/* Bottom Actions (Fixed) */}
        <Box className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <HStack className="justify-between">
            <Button
              variant="outline"
              className="w-[48%] rounded-lg"
              style={{ borderColor: '#EF4444' }}
              onPress={() => console.log('Cancel booking')}
            >
              <ButtonText style={{ color: '#EF4444' }} className="font-semibold">
                Cancel booking
              </ButtonText>
            </Button>
            <Button
              className="w-[48%] rounded-lg"
              style={{ backgroundColor: '#84a07c' }}
              onPress={() => console.log('Save changes')}
            >
              <ButtonText className="text-white font-semibold">
                Save changes
              </ButtonText>
            </Button>
          </HStack>
        </Box>
      </Box>
    </SafeAreaView>
  );
}