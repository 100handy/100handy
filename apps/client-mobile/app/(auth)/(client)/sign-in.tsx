import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import SignInForm from '@/components/auth/SignInForm';
import { signIn } from '@shared/supabase/auth';
import { type SignInFormData } from '@shared/schemas/auth';
import AuthFooter from '@/components/auth/AuthFooter';
import { useToast } from '@/components/ui/toast';
import { useAuthStore } from '@shared/supabase';
import Logo100Top from '@/assets/images/logo-100-top.svg';

export default function ClientSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const handleSignIn = async (data: SignInFormData): Promise<void> => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      // Update auth state and then navigate to root so index.tsx can handle routing
      await checkAuth();
      router.replace('/(client)/(tabs)/home');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Sign in failed', error instanceof Error ? error.message : 'Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-col flex-1 justify-between">
            <View>
              {/* Header */}
              <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
                <Pressable onPress={() => router.back()}>
                  <ChevronLeft size={24} color="#333A31" />
                </Pressable>
                <Text className="text-lg font-worksans-medium" style={{ color: '#333A31' }}>
                  Log in
                </Text>
                <View className="w-6" />
              </View>

              {/* Logo */}
              <View className="items-center my-12">
                <Logo100Top width={150} height={72} />
              </View>

              {/* Form Container */}
              <SignInForm
                onSubmit={handleSignIn}
                isLoading={isLoading}
                userRole="client"
              />
            </View>
            <AuthFooter />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
