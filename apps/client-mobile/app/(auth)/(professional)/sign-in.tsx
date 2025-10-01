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
import SignInForm from '@/components/auth/SignInForm';
import { signIn } from '@shared/supabase/auth';
import AuthFooter from '@/components/auth/AuthFooter';

export default function ProfessionalSignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (data: { email: string, password: string }): Promise<void> => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      // Navigate to the professional's dashboard or home screen upon successful sign-in
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Sign in error:', error);
      // You can add more specific error handling here, like showing an alert
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <VStack className="flex-1 justify-between">
            <Box>
              {/* Header */}
              <HStack className="items-center justify-between px-5 pt-2 pb-4">
                <Pressable onPress={() => router.back()}>
                  <ChevronLeft size={24} color="#333A31" />
                </Pressable>
                <Text className="text-lg font-worksans-medium" style={{ color: '#333A31' }}>
                  Log in
                </Text>
                <Box className="w-6" />
              </HStack>

              {/* Logo */}
              <Box className="items-center my-12">
                <VStack className="items-center">
                  <Text className="text-5xl font-cardo-regular tracking-widest" style={{ color: '#30352D' }}>
                    100
                  </Text>
                  <Text className="text-5xl font-cardo-bold tracking-widest" style={{ color: '#30352D' }}>
                    HANDY
                  </Text>
                </VStack>
              </Box>

              {/* Form Container */}
              <SignInForm
                onSubmit={handleSignIn}
                isLoading={isLoading}
                userRole="professional"
              />
            </Box>
            <AuthFooter />
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
}
