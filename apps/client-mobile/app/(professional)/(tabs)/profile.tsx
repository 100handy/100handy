import React, { useState, useEffect } from 'react';
import { ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import {
  User,
  FileText,
  Calendar,
  MessageSquare,
  Megaphone,
  CreditCard,
  HelpCircle,
  Shield,
  Info,
  Lock,
  LogOut,
  ChevronRight,
  Camera,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@shared/supabase';
import { useProfileStore } from '@shared/store';
import * as ImagePicker from 'expo-image-picker';
import AddProfilePhotoModal from '@/components/modals/AddProfilePhotoModal';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  isLogout?: boolean;
  onPress?: () => void;
}

export default function ProfessionalProfileScreen() {
  const router = useRouter();
  const { signOut, user } = useAuthStore();
  const { profile, fetchProfile, uploadAvatar } = useProfileStore();
  const [showPhotoModal, setShowPhotoModal] = useState(false);

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uploaded = await uploadAvatar(result.assets[0].uri);
      if (uploaded) {
        await fetchProfile();
        Alert.alert('Success', 'Profile photo updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to upload photo. Please try again.');
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uploaded = await uploadAvatar(result.assets[0].uri);
      if (uploaded) {
        await fetchProfile();
        Alert.alert('Success', 'Profile photo updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to upload photo. Please try again.');
      }
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: <User color="#B8926A" size={24} strokeWidth={1.5} />,
      label: 'Account detail',
      onPress: () => router.push('/profile/account-detail'),
    },
    {
      icon: <FileText color="#B8926A" size={24} strokeWidth={1.5} />,
      label: 'Tasker profile',
      onPress: () => router.push('/profile/tasker-profile'),
    },
    {
      icon: <Calendar color="#B8926A" size={24} strokeWidth={1.5} />,
      label: 'Sync calendar',
      onPress: () => router.push('/profile/calendar-settings'),
    },
    {
      icon: <MessageSquare color="#B8926A" size={24} strokeWidth={1.5} />,
      label: 'Chat templates',
      onPress: () => router.push('/profile/chat-templates'),
    },
    {
      icon: <Megaphone color="#B8926A" size={24} strokeWidth={1.5} />,
      label: 'Promote yourself',
      onPress: () => console.log('Promote yourself'),
    },
    {
      icon: <CreditCard color="#B8926A" size={24} strokeWidth={1.5} />,
      label: 'Payments',
      onPress: () => router.push('/profile/payments'),
    },
    {
      icon: <HelpCircle color="#B8926A" size={24} strokeWidth={1.5} />,
      label: 'Support',
      onPress: () => router.push('/profile/support'),
    },
    {
      icon: <Shield color="#B8926A" size={24} strokeWidth={1.5} />,
      label: 'Account security',
      onPress: () => console.log('Account security'),
    },
    {
      icon: <Info color="#B8926A" size={24} strokeWidth={1.5} />,
      label: 'About',
      onPress: () => console.log('About'),
    },
    {
      icon: <Lock color="#B8926A" size={24} strokeWidth={1.5} />,
      label: 'Password',
      onPress: () => console.log('Password'),
    },
    {
      icon: <LogOut color="#D17852" size={24} strokeWidth={1.5} />,
      label: 'Log out',
      isLogout: true,
      onPress: handleSignOut,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <Box className="py-6 px-5 items-center border-b border-gray-100">
        <Text className="font-worksans-bold text-2xl text-theme-font">
          Profile
        </Text>
      </Box>

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Profile Photo Section */}
        <VStack className="px-6 py-8 items-center gap-4 border-b border-gray-100">
          <Box className="w-[100px] h-[100px] rounded-full overflow-hidden bg-gray-300 relative">
            {profile?.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                className="w-full h-full"
                style={{ width: 100, height: 100 }}
              />
            ) : (
              <Box className="w-full h-full items-center justify-center bg-[#D17852]/20">
                <Text className="font-worksans-bold text-3xl text-[#D17852]">
                  {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
                </Text>
              </Box>
            )}
          </Box>

          <VStack className="items-center gap-1">
            <Text className="font-worksans-bold text-xl text-theme-font">
              {profile?.first_name && profile?.last_name
                ? `${profile.first_name} ${profile.last_name}`
                : profile?.first_name || 'Professional'}
            </Text>
            {profile?.email && (
              <Text className="font-worksans text-sm text-gray-600">
                {profile.email}
              </Text>
            )}
          </VStack>

          <Pressable
            onPress={() => setShowPhotoModal(true)}
            className="flex-row items-center gap-2 px-4 py-2"
          >
            <Camera size={18} color="#B8926A" />
            <Text className="font-worksans-semibold text-sm text-[#B8926A]">
              {profile?.avatar_url ? 'Change Photo' : 'Add Photo'}
            </Text>
          </Pressable>
        </VStack>

        {/* Menu Items */}
        <VStack className="">
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              className="px-5 py-5 border-b border-gray-100"
              onPress={item.onPress}
            >
              <HStack className="items-center justify-between">
                <HStack className="items-center flex-1">
                  <Box className="w-6 h-6 items-center justify-center mr-4">
                    {item.icon}
                  </Box>
                  <Text 
                    className={`font-worksans text-lg ${
                      item.isLogout ? 'text-clay-orange' : 'text-theme-font'
                    }`}
                  >
                    {item.label}
                  </Text>
                </HStack>
                {!item.isLogout && (
                  <ChevronRight color="#BDBDBD" size={22} strokeWidth={2} />
                )}
              </HStack>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>

      {/* Add Profile Photo Modal */}
      <AddProfilePhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onTakePhoto={takePhoto}
        onChooseFromLibrary={pickImage}
      />
    </SafeAreaView>
  );
}
