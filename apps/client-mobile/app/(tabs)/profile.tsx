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
  ChevronLeft,
  MoreVertical,
  Settings,
  Shield,
  CreditCard,
  Bell,
  Lock,
  Headphones,
  Info,
  LogOut,
  ChevronRight,
  Home,
  Search,
  ClipboardList,
  User,
} from 'lucide-react-native';
import { useProfileStore, useAuthStore } from '@shared/supabase';
import Header from '@/components/Header';
import { useRouter } from 'expo-router';

// --- Data for list items ---
const settingsItems = [
  {
    icon: Settings,
    bgColor: '#EBF5FF',
    color: '#3B82F6',
    title: 'Account Settings',
    subtitle: 'Manage your account preferences',
  },
  {
    icon: Shield,
    bgColor: '#E6F7F0',
    color: '#10B981',
    title: 'Account Security',
    subtitle: 'Password and security settings',
  },
  {
    icon: CreditCard,
    bgColor: '#F4F0FE',
    color: '#8B5CF6',
    title: 'Payments',
    subtitle: 'Payment methods and billing',
  },
  {
    icon: Bell,
    bgColor: '#FFF5EB',
    color: '#F97316',
    title: 'Notifications',
    subtitle: 'Manage notification preferences',
  },
  {
    icon: Lock,
    bgColor: '#FEF6F5',
    color: '#EF4444',
    title: 'Privacy Settings',
    subtitle: 'Control your privacy options',
  },
  {
    icon: Headphones,
    bgColor: '#FEFBEB',
    color: '#F59E0B',
    title: 'Support',
    subtitle: 'Get help and contact us',
  },
  {
    icon: Info,
    bgColor: '#F3F4F6',
    color: '#6B7280',
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
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Header title="Profile" onBackPress={() => router.back()} showBellIcon={false}/>
        <Box className="flex-1 justify-center items-center">
          <Loader size="large" />
          <Text className="mt-4 text-gray-600">Loading profile...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Header title="Profile" onBackPress={() => router.back()} showBellIcon={false}/>
        <Box className="flex-1 justify-center items-center p-6">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <Pressable onPress={fetchProfile} className="bg-blue-500 px-4 py-2 rounded">
            <Text className="text-white">Retry</Text>
          </Pressable>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box className="flex-1 bg-[#F7F8FA]">
        {/* Header */}
       <Header title="Profile" onBackPress={() => router.back()} showBellIcon={false}/>

        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack className="p-4">
            {/* Profile Info Card */}
            <Box className="bg-white rounded-2xl p-4 mb-4">
              <HStack className="items-center">
                <Image
                   source={{ uri: profile?.avatar_url || 'https://i.pravatar.cc/150?u=default' }}
                   alt="User Avatar"
                   className="w-16 h-16 rounded-full"
                 />
                 <VStack className="flex-1 ml-4">
                   <Heading size="lg">{profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : profile?.first_name || profile?.last_name || user?.email || 'User'}</Heading>
                   <Text size="sm" className="text-gray-500 mt-1">{profile?.email || user?.email || 'No email'}</Text>
                   <Text size="xs" className="text-gray-400 mt-1">Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}</Text>
                 </VStack>
                <Pressable 
                   onPress={() => router.push('/profile/edit')}
                   className="bg-[#FEF6F5] py-2 px-4 rounded-full"
                 >
                   <Text className="text-[#F56565] font-semibold text-sm">Edit</Text>
                 </Pressable>
              </HStack>
              
              {/* Stats Section */}
              <HStack className="justify-around mt-5 pt-5 border-t border-gray-100">
                <VStack className="items-center">
                  <Heading size="lg">12</Heading>
                  <Text size="sm" className="text-gray-500 mt-1">Completed</Text>
                </VStack>
                <VStack className="items-center">
                  <Heading size="lg">4.8</Heading>
                  <Text size="sm" className="text-gray-500 mt-1">Rating</Text>
                </VStack>
                <VStack className="items-center">
                  <Heading size="lg">£240</Heading>
                  <Text size="sm" className="text-gray-500 mt-1">Saved</Text>
                </VStack>
              </HStack>
            </Box>

            {/* Settings List */}
            {settingsItems.map((item, index) => (
              <Pressable key={index} className="flex-row items-center bg-white p-4 rounded-xl mb-3">
                <Box className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: item.bgColor }}>
                  <Icon as={item.icon} size="lg" style={{ color: item.color }} />
                </Box>
                <VStack className="flex-1 ml-4">
                  <Text className="font-semibold text-base text-gray-800">{item.title}</Text>
                  <Text className="text-sm text-gray-500 mt-px">{item.subtitle}</Text>
                </VStack>
                <Icon as={ChevronRight} size="lg" color="#9CA3AF" />
              </Pressable>
            ))}

            {/* Sign Out Button */}
            <Pressable onPress={handleSignOut} className="flex-row items-center justify-center bg-red-50 p-4 rounded-xl mt-2">
              <Icon as={LogOut} size="lg" color="#EF4444" />
              <Text className="text-red-600 font-semibold ml-2">Sign Out</Text>
            </Pressable>
          </VStack>
        </ScrollView>

     
      </Box>
    </SafeAreaView>
  );
}