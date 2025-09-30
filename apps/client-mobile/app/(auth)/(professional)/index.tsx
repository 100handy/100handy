import React, { useState } from 'react';
import { Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ProfessionalWelcome() {
  const [selectedCountry, setSelectedCountry] = useState('GB');

  return (
    <Box className="flex-1" style={{ backgroundColor: '#3E433D' }}>
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <VStack className="flex-1">
          {/* Dark Top Section */}
          <VStack style={{ backgroundColor: '#3E433D' }} className="pb-10">
            {/* Country Selector */}
            <Box className="items-center pt-4 pb-12">
              <Pressable className="flex-row items-center px-4 py-2 rounded-full border border-white/30">
                <Image 
                  source={require('@/assets/images/uk-flag.png')}
                  className="w-7 h-4 mr-2"
                  resizeMode="contain"
                />
                <Text className="text-white font-worksans-medium text-[15px] mr-1">
                  {selectedCountry}
                </Text>
                <ChevronDown size={16} color="white" />
              </Pressable>
            </Box>

            {/* Logo Container */}
            <Box className="items-center">
              <Box className="bg-white rounded-[32px] shadow-lg overflow-hidden" style={{ width: 175, height: 175 }}>
                {/* 100 HANDY Text */}
                <VStack className="items-center pt-6 pb-3">
                  <Text className="text-[34px] font-worksans-bold leading-[36px] tracking-wider" style={{ color: '#30352D' }}>
                    100
                  </Text>
                  <Text className="text-[34px] font-worksans-bold leading-[36px] tracking-wider" style={{ color: '#30352D' }}>
                    HANDY
                  </Text>
                </VStack>
                
                {/* Task Button */}
                <Box className="items-center px-4 pb-4">
                  <Box className="bg-clay-orange rounded-full px-7 py-2.5 shadow-md" style={{ transform: [{ rotate: '-9deg' }] }}>
                    <Text className="text-white text-[30px] font-worksans-bold tracking-wide">
                      Task
                    </Text>
                  </Box>
                </Box>
              </Box>

              {/* By Text - OUTSIDE the white card, below it */}
              <HStack className="items-center mt-3">
                <Text className="font-worksans-medium text-[16px] mr-1.5 text-white">
                  By
                </Text>
                <Text className="font-worksans-bold text-[16px] tracking-wide text-white">
                  100 HANDY
                </Text>
              </HStack>
            </Box>
          </VStack>

          {/* Light Bottom Section */}
          <VStack className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
            {/* Welcome Text */}
            <Text className="text-[19px] font-worksans-bold text-center px-8 pt-10 pb-8" style={{ color: '#30352D' }}>
              Wellcome to 100 Handy Task
            </Text>

            {/* Create Account Button */}
            <Box className="px-5">
              <Button
                className="rounded-full shadow-md mb-4"
                style={{ backgroundColor: '#C1856A' }}
                onPress={() => router.push('/(auth)/(professional)/sign-up')}
              >
                <ButtonText className="text-[18px] font-worksans-bold">
                  Create Account
                </ButtonText>
              </Button>

              {/* Sign In Button */}
              <Pressable 
                className="rounded-full py-4 border-2 mb-10"
                style={{ borderColor: '#C1856A', backgroundColor: 'transparent' }}
                onPress={() => router.push('/(auth)/(professional)/sign-in')}
              >
                <Text className="text-center text-[18px] font-worksans-bold" style={{ color: '#C1856A' }}>
                  Sign in
                </Text>
              </Pressable>

              {/* Terms and Privacy */}
              <Box className="pb-10">
                <Text className="text-center text-[15px] font-worksans-medium leading-[22px]" style={{ color: '#30352D' }}>
                  By singing up, you agree to the{' '}
                  <Text style={{ color: '#C1856A' }}>Term of service</Text>
                  {'\n'}
                  and have reviewed the{' '}
                  <Text style={{ color: '#C1856A' }}>Privacy Policy.</Text>
                  {'\n'}
                  Manage <Text style={{ color: '#C1856A' }}>privacy settings</Text>
                </Text>
              </Box>
            </Box>
          </VStack>
        </VStack>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
}