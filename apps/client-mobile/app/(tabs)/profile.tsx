import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import gluestack-ui components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { Loader } from '@/components/ui/loader';

// Import lucide-react-native icons
import {
  Settings,
  Shield,
  CreditCard,
  Bell,
  Lock,
  Headphones,
  Info,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { useProfileStore, useAuthStore } from '@shared/supabase';
import Header from '@/components/Header';
import { useRouter } from 'expo-router';

// --- Data for list items ---
const settingsItems = [
  {
    icon: Settings,
    bgColorClass: 'bg-info-bg',
    colorClass: 'text-info-color',
    title: 'Account Settings',
    subtitle: 'Manage your account preferences',
  },
  {
    icon: Shield,
    bgColorClass: 'bg-profile-green-bg',
    colorClass: 'text-profile-green',
    title: 'Account Security',
    subtitle: 'Password and security settings',
  },
  {
    icon: CreditCard,
    bgColorClass: 'bg-profile-purple-bg',
    colorClass: 'text-profile-purple',
    title: 'Payments',
    subtitle: 'Payment methods and billing',
  },
  {
    icon: Bell,
    bgColorClass: 'bg-profile-orange-bg',
    colorClass: 'text-profile-orange',
    title: 'Notifications',
    subtitle: 'Manage notification preferences',
  },
  {
    icon: Lock,
    bgColorClass: 'bg-profile-red-bg',
    colorClass: 'text-profile-red',
    title: 'Privacy Settings',
    subtitle: 'Control your privacy options',
  },
  {
    icon: Headphones,
    bgColorClass: 'bg-profile-yellow-bg',
    colorClass: 'text-profile-yellow',
    title: 'Support',
    subtitle: 'Get help and contact us',
  },
  {
    icon: Info,
    bgColorClass: 'bg-profile-gray-bg',
    colorClass: 'text-tertiary-text',
    title: 'About',
    subtitle: 'App info and legal terms',
  },
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
      <SafeAreaView className="flex-1 bg-primary-bg">
        <Header title="Profile" onBackPress={() => router.back()} showBellIcon={false}/>
        <Box className="flex-1 justify-center items-center">
          <Loader size="large" />
          <Text className="mt-4 text-secondary-text font-worksans">Loading profile...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-primary-bg">
        <Header title="Profile" onBackPress={() => router.back()} showBellIcon={false}/>
        <Box className="flex-1 justify-center items-center p-6">
          <Text className="text-profile-danger text-center mb-4 font-worksans">{error}</Text>
          <Pressable onPress={fetchProfile} className="bg-info-color px-4 py-2 rounded-profile-small">
            <Text className="text-primary-bg font-worksans-medium">Retry</Text>
          </Pressable>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg">
      <Box className="flex-1 bg-secondary-bg">
        {/* Header */}
       <Header title="Profile" onBackPress={() => router.back()} showBellIcon={false}/>

        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack className="p-profile-md">
            {/* Profile Info Card */}
            <Box className="bg-primary-bg rounded-2xl p-profile-md mb-profile-md">
              <HStack className="items-center">
                <Image
                   source={{ uri: profile?.avatar_url || 'https://i.pravatar.cc/150?u=default' }}
                   alt="User Avatar"
                   className="w-16 h-16 rounded-profile-full"
                 />
                 <VStack className="flex-1 ml-4">
                   <Heading className="font-worksans-semibold text-lg text-primary-text">{profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : profile?.first_name || profile?.last_name || user?.email || 'User'}</Heading>
          <Text className="font-worksans text-sm text-secondary-text mt-1">{profile?.email || user?.email || 'No email'}</Text>
          <Text className="font-worksans text-xs text-tertiary-text mt-1">Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}</Text>
                 </VStack>
                <Pressable 
                   onPress={() => router.push('/profile/edit')}
                   className="bg-primary-bg-10 py-2 px-4 rounded-profile-full"
                 >
                   <Text className="text-primary-brand font-worksans-medium text-xs">Edit</Text>
                 </Pressable>
              </HStack>
              
              {/* Stats Section */}
              <HStack className="justify-around mt-5 pt-5 border-t border-profile-border-light">
                <VStack className="items-center">
                  <Heading className="font-worksans-semibold text-lg text-primary-text">12</Heading>
            <Text className="font-worksans text-xs text-tertiary-text mt-1">Completed</Text>
                </VStack>
                <VStack className="items-center">
                  <Heading className="font-worksans-semibold text-lg text-primary-text">4.8</Heading>
            <Text className="font-worksans text-xs text-tertiary-text mt-1">Rating</Text>
                </VStack>
                <VStack className="items-center">
                  <Heading className="font-worksans-semibold text-lg text-primary-text">£240</Heading>
            <Text className="font-worksans text-xs text-tertiary-text mt-1">Saved</Text>
                </VStack>
              </HStack>
            </Box>

            {/* Settings List */}
            {settingsItems.map((item, index) => (
              <Pressable key={index} className="flex-row items-center bg-primary-bg p-profile-lg rounded-profile-small mb-3">
                <Box className={`w-10 h-10 rounded-profile-small items-center justify-center ${item.bgColorClass}`}>
                  <Icon as={item.icon} size="lg" className={item.colorClass} />
                </Box>
                <VStack className="flex-1 ml-4">
                  <Text className="font-worksans-medium text-sm text-primary-text">{item.title}</Text>
            <Text className="font-worksans text-xs text-tertiary-text mt-px">{item.subtitle}</Text>
                </VStack>
                <Icon as={ChevronRight} size="lg" className="text-inactive-text" />
              </Pressable>
            ))}

            {/* Sign Out Button */}
            <Pressable onPress={handleSignOut} className="flex-row items-center justify-center bg-profile-danger-bg p-profile-md rounded-profile-small mt-2">
              <Icon as={LogOut} size="lg" className="text-profile-danger" />
              <Text className="text-profile-danger font-worksans-medium ml-2">Sign Out</Text>
            </Pressable>
          </VStack>
        </ScrollView>

     
      </Box>
    </SafeAreaView>
  );
}