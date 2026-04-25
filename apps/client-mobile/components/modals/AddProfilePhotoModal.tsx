import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Modal } from '@/components/ui/modal';
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
  const insets = useSafeAreaInsets();
  const headerTopInset = Math.max(insets.top, 24);
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      className="justify-start items-stretch"
    >
      <ModalContent className="flex-1 h-full w-full max-w-none m-0 rounded-none border-0 p-0 bg-white">
        <SafeAreaView className="flex-1 bg-white" edges={[]}>
          {/* Header */}
          <View
            className="flex-row items-center px-5 border-b border-gray-100 bg-white"
            style={{ minHeight: 56, paddingTop: headerTopInset + 8, paddingBottom: 12 }}
          >
            <Pressable onPress={onClose} className="w-10 h-10 items-start justify-center">
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
              <Pressable
                onPress={() => setShowOptions(false)}
                className="absolute inset-0 bg-black/35"
                style={{ zIndex: 20 }}
              />

              <View
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
                style={{ paddingBottom: Math.max(insets.bottom, 16), zIndex: 30 }}
              >
                <View className="px-6 pt-8 pb-6 gap-6 flex-col">
                  <Text className="text-xl font-semibold text-brand-dark" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
                    Select a Photo
                  </Text>

                  <View className="gap-4 flex-row">
                    {/* Library Button */}
                    <Pressable
                      onPress={() => handleSelectOption('library')}
                      className="flex-1 py-4 bg-brand-terracotta rounded-full items-center"
                    >
                      <Text className="text-base font-medium text-white" style={{ fontFamily: 'WorkSans_500Medium' }}>
                        Library
                      </Text>
                    </Pressable>

                    {/* Take a photo Button */}
                    <Pressable
                      onPress={() => handleSelectOption('camera')}
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
      </ModalContent>
    </Modal>
  );
}
