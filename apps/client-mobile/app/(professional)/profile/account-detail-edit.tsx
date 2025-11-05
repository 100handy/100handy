import React, { useState, useEffect } from 'react';
import { ScrollView, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Input } from '@/components/ui/input';
import { InputField } from '@/components/ui/input';
import { useRouter } from 'expo-router';
import { ChevronLeft, Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useProfileStore } from '@shared/supabase';
import AddProfilePhotoModal from '@/components/modals/AddProfilePhotoModal';

interface FormData {
  first_name: string;
  last_name: string;
  phone: string;
  postcode: string;
}

export default function AccountDetailEditScreen() {
  const router = useRouter();
  const { profile, updateProfile, uploadAvatar, removeAvatar, fetchProfile } = useProfileStore();

  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    phone: '',
    postcode: '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        postcode: profile.postcode || '',
      });
      setSelectedImage(profile.avatar_url || null);
    }
  }, [profile]);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload a photo.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera permissions to take a photo.');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setSelectedImage(null),
        },
      ]
    );
  };

  const showPhotoOptions = () => {
    setShowPhotoModal(true);
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      Alert.alert('Required Fields', 'Please enter your first and last name.');
      return;
    }

    setIsSaving(true);

    try {
      // Handle photo upload/removal if changed
      const currentAvatarUrl = profile?.avatar_url;

      if (selectedImage !== currentAvatarUrl) {
        if (selectedImage && selectedImage.startsWith('file://')) {
          // New image selected - upload it
          const uploaded = await uploadAvatar(selectedImage);
          if (!uploaded) {
            Alert.alert('Error', 'Failed to upload profile photo. Please try again.');
            setIsSaving(false);
            return;
          }
        } else if (!selectedImage && currentAvatarUrl) {
          // Photo removed - delete from storage
          await removeAvatar();
        }
      }

      // Update profile data
      const success = await updateProfile(formData);

      if (success) {
        Alert.alert('Success', 'Your profile has been updated.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'An error occurred while saving your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = formData.first_name
    ? `${formData.first_name} ${formData.last_name?.[0] || ''}.`
    : 'Not set';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <HStack className="py-4 px-6 items-center justify-between border-b border-gray-100">
          <Pressable onPress={() => router.back()} className="w-10">
            <ChevronLeft color="#30352D" size={24} strokeWidth={1.5} />
          </Pressable>
          <Text className="font-worksans-bold text-xl text-theme-font">
            Edit Account
          </Text>
          <Pressable
            className="w-10"
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text className={`font-worksans-semibold text-base ${isSaving ? 'text-gray-400' : 'text-[#B8926A]'}`}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </Pressable>
        </HStack>

        <ScrollView
          className="flex-1 bg-white"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Photo Section */}
          <VStack className="px-6 py-8 items-center gap-3">
            <Box className="w-[120px] h-[120px] rounded-full overflow-hidden bg-gray-300 relative">
              {selectedImage ? (
                <>
                  <Image
                    source={{ uri: selectedImage }}
                    className="w-full h-full"
                    style={{ width: 120, height: 120 }}
                  />
                  <Pressable
                    onPress={handleRemovePhoto}
                    className="absolute top-0 right-0 w-8 h-8 bg-red-500 rounded-full items-center justify-center"
                  >
                    <X size={16} color="#FFFFFF" strokeWidth={3} />
                  </Pressable>
                </>
              ) : (
                <Box className="w-full h-full items-center justify-center bg-[#D17852]/20">
                  <Text className="font-worksans-bold text-4xl text-[#D17852]">
                    {formData.first_name?.[0] || '?'}
                  </Text>
                </Box>
              )}
            </Box>

            <Pressable
              onPress={showPhotoOptions}
              className="flex-row items-center gap-2"
            >
              <Camera size={20} color="#B8926A" />
              <Text className="font-worksans-semibold text-base text-[#B8926A]">
                {selectedImage ? 'Change Photo' : 'Add Photo'}
              </Text>
            </Pressable>
          </VStack>

          {/* Form Fields */}
          <VStack className="px-6 gap-6 pb-8">
            {/* First Name */}
            <VStack className="gap-2">
              <Text className="font-worksans-medium text-sm text-gray-600">
                First Name *
              </Text>
              <Input className="border border-gray-300 rounded-lg">
                <InputField
                  value={formData.first_name}
                  onChangeText={(text) => setFormData({ ...formData, first_name: text })}
                  placeholder="Enter first name"
                  className="text-base"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                />
              </Input>
            </VStack>

            {/* Last Name */}
            <VStack className="gap-2">
              <Text className="font-worksans-medium text-sm text-gray-600">
                Last Name *
              </Text>
              <Input className="border border-gray-300 rounded-lg">
                <InputField
                  value={formData.last_name}
                  onChangeText={(text) => setFormData({ ...formData, last_name: text })}
                  placeholder="Enter last name"
                  className="text-base"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                />
              </Input>
            </VStack>

            {/* Email (Read-only) */}
            <VStack className="gap-2">
              <Text className="font-worksans-medium text-sm text-gray-600">
                Email
              </Text>
              <Input className="border border-gray-300 rounded-lg bg-gray-100">
                <InputField
                  value={profile?.email || ''}
                  editable={false}
                  className="text-base text-gray-500"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                />
              </Input>
              <Text className="font-worksans text-xs text-gray-500">
                Contact support to change your email
              </Text>
            </VStack>

            {/* Phone */}
            <VStack className="gap-2">
              <Text className="font-worksans-medium text-sm text-gray-600">
                Mobile Phone
              </Text>
              <Input className="border border-gray-300 rounded-lg">
                <InputField
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  className="text-base"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                />
              </Input>
            </VStack>

            {/* Postcode */}
            <VStack className="gap-2">
              <Text className="font-worksans-medium text-sm text-gray-600">
                Postcode
              </Text>
              <Input className="border border-gray-300 rounded-lg">
                <InputField
                  value={formData.postcode}
                  onChangeText={(text) => setFormData({ ...formData, postcode: text.toUpperCase() })}
                  placeholder="Enter postcode"
                  autoCapitalize="characters"
                  className="text-base"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                />
              </Input>
            </VStack>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>

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
