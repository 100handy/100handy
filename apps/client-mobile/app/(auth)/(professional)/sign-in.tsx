import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
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

export default function ProfessionalSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const handleSignIn = async (data: SignInFormData): Promise<void> => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      // Update auth state
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        // Check if user has the professional role
        const { userRole } = useAuthStore.getState();
        if (userRole === 'handy') {
          router.replace('/(professional)/(tabs)/dashboard');
        } else if (userRole === 'customer') {
          // Client user logging in through professional flow — redirect to client home
          toast.info('Client account', 'This account is registered as a client. Redirecting to your home screen.');
          router.replace('/(client)/(tabs)/home');
        } else {
          // No role set — default to professional flow (new users choosing professional)
          router.replace('/(professional)/(tabs)/dashboard');
        }
      } else {
        throw new Error('Authentication check failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Sign in failed', error instanceof Error ? error.message : 'Invalid email or password');
    } finally {
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
                {router.canGoBack() ? (
                  <Pressable onPress={() => router.back()}>
                    <ChevronLeft size={24} color="#333A31" />
                  </Pressable>
                ) : (
                  <View className="w-6" />
                )}
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
                userRole="professional"
              />

              {/* Sign Up Link */}
              <Pressable className="mt-2" onPress={() => router.push('/(auth)/(professional)/sign-up')}>
                <Text className="text-center text-[14px] font-worksans-medium" style={{ color: '#30352D' }}>
                  Don't have an account?{' '}
                  <Text style={{ color: '#C1856A' }}>Sign up</Text>
                </Text>
              </Pressable>
            </View>
            <AuthFooter />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
