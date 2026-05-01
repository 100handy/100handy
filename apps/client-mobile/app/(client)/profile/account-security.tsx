import React, { useState, useCallback } from 'react';
import { useAuthStore } from '@shared/store';
import { SafeAreaView } from 'react-native-safe-area-context'; import { Mail, Shield, ShieldOff } from 'lucide-react-native'; import Header from '@/components/Header'; import { useRouter } from 'expo-router'; import { useFocusEffect } from '@react-navigation/native'; import { supabase, disable2FA } from '@shared/supabase';
import { useProfile, useInvalidateProfile } from '@shared/query';
import { Alert, ActivityIndicator, View, Text, Pressable } from 'react-native';

export default function AccountSecurityScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: profile, refetch: refetchProfile } = useProfile();
  const { invalidateProfile } = useInvalidateProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const is2FAEnabled = profile?.two_factor_enabled || false;

  // Refetch profile when screen comes into focus (e.g., after enabling 2FA)
  useFocusEffect(
    useCallback(() => {
      refetchProfile();
    }, [refetchProfile])
  );

  const handleDisable2FA = async () => {
    Alert.alert(
      'Disable Two-Factor Authentication',
      'Are you sure you want to disable two-factor authentication? This will make your account less secure.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            setError(null);

            try {
              const success = await disable2FA();

              if (success) {
                invalidateProfile(); // Invalidate cache globally
                await refetchProfile();
                Alert.alert(
                  'Success',
                  'Two-factor authentication has been disabled.',
                  [{ text: 'OK' }]
                );
              } else {
                throw new Error('Failed to disable 2FA');
              }
            } catch (err) {
              console.error('Error disabling 2FA:', err);
              setError('Failed to disable two-factor authentication');
              Alert.alert(
                'Error',
                'Failed to disable two-factor authentication. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSendCode = async () => {
    if (!user?.email) {
      setError('Email address not found');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Send OTP via Supabase Auth to email
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: user.email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (otpError) {
        throw otpError;
      }

      // Navigate to OTP verification screen
      router.push({
        pathname: '/(client)/profile/verify-2fa-otp',
        params: {
          email: user.email,
        },
      });
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
      Alert.alert(
        'Error',
        'Failed to send verification code. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <Header title="Account Security" onBackPress={() => router.back()} showBellIcon={false} />

        {/* Content */}
        <View className="flex-col p-6 space-y-6 flex-1">
          {is2FAEnabled ? (
            /* 2FA Enabled State */
            <>
              {/* Status Badge */}
              <View className="bg-green-50 border border-green-200 rounded-xl p-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-green-500/10 rounded-full items-center justify-center">
                    <Shield size={24} color="#10B981" />
                  </View>
                  <View className="flex-col flex-1">
                    <Text className="text-base font-semibold text-green-800 mb-1">
                      Two-Factor Authentication Enabled
                    </Text>
                    <Text className="text-sm text-green-600">
                      Your account is protected with 2FA
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-col space-y-4">
                <Text className="text-2xl font-bold text-gray-800">Account Security</Text>
                <Text className="text-base text-gray-600">
                  Two-factor authentication adds an extra layer of security to your account by
                  requiring a verification code from your email when signing in.
                </Text>
                <Text className="text-base text-gray-600">
                  You can disable two-factor authentication if you no longer want to use it,
                  but this will make your account less secure.
                </Text>
              </View>

              {/* Email Display */}
              <View className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-[#C1856A]/10 rounded-full items-center justify-center">
                    <Mail size={24} color="#C1856A" />
                  </View>
                  <View className="flex-col flex-1">
                    <Text className="text-sm text-gray-500 mb-1">Verification codes sent to</Text>
                    <Text className="text-base font-semibold text-gray-800">{user?.email}</Text>
                  </View>
                </View>
              </View>

              {/* Error Message */}
              {error && (
                <View className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <Text className="text-red-600 text-sm">{error}</Text>
                </View>
              )}

              <View className="flex-1" />

              {/* Disable Button */}
              <Pressable
                className={`rounded-full py-4 items-center ${isLoading ? 'bg-gray-300' : 'bg-red-500'}`}
                onPress={handleDisable2FA}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white text-lg font-bold">Processing...</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-2">
                    <ShieldOff size={20} color="white" />
                    <Text className="text-white text-lg font-bold">Disable Two-Factor Authentication</Text>
                  </View>
                )}
              </Pressable>
            </>
          ) : (
            /* 2FA Disabled State */
            <>
              <View className="flex-col space-y-4">
                <Text className="text-2xl font-bold text-gray-800">Two-factor authentication</Text>
                <Text className="text-base text-gray-600">
                  To keep your account secure, set up two-factor authentication.
                </Text>
                <Text className="text-base text-gray-600">
                  We'll send a verification code to your email address to activate two-factor
                  authentication.
                </Text>
              </View>

              {/* Email Display */}
              <View className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-[#C1856A]/10 rounded-full items-center justify-center">
                    <Mail size={24} color="#C1856A" />
                  </View>
                  <View className="flex-col flex-1">
                    <Text className="text-sm text-gray-500 mb-1">Verification code will be sent to</Text>
                    <Text className="text-base font-semibold text-gray-800">{user?.email}</Text>
                  </View>
                </View>
              </View>

              {/* Error Message */}
              {error && (
                <View className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <Text className="text-red-600 text-sm">{error}</Text>
                </View>
              )}

              <View className="flex-1" />

              {/* Send Code Button */}
              <Pressable
                className={`rounded-full py-4 items-center ${isLoading ? 'bg-gray-300' : 'bg-[#C1856A]'}`}
                onPress={handleSendCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white text-lg font-bold">Sending...</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-2">
                    <Shield size={20} color="white" />
                    <Text className="text-white text-lg font-bold">Enable Two-Factor Authentication</Text>
                  </View>
                )}
              </Pressable>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
