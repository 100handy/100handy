import React, { useState, useCallback, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';
import { ChevronLeft, ShieldCheck, Camera, FileText } from 'lucide-react-native';
import { router } from 'expo-router';
import { useStripeIdentity } from "@stripe/stripe-identity-react-native";
import { supabase } from '@shared/supabase';
import { completeOnboarding, getHandyProfile, markVerificationSubmitted } from '@shared/supabase/profile';
import { useToast } from '@/components/ui/toast';

export default function VerifyDocumentUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Auto-skip if verification was already submitted/verified
  useEffect(() => {
    const checkExistingVerification = async () => {
      try {
        const handyProfile = await getHandyProfile();
        if (handyProfile?.verification_status === 'submitted' || handyProfile?.verification_status === 'verified') {
          await completeOnboarding();
          router.replace('/(professional)/(tabs)/dashboard');
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    };
    checkExistingVerification();
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase.functions.invoke('create-verification-session', {
        body: {
          userId: user.id,
          email: user.email,
        },
      });

      if (error) {
        throw error;
      }

      return {
        sessionId: data.id,
        ephemeralKeySecret: data.ephemeral_key_secret,
        brandLogo: Image.resolveAssetSource(require('@/assets/images/icon.png')),
      };
    } catch (e: any) {
      Alert.alert('Error', e.message);
      throw e;
    }
  }, []);

  const { status, present, loading: stripeLoading } = useStripeIdentity(fetchOptions);

  const handleVerifyWithStripe = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await present() as { status: string } | undefined;

      if (result?.status === 'FlowCompleted') {
        const saved = await markVerificationSubmitted();
        if (!saved) {
          throw new Error('Failed to save verification status');
        }
        await completeOnboarding();
        toast.success('Verification Submitted', 'Your identity verification has been submitted for review.');
        router.replace('/(professional)/(tabs)/dashboard');
      } else if (result?.status === 'FlowCanceled') {
        // User canceled - stay on page
      } else if (result?.status === 'FlowFailed') {
        toast.error('Verification Failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Error in verification:', error);
      toast.error('Error', 'Failed to start verification');
    } finally {
      setIsLoading(false);
    }
  }, [present, toast]);

  const handleSkipForNow = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Mark onboarding as completed even without verification
      await completeOnboarding();
      router.replace('/(professional)/(tabs)/dashboard');
    } catch (error) {
      console.error('Error skipping:', error);
      toast.error('Error', 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-col flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-2 pb-5">
              <Pressable onPress={() => router.back()}>
                <ChevronLeft size={24} color="#333A31" />
              </Pressable>
              <Text className="text-[18px] font-worksans-medium" style={{ color: '#333A31' }}>
                Verify Identity
              </Text>
              <View className="w-6" />
            </View>

            {/* Content */}
            <View className="flex-col flex-1 px-6">
              {/* Illustration */}
              <View className="items-center mb-6">
                <View
                  className="w-24 h-24 rounded-full items-center justify-center"
                  style={{ backgroundColor: '#F6E4D8' }}
                >
                  <ShieldCheck size={48} color="#C1856A" />
                </View>
              </View>

              {/* Title */}
              <Text className="text-center text-[22px] font-worksans-bold mb-3" style={{ color: '#30352D' }}>
                Verify your identity
              </Text>

              {/* Subtitle */}
              <Text className="text-center text-[15px] font-worksans-medium leading-[22px] mb-8" style={{ color: '#666' }}>
                Complete a quick identity check to build trust with clients. This process is secure and powered by Stripe.
              </Text>

              {/* What you'll need */}
              <View className="mb-8">
                <Text className="text-[15px] font-worksans-bold mb-4" style={{ color: '#30352D' }}>
                  What you'll need:
                </Text>

                <View className="flex-row items-center mb-3">
                  <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#F6E4D8' }}>
                    <FileText size={20} color="#C1856A" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-worksans-medium" style={{ color: '#30352D' }}>
                      Government-issued photo ID
                    </Text>
                    <Text className="text-[13px] font-worksans" style={{ color: '#666' }}>
                      Passport, driver's license, or national ID
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#F6E4D8' }}>
                    <Camera size={20} color="#C1856A" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-worksans-medium" style={{ color: '#30352D' }}>
                      A selfie for face matching
                    </Text>
                    <Text className="text-[13px] font-worksans" style={{ color: '#666' }}>
                      We'll compare your photo with your ID
                    </Text>
                  </View>
                </View>
              </View>

              {/* Status indicator */}
              {status && (
                <View className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                  <Text className="text-center text-[13px] font-worksans" style={{ color: '#666' }}>
                    Status: {status}
                  </Text>
                </View>
              )}

              {/* Spacer */}
              <View className="flex-1" />

              {/* Verify Button */}
              <Button
                className="rounded-full mb-3"
                style={{ backgroundColor: '#C1856A' }}
                onPress={handleVerifyWithStripe}
                isDisabled={isLoading || stripeLoading}
              >
                <ButtonText className="text-[18px] font-worksans-bold text-white">
                  {isLoading || stripeLoading ? 'Loading...' : 'Start Verification'}
                </ButtonText>
              </Button>

              {/* Skip Button */}
              <Pressable
                className="rounded-full py-3 border-2 mb-6"
                style={{ borderColor: '#C1856A' }}
                onPress={handleSkipForNow}
                disabled={isLoading}
              >
                <Text className="text-center text-[18px] font-worksans-bold" style={{ color: '#C1856A' }}>
                  Skip for now
                </Text>
              </Pressable>

              {/* Security Note */}
              <Text className="text-center text-[12px] font-worksans mb-4" style={{ color: '#999' }}>
                Your data is encrypted and securely processed by Stripe Identity.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
