import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import gluestack-ui components
import { Input, InputField } from '@/components/ui/input';

// Import lucide-react-native icons
import {
  ArrowLeft,
  MapPin,
} from 'lucide-react-native';

// --- Main Screen Component ---
export default function YourAddressScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
          <Pressable>
            <ArrowLeft size={28} color="#1F2937" />
          </Pressable>
          <Text className="text-base font-semibold">Your Address</Text>
          {/* Spacer to keep title centered */}
          <View className="w-6" />
        </View>

        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <View className="flex-col space-y-6">
            {/* Descriptive Text */}
            <Text className="text-gray-600 text-base leading-6">
                Please provide your address so we can show you services in your area and help with accurate bookings.
            </Text>

            {/* Form Fields */}
            <View className="flex-col space-y-5">
              {/* Street Address Input */}
              <View className="flex-col">
                  <Text className="text-gray-800 font-medium mb-2">Street Address</Text>
                  <Input variant="outline" size="lg" className="border-gray-300">
                      <InputField placeholder="e.g., 10 High Street" />
                  </Input>
              </View>
              
              {/* Apartment/Unit Input */}
              <View className="flex-col">
                  <Text className="text-gray-800 font-medium mb-2">Apartment / Unit</Text>
                  <Input variant="outline" size="lg" className="border-gray-300">
                      <InputField placeholder="Apt, unit, floor (optional)" />
                  </Input>
              </View>

              {/* Postcode Input */}
              <View className="flex-col">
                  <Text className="text-gray-800 font-medium mb-2">Postcode</Text>
                  <Input variant="outline" size="lg" className="border-gray-300">
                      <InputField placeholder="Postcode" />
                  </Input>
                  <Text className="text-sm text-gray-500 mt-2">
                      Enter full postcode for best accuracy.
                  </Text>
              </View>
            </View>

            {/* Map Preview */}
            <View className="bg-gray-100 rounded-xl items-center justify-center h-48 mt-4">
                <View className="flex-col items-center space-y-2">
                    <MapPin size={28} color="#A0AEC0" />
                    <Text className="font-semibold text-gray-500">Map preview will appear here</Text>
                    <Text className="text-sm text-gray-400">Enter your address above</Text>
                </View>
            </View>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}