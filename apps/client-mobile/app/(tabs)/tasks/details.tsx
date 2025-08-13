import React, { useReducer, useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
// import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeftIcon, MapPinIcon } from 'lucide-react-native';
import Header from '@/components/Header';
import { Divider } from '@/components/ui/divider';
import { useRouter } from 'expo-router';

// Brand colors from your original code
const colors = {
  clayOrange: '#D9896C',
  sageGreen: '#A3B899',
  warmTaupe: '#BFA28D',
  themeBackground: '#F6E4D8', // Note: The image has a more neutral grey/white background. I've kept your theme color.
  themeFont: '#333A31',
};

// A simple component to render the Visa logo as seen in the image
const VisaIcon = () => (
  <Box className="bg-[#1a1f71] rounded-sm w-10 h-6 justify-center items-center">
    <Text className="text-white font-bold italic text-[10px]">VISA</Text>
  </Box>
);


export default function TaskDetailsScreen() {
  const [description, setDescription] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const router = useRouter()

  const handleApplyPromo = () => {
    console.log('Applying promo code:', promoCode);
    // Add promo logic here
  };



  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: 'white' }}>
      <Box className="flex-1 bg-[#f0f0f0]">
        {/* Top App Bar */}
        <Header 
          title="Task Details" 
          onBackPress={() => router.back()} 
          showBellIcon={false} 
        
        />

        {/* Content */}
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
          <VStack className="space-y-4">

            {/* Task Description Card */}
            <VStack className="space-y-2 bg-white p-4 rounded-xl">
              <HStack className="items-center">
                <Text size="sm" className="font-semibold text-black">
                  Task Description
                </Text>
                <Text className="text-[#E53E3E] ml-1">*</Text>
              </HStack>
              <Box className="h-24 border border-gray-300 rounded-lg p-2">
                <TextInput
                  placeholder="Tell us about the task (what, where, any access instructions)."
                  value={description}
                  onChangeText={setDescription}
                  maxLength={500}
                  multiline
                  textAlignVertical="top"
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: '#6B7280',
                    lineHeight: 20,
                  }}
                />
              </Box>
              <Text className="text-xs text-right text-gray-400">
                {description.length}/500 characters
              </Text>
            </VStack>

            {/* Date & Time and Address Combined Card */}
            <VStack className="bg-white p-4 rounded-xl space-y-4 my-4">
              {/* Date & Time Section */}
              <HStack className="items-center justify-between">
                <VStack>
                  <Text className="text-sm text-gray-500 mb-1">
                    Date & Time
                  </Text>
                  <Text className="text-sm font-semibold text-black">
                    Tomorrow, 2:00 PM - 4:00 PM
                  </Text>
                </VStack>
                <Pressable onPress={() => console.log('Change date/time')}>
                  <Text className="text-sm font-semibold" style={{ color: colors.clayOrange }}>
                    Change
                  </Text>
                </Pressable>
              </HStack>

              {/* Divider */}
              <Divider className="h-px my-4 bg-gray-200" />

              {/* Address Section */}
              <HStack className="items-center justify-between">
                <HStack className="items-center space-x-3">
                  <MapPinIcon size={20} color={'black'} />
                  <VStack>
                    <Text className="text-sm text-gray-500 mb-1">
                      Address
                    </Text>
                    <Text className="text-sm font-semibold text-black leading-5">
                      123 Main Street{'\n'}London SW1A 1AA
                    </Text>
                  </VStack>
                </HStack>
                <Pressable onPress={() => console.log('Edit address')}>
                  <Text className="text-sm font-semibold" style={{ color: colors.clayOrange }}>
                    Edit
                  </Text>
                </Pressable>
              </HStack>
            </VStack>

            {/* Payment Method Card */}
            <VStack className="bg-white p-4 rounded-xl space-y-4 my-4">
              {/* Payment Method Section */}
              <HStack className="items-center justify-between">
                <VStack>
                  <Text className="text-sm text-gray-500 mb-1">
                    Payment Method
                  </Text>
                  <HStack className="w-full justify-between space-x-3 my-2">
                    <HStack>
                      <VisaIcon />
                    <Text className="text-sm font-semibold text-black tracking-widest ml-2">
                      •••• 4242
                    </Text>
                    </HStack>
                      <Pressable onPress={() => console.log('Change payment')} className='mt-2'>
                  <Text className="text-sm font-semibold" style={{ color: colors.clayOrange }}>
                    Change
                  </Text>
                </Pressable>
                  </HStack>
                </VStack>
              
              </HStack>

 <Divider className="h-px my-4 bg-gray-200" />
              {/* Promo Code Section */}
              <HStack className="items-center space-x-3">
                <Input className="w-[70%] bg-white rounded-lg border border-gray-300">
                  <InputField
                    placeholder="Promo code"
                    value={promoCode}
                    onChangeText={setPromoCode}
                    className="text-black text-sm p-3"
                  />
                </Input>
                <Button
                  onPress={handleApplyPromo}
                  style={{ backgroundColor: colors.sageGreen }}
                  className="rounded-lg ml-3"
                >
                  <ButtonText className="text-white font-bold text-sm">
                    Apply
                  </ButtonText>
                </Button>
              </HStack>
            </VStack>

            {/* Estimated Total */}
            <VStack className="bg-[#F6e4d8] p-4 rounded-xl space-y-1 border-[#BFA28D] border-2">
              <HStack className="items-center justify-between w-full">
                <Text size="md" className="font-semibold text-black">
                  Estimated Total
                </Text>
                <Text className="text-xl font-bold text-black">
                  £45.00
                </Text>
              </HStack>
              <Text className="text-xs text-gray-500">
                Final price may vary based on actual time spent
              </Text>
            </VStack>
          </VStack>
        </ScrollView>

        {/* Bottom Actions (Fixed) */}
        <Box className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <HStack className="space-x-4">
            <Button
              variant="outline"
              className="w-[45%] rounded-lg"
              style={{ borderColor: colors.clayOrange }}
              onPress={() => console.log('Save as draft')}
            >
              <ButtonText style={{ color: colors.clayOrange }} className="font-semibold">
                Save as draft
              </ButtonText>
            </Button>
            <Button
              className="w-[45%] rounded-lg ml-5"
              style={{ backgroundColor: colors.clayOrange }}
              onPress={() => console.log('Next')}
            >
              <ButtonText className="text-white font-semibold">
                Next
              </ButtonText>
            </Button>
          </HStack>
        </Box>
      </Box>
    </SafeAreaView>
  );
}