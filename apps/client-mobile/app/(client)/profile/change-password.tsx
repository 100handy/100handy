import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import { useToast } from '@/components/ui/toast';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const toast = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const handleSavePassword = () => {
    // Validation
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

    // TODO: Implement actual password change API call
    console.log('Change password');
    toast.success('Success', 'Password changed successfully');

    // Clear fields
    setCurrentPassword('');
    setNewPassword('');
    setRetypePassword('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1">
        {/* Header */}
        <HStack className="items-center p-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <Icon as={ChevronLeft} size="xl" className="mr-1" />
            <Text className="text-base">Profile</Text>
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold mr-12">Password</Text>
        </HStack>

        {/* Password Fields */}
        <VStack className="p-6 flex-1 gap-4">
          {/* Current Password */}
          <VStack className="gap-2">
            <Text className="text-sm font-medium text-[#333333]">Current Password</Text>
            <Input variant="outline" size="md">
              <InputField
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
              />
              <InputSlot className="pr-3" onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <InputIcon as={showCurrentPassword ? Eye : EyeOff} className="text-gray-400" />
              </InputSlot>
            </Input>
          </VStack>

          {/* New Password */}
          <VStack className="gap-2">
            <Text className="text-sm font-medium text-[#333333]">New Password</Text>
            <Input variant="outline" size="md">
              <InputField
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
              />
              <InputSlot className="pr-3" onPress={() => setShowNewPassword(!showNewPassword)}>
                <InputIcon as={showNewPassword ? Eye : EyeOff} className="text-gray-400" />
              </InputSlot>
            </Input>
            <Text className="text-xs text-gray-500">Must be at least 8 characters</Text>
          </VStack>

          {/* Retype Password */}
          <VStack className="gap-2">
            <Text className="text-sm font-medium text-[#333333]">Retype Password</Text>
            <Input variant="outline" size="md">
              <InputField
                type={showRetypePassword ? 'text' : 'password'}
                value={retypePassword}
                onChangeText={setRetypePassword}
                placeholder="Retype new password"
              />
              <InputSlot className="pr-3" onPress={() => setShowRetypePassword(!showRetypePassword)}>
                <InputIcon as={showRetypePassword ? Eye : EyeOff} className="text-gray-400" />
              </InputSlot>
            </Input>
          </VStack>
        </VStack>

        {/* Save Button */}
        <Box className="px-6 pb-6">
          <Pressable
            className="bg-[#C1856A] rounded-full py-4 items-center"
            onPress={handleSavePassword}
          >
            <Text className="text-white text-lg font-bold">Save</Text>
          </Pressable>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
