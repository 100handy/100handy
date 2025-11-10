import React from 'react';
import { Image } from 'expo-image';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';

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
  <View className="flex-row items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? '#FBBF24' : 'transparent'}
        color={i < rating ? '#FBBF24' : '#CBD5E0'}
      />
    ))}
    <Text className="text-sm text-gray-500 ml-2">{`${rating.toFixed(1)} (${reviews} reviews)`}</Text>
  </View>
);

// --- Helper Component for Calendar Icon ---
const CalendarIcon = ({ month, day }: { month: string; day: string | number }) => (
    <View className="flex-col items-center">
        <View className="bg-red-500 rounded-t-md w-14 py-1">
            <Text className="text-white text-xs font-bold text-center">{month}</Text>
        </View>
        <View className="bg-gray-100 rounded-b-md w-14 py-1 items-center justify-center h-10">
            <Text className="text-lg text-gray-800 font-bold">{day}</Text>
        </View>
    </View>
);

// --- Helper Component for Visa Icon ---
const VisaIcon = () => (
    <View className="bg-[#1a1f71] rounded-sm w-10 h-6 justify-center items-center">
      <Text className="text-white font-bold italic text-[10px]">VISA</Text>
    </View>
);

// --- Main Screen Component ---
export default function ManageBookingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white">
          <Pressable>
            <ArrowLeft size={24} color="#1F2937" />
          </Pressable>
          <Text className="text-lg font-semibold">Manage Booking</Text>
          <Pressable>
            <MoreVertical size={24} color="#1F2937" />
          </Pressable>
        </View>
        

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
            {/* Booking Confirmed Card */}
            <View className="flex-col bg-white rounded-lg p-4 mb-4">
                <View className="flex-row items-center space-x-3">
                    <View className="bg-green-100 rounded-full p-2">
                        <CheckCircle2 size={24} color="#48BB78" />
                    </View>
                    <View className="flex-col">
                        <Text className="text-base font-semibold">Booking Confirmed</Text>
                        <Text className="text-sm text-gray-500">Booking ID: #HND-2024-001</Text>
                    </View>
                </View>
                <View className="flex-row items-center space-x-3 bg-yellow-50 border border-yellow-300 rounded-lg p-3 mt-3">
                    <Clock size={20} color="#D97706" />
                    <View className="flex-col flex-1">
                        <Text className="text-yellow-700 font-bold text-sm">Free cancellation until 6:00 PM today</Text>
                        <Text className="text-yellow-600 text-xs">After this time, cancellation fees may apply</Text>
                    </View>
                </View>
            </View>

            {/* Date & Time Card */}
            <View className="flex-col bg-white rounded-lg p-4 mb-4">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-base font-semibold">Date & Time</Text>
                    <Pressable>
                        <View className="flex-row items-center space-x-1">
                            <Edit size={16} color="#EF4444" />
                            <Text className="text-red-500 font-semibold">Edit</Text>
                        </View>
                    </Pressable>
                </View>
                <View className="flex-row items-center space-x-3">
                    <View className="flex-col items-center bg-gray-100 rounded-lg p-2">
                        <Text className="font-bold text-red-500">FEB</Text>
                        <Text className="font-bold text-lg">15</Text>
                    </View>
                    <View className="flex-col">
                        <Text className="font-semibold">Tomorrow</Text>
                        <Text className="text-gray-500">2:00 PM - 4:00 PM (2 hours)</Text>
                    </View>
                </View>
            </View>

            {/* Task Details Card */}
            <View className="flex-col bg-white rounded-lg p-4 mb-4">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-base font-semibold">Task Details</Text>
                    <Pressable>
                        <View className="flex-row items-center space-x-1">
                            <Edit size={16} color="#EF4444" />
                            <Text className="text-red-500 font-semibold">Edit</Text>
                        </View>
                    </Pressable>
                </View>
                <View className="flex-row items-start space-x-3">
                    <Wrench size={24} color="#6B7280" />
                    <View className="flex-col flex-1">
                        <Text className="font-semibold">General handyman tasks</Text>
                        <Text className="text-gray-500">Fix leaky kitchen faucet and replace bathroom light fixture. Tools available in garage.</Text>
                    </View>
                </View>
            </View>

            {/* Location Card */}
            <View className="flex-col bg-white rounded-lg p-4 mb-4">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-base font-semibold">Location</Text>
                    <Pressable>
                        <View className="flex-row items-center space-x-1">
                            <Edit size={16} color="#EF4444" />
                            <Text className="text-red-500 font-semibold">Edit</Text>
                        </View>
                    </Pressable>
                </View>
                <View className="flex-row items-start space-x-3">
                    <MapPin size={24} color="#6B7280" />
                    <View className="flex-col">
                        <Text className="font-semibold">123 Main Street</Text>
                        <Text className="text-gray-500">London SW1A 1AA</Text>
                        <Text className="text-gray-500">Apartment 4B, buzz #4</Text>
                    </View>
                </View>
            </View>

            {/* Your Handy Card */}
            <View className="bg-white rounded-lg p-4 mb-4">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center space-x-4">
                        <Image source={{ uri: 'https://i.pravatar.cc/150?u=mike' }} alt="Handyman" className="w-12 h-12 rounded-full" />
                        <View className="flex-col">
                            <Text className="text-base font-semibold">Mike Johnson</Text>
                            <StarRating rating={4.9} reviews={127}/>
                        </View>
                    </View>
                    <Pressable>
                        <Text className="text-red-600 font-semibold text-sm">Message</Text>
                    </Pressable>
                </View>
            </View>

             {/* Payment Summary Card */}
             <View className="bg-white rounded-lg p-4 mb-4">
                <View className="flex-col space-y-3">
                    <Text className="text-base font-semibold">Payment Summary</Text>
                    <View className="flex-col space-y-2 border-b border-gray-200 pb-3">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-600 text-sm">Service (2 hours)</Text>
                            <Text className="text-gray-800 text-sm font-medium">£40.00</Text>
                        </View>
                         <View className="flex-row justify-between items-center">
                            <Text className="text-gray-600 text-sm">Platform fee</Text>
                            <Text className="text-gray-800 text-sm font-medium">£5.00</Text>
                        </View>
                    </View>
                    <View className="h-px bg-border" />
                    <View className="flex-row justify-between items-center">
                        <Text className="text-base font-semibold">Total</Text>
                        <Text className="text-base font-semibold">£45.00</Text>
                    </View>
                     {/* FIX: Re-added the Visa/Card info section */}
                     <View className="flex-row items-center space-x-3 border-t border-gray-200 pt-3 mt-1">
                        <VisaIcon/>
                        <Text className="text-gray-600 text-sm tracking-wider">•••• 4242</Text>
                    </View>
                </View>
             </View>
        </ScrollView>

        {/* Bottom Actions (Fixed) */}
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <View className="flex-row justify-between">
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
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}