import React, { useState } from 'react';
import { ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
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
          <HStack className="items-center px-5 py-4 border-b border-gray-100">
            <Pressable onPress={onClose} className="mr-4">
              <ChevronLeft size={24} color="#000" />
            </Pressable>
            <Text className="text-lg font-semibold text-[#333A31]" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
              Add profile photo
            </Text>
          </HStack>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <VStack className="px-5 py-8 gap-6">
              {/* Title */}
              <Text className="text-xl font-semibold text-center text-[#333A31]" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
                Show off your best self!
              </Text>

              {/* Sample Photos */}
              <HStack className="justify-center gap-4">
                <Box className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    source={{ uri: 'https://i.pravatar.cc/150?img=33' }}
                    style={{ width: 96, height: 96 }}
                  />
                </Box>
                <Box className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    source={{ uri: 'https://i.pravatar.cc/150?img=47' }}
                    style={{ width: 96, height: 96 }}
                  />
                </Box>
                <Box className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    source={{ uri: 'https://i.pravatar.cc/150?img=29' }}
                    style={{ width: 96, height: 96 }}
                  />
                </Box>
              </HStack>

              {/* Tips */}
              <VStack className="gap-4">
                <Text className="text-center text-sm text-[#333A31]" style={{ fontFamily: 'WorkSans_400Regular' }}>
                  A great photo increases your chances of being hired. Some tips:
                </Text>

                <VStack className="gap-2">
                  <Text className="text-center text-sm text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
                    • Center yourself and smile at the camera
                  </Text>
                  <Text className="text-center text-sm text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
                    • Take a headshot - from the chest up.
                  </Text>
                  <Text className="text-center text-sm text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
                    • Make sure it's focused and well - lit.
                  </Text>
                </VStack>
              </VStack>

              {/* Add Photo Button */}
              <Pressable
                onPress={handleAddPhoto}
                className="mx-5 mt-4 py-4 rounded-full border-2 border-[#D17852] items-center"
              >
                <Text className="text-base font-medium text-[#D17852]" style={{ fontFamily: 'WorkSans_500Medium' }}>
                  Add Photo
                </Text>
              </Pressable>
            </VStack>
          </ScrollView>

          {/* Bottom Sheet for Select Photo Options */}
          {showOptions && (
            <Box className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg">
              <VStack className="px-6 py-8 gap-6">
                <Text className="text-xl font-semibold text-[#333A31]" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
                  Select a Photo
                </Text>

                <HStack className="gap-4">
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
                </HStack>
              </VStack>
            </Box>
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
