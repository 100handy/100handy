import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { signUp } from '@shared/supabase/auth';
import SignUpForm from '@/components/auth/SignUpForm';
import { useToast } from '@/components/ui/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@hasSeenOnboarding';

export default function ClientSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleNotNow = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      router.replace('/(client)/(tabs)/home');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/(client)/(tabs)/home');
    }
  };

  const handleSignUp = async (email: string, password: string, metadata: any): Promise<void> => {
    try {
      setIsLoading(true);

      // Sign up with email - this will send email verification automatically
      await signUp(email, password, { data: metadata });

      // Navigate to email verification screen
      router.push({
        pathname: '/(auth)/verify-email',
        params: { email },
      });
    } catch (error) {
      console.error('Client SignUp error:', error);
      toast.error('Sign up failed', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <VStack className="flex-1">
          {/* Header */}
          <HStack className="items-center justify-between px-5 pt-2 pb-4">
            <Pressable onPress={() => router.back()}>
              <ChevronLeft size={24} color="#333A31" />
            </Pressable>
            <Text className="text-lg font-worksans-medium" style={{ color: '#333A31' }}>
              Sign Up
            </Text>
            <Pressable onPress={handleNotNow}>
              <Text className="text-sm font-worksans-medium" style={{ color: '#333A31' }}>
                Not now
              </Text>
            </Pressable>
          </HStack>

          {/* Logo */}
          <Box className="items-center mb-6">
            <Box className="bg-white rounded-[20px] shadow-sm overflow-hidden" style={{ width: 100, height: 100 }}>
              {/* 100 HANDY Text */}
              <VStack className="items-center pt-2 pb-0">
                <Text className="text-[20px] font-worksans-bold leading-[22px] tracking-wide" style={{ color: '#30352D' }}>
                  100
                </Text>
                <Text className="text-[20px] font-worksans-bold leading-[22px] tracking-wide" style={{ color: '#30352D' }}>
                  HANDY
                </Text>
              </VStack>
              
              {/* Task Button */}
              <Box className="items-center px-2 mt-0.5">
                <Box className="bg-clay-orange rounded-full px-4 py-1.5 shadow-sm" style={{ transform: [{ rotate: '-9deg' }] }}>
                  <Text className="text-white text-[16px] font-worksans-bold tracking-wide">
                    Task
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Form Container */}
          <SignUpForm
            onSubmit={handleSignUp}
            isLoading={isLoading}
            userRole="client"
          />
        </VStack>
        </ScrollView>
      </SafeAreaView>
      </Box>
  );
}
