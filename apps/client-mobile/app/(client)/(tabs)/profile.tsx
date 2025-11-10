import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import gluestack-ui components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper
} from '@/components/ui/actionsheet';

// Import lucide-react-native icons
import {
  User,
  Shield,
  Lock,
  CreditCard,
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
import { useAuthStore } from '@shared/supabase';
import { useProfile } from '@shared/query';
import { useRouter } from 'expo-router';
import { useSecureNavigation } from '@/hooks/useSecureNavigation';

// --- Data for list items ---
// requiresSecurity: true means 2FA must be enabled to access this section
const menuItems = [
  { icon: User, title: 'Account', route: '/profile/edit', requiresSecurity: true },
  { icon: Shield, title: 'Account Security', route: '/(client)/profile/account-security', requiresSecurity: false },
  { icon: Lock, title: 'Change Password', route: '/profile/change-password', requiresSecurity: true },
  { icon: CreditCard, title: 'Payment', route: '/profile/payments', requiresSecurity: true },
  { icon: Megaphone, title: 'Promos', route: '/profile/promotions', requiresSecurity: false },
  { icon: Bell, title: 'Notifications', route: '/profile/notifications', requiresSecurity: false },
  { icon: HelpCircle, title: 'Privacy settings', route: '/profile/privacy-settings', requiresSecurity: false },
  { icon: MessageSquare, title: 'Support', route: '/profile/support', requiresSecurity: false },
  { icon: Info, title: 'About', route: '/profile/about', requiresSecurity: false },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { data: profile, isLoading, error } = useProfile();
  const { signOut, user } = useAuthStore();
  const { navigateWithSecurityCheck } = useSecureNavigation();
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigate directly to auth screen after successful logout
      router.replace('/(auth)/role-selection');
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if signOut fails, try to navigate to auth screen
      router.replace('/(auth)/role-selection');
    }
  };

  const handleMenuItemPress = (item: typeof menuItems[0]) => {
    if (item.title === 'Privacy settings') {
      console.log('Opening privacy notice actionsheet');
      setShowPrivacyNotice(true);
    } else {
      navigateWithSecurityCheck(item.route, item.requiresSecurity);
    }
  };

  const handleAcceptCookies = () => {
    setShowPrivacyNotice(false);
    // You can add logic to save user's cookie preferences here
    console.log('Cookies accepted');
  };

  const handleCookiesSettings = () => {
    setShowPrivacyNotice(false);
    router.push('/profile/privacy-settings');
  };

  useEffect(() => {
    console.log('showPrivacyNotice state changed:', showPrivacyNotice);
  }, [showPrivacyNotice]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Box className="flex-1 justify-center items-center">
          <Text className="mt-4 text-gray-500">Loading profile...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Box className="flex-1 justify-center items-center p-6">
          <Text className="text-red-500 text-center mb-4">
            {error instanceof Error ? error.message : 'Failed to load profile'}
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  const displayName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name?.charAt(0) || ''}.` 
    : user?.email?.split('@')[0] || 'User';

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <Box className="flex-1">
          {/* Header with dark green background */}
          <Box className="bg-[#333A31] pt-12 pb-6 px-6">
            {/* Notification icon */}
            <Pressable className="absolute top-3 right-6 z-10">
              <Bell size={24} color="white" />
            </Pressable>

            {/* Profile Info */}
            <HStack className="items-start mb-6">
              <Image
                source={{ uri: profile?.avatar_url || 'https://i.pravatar.cc/150?u=default' }}
                alt="User Avatar"
                className="w-[72px] h-[72px] rounded-full"
              />
              <VStack className="ml-4 flex-1">
                <Text className="text-white text-[32px] font-black leading-tight mb-1">
                  {displayName}
                </Text>
                <Text className="text-[#F3E3D3] text-base mb-1">
                  {profile?.email || user?.email || 'No email'}
                </Text>
                <Text className="text-white text-base">
                  Wanstead, Greater London, E11 2
                </Text>
              </VStack>
            </HStack>

            {/* Referral Banner */}
            <Pressable
              className="border-2 border-[#C1856A] rounded-full py-3 px-4 flex-row items-center justify-center"
              onPress={() => console.log('Referral program')}
            >
              <Gift size={20} color="#C1856A" className="mr-2" />
              <Text className="text-[#C1856A] font-bold text-base">Help your friends, Get £10</Text>
            </Pressable>
          </Box>

          {/* Menu Items */}
          <ScrollView className="flex-1 bg-white mt-4">
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

            {/* Go 100Task */}
            <Pressable
              className="flex-row items-center px-6 py-5 border-b border-gray-100"
              onPress={() => console.log('Go to 100Task')}
            >
              <Globe size={20} color="#C1856A" strokeWidth={1.5} />
              <Text className="flex-1 ml-4 text-lg text-[#C1856A]">Go 100Task</Text>
            </Pressable>

            {/* Sign Out Button */}
            <Pressable
              className="flex-row items-center px-6 py-5"
              onPress={handleSignOut}
            >
              <LogOut size={20} color="#C1856A" strokeWidth={1.5} />
              <Text className="flex-1 ml-4 text-lg text-[#C1856A]">Log out</Text>
            </Pressable>
          </ScrollView>
        </Box>
      </SafeAreaView>

      {/* Privacy Notice Actionsheet */}
      <Actionsheet isOpen={showPrivacyNotice} onClose={() => setShowPrivacyNotice(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-white" style={{ minHeight: '40%' }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-gray-400" />
          </ActionsheetDragIndicatorWrapper>

          <VStack className="w-full px-6 py-4 items-center">
            {/* Title */}
            <Text className="text-[#333A31] text-xl font-medium mb-4">
              Privacy Notice
            </Text>

            {/* Description */}
            <Text className="text-[#333A31] text-xs text-center leading-5 mb-6">
              By selecting "Accept All", you agree to the app storing information to enhance device navigation, analyze usage, and assist in our marketing efforts
            </Text>

            {/* Accept All Cookies Button */}
            <Pressable
              className="w-full bg-[#A0B194] rounded-lg py-4 mb-4 items-center justify-center"
              onPress={handleAcceptCookies}
            >
              <Text className="text-white text-base font-bold">
                Accept All Cookies
              </Text>
            </Pressable>

            {/* Cookies Settings Link */}
            <Pressable onPress={handleCookiesSettings}>
              <Text className="text-[#A0B194] text-base font-bold underline">
                Cookies Settings
              </Text>
            </Pressable>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}
