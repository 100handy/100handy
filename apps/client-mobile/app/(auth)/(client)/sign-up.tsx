import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { signUp } from '@shared/supabase/auth';
import AuthLogo from '@/components/auth/AuthLogo';
import SignUpForm from '@/components/auth/SignUpForm';
import { useToast } from '@/components/ui/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/lib/storage-keys';

export default function ClientSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleNotNow = async (): Promise<void> => {
    try {
      // Set both flags since user has seen both onboarding and terms screens
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, 'true'),
        AsyncStorage.setItem(STORAGE_KEYS.HAS_ACCEPTED_TERMS, 'true'),
      ]);
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
      await signUp({ email, password, options: { data: metadata } });

      // Navigate to email OTP verification screen
      router.push({
        pathname: '/(auth)/(client)/verify-email-otp',
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
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-col flex-1 w-full self-center" style={{ maxWidth: 560 }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-2 pb-2">
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
            </View>

            {/* Logo */}
            <View className="items-center mt-4 mb-5">
              <AuthLogo size="compact" />
            </View>

            {/* Form Container */}
            <SignUpForm
              onSubmit={handleSignUp}
              isLoading={isLoading}
              userRole="client"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
