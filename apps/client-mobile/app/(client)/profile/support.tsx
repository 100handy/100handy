import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Alert, View, Text, Pressable, Linking, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useDeleteAccount } from '@shared/supabase';
import { useToast } from '@/components/ui/toast';

interface MenuItemProps {
  title: string;
  onPress: () => void;
  showDivider?: boolean;
}

const MenuItem = ({ title, onPress, showDivider = true }: MenuItemProps) => (
  <View>
    <Pressable onPress={onPress}>
      <View className="px-6 py-4">
        <Text className="text-[20px] font-bold text-[#30352D]">{title}</Text>
      </View>
    </Pressable>
    {showDivider && <View className="h-[1px] bg-gray-200" />}
  </View>
);

export default function SupportScreen() {
  const router = useRouter();
  const toast = useToast();
  const deleteAccount = useDeleteAccount();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMessageSupport = () => {
    router.push('/(client)/support/message-support');
  };

  const handleViewTickets = () => {
    router.push('/(client)/support/tickets');
  };

  const handleSupportCenter = async () => {
    const url = 'https://100handy.com/support'; // Replace with actual support center URL
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to open support center');
    }
  };

  const handleBecomeTasker = () => {
    Alert.alert(
      'Become a Tasker',
      'Interested in earning money by helping others? Join our community of skilled taskers!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Learn More',
          onPress: () => {
            // Navigate to tasker onboarding or open registration URL
            Linking.openURL('https://100handy.com/become-tasker');
          }
        }
      ]
    );
  };

  const handleCancellationPolicy = () => {
    Alert.alert(
      'Cancellation Policy',
      'Free cancellation up to 24 hours before your booking start time.\n\n' +
      'Cancellations made less than 24 hours before the booking will incur a 50% cancellation fee.\n\n' +
      'No-shows will be charged the full booking amount.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone. All your data, bookings, and reviews will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              const success = await deleteAccount.mutateAsync();

              if (success) {
                toast.success('Success', 'Your account has been deleted');
                router.replace('/(auth)/(client)');
              } else {
                throw new Error('Failed to delete account');
              }
            } catch (err) {
              console.error('Error deleting account:', err);
              toast.error('Error', 'Failed to delete account. Please try again or contact support.');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <ChevronLeft size={24} color="#30352D" />
            <Text className="text-[18px] text-[#30352D] ml-2">Profile</Text>
          </Pressable>
          <Text className="flex-1 text-center text-[18px] font-bold text-[#30352D] mr-16">
            Support
          </Text>
        </View>

        <ScrollView className="flex-1">
          <View className="flex-col pt-6">
            <MenuItem
              title="Message Support"
              onPress={handleMessageSupport}
            />

            <MenuItem
              title="View My Tickets"
              onPress={handleViewTickets}
            />

            <MenuItem
              title="Support Center"
              onPress={handleSupportCenter}
            />

            <MenuItem
              title="Become a Tasker"
              onPress={handleBecomeTasker}
            />

            <MenuItem
              title="Cancellation Policy"
              onPress={handleCancellationPolicy}
            />

            <MenuItem
              title="Delete Account"
              onPress={handleDeleteAccount}
              showDivider={false}
            />

            <View className="px-6 mt-8">
              <Text className="text-[13px] text-[#333A31]">
                Version 1.2.0 (100 Handy)
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
