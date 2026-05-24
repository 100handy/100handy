import React, { useState, useCallback } from 'react';
import { useAuthStore } from '@shared/store';
import { SafeAreaView } from 'react-native-safe-area-context'; import { Mail, Shield, ShieldOff } from 'lucide-react-native'; import Header from '@/components/Header'; import { useRouter } from 'expo-router'; import { useFocusEffect } from '@react-navigation/native'; import { supabase, disable2FA, signIn } from '@shared/supabase';
import { useDeleteAccount, useProfile, useInvalidateProfile } from '@shared/query';
import { Alert, ActivityIndicator, View, Text, Pressable, TextInput } from 'react-native';
import { Modal, ModalBackdrop, ModalBody, ModalContent } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { goBackOrReplace } from '@/lib/navigation';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

export default function AccountSecurityScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: profile, refetch: refetchProfile } = useProfile();
  const { invalidateProfile } = useInvalidateProfile();
  const deleteAccount = useDeleteAccount();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const content = useAppContent('client_account_security', {
    'header.title': 'Account Security',
    'enabled.badge_title': 'Two-Factor Authentication Enabled',
    'enabled.badge_body': 'Your account is protected with 2FA',
    'enabled.hero_title': 'Account Security',
    'enabled.body_1': 'Two-factor authentication adds an extra layer of security to your account by requiring a verification code from your email when signing in.',
    'enabled.body_2': 'You can disable two-factor authentication if you no longer want to use it, but this will make your account less secure.',
    'disabled.hero_title': 'Two-factor authentication',
    'disabled.body_1': 'To keep your account secure, set up two-factor authentication.',
    'disabled.body_2': "We'll send a verification code to your email address to activate two-factor authentication.",
    'email.enabled_label': 'Verification codes sent to',
    'email.disabled_label': 'Verification code will be sent to',
    'actions.disable_2fa': 'Disable Two-Factor Authentication',
    'actions.enable_2fa': 'Enable Two-Factor Authentication',
    'actions.processing': 'Processing...',
    'actions.sending': 'Sending...',
    'actions.delete_account': 'Delete Account',
    'delete_modal.title': 'Delete Account',
    'delete_modal.body': 'This action cannot be undone. Your account and related data will be permanently deleted.',
    'delete_modal.prompt': 'Enter your password to confirm.',
    'delete_modal.password_placeholder': 'Password',
    'delete_modal.confirm': 'Delete My Account',
    'delete_modal.cancel': 'Cancel',
    'alerts.disable_title': 'Disable Two-Factor Authentication',
    'alerts.disable_body': 'Are you sure you want to disable two-factor authentication? This will make your account less secure.',
    'alerts.cancel': 'Cancel',
    'alerts.disable_confirm': 'Disable',
    'alerts.success_title': 'Success',
    'alerts.success_body': 'Two-factor authentication has been disabled.',
    'alerts.error_title': 'Error',
    'alerts.disable_error_body': 'Failed to disable two-factor authentication. Please try again.',
    'alerts.send_error_body': 'Failed to send verification code. Please try again.',
    'toasts.delete_success_title': 'Success',
    'toasts.delete_success_body': 'Your account has been deleted',
    'toasts.delete_error_title': 'Error',
    'toasts.delete_error_body': 'Failed to delete account. Please try again.',
    'toasts.delete_password_error_body': 'Incorrect password. Please try again.',
  });

  const is2FAEnabled = profile?.two_factor_enabled || false;

  // Refetch profile when screen comes into focus (e.g., after enabling 2FA)
  useFocusEffect(
    useCallback(() => {
      refetchProfile();
    }, [refetchProfile])
  );

  const handleDisable2FA = async () => {
    Alert.alert(
      getAppContentValue(content, 'alerts.disable_title', 'Disable Two-Factor Authentication'),
      getAppContentValue(content, 'alerts.disable_body', 'Are you sure you want to disable two-factor authentication? This will make your account less secure.'),
      [
        {
          text: getAppContentValue(content, 'alerts.cancel', 'Cancel'),
          style: 'cancel',
        },
        {
          text: getAppContentValue(content, 'alerts.disable_confirm', 'Disable'),
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
                  getAppContentValue(content, 'alerts.success_title', 'Success'),
                  getAppContentValue(content, 'alerts.success_body', 'Two-factor authentication has been disabled.'),
                  [{ text: 'OK' }]
                );
              } else {
                throw new Error('Failed to disable 2FA');
              }
            } catch (err) {
              console.error('Error disabling 2FA:', err);
              setError('Failed to disable two-factor authentication');
              Alert.alert(
                getAppContentValue(content, 'alerts.error_title', 'Error'),
                getAppContentValue(content, 'alerts.disable_error_body', 'Failed to disable two-factor authentication. Please try again.'),
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
        getAppContentValue(content, 'alerts.error_title', 'Error'),
        getAppContentValue(content, 'alerts.send_error_body', 'Failed to send verification code. Please try again.'),
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteWithPassword = async () => {
    if (!deletePassword || !user?.email) return;

    setIsLoading(true);
    setError(null);

    try {
      await signIn(user.email, deletePassword);

      const success = await deleteAccount.mutateAsync();
      if (success) {
        setShowDeleteConfirm(false);
        setDeletePassword('');
        toast.success(
          getAppContentValue(content, 'toasts.delete_success_title', 'Success'),
          getAppContentValue(content, 'toasts.delete_success_body', 'Your account has been deleted'),
        );
        router.replace('/(auth)/(client)');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      const message = err instanceof Error && err.message.includes('Invalid login credentials')
        ? getAppContentValue(content, 'toasts.delete_password_error_body', 'Incorrect password. Please try again.')
        : getAppContentValue(content, 'toasts.delete_error_body', 'Failed to delete account. Please try again.');
      toast.error(getAppContentValue(content, 'toasts.delete_error_title', 'Error'), message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <Header title={getAppContentValue(content, 'header.title', 'Account Security')} onBackPress={() => goBackOrReplace(router, '/(client)/(tabs)/profile')} showBellIcon={false} />

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
                      {getAppContentValue(content, 'enabled.badge_title', 'Two-Factor Authentication Enabled')}
                    </Text>
                    <Text className="text-sm text-green-600">
                      {getAppContentValue(content, 'enabled.badge_body', 'Your account is protected with 2FA')}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-col space-y-4">
                <Text className="text-2xl font-bold text-gray-800">{getAppContentValue(content, 'enabled.hero_title', 'Account Security')}</Text>
                <Text className="text-base text-gray-600">
                  {getAppContentValue(content, 'enabled.body_1', 'Two-factor authentication adds an extra layer of security to your account by requiring a verification code from your email when signing in.')}
                </Text>
                <Text className="text-base text-gray-600">
                  {getAppContentValue(content, 'enabled.body_2', 'You can disable two-factor authentication if you no longer want to use it, but this will make your account less secure.')}
                </Text>
              </View>

              {/* Email Display */}
              <View className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-[#C1856A]/10 rounded-full items-center justify-center">
                    <Mail size={24} color="#C1856A" />
                  </View>
                  <View className="flex-col flex-1">
                    <Text className="text-sm text-gray-500 mb-1">{getAppContentValue(content, 'email.enabled_label', 'Verification codes sent to')}</Text>
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
                    <Text className="text-white text-lg font-bold">{getAppContentValue(content, 'actions.processing', 'Processing...')}</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-2">
                    <ShieldOff size={20} color="white" />
                    <Text className="text-white text-lg font-bold">{getAppContentValue(content, 'actions.disable_2fa', 'Disable Two-Factor Authentication')}</Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                className="py-4 items-center mt-4"
                onPress={handleDeleteAccount}
                disabled={isLoading}
              >
                <Text className="text-red-600 text-base font-bold">{getAppContentValue(content, 'actions.delete_account', 'Delete Account')}</Text>
              </Pressable>
            </>
          ) : (
            /* 2FA Disabled State */
            <>
              <View className="flex-col space-y-4">
                <Text className="text-2xl font-bold text-gray-800">{getAppContentValue(content, 'disabled.hero_title', 'Two-factor authentication')}</Text>
                <Text className="text-base text-gray-600">
                  {getAppContentValue(content, 'disabled.body_1', 'To keep your account secure, set up two-factor authentication.')}
                </Text>
                <Text className="text-base text-gray-600">
                  {getAppContentValue(content, 'disabled.body_2', "We'll send a verification code to your email address to activate two-factor authentication.")}
                </Text>
              </View>

              {/* Email Display */}
              <View className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-[#C1856A]/10 rounded-full items-center justify-center">
                    <Mail size={24} color="#C1856A" />
                  </View>
                  <View className="flex-col flex-1">
                    <Text className="text-sm text-gray-500 mb-1">{getAppContentValue(content, 'email.disabled_label', 'Verification code will be sent to')}</Text>
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
                    <Text className="text-white text-lg font-bold">{getAppContentValue(content, 'actions.sending', 'Sending...')}</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-2">
                    <Shield size={20} color="white" />
                    <Text className="text-white text-lg font-bold">{getAppContentValue(content, 'actions.enable_2fa', 'Enable Two-Factor Authentication')}</Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                className="py-4 items-center mt-4"
                onPress={handleDeleteAccount}
                disabled={isLoading}
              >
                <Text className="text-red-600 text-base font-bold">{getAppContentValue(content, 'actions.delete_account', 'Delete Account')}</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      <Modal isOpen={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}>
        <ModalBackdrop />
        <ModalContent className="bg-white">
          <ModalBody>
            <View className="flex-col w-full px-4 py-6">
              <Text className="text-xl font-semibold text-[#30352D] mb-2">{getAppContentValue(content, 'delete_modal.title', 'Delete Account')}</Text>
              <Text className="text-sm text-gray-600 mb-2">
                {getAppContentValue(content, 'delete_modal.body', 'This action cannot be undone. Your account and related data will be permanently deleted.')}
              </Text>
              <Text className="text-sm font-semibold text-gray-700 mb-4">
                {getAppContentValue(content, 'delete_modal.prompt', 'Enter your password to confirm.')}
              </Text>
              <TextInput
                value={deletePassword}
                onChangeText={setDeletePassword}
                placeholder={getAppContentValue(content, 'delete_modal.password_placeholder', 'Password')}
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoFocus
                className="border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
                style={{ color: '#30352D' }}
              />
              <Pressable
                onPress={confirmDeleteWithPassword}
                disabled={isLoading || !deletePassword}
                className="w-full py-4 rounded-full items-center"
                style={{ backgroundColor: isLoading || !deletePassword ? '#D1D5DB' : '#DC2626' }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-semibold text-base">{getAppContentValue(content, 'delete_modal.confirm', 'Delete My Account')}</Text>
                )}
              </Pressable>
              <Pressable
                onPress={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}
                className="w-full py-3 items-center mt-2"
              >
                <Text className="text-gray-500 text-base">{getAppContentValue(content, 'delete_modal.cancel', 'Cancel')}</Text>
              </Pressable>
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
