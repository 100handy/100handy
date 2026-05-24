import React, { useState, useCallback } from 'react';
import { Image } from 'expo-image';
import { ScrollView, View, Text, Pressable, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';
import {
  User,
  Shield,
  Lock,
  CreditCard,
  Receipt,
  Bell,
  HelpCircle,
  MessageSquare,
  Info,
  LogOut,
  ChevronRight,
  Gift,
  Megaphone,
  Globe,
} from 'lucide-react-native';
import { useAuthStore } from '@shared/store';
import { switchToProfessionalRole } from '@shared/supabase';
import { getHandyProfile } from '@shared/supabase/profile';
import { getSession } from '@shared/supabase/auth';
import { useProfile, useUnreadNotificationCount } from '@shared/query';
import { queryClient } from '@shared/query/queryClient';
import { useRouter } from 'expo-router';
import { useToast } from '@/components/ui/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useSecureNavigation } from '@/hooks/useSecureNavigation';
import ReferralShareModal from '@/components/modals/ReferralShareModal';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

const DEFAULT_CONTENT = {
  'header.title': 'Profile',
  'auth.title': 'Please sign in',
  'auth.body': 'You need to be signed in to view your profile.',
  'auth.cta': 'Sign In',
  'loading.text': 'Loading profile...',
  'error.retry': 'Retry',
  'referral.cta': 'Help your friends, Get £10',
  'actions.offer_services': 'Offer services with 100Handy',
  'actions.logging_out': 'Error',
  'actions.logging_out_body': 'Failed to sign out. Please try again.',
  'actions.logout': 'Log out',
  'privacy.title': 'Privacy Notice',
  'privacy.body': 'By selecting "Accept All", you agree to the app storing information to enhance device navigation, analyze usage, and assist in our marketing efforts',
  'privacy.accept_cta': 'Accept All Cookies',
  'privacy.settings_cta': 'Cookies Settings',
  'verify.title': 'Verify Identity',
  'verify.body': 'Enter your password to access this section.',
  'verify.password_placeholder': 'Password',
  'verify.cta': 'Continue',
  'verify.cancel': 'Cancel',
  'switch.error_title': 'Switch failed',
} as const;

const ROLE_SWITCH_TIMEOUT_MS = 15000;

function withTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(message)), ROLE_SWITCH_TIMEOUT_MS);
    }),
  ]);
}

// --- Data for list items ---
// requiresSecurity: true means 2FA must be enabled to access this section
const menuItems = [
  { icon: User, title: 'Account', route: '/profile/edit', requiresSecurity: true },
  { icon: Shield, title: 'Account Security', route: '/(client)/profile/account-security', requiresSecurity: false },
  { icon: Lock, title: 'Change Password', route: '/profile/change-password', requiresSecurity: true },
  { icon: CreditCard, title: 'Payment', route: '/(client)/profile/payments', requiresSecurity: true },
  { icon: Receipt, title: 'Payment History', route: '/(client)/profile/payment-history', requiresSecurity: false },
  { icon: Megaphone, title: 'Promos', route: '/(client)/profile/promotions', requiresSecurity: false },
  { icon: Bell, title: 'Notifications', route: '/(client)/profile/notifications', requiresSecurity: false },
  { icon: HelpCircle, title: 'Privacy settings', route: '/(client)/profile/privacy-settings', requiresSecurity: false },
  { icon: MessageSquare, title: 'Support', route: '/(client)/profile/support', requiresSecurity: false },
  { icon: Info, title: 'About', route: '/profile/about', requiresSecurity: false },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut, user, isLoading: authLoading, checkAuth } = useAuthStore();
  const { data: profile, isLoading, error, refetch } = useProfile();
  const { navigateWithSecurityCheck, pendingRoute, isVerifying, verifyAndNavigate, cancelVerification } = useSecureNavigation();
  const [verifyPassword, setVerifyPassword] = useState('');
  const toast = useToast();
  const { data: unreadCount } = useUnreadNotificationCount(user?.id || '', 'customer');
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [isSwitchingToProfessional, setIsSwitchingToProfessional] = useState(false);
  const content = useAppContent('client_profile', DEFAULT_CONTENT);

  // Refetch profile when screen comes into focus (e.g., after changing 2FA settings)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error(
        getAppContentValue(content, 'actions.logging_out', DEFAULT_CONTENT['actions.logging_out']),
        getAppContentValue(content, 'actions.logging_out_body', DEFAULT_CONTENT['actions.logging_out_body'])
      );
    }
  };

  const handleGo100Task = async (): Promise<void> => {
    if (!user?.id) {
      router.push('/(auth)/(client)');
      return;
    }

    setIsSwitchingToProfessional(true);
    try {
      const ok = await withTimeout(
        switchToProfessionalRole(),
        'The role switch took too long. Please check your connection and try again.'
      );
      if (!ok) {
        console.error('Failed to switch to professional role');
        toast.error(
          getAppContentValue(content, 'switch.error_title', DEFAULT_CONTENT['switch.error_title']),
          'Could not switch to professional role. Please try again.'
        );
        return;
      }

      const { data: { session } } = await withTimeout(
        getSession(),
        'The updated session took too long to load. Please try again.'
      );
      const switchedUser = session?.user ?? null;
      const switchedMetadata = switchedUser?.user_metadata;
      useAuthStore.setState({
        user: switchedUser,
        session: session ?? null,
        isAuthenticated: !!switchedUser,
        isEmailVerified: !!switchedUser?.email_confirmed_at,
        isPhoneVerified: !!switchedUser?.phone_confirmed_at,
        hasCompletedOnboarding: switchedMetadata?.onboarding_completed || false,
        userRole: 'handy',
        isRoleResolved: true,
        isLoading: false,
      });

      void checkAuth();
      queryClient.clear();

      // Check if professional onboarding is completed
      const handyProfile = await withTimeout(
        getHandyProfile(),
        'The professional profile took too long to load. Please try again.'
      );
      if (!handyProfile?.onboarding_completed) {
        // First-time switch — send through professional onboarding flow
        router.replace('/(auth)/(professional)/verify-info');
      } else {
        router.replace('/(professional)/(tabs)/dashboard');
      }
    } catch (err) {
      console.error('Error switching to professional:', err);
      toast.error(
        'Switch failed',
        err instanceof Error ? err.message : 'An error occurred while switching roles. Please try again.'
      );
    } finally {
      setIsSwitchingToProfessional(false);
    }
  };

  const handleMenuItemPress = (item: typeof menuItems[0]) => {
    if (item.title === 'Privacy settings') {
      setShowPrivacyNotice(true);
    } else {
      navigateWithSecurityCheck(item.route, item.requiresSecurity);
    }
  };

  const handleAcceptCookies = async () => {
    setShowPrivacyNotice(false);
    try {
      await AsyncStorage.setItem('cookie_preferences', JSON.stringify({ accepted: true, timestamp: Date.now() }));
    } catch (error) {
      console.error('Error saving cookie preferences:', error);
    }
  };

  const handleCookiesSettings = () => {
    setShowPrivacyNotice(false);
    router.push('/(client)/profile/privacy-settings');
  };

  // Show sign-in prompt for unauthenticated users (after auth loading completes)
  if (!authLoading && !user?.id) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="bg-[#333A31] pt-12 pb-6 px-6">
          <Text className="text-white text-[32px] font-black leading-tight">
            {getAppContentValue(content, 'header.title', DEFAULT_CONTENT['header.title'])}
          </Text>
        </View>
        <View className="flex-1 items-center justify-center py-12">
          <User size={64} color="#C1856A" />
          <Text className="text-lg font-medium text-[#333A31] mt-4 mb-2">
            {getAppContentValue(content, 'auth.title', DEFAULT_CONTENT['auth.title'])}
          </Text>
          <Text className="text-sm text-[#666666] text-center px-8 mb-6">
            {getAppContentValue(content, 'auth.body', DEFAULT_CONTENT['auth.body'])}
          </Text>
          <Pressable
            onPress={() => router.push('/(auth)/(client)/sign-in')}
            className="px-8 py-3 rounded-full bg-clay-orange"
          >
            <Text className="text-white font-medium">
              {getAppContentValue(content, 'auth.cta', DEFAULT_CONTENT['auth.cta'])}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="mt-4 text-gray-500">
            {getAppContentValue(content, 'loading.text', DEFAULT_CONTENT['loading.text'])}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-red-500 text-center mb-4">
            {error instanceof Error ? error.message : 'Failed to load profile'}
          </Text>
          <Pressable
            onPress={() => refetch()}
            className="bg-brand-terracotta px-6 py-2.5 rounded-full"
          >
            <Text className="text-white font-medium">
              {getAppContentValue(content, 'error.retry', DEFAULT_CONTENT['error.retry'])}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const displayName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name?.charAt(0) || ''}.` 
    : user?.email?.split('@')[0] || 'User';

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1">
          {/* Header with dark green background */}
          <View className="bg-[#333A31] pt-12 pb-6 px-6">
            {/* Notification icon with badge */}
            <Pressable
              className="absolute top-3 right-6 z-10"
              onPress={() => router.push('/(client)/notifications')}
            >
              <Bell size={24} color="white" />
              {!!unreadCount && unreadCount > 0 && (
                <View className="absolute -top-1 -right-2 min-w-[18px] h-[18px] rounded-full items-center justify-center px-1" style={{ backgroundColor: '#C1856A' }}>
                  <Text className="text-white text-[10px] font-bold">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Profile Info */}
            <View className="flex-row items-start mb-6">
              <Image
                source={{ uri: profile?.avatar_url || undefined }}
                placeholder={require('@/assets/images/icon.png')}
                alt="User Avatar"
                className="w-[72px] h-[72px] rounded-full"
                transition={200}
              />
              <View className="flex-col ml-4 flex-1">
                <Text className="text-white text-[32px] font-black leading-tight mb-1">
                  {displayName}
                </Text>
                <Text className="text-[#F3E3D3] text-base mb-1">
                  {profile?.email || user?.email || 'No email'}
                </Text>
                {profile?.postcode && (
                  <Text className="text-white text-base">
                    {profile.postcode}
                  </Text>
                )}
              </View>
            </View>

            {/* Referral Banner */}
            <Pressable
              className="border-2 border-[#C1856A] rounded-full py-3 px-4 flex-row items-center justify-center"
              onPress={() => setShowReferralModal(true)}
            >
              <Gift size={20} color="#C1856A" className="mr-2" />
              <Text className="text-[#C1856A] font-bold text-base">
                {getAppContentValue(content, 'referral.cta', DEFAULT_CONTENT['referral.cta'])}
              </Text>
            </Pressable>
          </View>

          {/* Menu Items */}
          <ScrollView
            className="flex-1 bg-white mt-4"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#C1856A"
                colors={['#C1856A']}
              />
            }
          >
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                className="flex-row items-center px-6 py-5 border-b border-gray-100"
                onPress={() => handleMenuItemPress(item)}
              >
                <item.icon size={20} color="#9CA3AF" strokeWidth={1.5} />
                <Text className="flex-1 ml-4 text-lg text-[#30352d]">{item.title}</Text>
                <ChevronRight size={20} color="#D1D5DB" />
              </Pressable>
            ))}

            {/* Offer services with 100Handy */}
            <Pressable
              className="flex-row items-center px-6 py-5 border-b border-gray-100"
              onPress={handleGo100Task}
              disabled={isSwitchingToProfessional}
            >
              <Globe size={20} color="#C1856A" strokeWidth={1.5} />
              <Text className="flex-1 ml-4 text-lg text-[#C1856A]">
                {getAppContentValue(content, 'actions.offer_services', DEFAULT_CONTENT['actions.offer_services'])}
              </Text>
              {isSwitchingToProfessional && <ActivityIndicator size="small" color="#C1856A" />}
            </Pressable>

            {/* Sign Out Button */}
            <Pressable
              className="flex-row items-center px-6 py-5"
              onPress={handleSignOut}
            >
              <LogOut size={20} color="#C1856A" strokeWidth={1.5} />
              <Text className="flex-1 ml-4 text-lg text-[#C1856A]">
                {getAppContentValue(content, 'actions.logout', DEFAULT_CONTENT['actions.logout'])}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Privacy Notice Modal */}
      <Modal isOpen={showPrivacyNotice} onClose={() => setShowPrivacyNotice(false)}>
        <ModalBackdrop />
        <ModalContent className="bg-white" style={{ minHeight: '40%' }}>
          {/* Drag Indicator */}
          <View className="w-full items-center pt-2 pb-1">
            <View className="w-12 h-1 rounded-full bg-gray-400" />
          </View>

          <ModalBody>
            <View className="flex-col w-full px-6 py-4 items-center">
              {/* Title */}
              <Text className="text-[#333A31] text-xl font-medium mb-4">
                {getAppContentValue(content, 'privacy.title', DEFAULT_CONTENT['privacy.title'])}
              </Text>

              {/* Description */}
              <Text className="text-[#333A31] text-xs text-center leading-5 mb-6">
                {getAppContentValue(content, 'privacy.body', DEFAULT_CONTENT['privacy.body'])}
              </Text>

              {/* Accept All Cookies Button */}
              <Pressable
                className="w-full bg-[#A0B194] rounded-lg py-4 mb-4 items-center justify-center"
                onPress={handleAcceptCookies}
              >
                <Text className="text-white text-base font-bold">
                  {getAppContentValue(content, 'privacy.accept_cta', DEFAULT_CONTENT['privacy.accept_cta'])}
                </Text>
              </Pressable>

              {/* Cookies Settings Link */}
              <Pressable onPress={handleCookiesSettings}>
                <Text className="text-[#A0B194] text-base font-bold underline">
                  {getAppContentValue(content, 'privacy.settings_cta', DEFAULT_CONTENT['privacy.settings_cta'])}
                </Text>
              </Pressable>
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>

      <ReferralShareModal isOpen={showReferralModal} onClose={() => setShowReferralModal(false)} />

      {/* Password Verification Modal (for 2FA-protected routes) */}
      <Modal isOpen={!!pendingRoute} onClose={() => { cancelVerification(); setVerifyPassword(''); }}>
        <ModalBackdrop />
        <ModalContent className="bg-white" style={{ minHeight: '30%' }}>
          <ModalBody>
            <View className="flex-col w-full px-4 py-6">
              <Text className="text-[#333A31] text-xl font-semibold mb-2">
                {getAppContentValue(content, 'verify.title', DEFAULT_CONTENT['verify.title'])}
              </Text>
              <Text className="text-gray-600 text-sm mb-6">
                {getAppContentValue(content, 'verify.body', DEFAULT_CONTENT['verify.body'])}
              </Text>
              <TextInput
                value={verifyPassword}
                onChangeText={setVerifyPassword}
                placeholder={getAppContentValue(content, 'verify.password_placeholder', DEFAULT_CONTENT['verify.password_placeholder'])}
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoFocus
                className="border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
                style={{ color: '#333A31' }}
              />
              <Pressable
                onPress={() => {
                  verifyAndNavigate(verifyPassword);
                  setVerifyPassword('');
                }}
                disabled={isVerifying || !verifyPassword}
                className="w-full py-4 rounded-full items-center"
                style={{ backgroundColor: isVerifying || !verifyPassword ? '#D1D5DB' : '#C1856A' }}
              >
                {isVerifying ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-semibold text-base">
                    {getAppContentValue(content, 'verify.cta', DEFAULT_CONTENT['verify.cta'])}
                  </Text>
                )}
              </Pressable>
              <Pressable
                onPress={() => { cancelVerification(); setVerifyPassword(''); }}
                className="w-full py-3 items-center mt-2"
              >
                <Text className="text-gray-500 text-base">
                  {getAppContentValue(content, 'verify.cancel', DEFAULT_CONTENT['verify.cancel'])}
                </Text>
              </Pressable>
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
