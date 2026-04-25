import React, { useState } from 'react';
import { ScrollView, Image, Alert, View, Text, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useProfileStore } from '@shared/supabase';

export default function AddProfilePhotoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerTopInset = Math.max(insets.top, 24);
  const { uploadAvatar, fetchProfile } = useProfileStore();
  const [showOptions, setShowOptions] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(professional)/(tabs)/dashboard');
  };

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
          { text: 'OK', onPress: handleBack }
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
          { text: 'OK', onPress: handleBack }
        ]);
      } else {
        Alert.alert('Error', 'Failed to upload photo. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={[]}>
      {/* Header */}
      <View
        className="flex-row items-center px-5 border-b border-gray-100 bg-white"
        style={{ minHeight: 56, paddingTop: headerTopInset + 8, paddingBottom: 12 }}
      >
        <Pressable onPress={handleBack} className="w-10 h-10 items-start justify-center">
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text
          className="flex-1 text-lg font-semibold text-brand-dark text-center pr-10"
          numberOfLines={1}
          style={{ fontFamily: 'WorkSans_600SemiBold' }}
        >
          Add profile photo
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col px-6 pt-8 pb-10 gap-7">
          {/* Title */}
          <Text className="text-[30px] leading-9 font-semibold text-center text-brand-dark" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
            Show off your best self!
          </Text>

          {/* Sample Photos */}
          <View className="flex-row justify-center gap-4">
            <View className="w-[76px] h-[76px] rounded-full overflow-hidden bg-[#F4F4F4]">
              <Image
                source={require('@/assets/images/icon.png')}
                style={{ width: 76, height: 76 }}
              />
            </View>
            <View className="w-[76px] h-[76px] rounded-full overflow-hidden bg-[#F4F4F4]">
              <Image
                source={require('@/assets/images/icon.png')}
                style={{ width: 76, height: 76 }}
              />
            </View>
            <View className="w-[76px] h-[76px] rounded-full overflow-hidden bg-[#F4F4F4]">
              <Image
                source={require('@/assets/images/icon.png')}
                style={{ width: 76, height: 76 }}
              />
            </View>
          </View>

          {/* Tips */}
          <View className="flex-col gap-4">
            <Text className="text-center text-[18px] leading-7 text-brand-dark px-2" style={{ fontFamily: 'WorkSans_400Regular' }}>
              A great photo increases your chances of being hired. Some tips:
            </Text>

            <View className="flex-col gap-3 px-3">
              <Text className="text-center text-[17px] leading-6 text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
                • Center yourself and smile at the camera
              </Text>
              <Text className="text-center text-[17px] leading-6 text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
                • Take a headshot - from the chest up.
              </Text>
              <Text className="text-center text-[17px] leading-6 text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
                • Make sure it&apos;s focused and well-lit.
              </Text>
            </View>
          </View>

          {/* Add Photo Button */}
          <Pressable
            onPress={handleAddPhoto}
            className="mt-2 py-4 rounded-full border-2 border-brand-terracotta items-center"
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
          <View
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <View className="flex-col px-6 pt-8 pb-6 gap-6">
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
