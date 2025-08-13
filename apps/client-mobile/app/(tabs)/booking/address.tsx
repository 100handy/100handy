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
      <Box className="flex-1 bg-white">
        {/* Header */}
        <HStack className="items-center justify-between px-4 py-3 border-b border-gray-100">
          <Pressable>
            <Icon as={ArrowLeft} size="xl" color="#1F2937" />
          </Pressable>
          <Heading size="md" className="font-semibold">Your Address</Heading>
          {/* Spacer to keep title centered */}
          <Box className="w-6" />
        </HStack>

        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <VStack className="space-y-6">
            {/* Descriptive Text */}
            <Text className="text-gray-600 text-base leading-6">
                Please provide your address so we can show you services in your area and help with accurate bookings.
            </Text>

            {/* Form Fields */}
            <VStack className="space-y-5">
              {/* Street Address Input */}
              <VStack>
                  <Text className="text-gray-800 font-medium mb-2">Street Address</Text>
                  <Input variant="outline" size="lg" className="border-gray-300">
                      <InputField placeholder="e.g., 10 High Street" />
                  </Input>
              </VStack>
              
              {/* Apartment/Unit Input */}
              <VStack>
                  <Text className="text-gray-800 font-medium mb-2">Apartment / Unit</Text>
                  <Input variant="outline" size="lg" className="border-gray-300">
                      <InputField placeholder="Apt, unit, floor (optional)" />
                  </Input>
              </VStack>

              {/* Postcode Input */}
              <VStack>
                  <Text className="text-gray-800 font-medium mb-2">Postcode</Text>
                  <Input variant="outline" size="lg" className="border-gray-300">
                      <InputField placeholder="Postcode" />
                  </Input>
                  <Text className="text-sm text-gray-500 mt-2">
                      Enter full postcode for best accuracy.
                  </Text>
              </VStack>
            </VStack>

            {/* Map Preview */}
            <Box className="bg-gray-100 rounded-xl items-center justify-center h-48 mt-4">
                <VStack className="items-center space-y-2">
                    <Icon as={MapPin} size="xl" color="#A0AEC0"/>
                    <Text className="font-semibold text-gray-500">Map preview will appear here</Text>
                    <Text className="text-sm text-gray-400">Enter your address above</Text>
                </VStack>
            </Box>

          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}