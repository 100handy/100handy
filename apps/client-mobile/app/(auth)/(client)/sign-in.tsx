import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import SignInForm from '@/components/auth/SignInForm';
import { signIn } from '@shared/supabase/auth';
import { type SignInFormData } from '@shared/schemas/auth';
import AuthFooter from '@/components/auth/AuthFooter';
import AuthLogo from '@/components/auth/AuthLogo';
import { useToast } from '@/components/ui/toast';
import { useAuthStore, usePendingBookingStore, useLocationStore } from '@shared/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHandyProfile } from '@shared/supabase/profile';
import { buildPendingBookingRoute, resolveAuthenticatedRoute } from '@/lib/auth-routing';

export default function ClientSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { checkAuth } = useAuthStore();
  const pendingBookingStore = usePendingBookingStore();
  const { setLocation } = useLocationStore();

  const navigateAfterAuth = async () => {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      throw new Error('Authentication check failed');
    }

    const { isEmailVerified, userRole, hasCompletedOnboarding, user } = useAuthStore.getState();
    const route = await resolveAuthenticatedRoute({
      isEmailVerified,
      userRole,
      hasCompletedOnboarding,
      userEmail: user?.email,
      userId: user?.id,
      getLocalClientOnboardingCompleted: async (userId) =>
        (await AsyncStorage.getItem(`@clientOnboardingCompleted:${userId}`)) === 'true',
      getProfessionalOnboardingCompleted: async () => {
        const handyProfile = await getHandyProfile();
        return handyProfile?.onboarding_completed || false;
      },
      getPendingBookingRoute: () =>
        buildPendingBookingRoute({
          hasRestorablePendingBooking: pendingBookingStore.hasRestorablePendingBooking,
          getPendingBooking: pendingBookingStore.getPendingBooking,
          markPendingBookingRestored: pendingBookingStore.markPendingBookingRestored,
          setLocation,
        }),
    });

    router.replace(route as Parameters<typeof router.replace>[0]);
  };

  const handleSignIn = async (data: SignInFormData): Promise<void> => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      await navigateAfterAuth();
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
                <AuthLogo />
              </View>

              {/* Form Container */}
              <SignInForm
                onSubmit={handleSignIn}
                onOAuthSuccess={navigateAfterAuth}
                isLoading={isLoading}
                userRole="client"
              />

              {/* Sign Up Link */}
              <Pressable className="mt-2" onPress={() => router.push('/(auth)/(client)/sign-up')}>
                <Text className="text-center text-[14px] font-worksans-medium" style={{ color: '#30352D' }}>
                  Don&apos;t have an account?{' '}
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
