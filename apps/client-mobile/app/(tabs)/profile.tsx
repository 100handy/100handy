import React, { useEffect } from 'react';
import { Image } from 'expo-image';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import gluestack-ui components
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
    bgColorClass: 'bg-status-info-bg',
    colorClass: 'text-status-info',
    title: 'Account Settings',
    subtitle: 'Manage your account preferences',
  },
  {
    icon: Shield,
    bgColorClass: 'bg-accent-green-bg',
    colorClass: 'text-accent-green',
    title: 'Account Security',
    subtitle: 'Password and security settings',
  },
  {
    icon: CreditCard,
    bgColorClass: 'bg-accent-purple-bg',
    colorClass: 'text-accent-purple',
    title: 'Payments',
    subtitle: 'Payment methods and billing',
  },
  {
    icon: Bell,
    bgColorClass: 'bg-accent-orange-bg',
    colorClass: 'text-accent-orange',
    title: 'Notifications',
    subtitle: 'Manage notification preferences',
  },
  {
    icon: Lock,
    bgColorClass: 'bg-accent-red-bg',
    colorClass: 'text-accent-red',
    title: 'Privacy Settings',
    subtitle: 'Control your privacy options',
  },
  {
    icon: Headphones,
    bgColorClass: 'bg-accent-yellow-bg',
    colorClass: 'text-accent-yellow',
    title: 'Support',
    subtitle: 'Get help and contact us',
  },
  {
    icon: Info,
    bgColorClass: 'bg-accent-gray-bg',
    colorClass: 'text-text-tertiary',
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
      <SafeAreaView className="flex-1 bg-bg-primary">
        <Header title="Profile" onBackPress={() => router.back()} showBellIcon={false} />
        <View className="flex-1 justify-center items-center">
          <Loader size="large" />
          <Text className="mt-4 text-text-secondary font-worksans">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-bg-primary">
        <Header title="Profile" onBackPress={() => router.back()} showBellIcon={false} />
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-status-danger text-center mb-4 font-worksans">{error}</Text>
          <Pressable onPress={fetchProfile} className="bg-status-info px-4 py-2 rounded-profile-small">
            <Text className="text-bg-primary font-worksans-medium">Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <View className="flex-1 bg-bg-secondary">
        {/* Header */}
        <Header title="Profile" onBackPress={() => router.back()} showBellIcon={false} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-col p-profile-md">
            {/* Profile Info Card */}
            <View className="bg-bg-primary rounded-2xl p-profile-md mb-profile-md">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: profile?.avatar_url || 'https://i.pravatar.cc/150?u=default' }}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-profile-full"
                />
                <View className="flex-col flex-1 ml-4">
                  <Text className="font-worksans-semibold text-lg text-text-primary">{profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : profile?.first_name || profile?.last_name || user?.email || 'User'}</Text>
                  <Text className="font-worksans text-sm text-text-secondary mt-1">{profile?.email || user?.email || 'No email'}</Text>
                  <Text className="font-worksans text-xs text-text-tertiary mt-1">Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}</Text>
                </View>
                <Pressable
                  onPress={() => router.push('/profile/edit')}
                  className="bg-bg-clay-orange-10 py-2 px-4 rounded-profile-full"
                >
                  <Text className="text-clay-orange font-worksans-medium text-xs">Edit</Text>
                </Pressable>
              </View>

              {/* Stats Section */}
              <View className="flex-row justify-around mt-5 pt-5 border-t border-border-light">
                <View className="flex-col items-center">
                  <Text className="font-worksans-semibold text-lg text-text-primary">12</Text>
                  <Text className="font-worksans text-xs text-text-tertiary mt-1">Completed</Text>
                </View>
                <View className="flex-col items-center">
                  <Text className="font-worksans-semibold text-lg text-text-primary">4.8</Text>
                  <Text className="font-worksans text-xs text-text-tertiary mt-1">Rating</Text>
                </View>
                <View className="flex-col items-center">
                  <Text className="font-worksans-semibold text-lg text-text-primary">£240</Text>
                  <Text className="font-worksans text-xs text-text-tertiary mt-1">Saved</Text>
                </View>
              </View>
            </View>

            {/* Settings List */}
            {settingsItems.map((item, index) => {
              const ItemIcon = item.icon;
              return (
                <Pressable
                  key={index}
                  className="flex-row items-center bg-bg-primary p-profile-lg rounded-profile-small mb-3"
                  onPress={() => {
                    if (item.title === 'Notifications') {
                      router.push('/(client)/profile/notifications');
                    } else if (item.title === 'Account Security') {
                      router.push('/profile/account-security');
                    } else if (item.title === 'Payments') {
                      router.push('/profile/payments');
                    } else if (item.title === 'Support') {
                      router.push('/(client)/profile/support');
                    }
                    // Add other navigation handlers here as needed
                  }}
                >
                  <View className={`w-10 h-10 rounded-profile-small items-center justify-center ${item.bgColorClass}`}>
                    <ItemIcon size={24} color={item.colorClass.includes('info') ? '#3B82F6' : item.colorClass.includes('green') ? '#10B981' : item.colorClass.includes('purple') ? '#8B5CF6' : item.colorClass.includes('orange') ? '#F59E0B' : item.colorClass.includes('red') ? '#EF4444' : item.colorClass.includes('yellow') ? '#EAB308' : '#6B7280'} />
                  </View>
                  <View className="flex-col flex-1 ml-4">
                    <Text className="font-worksans-medium text-sm text-text-primary">{item.title}</Text>
                    <Text className="font-worksans text-xs text-text-tertiary mt-px">{item.subtitle}</Text>
                  </View>
                  <ChevronRight size={24} color="#9CA3AF" />
                </Pressable>
              );
            })}

            {/* Sign Out Button */}
            <Pressable onPress={handleSignOut} className="flex-row items-center justify-center bg-profile-danger-bg p-profile-md rounded-profile-small mt-2">
              <LogOut size={24} color="#EF4444" />
              <Text className="text-profile-danger font-worksans-medium ml-2">Sign Out</Text>
            </Pressable>
          </View>
        </ScrollView>


      </View>
    </SafeAreaView>
  );
}