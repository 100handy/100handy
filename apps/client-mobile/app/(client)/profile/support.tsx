import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Alert, View, Text, Pressable, Linking, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { useDeleteAccount, useAuthStore, signIn } from '@shared/supabase';
import { useToast } from '@/components/ui/toast';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';
import Constants from 'expo-constants';

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
  const user = useAuthStore((state) => state.user);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

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
    setShowDeleteConfirm(true);
  };

  const confirmDeleteWithPassword = async () => {
    if (!deletePassword || !user?.email) return;
    setIsDeleting(true);
    try {
      // Re-authenticate before destructive action
      await signIn(user.email, deletePassword);

      const success = await deleteAccount.mutateAsync();
      if (success) {
        setShowDeleteConfirm(false);
        setDeletePassword('');
        toast.success('Success', 'Your account has been deleted');
        router.replace('/(auth)/(client)');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      const message = err instanceof Error && err.message.includes('Invalid login credentials')
        ? 'Incorrect password. Please try again.'
        : 'Failed to delete account. Please try again or contact support.';
      toast.error('Error', message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <Header title="Support" onBackPress={() => router.back()} showBellIcon={false} />

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
                Version {Constants.expoConfig?.version ?? '1.0.0'} (100 Handy)
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Delete Account Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}>
        <ModalBackdrop />
        <ModalContent className="bg-white">
          <ModalBody>
            <View className="flex-col w-full px-4 py-6">
              <Text className="text-xl font-semibold text-[#30352D] mb-2">Delete Account</Text>
              <Text className="text-sm text-gray-600 mb-2">
                This action cannot be undone. All your data, bookings, and reviews will be permanently deleted.
              </Text>
              <Text className="text-sm font-semibold text-gray-700 mb-4">
                Enter your password to confirm.
              </Text>
              <TextInput
                value={deletePassword}
                onChangeText={setDeletePassword}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoFocus
                className="border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
                style={{ color: '#30352D' }}
              />
              <Pressable
                onPress={confirmDeleteWithPassword}
                disabled={isDeleting || !deletePassword}
                className="w-full py-4 rounded-full items-center"
                style={{ backgroundColor: isDeleting || !deletePassword ? '#D1D5DB' : '#DC2626' }}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-semibold text-base">Delete My Account</Text>
                )}
              </Pressable>
              <Pressable
                onPress={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}
                className="w-full py-3 items-center mt-2"
              >
                <Text className="text-gray-500 text-base">Cancel</Text>
              </Pressable>
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
