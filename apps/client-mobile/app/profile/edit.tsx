import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Image } from 'expo-image';
import { Loader } from '@/components/ui/loader';
import { Camera, User } from 'lucide-react-native';
import { useProfileStore } from '@shared/supabase';
import Header from '@/components/Header';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfile() {
  const router = useRouter();
  const { profile, isLoading, updateProfile, uploadAvatar, fetchProfile } = useProfileStore();
  
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    postcode: profile?.postcode || '',
    avatar_url: profile?.avatar_url || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        postcode: profile.postcode || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      Alert.alert('Error', 'First name and last name are required');
      return;
    }

    setIsUpdating(true);
    try {
      const success = await updateProfile({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim(),
        postcode: formData.postcode.trim()
      });
      if (success) {
        Alert.alert('Success', 'Profile updated successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImagePicker = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
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
        setIsUploadingImage(true);
        const imageUri = result.assets[0].uri;
        const success = await uploadAvatar(imageUri);
        
        if (success) {
          Alert.alert('Success', 'Profile picture updated successfully');
        } else {
          Alert.alert('Error', 'Failed to upload profile picture');
        }
        setIsUploadingImage(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'An error occurred while selecting image');
      setIsUploadingImage(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Header title="Edit Profile" onBackPress={() => router.back()} showBellIcon={false} />
        <View className="flex-1 justify-center items-center">
          <Loader size="large" />
          <Text className="mt-4 text-gray-600">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Header title="Edit Profile" onBackPress={() => router.back()} showBellIcon={false} />
      
      <ScrollView className="flex-1">
        <View className="flex-col p-6 space-y-6">
          {/* Profile Picture Section */}
          <View className="flex-col items-center space-y-4">
            <View className="relative">
              <Image
                source={formData.avatar_url ? { uri: formData.avatar_url } : require('@/assets/images/icon.png')}
                alt="Profile Picture"
                className="w-24 h-24 rounded-full"
              />
              {isUploadingImage && (
                <View className="absolute inset-0 bg-black/50 rounded-full justify-center items-center">
                  <Loader size="small" />
                </View>
              )}
            </View>
            
            <Pressable 
              onPress={handleImagePicker}
              disabled={isUploadingImage}
              className="flex-row items-center bg-gray-100 px-4 py-2 rounded-full"
            >
              <Camera size={16} color="#666" />
              <Text className="ml-2 text-gray-600 font-medium">
                {isUploadingImage ? 'Uploading...' : 'Change Photo'}
              </Text>
            </Pressable>
          </View>

          {/* Form Fields */}
          <View className="flex-col space-y-4">
            <View className="flex-col space-y-2">
              <Text className="text-gray-700 font-medium">First Name</Text>
              <Input className="border border-gray-200 rounded-lg">
                <InputField
                  value={formData.first_name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, first_name: text }))}
                  placeholder="Enter your first name"
                  className="px-4 py-3"
                />
              </Input>
            </View>

            <View className="flex-col space-y-2">
              <Text className="text-gray-700 font-medium">Last Name</Text>
              <Input className="border border-gray-200 rounded-lg">
                <InputField
                  value={formData.last_name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, last_name: text }))}
                  placeholder="Enter your last name"
                  className="px-4 py-3"
                />
              </Input>
            </View>

            <View className="flex-col space-y-2">
              <Text className="text-gray-700 font-medium">Phone</Text>
              <Input className="border border-gray-200 rounded-lg">
                <InputField
                  value={formData.phone}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                  placeholder="Enter your phone number"
                  className="px-4 py-3"
                  keyboardType="phone-pad"
                />
              </Input>
            </View>

            <View className="flex-col space-y-2">
              <Text className="text-gray-700 font-medium">Postcode</Text>
              <Input className="border border-gray-200 rounded-lg">
                <InputField
                  value={formData.postcode}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, postcode: text }))}
                  placeholder="Enter your postcode"
                  className="px-4 py-3"
                />
              </Input>
            </View>

            <View className="flex-col space-y-2">
              <Text className="text-gray-700 font-medium">Email</Text>
              <Input className="border border-gray-200 rounded-lg bg-gray-50">
                <InputField
                  value={profile?.email || ''}
                  editable={false}
                  placeholder="Email address"
                  className="px-4 py-3 text-gray-500"
                />
              </Input>
              <Text className="text-xs text-gray-500">Email cannot be changed</Text>
            </View>
          </View>

          {/* Save Button */}
          <Button 
            onPress={handleSave}
            disabled={isUpdating || !formData.first_name.trim() || !formData.last_name.trim()}
            className="bg-blue-500 rounded-lg mt-8"
          >
            {isUpdating ? (
              <View className="flex-row items-center space-x-2">
                <Loader size="small" />
                <ButtonText className="text-white">Updating...</ButtonText>
              </View>
            ) : (
              <ButtonText className="text-white font-semibold">Save Changes</ButtonText>
            )}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}