import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { signUp } from '@shared/supabase/auth';
import SignUpForm from '@/components/auth/SignUpForm';
import { useToast } from '@/components/ui/toast';

export default function ProfessionalSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSignUp = async (email: string, password: string, metadata: any): Promise<void> => {
    try {
      setIsLoading(true);

      // Sign up with email - this will send email verification automatically
      await signUp({ email, password, options: { data: metadata } });

      // Navigate to email OTP verification screen
      router.push({
        pathname: '/(auth)/(professional)/verify-email-otp',
        params: { email },
      });
    } catch (error) {
      console.error('Professional SignUp error:', error);
      toast.error('Sign up failed', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-col flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
            <Pressable onPress={() => router.back()}>
              <ChevronLeft size={24} color="#333A31" />
            </Pressable>
            <Text className="text-lg font-worksans-medium" style={{ color: '#333A31' }}>
              Sign Up
            </Text>
            <Pressable>
              <Text className="text-sm font-worksans-medium" style={{ color: '#333A31' }}>
                Not now
              </Text>
            </Pressable>
          </View>

          {/* Logo */}
          <View className="items-center mb-6">
            <View className="bg-white rounded-[20px] shadow-sm overflow-hidden" style={{ width: 100, height: 100 }}>
              {/* 100 HANDY Text */}
              <View className="flex-col items-center pt-2 pb-0">
                <Text className="text-[20px] font-worksans-bold leading-[22px] tracking-wide" style={{ color: '#30352D' }}>
                  100
                </Text>
                <Text className="text-[20px] font-worksans-bold leading-[22px] tracking-wide" style={{ color: '#30352D' }}>
                  HANDY
                </Text>
              </View>
              
              {/* Task Button */}
              <View className="items-center px-2 mt-0.5">
                <View className="bg-clay-orange rounded-full px-4 py-1.5 shadow-sm" style={{ transform: [{ rotate: '-9deg' }] }}>
                  <Text className="text-white text-[16px] font-worksans-bold tracking-wide">
                    Task
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Form Container */}
          <SignUpForm
            onSubmit={handleSignUp}
            isLoading={isLoading}
            userRole="professional"
          />
        </View>
        </ScrollView>
      </SafeAreaView>
      </View>
  );
}