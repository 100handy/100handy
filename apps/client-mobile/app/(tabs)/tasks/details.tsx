import React, { useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapPinIcon } from 'lucide-react-native';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { Divider } from '@/components/ui/divider';
import Header from '@/components/Header';

// Component for rendering the Visa logo
const VisaIcon = () => (
  <Box className="bg-blue-900 rounded-sm w-10 h-6 justify-center items-center">
    <Text className="text-white font-bold italic text-xs">VISA</Text>
  </Box>
);

export default function TaskDetailsScreen() {
  const [description, setDescription] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const router = useRouter();

  const handleApplyPromo = () => {
    console.log('Applying promo code:', promoCode);
    // TODO: Add promo logic here
  };



  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1 bg-gray-custom-100">
        <Header 
          title="Task Details" 
          onBackPress={() => router.back()} 
          showBellIcon={false} 
        />

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
          <VStack className="space-y-4">
            {/* Task Description Card */}
            <VStack className="space-y-2 bg-white p-4 rounded-xl">
              <HStack className="items-center">
                <Text size="sm" className="font-semibold text-text-primary">
                  Task Description
                </Text>
                <Text className="text-red-500 ml-1">*</Text>
              </HStack>
              <Box className="h-24 border border-input-border rounded-lg p-2">
                <TextInput
                  placeholder="Tell us about the task (what, where, any access instructions)."
                  value={description}
                  onChangeText={setDescription}
                  maxLength={500}
                  multiline
                  textAlignVertical="top"
                  className="flex-1 text-sm text-text-tertiary leading-5"
                />
              </Box>
              <Text className="text-xs text-right text-gray-custom-400">
                {description.length}/500 characters
              </Text>
            </VStack>

            {/* Date & Time and Address Card */}
            <VStack className="bg-white p-4 rounded-xl space-y-4 my-4">
              {/* Date & Time */}
              <HStack className="items-center justify-between">
                <VStack>
                  <Text className="text-sm text-text-secondary mb-1">
                    Date & Time
                  </Text>
                  <Text className="text-sm font-semibold text-text-primary">
                    Tomorrow, 2:00 PM - 4:00 PM
                  </Text>
                </VStack>
                <Pressable onPress={() => console.log('Change date/time')}>
                  <Text className="text-sm font-semibold text-clayOrange">
                    Change
                  </Text>
                </Pressable>
              </HStack>

              <Divider className="h-px my-4 bg-gray-200" />
              
              {/* Address */}
              <HStack className="items-center justify-between">
                <HStack className="items-center space-x-3">
                  <MapPinIcon size={20} className="text-black" />
                  <VStack>
                    <Text className="text-sm text-text-secondary mb-1">
                      Address
                    </Text>
                    <Text className="text-sm font-semibold text-text-primary leading-5">
                      123 Main Street{'\n'}London SW1A 1AA
                    </Text>
                  </VStack>
                </HStack>
                <Pressable onPress={() => console.log('Edit address')}>
                  <Text className="text-sm font-semibold text-clayOrange">
                    Edit
                  </Text>
                </Pressable>
              </HStack>
            </VStack>

            {/* Payment Method Card */}
            <VStack className="bg-white p-4 rounded-xl space-y-4 my-4">
              {/* Payment Method */}
              <HStack className="items-center justify-between">
                <VStack>
                  <Text className="text-sm text-text-secondary mb-1">
                    Payment Method
                  </Text>
                  <HStack className="w-full justify-between space-x-3 my-2">
                    <HStack>
                      <VisaIcon />
                    <Text className="text-sm font-semibold text-text-primary tracking-widest ml-2">
                      •••• 4242
                    </Text>
                    </HStack>
                      <Pressable onPress={() => console.log('Change payment')} className='mt-2'>
                  <Text className="text-sm font-semibold text-clayOrange">
                    Change
                  </Text>
                </Pressable>
                  </HStack>
                </VStack>
              
              </HStack>

              <Divider className="h-px my-4 bg-gray-200" />
              
              {/* Promo Code */}
              <HStack className="items-center space-x-3">
                <Input className="w-[70%] bg-white rounded-lg border border-input-border">
                  <InputField
                    placeholder="Promo code"
                    value={promoCode}
                    onChangeText={setPromoCode}
                    className="text-text-primary text-sm p-3"
                  />
                </Input>
                <Button
                  onPress={handleApplyPromo}
                  className="rounded-lg ml-3 bg-sageGreen"
                >
                  <ButtonText className="text-white font-bold text-sm">
                    Apply
                  </ButtonText>
                </Button>
              </HStack>
            </VStack>

            {/* Estimated Total */}
            <VStack className="bg-bg-highlight p-4 rounded-xl space-y-1 border-border-highlight border-2">
              <HStack className="items-center justify-between w-full">
                <Text size="md" className="font-semibold text-text-primary">
                  Estimated Total
                </Text>
                <Text className="text-xl font-bold text-text-primary">
                  £45.00
                </Text>
              </HStack>
              <Text className="text-xs text-text-secondary">
                Final price may vary based on actual time spent
              </Text>
            </VStack>
          </VStack>
        </ScrollView>

        <Box className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <HStack className="space-x-4">
            <Button
              variant="outline"
              className="w-[45%] rounded-lg border-clayOrange"
              onPress={() => console.log('Save as draft')}
            >
              <ButtonText className="font-semibold text-clayOrange">
                Save as draft
              </ButtonText>
            </Button>
            <Button
              className="w-[45%] rounded-lg ml-5 bg-clayOrange"
              onPress={() => console.log('Next')}
            >
              <ButtonText className="text-base font-semibold text-white">
                Next
              </ButtonText>
            </Button>
          </HStack>
        </Box>
      </Box>
    </SafeAreaView>
  );
}