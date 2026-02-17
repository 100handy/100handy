import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Linking,
  ActivityIndicator,
  View,
  Text,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, X, Camera } from 'lucide-react-native';
import {
  getUserSkills,
  UserSkill,
  uploadBusinessPhoto,
  deleteBusinessPhoto,
  getBusinessPhotosByUser,
  BusinessPhoto,
} from '@shared/supabase/profile';
import * as ImagePicker from 'expo-image-picker';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
} from '@/components/ui/modal';

export default function BusinessPhotosScreen() {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState<BusinessPhoto[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load skills and photos in parallel
      const [userSkills, userPhotos] = await Promise.all([
        getUserSkills(),
        getBusinessPhotosByUser(),
      ]);
      setSkills(userSkills);
      setPhotos(userPhotos);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group photos by skill ID for display
  const getPhotosForSkill = (skillId: string): BusinessPhoto[] => {
    return photos.filter((photo) => photo.user_skill_id === skillId);
  };

  const pickImage = async () => {
    // Close modal first and wait for it to fully close
    setShowPhotoModal(false);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0] && selectedSkillId) {
      await handleUploadPhoto(selectedSkillId, result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Close modal first and wait for it to fully close
    setShowPhotoModal(false);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to take photos.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0] && selectedSkillId) {
      await handleUploadPhoto(selectedSkillId, result.assets[0].uri);
    }
  };

  const handleUploadPhoto = async (userSkillId: string, imageUri: string) => {
    setIsUploading(true);
    try {
      const photoRecord = await uploadBusinessPhoto(userSkillId, imageUri);

      if (photoRecord) {
        // Add the new photo to the state
        setPhotos((prev) => [...prev, photoRecord]);
        Alert.alert('Success', 'Photo uploaded successfully!');
      } else {
        Alert.alert('Error', 'Failed to upload photo. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = (photo: BusinessPhoto) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const success = await deleteBusinessPhoto(photo.id);
          if (success) {
            // Remove photo from state
            setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
            Alert.alert('Success', 'Photo deleted successfully!');
          } else {
            Alert.alert('Error', 'Failed to delete photo. Please try again.');
          }
        },
      },
    ]);
  };

  const openPhotoModal = (skillId: string) => {
    setSelectedSkillId(skillId);
    setShowPhotoModal(true);
  };

  const handleGoToSkillsRates = () => {
    router.push('/(professional)/skills/my-skills');
  };

  const handleLearnMore = () => {
    const policyUrl = 'https://100handy.com/photo-policy';
    Linking.openURL(policyUrl).catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#D17852" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text
          className="flex-1 text-center text-lg font-semibold text-[#333A31] pr-6"
          style={{ fontFamily: 'WorkSans_600SemiBold' }}
        >
          Business Photos
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col px-5 py-6 gap-6">
          {/* Empty State - Show when no skills */}
          {skills.length === 0 && (
            <View className="flex-col gap-4 items-center py-8">
              {/* Title */}
              <Text
                className="text-lg font-semibold text-[#333A31] text-center"
                style={{ fontFamily: 'WorkSans_600SemiBold' }}
              >
                You have no skills added
              </Text>

              {/* Description */}
              <Text
                className="text-sm text-[#666666] leading-5 text-center px-4"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                Go to your Skills & Rates and add your skills. You Can then come
                back here to upload your business Photos.
              </Text>

              {/* Go to Skills & Rates Link */}
              <Pressable onPress={handleGoToSkillsRates} className="mt-2">
                <Text
                  className="text-base font-medium text-[#D17852]"
                  style={{ fontFamily: 'WorkSans_500Medium' }}
                >
                  Go to Skills & Rates
                </Text>
              </Pressable>

              {/* Policy Link */}
              <View className="flex-col mt-4 items-center">
                <View className="flex-row flex-wrap justify-center">
                  <Text
                    className="text-sm text-[#666666]"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Learn more about our accepted photo policy{' '}
                  </Text>
                  <Pressable onPress={handleLearnMore}>
                    <Text
                      className="text-sm text-[#D17852]"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      here
                    </Text>
                  </Pressable>
                  <Text
                    className="text-sm text-[#666666]"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    .
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Skills-based Photo Upload - Show when skills exist */}
          {skills.length > 0 && (
            <View className="flex-col gap-4">
              <Text
                className="text-sm text-[#666666] leading-5"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                Add photos for each of your skills to showcase your work and
                attract more clients.
              </Text>

              {/* Skills List with Photo Upload */}
              {skills.map((userSkill) => {
                const skillPhotos = getPhotosForSkill(userSkill.id);

                return (
                  <View key={userSkill.id} className="flex-col gap-3">
                    {/* Skill Name */}
                    <Text
                      className="text-base font-semibold text-[#333A31]"
                      style={{ fontFamily: 'WorkSans_600SemiBold' }}
                    >
                      {userSkill.skill?.name}
                    </Text>

                    {/* Uploaded Photos Grid */}
                    {skillPhotos.length > 0 && (
                      <View className="flex-row flex-wrap gap-2">
                        {skillPhotos.map((photo) => (
                          <View key={photo.id} className="relative">
                            <Image
                              source={{ uri: photo.photo_url }}
                              className="w-24 h-24 rounded-lg"
                              style={{ width: 96, height: 96 }}
                            />
                            <Pressable
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                              onPress={() => handleDeletePhoto(photo)}
                            >
                              <X size={14} color="white" strokeWidth={3} />
                            </Pressable>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Photo Upload Button */}
                    <Pressable
                      className="border-2 border-dashed border-[#D17852] rounded-lg p-8 items-center justify-center bg-[#FFF8F5]"
                      onPress={() => openPhotoModal(userSkill.id)}
                      disabled={isUploading}
                    >
                      {isUploading && selectedSkillId === userSkill.id ? (
                        <View className="flex-row items-center gap-2">
                          <ActivityIndicator size="small" color="#D17852" />
                          <Text
                            className="text-sm font-medium text-[#D17852]"
                            style={{ fontFamily: 'WorkSans_500Medium' }}
                          >
                            Uploading...
                          </Text>
                        </View>
                      ) : (
                        <View className="flex-row items-center gap-2">
                          <Camera size={18} color="#D17852" />
                          <Text
                            className="text-sm font-medium text-[#D17852]"
                            style={{ fontFamily: 'WorkSans_500Medium' }}
                          >
                            + Add Photos
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  </View>
                );
              })}

              {/* Policy Link */}
              <View className="flex-col mt-2 items-center">
                <View className="flex-row flex-wrap justify-center">
                  <Text
                    className="text-sm text-[#666666]"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Learn more about our accepted photo policy{' '}
                  </Text>
                  <Pressable onPress={handleLearnMore}>
                    <Text
                      className="text-sm text-[#D17852]"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      here
                    </Text>
                  </Pressable>
                  <Text
                    className="text-sm text-[#666666]"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    .
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Photo Action Sheet */}
      <Modal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        size="sm"
      >
        <ModalBackdrop />
        <ModalContent className="bg-white rounded-2xl p-6">
          <Text
            className="text-lg font-semibold text-[#333A31] text-center mb-6"
            style={{ fontFamily: 'WorkSans_600SemiBold' }}
          >
            Add Photo
          </Text>

          <View className="gap-3">
            {/* Choose from Library */}
            <Pressable
              onPress={pickImage}
              className="py-4 bg-[#D17852] rounded-full items-center"
            >
              <Text
                className="text-base font-medium text-white"
                style={{ fontFamily: 'WorkSans_500Medium' }}
              >
                Choose from Library
              </Text>
            </Pressable>

            {/* Take Photo */}
            <Pressable
              onPress={takePhoto}
              className="py-4 border-2 border-[#D17852] rounded-full items-center"
            >
              <Text
                className="text-base font-medium text-[#D17852]"
                style={{ fontFamily: 'WorkSans_500Medium' }}
              >
                Take a Photo
              </Text>
            </Pressable>

            {/* Cancel */}
            <Pressable
              onPress={() => setShowPhotoModal(false)}
              className="py-4 items-center"
            >
              <Text
                className="text-base font-medium text-[#666666]"
                style={{ fontFamily: 'WorkSans_500Medium' }}
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
