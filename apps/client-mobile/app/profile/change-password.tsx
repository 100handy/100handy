import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useToast } from '@/components/ui/toast';
import { signIn, updatePassword } from '@shared/supabase/auth';
import { useAuthStore } from '@shared/supabase';
import { ExpandablePasswordRow } from '@/components/profile/ExpandablePasswordRow';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isCurrentOpen, setIsCurrentOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isRetypeOpen, setIsRetypeOpen] = useState(false);

  const [isCurrentVisible, setIsCurrentVisible] = useState(false);
  const [isNewVisible, setIsNewVisible] = useState(false);
  const [isRetypeVisible, setIsRetypeVisible] = useState(false);

  const handleSavePassword = async (): Promise<void> => {
    if (!currentPassword || !newPassword || !retypePassword) {
      toast.error('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== retypePassword) {
      toast.error('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Error', 'Password must be at least 8 characters');
      return;
    }

    if (!user?.email) {
      toast.error('Error', 'User email not found');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(user.email, currentPassword);
      await updatePassword(newPassword);

      toast.success('Success', 'Password changed successfully');

      setCurrentPassword('');
      setNewPassword('');
      setRetypePassword('');
      setIsCurrentOpen(false);
      setIsNewOpen(false);
      setIsRetypeOpen(false);

      setTimeout(() => router.back(), 1500);
    } catch (error: unknown) {
      console.error('Password change error:', error);
      const message = error instanceof Error ? error.message : '';

      if (message.includes('Invalid login credentials')) {
        toast.error('Error', 'Current password is incorrect');
      } else if (message.includes('Password should be')) {
        toast.error('Error', message);
      } else {
        toast.error('Error', 'Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center p-4 border-b border-[#E5E7EB]">
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <ChevronLeft size={24} color="#000000" />
            <Text className="text-base ml-1 text-[#333A31]">Profile</Text>
          </Pressable>
          <Text className="flex-1 text-center text-lg font-worksans-semibold mr-12 text-[#333A31]">
            Password
          </Text>
        </View>

        {/* Expandable rows */}
        <View className="flex-1">
          <ExpandablePasswordRow
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder=""
            isOpen={isCurrentOpen}
            onToggleOpen={() => setIsCurrentOpen((v) => !v)}
            onClearAndCollapse={() => {
              setCurrentPassword('');
              setIsCurrentOpen(false);
              setIsCurrentVisible(false);
            }}
            isPasswordVisible={isCurrentVisible}
            onTogglePasswordVisible={() => setIsCurrentVisible((v) => !v)}
          />

          <ExpandablePasswordRow
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder=""
            helperText="Must be at least 8 characters"
            isOpen={isNewOpen}
            onToggleOpen={() => setIsNewOpen((v) => !v)}
            onClearAndCollapse={() => {
              setNewPassword('');
              setIsNewOpen(false);
              setIsNewVisible(false);
            }}
            isPasswordVisible={isNewVisible}
            onTogglePasswordVisible={() => setIsNewVisible((v) => !v)}
          />

          <ExpandablePasswordRow
            label="Retype Password"
            value={retypePassword}
            onChangeText={setRetypePassword}
            placeholder=""
            isOpen={isRetypeOpen}
            onToggleOpen={() => setIsRetypeOpen((v) => !v)}
            onClearAndCollapse={() => {
              setRetypePassword('');
              setIsRetypeOpen(false);
              setIsRetypeVisible(false);
            }}
            isPasswordVisible={isRetypeVisible}
            onTogglePasswordVisible={() => setIsRetypeVisible((v) => !v)}
          />
        </View>

        {/* Save Button */}
        <View className="px-6 pb-6">
          <Pressable
            className={`rounded-full py-4 items-center ${isLoading ? 'opacity-60' : ''} bg-[#C1856A]`}
            onPress={handleSavePassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-lg font-worksans-bold">Save</Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}


