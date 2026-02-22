import React, { useState } from 'react';
import { ScrollView, Image, Alert, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useProfileStore } from '@shared/supabase';

export default function AddProfilePhotoScreen() {
  const router = useRouter();
  const { uploadAvatar, fetchProfile } = useProfileStore();
  const [showOptions, setShowOptions] = useState(false);

  const handleAddPhoto = () => {
    setShowOptions(true);
  };

  const pickImage = async () => {
    setShowOptions(false);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uploaded = await uploadAvatar(result.assets[0].uri);
      if (uploaded) {
        await fetchProfile();
        Alert.alert('Success', 'Profile photo updated successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', 'Failed to upload photo. Please try again.');
      }
    }
  };

  const takePhoto = async () => {
    setShowOptions(false);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uploaded = await uploadAvatar(result.assets[0].uri);
      if (uploaded) {
        await fetchProfile();
        Alert.alert('Success', 'Profile photo updated successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', 'Failed to upload photo. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text className="text-lg font-semibold text-brand-dark" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
          Add profile photo
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col px-5 py-8 gap-6">
          {/* Title */}
          <Text className="text-xl font-semibold text-center text-brand-dark" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
            Show off your best self!
          </Text>

          {/* Sample Photos */}
          <View className="flex-row justify-center gap-4">
            <View className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              <Image
                source={require('@/assets/images/icon.png')}
                style={{ width: 96, height: 96 }}
              />
            </View>
            <View className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              <Image
                source={require('@/assets/images/icon.png')}
                style={{ width: 96, height: 96 }}
              />
            </View>
            <View className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              <Image
                source={require('@/assets/images/icon.png')}
                style={{ width: 96, height: 96 }}
              />
            </View>
          </View>

          {/* Tips */}
          <View className="flex-col gap-4">
            <Text className="text-center text-sm text-brand-dark" style={{ fontFamily: 'WorkSans_400Regular' }}>
              A great photo increases your chances of being hired. Some tips:
            </Text>

            <View className="flex-col gap-2">
              <Text className="text-center text-sm text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
                Center yourself and smile at the camera
              </Text>
              <Text className="text-center text-sm text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
                Take a headshot - from the chest up.
              </Text>
              <Text className="text-center text-sm text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
                Make sure it's focused and well - lit.
              </Text>
            </View>
          </View>

          {/* Add Photo Button */}
          <Pressable
            onPress={handleAddPhoto}
            className="mx-5 mt-4 py-4 rounded-full border-2 border-brand-terracotta items-center"
          >
            <Text className="text-base font-medium text-brand-terracotta" style={{ fontFamily: 'WorkSans_500Medium' }}>
              Add Photo
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Sheet for Select Photo Options */}
      {showOptions && (
        <>
          {/* Background overlay */}
          <Pressable
            onPress={() => setShowOptions(false)}
            className="absolute inset-0 bg-black/30"
          />

          {/* Bottom Sheet */}
          <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg">
            <View className="flex-col px-6 py-8 gap-6">
              <Text className="text-xl font-semibold text-brand-dark" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
                Select a Photo
              </Text>

              <View className="flex-row gap-4">
                {/* Library Button */}
                <Pressable
                  onPress={pickImage}
                  className="flex-1 py-4 bg-brand-terracotta rounded-full items-center"
                >
                  <Text className="text-base font-medium text-white" style={{ fontFamily: 'WorkSans_500Medium' }}>
                    Library
                  </Text>
                </Pressable>

                {/* Take a photo Button */}
                <Pressable
                  onPress={takePhoto}
                  className="flex-1 py-4 rounded-full border-2 border-brand-terracotta items-center"
                >
                  <Text className="text-base font-medium text-brand-terracotta" style={{ fontFamily: 'WorkSans_500Medium' }}>
                    Take a photo
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
