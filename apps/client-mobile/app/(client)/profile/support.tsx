import React, { useState } from 'react';
import { useAuthStore } from '@shared/store';
import { SafeAreaView } from 'react-native-safe-area-context'; import { ScrollView, Alert, View, Text, Pressable, Linking, ActivityIndicator, TextInput } from 'react-native'; import { useRouter } from 'expo-router'; import Header from '@/components/Header'; import { useDeleteAccount } from '@shared/query'; import { signIn } from '@shared/supabase';
import { useToast } from '@/components/ui/toast';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';
import Constants from 'expo-constants';
import { goBackOrReplace } from '@/lib/navigation';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

const DEFAULT_CONTENT = {
  'header.title': 'Support',
  'menu.message_support': 'Message Support',
  'menu.view_tickets': 'View My Tickets',
  'menu.support_center': 'Support Center',
  'menu.support_center_url': 'https://100handy.com/support',
  'menu.cancellation_policy': 'Cancellation Policy',
  'policy.title': 'Cancellation Policy',
  'policy.body': 'Free cancellation up to 24 hours before your booking start time.\n\nCancellations made less than 24 hours before the booking will incur a 50% cancellation fee.\n\nNo-shows will be charged the full booking amount.',
  'menu.delete_account': 'Delete Account',
  'delete.title': 'Delete Account',
  'delete.warning': 'This action cannot be undone. All your data, bookings, and reviews will be permanently deleted.',
  'delete.prompt': 'Enter your password to confirm.',
  'delete.password_placeholder': 'Password',
  'delete.confirm_cta': 'Delete My Account',
  'delete.cancel_cta': 'Cancel',
  'delete.success_title': 'Success',
  'delete.success_body': 'Your account has been deleted',
  'delete.error_title': 'Error',
  'delete.wrong_password': 'Incorrect password. Please try again.',
  'delete.generic_error': 'Failed to delete account. Please try again or contact support.',
  'support_center.error_title': 'Error',
  'support_center.error_body': 'Unable to open support center',
} as const;

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
  const content = useAppContent('client_support', DEFAULT_CONTENT);

  const handleMessageSupport = () => {
    router.push('/(client)/support/message-support');
  };

  const handleViewTickets = () => {
    router.push('/(client)/support/tickets');
  };

  const handleSupportCenter = async () => {
    const url = getAppContentValue(content, 'menu.support_center_url', DEFAULT_CONTENT['menu.support_center_url']);
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        getAppContentValue(content, 'support_center.error_title', DEFAULT_CONTENT['support_center.error_title']),
        getAppContentValue(content, 'support_center.error_body', DEFAULT_CONTENT['support_center.error_body'])
      );
    }
  };

  const handleCancellationPolicy = () => {
    Alert.alert(
      getAppContentValue(content, 'policy.title', DEFAULT_CONTENT['policy.title']),
      getAppContentValue(content, 'policy.body', DEFAULT_CONTENT['policy.body']),
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
        toast.success(
          getAppContentValue(content, 'delete.success_title', DEFAULT_CONTENT['delete.success_title']),
          getAppContentValue(content, 'delete.success_body', DEFAULT_CONTENT['delete.success_body'])
        );
        router.replace('/(auth)/(client)');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      const message = err instanceof Error && err.message.includes('Invalid login credentials')
        ? getAppContentValue(content, 'delete.wrong_password', DEFAULT_CONTENT['delete.wrong_password'])
        : getAppContentValue(content, 'delete.generic_error', DEFAULT_CONTENT['delete.generic_error']);
      toast.error(getAppContentValue(content, 'delete.error_title', DEFAULT_CONTENT['delete.error_title']), message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <Header
          title={getAppContentValue(content, 'header.title', DEFAULT_CONTENT['header.title'])}
          onBackPress={() => goBackOrReplace(router, '/(client)/(tabs)/profile')}
          showBellIcon={false}
        />

        <ScrollView className="flex-1">
          <View className="flex-col pt-6">
            <MenuItem
              title={getAppContentValue(content, 'menu.message_support', DEFAULT_CONTENT['menu.message_support'])}
              onPress={handleMessageSupport}
            />

            <MenuItem
              title={getAppContentValue(content, 'menu.view_tickets', DEFAULT_CONTENT['menu.view_tickets'])}
              onPress={handleViewTickets}
            />

            <MenuItem
              title={getAppContentValue(content, 'menu.support_center', DEFAULT_CONTENT['menu.support_center'])}
              onPress={handleSupportCenter}
            />

            <MenuItem
              title={getAppContentValue(content, 'menu.cancellation_policy', DEFAULT_CONTENT['menu.cancellation_policy'])}
              onPress={handleCancellationPolicy}
            />

            <MenuItem
              title={getAppContentValue(content, 'menu.delete_account', DEFAULT_CONTENT['menu.delete_account'])}
              onPress={handleDeleteAccount}
              showDivider={false}
            />

            <View className="px-6 mt-8">
              <Text className="text-[13px] text-[#333A31]">
                Version {Constants.expoConfig?.version ?? '1.0.0'} (100Handy)
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
              <Text className="text-xl font-semibold text-[#30352D] mb-2">
                {getAppContentValue(content, 'delete.title', DEFAULT_CONTENT['delete.title'])}
              </Text>
              <Text className="text-sm text-gray-600 mb-2">
                {getAppContentValue(content, 'delete.warning', DEFAULT_CONTENT['delete.warning'])}
              </Text>
              <Text className="text-sm font-semibold text-gray-700 mb-4">
                {getAppContentValue(content, 'delete.prompt', DEFAULT_CONTENT['delete.prompt'])}
              </Text>
              <TextInput
                value={deletePassword}
                onChangeText={setDeletePassword}
                placeholder={getAppContentValue(content, 'delete.password_placeholder', DEFAULT_CONTENT['delete.password_placeholder'])}
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
                  <Text className="text-white font-semibold text-base">
                    {getAppContentValue(content, 'delete.confirm_cta', DEFAULT_CONTENT['delete.confirm_cta'])}
                  </Text>
                )}
              </Pressable>
              <Pressable
                onPress={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}
                className="w-full py-3 items-center mt-2"
              >
                <Text className="text-gray-500 text-base">
                  {getAppContentValue(content, 'delete.cancel_cta', DEFAULT_CONTENT['delete.cancel_cta'])}
                </Text>
              </Pressable>
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
