import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import gluestack-ui components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';

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
  BarChart3,
} from 'lucide-react-native';
import { useProfileStore, useAuthStore } from '@shared/supabase';
import { useRouter } from 'expo-router';

// --- Data for list items ---
const menuItems = [
  { icon: User, title: 'Account' },
  { icon: Shield, title: 'Account Security' },
  { icon: Lock, title: 'Change Password' },
  { icon: CreditCard, title: 'Payment' },
  { icon: BarChart3, title: 'Analytics' },
  { icon: Megaphone, title: 'Promos' },
  { icon: Bell, title: 'Notifications' },
  { icon: HelpCircle, title: 'Privacy settings' },
  { icon: MessageSquare, title: 'Support' },
  { icon: Info, title: 'About' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, isLoading, error, fetchProfile } = useProfileStore();
  const { signOut, user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

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
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <Pressable onPress={fetchProfile} className="bg-blue-500 px-4 py-2 rounded">
            <Text className="text-white">Retry</Text>
          </Pressable>
        </Box>
      </SafeAreaView>
    );
  }

  const displayName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name?.charAt(0) || ''}.` 
    : user?.email?.split('@')[0] || 'User';

  return (
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
              onPress={() => {
                if (item.title === 'Account') {
                  router.push('/profile/edit');
                } else if (item.title === 'Account Security') {
                  router.push('/profile/account-security');
                } else if (item.title === 'Change Password') {
                  router.push('/profile/change-password');
                } else if (item.title === 'Notifications') {
                  router.push('/profile/notifications');
                } else if (item.title === 'About') {
                  router.push('/profile/about');
                }
                else if (item.title === 'Promos') {
                  router.push('/profile/promotions');
                } else if (item.title === 'Payment') {
                  router.push('/profile/payments');
                } else if (item.title === 'Analytics') {
                  router.push('/(client)/profile/analytics' as any);
                }
              }}
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
  );
}
