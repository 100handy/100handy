import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

// Import gluestack-ui components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Input, InputField } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

// Import icons
import { ChevronLeft, Upload, User, Phone, Home } from 'lucide-react-native';

// Import hooks
import { useProfile, useUpdateProfile, useUploadAvatar } from '@shared/query';

export default function EditProfileScreen() {
  const router = useRouter();
  const toast = useToast();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    postcode: '',
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        postcode: profile.postcode || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync(formData);
      setIsEditing(false);
      toast.success('Success', 'Profile updated successfully');
    } catch (error) {
      toast.error('Error', 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        postcode: profile.postcode || '',
      });
    }
    setIsEditing(false);
  };

  const handleAvatarUpload = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadAvatarMutation.mutateAsync(result.assets[0].uri);
        toast.success('Success', 'Avatar updated successfully');
      }
    } catch (error) {
      toast.error('Error', 'Failed to upload avatar');
    }
  };

  if (profileLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Box className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#C1856A" />
          <Text className="mt-4 text-gray-500">Loading profile...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  const isLoading = updateProfileMutation.isPending || uploadAvatarMutation.isPending;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1">
        {/* Header */}
        <HStack className="items-center justify-between px-6 py-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <ChevronLeft size={24} color="#333A31" />
            <Text className="text-lg font-semibold text-[#333A31] ml-2">Profile</Text>
          </Pressable>

          {!isEditing ? (
            <Pressable
              onPress={() => setIsEditing(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <Text className="text-[#333A31] font-medium">Edit</Text>
            </Pressable>
          ) : (
            <HStack className="gap-2">
              <Pressable
                onPress={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                disabled={isLoading}
              >
                <Text className="text-[#333A31] font-medium">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                className="px-4 py-2 bg-[#C1856A] rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-medium">Save</Text>
                )}
              </Pressable>
            </HStack>
          )}
        </HStack>

        <ScrollView className="flex-1">
          <VStack className="p-6 gap-6">
            {/* Avatar Section */}
            <VStack className="items-center gap-4">
              <TouchableOpacity
                onPress={handleAvatarUpload}
                disabled={!isEditing || isLoading}
                className="relative"
              >
                <Box className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                  {profile?.avatar_url ? (
                    <Image
                      source={{ uri: profile.avatar_url }}
                      alt="Profile"
                      className="w-full h-full"
                    />
                  ) : (
                    <Box className="w-full h-full items-center justify-center bg-[#C1856A]">
                      <Text className="text-white text-4xl font-bold">
                        {profile?.first_name?.[0] || profile?.email?.[0]?.toUpperCase() || 'U'}
                      </Text>
                    </Box>
                  )}
                  {isEditing && (
                    <Box className="absolute inset-0 bg-black/50 items-center justify-center">
                      <Upload size={32} color="white" />
                    </Box>
                  )}
                </Box>
              </TouchableOpacity>

              {isEditing && (
                <Text className="text-sm text-gray-500 text-center">
                  Tap to change profile picture
                </Text>
              )}
            </VStack>

            {/* Form Fields */}
            <VStack className="gap-4">
              {/* First Name */}
              <VStack className="gap-2">
                <HStack className="items-center gap-2">
                  <User size={16} color="#333A31" />
                  <Text className="text-sm font-medium text-[#333A31]">First Name</Text>
                </HStack>
                <Input
                  variant="outline"
                  size="md"
                  isDisabled={!isEditing}
                  className="border-gray-300"
                >
                  <InputField
                    value={formData.first_name}
                    onChangeText={(text) => setFormData({ ...formData, first_name: text })}
                    placeholder="Enter first name"
                  />
                </Input>
              </VStack>

              {/* Last Name */}
              <VStack className="gap-2">
                <HStack className="items-center gap-2">
                  <User size={16} color="#333A31" />
                  <Text className="text-sm font-medium text-[#333A31]">Last Name</Text>
                </HStack>
                <Input
                  variant="outline"
                  size="md"
                  isDisabled={!isEditing}
                  className="border-gray-300"
                >
                  <InputField
                    value={formData.last_name}
                    onChangeText={(text) => setFormData({ ...formData, last_name: text })}
                    placeholder="Enter last name"
                  />
                </Input>
              </VStack>

              {/* Phone */}
              <VStack className="gap-2">
                <HStack className="items-center gap-2">
                  <Phone size={16} color="#333A31" />
                  <Text className="text-sm font-medium text-[#333A31]">Phone</Text>
                </HStack>
                <Input
                  variant="outline"
                  size="md"
                  isDisabled={!isEditing}
                  className="border-gray-300"
                >
                  <InputField
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </Input>
              </VStack>

              {/* Postcode */}
              <VStack className="gap-2">
                <HStack className="items-center gap-2">
                  <Home size={16} color="#333A31" />
                  <Text className="text-sm font-medium text-[#333A31]">Postcode</Text>
                </HStack>
                <Input
                  variant="outline"
                  size="md"
                  isDisabled={!isEditing}
                  className="border-gray-300"
                >
                  <InputField
                    value={formData.postcode}
                    onChangeText={(text) => setFormData({ ...formData, postcode: text })}
                    placeholder="Enter postcode"
                  />
                </Input>
              </VStack>

              {/* Email (read-only) */}
              <VStack className="gap-2">
                <Text className="text-sm font-medium text-[#333A31]">Email</Text>
                <Input
                  variant="outline"
                  size="md"
                  isDisabled={true}
                  className="border-gray-300 bg-gray-100"
                >
                  <InputField
                    value={profile?.email || ''}
                    editable={false}
                  />
                </Input>
                <Text className="text-xs text-gray-500">Email cannot be changed</Text>
              </VStack>
            </VStack>
          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
