import React from 'react';
import { ScrollView } from 'react-native';
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
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@shared/supabase';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  isLogout?: boolean;
  onPress?: () => void;
}

export default function ProfessionalProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Sign out error:', error);
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
      onPress: () => console.log('Sync calendar'),
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
    </SafeAreaView>
  );
}
