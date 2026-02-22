import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Modal } from '@/components/ui/modal';
import { ModalBackdrop } from '@/components/ui/modal';
import { ModalContent } from '@/components/ui/modal';
import { ChevronLeft } from 'lucide-react-native';

interface AddProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onChooseFromLibrary: () => void;
}

export default function AddProfilePhotoModal({
  isOpen,
  onClose,
  onTakePhoto,
  onChooseFromLibrary,
}: AddProfilePhotoModalProps) {
  const [showOptions, setShowOptions] = useState(false);

  const handleAddPhoto = () => {
    setShowOptions(true);
  };

  const handleSelectOption = (option: 'library' | 'camera') => {
    setShowOptions(false);
    setTimeout(() => {
      if (option === 'library') {
        onChooseFromLibrary();
      } else {
        onTakePhoto();
      }
      onClose();
    }, 300);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent className="h-full w-full">
        <SafeAreaView className="flex-1 bg-white">
          {/* Header */}
          <View className="items-center px-5 py-4 border-b border-gray-100 flex-row">
            <Pressable onPress={onClose} className="mr-4">
              <ChevronLeft size={24} color="#000" />
            </Pressable>
            <Text className="text-lg font-semibold text-[#333A31]" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
              Add profile photo
            </Text>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="px-5 py-8 gap-6 flex-col">
              {/* Title */}
              <Text className="text-xl font-semibold text-center text-[#333A31]" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
                Show off your best self!
              </Text>

              {/* Sample Photos */}
              <View className="justify-center gap-4 flex-row">
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
              <View className="gap-4 flex-col">
                <Text className="text-center text-sm text-[#333A31]" style={{ fontFamily: 'WorkSans_400Regular' }}>
                  A great photo increases your chances of being hired. Some tips:
                </Text>

                <View className="gap-2 flex-col">
                  <Text className="text-center text-sm text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
                    • Center yourself and smile at the camera
                  </Text>
                  <Text className="text-center text-sm text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
                    • Take a headshot - from the chest up.
                  </Text>
                  <Text className="text-center text-sm text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
                    • Make sure it's focused and well - lit.
                  </Text>
                </View>
              </View>

              {/* Add Photo Button */}
              <Pressable
                onPress={handleAddPhoto}
                className="mx-5 mt-4 py-4 rounded-full border-2 border-[#D17852] items-center"
              >
                <Text className="text-base font-medium text-[#D17852]" style={{ fontFamily: 'WorkSans_500Medium' }}>
                  Add Photo
                </Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* Bottom Sheet for Select Photo Options */}
          {showOptions && (
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg">
              <View className="px-6 py-8 gap-6 flex-col">
                <Text className="text-xl font-semibold text-[#333A31]" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
                  Select a Photo
                </Text>

                <View className="gap-4 flex-row">
                  {/* Library Button */}
                  <Pressable
                    onPress={() => handleSelectOption('library')}
                    className="flex-1 py-4 bg-[#D17852] rounded-full items-center"
                  >
                    <Text className="text-base font-medium text-white" style={{ fontFamily: 'WorkSans_500Medium' }}>
                      Library
                    </Text>
                  </Pressable>

                  {/* Take a photo Button */}
                  <Pressable
                    onPress={() => handleSelectOption('camera')}
                    className="flex-1 py-4 rounded-full border-2 border-[#D17852] items-center"
                  >
                    <Text className="text-base font-medium text-[#D17852]" style={{ fontFamily: 'WorkSans_500Medium' }}>
                      Take a photo
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          {/* Background overlay when options are shown */}
          {showOptions && (
            <Pressable
              onPress={() => setShowOptions(false)}
              className="absolute inset-0 bg-black/30"
              style={{ zIndex: -1 }}
            />
          )}
        </SafeAreaView>
      </ModalContent>
    </Modal>
  );
}
