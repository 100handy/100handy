import React from 'react';
import { Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeft, FileText, Star, ShieldCheck } from 'lucide-react-native';
import { router } from 'expo-router';

export default function VerifyFinalSummary() {
  const handleBack = (): void => {
    router.back();
  };

  const handleVerifyNow = (): void => {
    // Here you would integrate with Persona SDK or your verification service
    // For now, navigate to success/next step
    router.push('/(auth)/(professional)/sign-in');
  };

  const handleSkip = (): void => {
    router.push('/(auth)/(professional)/sign-in');
  };

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <VStack className="flex-1">
            {/* Header */}
            <HStack className="items-center justify-between px-4 pt-2 pb-6">
              <Pressable onPress={handleBack}>
                <ChevronLeft size={20} color="#30352D" />
              </Pressable>
              <Pressable>
                <FileText size={20} color="#30352D" />
              </Pressable>
            </HStack>

            {/* Content */}
            <VStack className="flex-1 px-6">
              {/* Title */}
              <Text className="text-center text-[15px] font-worksans-medium mb-1" style={{ color: '#30352D' }}>
                One last thing:
              </Text>
              <Text className="text-center text-[22px] font-worksans-bold mb-6" style={{ color: '#30352D' }}>
                Verify your identity
              </Text>

              {/* Profile Card */}
              <Box 
                className="rounded-2xl p-3.5 mb-6"
                style={{ backgroundColor: '#F6E4D8' }}
              >
                <HStack className="gap-3">
                  {/* Profile Image */}
                  <Box className="w-[110px] h-[110px] rounded-full overflow-hidden">
                    <Image
                      source={require('@/assets/images/profile-mike.png')}
                      style={{ width: 110, height: 110 }}
                      resizeMode="cover"
                    />
                  </Box>

                  {/* Profile Info */}
                  <VStack className="flex-1 justify-center gap-1">
                    <Text className="text-[23px] font-worksans-medium mb-1" style={{ color: '#333A31' }}>
                      Mike W.
                    </Text>
                    
                    <HStack className="items-center gap-1.5">
                      <Star size={14} color="#FFA500" fill="#FFA500" />
                      <Text className="text-[17px] font-worksans" style={{ color: '#333A31' }}>
                        5.0 (124 reviews)
                      </Text>
                    </HStack>

                    <Text className="text-[17px] font-worksans-bold" style={{ color: '#333A31' }}>
                      124 overall jobs
                    </Text>

                    <HStack className="items-center gap-1.5 mt-0.5">
                      <ShieldCheck size={14} color="#C1856A" fill="#C1856A" />
                      <Text className="text-[17px] font-worksans-bold" style={{ color: '#C1856A' }}>
                        ID Verified
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Box>

              {/* Info Text */}
              <Text className="text-[12px] font-worksans-medium leading-[18px] mb-2" style={{ color: '#333A31' }}>
                This gives Clients confidence to hire Taskers like you.
              </Text>
              <Text className="text-[12px] font-worksans-medium leading-[18px] mb-3" style={{ color: '#333A31' }}>
                We'll ask you for:
              </Text>

              {/* Requirements List */}
              <VStack className="mb-6 gap-1">
                <HStack className="items-start gap-2">
                  <Box className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: '#333A31' }} />
                  <Text className="text-[12px] font-worksans-medium flex-1" style={{ color: '#333A31' }}>
                    DOB, and full address
                  </Text>
                </HStack>
                <HStack className="items-start gap-2">
                  <Box className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: '#333A31' }} />
                  <Text className="text-[12px] font-worksans-medium flex-1" style={{ color: '#333A31' }}>
                    A government-issued photo ID document
                  </Text>
                </HStack>
              </VStack>

              {/* Spacer */}
              <Box className="flex-1" />

              {/* Verify Button */}
              <Button
                className="rounded-full mb-3"
                style={{ backgroundColor: '#C1856A' }}
                onPress={handleVerifyNow}
              >
                <ButtonText className="text-[18px] font-worksans-bold text-white">
                  Verify me now
                </ButtonText>
              </Button>

              {/* Skip Button */}
              <Pressable 
                className="rounded-full py-3 border-2 mb-6"
                style={{ borderColor: '#C1856A' }}
                onPress={handleSkip}
              >
                <Text className="text-center text-[18px] font-worksans-bold" style={{ color: '#C1856A' }}>
                  Skip for no
                </Text>
              </Pressable>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
}
