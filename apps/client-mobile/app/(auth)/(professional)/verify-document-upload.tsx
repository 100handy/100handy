import React, { useState } from 'react';
import { ScrollView, Image, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';
import { ChevronLeft, Camera, Upload } from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { uploadVerificationDocument, completeOnboarding } from '@shared/supabase/profile';
import { useToast } from '@/components/ui/toast';

type DocumentType = 'driver_license' | 'passport' | 'national_id' | 'residency_permit';

const DOCUMENT_TYPES = [
  { value: 'driver_license', label: "Driver's License" },
  { value: 'passport', label: 'Passport' },
  { value: 'national_id', label: 'National ID' },
  { value: 'residency_permit', label: 'Residency Permit' },
] as const;

export default function VerifyDocumentUpload() {
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>('driver_license');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleTakePhoto = async (): Promise<void> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        toast.error('Permission denied', 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      toast.error('Error', 'Failed to take photo');
    }
  };

  const handleChooseFromGallery = async (): Promise<void> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        toast.error('Permission denied', 'Photo library permission is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
      toast.error('Error', 'Failed to choose photo');
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!imageUri) {
      toast.error('Missing document', 'Please upload a photo of your ID');
      return;
    }

    try {
      setIsLoading(true);

      // Upload document
      const documentUrl = await uploadVerificationDocument(imageUri, selectedDocumentType);

      if (documentUrl) {
        // Mark onboarding as completed
        await completeOnboarding();

        toast.success('Success', 'Verification submitted successfully');

        // Navigate to professional dashboard
        router.replace('/(professional)/(tabs)/dashboard');
      } else {
        toast.error('Upload failed', 'Please try again');
      }
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast.error('Error', 'Failed to submit verification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipForNow = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Mark onboarding as completed even without document
      await completeOnboarding();
      router.replace('/(professional)/(tabs)/dashboard');
    } catch (error) {
      console.error('Error skipping:', error);
      toast.error('Error', 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-col flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-2 pb-5">
              <Pressable onPress={() => router.back()}>
                <ChevronLeft size={24} color="#333A31" />
              </Pressable>
              <Text className="text-[18px] font-worksans-medium" style={{ color: '#333A31' }}>
                Upload ID Document
              </Text>
              <View className="w-6" />
            </View>

            {/* Content */}
            <View className="flex-col flex-1 px-6">
              {/* Title */}
              <Text className="text-[20px] font-worksans-bold mb-3" style={{ color: '#30352D' }}>
                Verify your identity
              </Text>

              {/* Subtitle */}
              <Text className="text-[15px] font-worksans-medium leading-[20px] mb-6" style={{ color: '#30352D' }}>
                Upload a photo of your government-issued ID to verify your identity
              </Text>

              {/* Document Type Selection */}
              <Text className="text-[15px] font-worksans-medium mb-3" style={{ color: '#30352D' }}>
                Select document type
              </Text>

              <View className="flex-col mb-6">
                {DOCUMENT_TYPES.map((type) => (
                  <Pressable
                    key={type.value}
                    className="py-3 px-4 border-b border-gray-200"
                    onPress={() => setSelectedDocumentType(type.value)}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-[15px] font-worksans" style={{ color: '#30352D' }}>
                        {type.label}
                      </Text>
                      <View
                        className="w-5 h-5 rounded-full border-2"
                        style={{
                          borderColor: selectedDocumentType === type.value ? '#C1856A' : '#D1D5DB',
                          backgroundColor: selectedDocumentType === type.value ? '#C1856A' : 'transparent'
                        }}
                      >
                        {selectedDocumentType === type.value && (
                          <View className="w-2 h-2 rounded-full bg-white" style={{ margin: 4.5 }} />
                        )}
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>

              {/* Image Preview */}
              {imageUri && (
                <View className="mb-6 rounded-xl overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: '100%', height: 200 }}
                    resizeMode="contain"
                  />
                  <Pressable
                    className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
                    onPress={() => setImageUri(null)}
                  >
                    <Text className="text-white text-xs font-worksans-bold">Remove</Text>
                  </Pressable>
                </View>
              )}

              {/* Upload Buttons */}
              {!imageUri && (
                <View className="flex-col mb-6 gap-3">
                  <Button
                    className="rounded-full border-2"
                    style={{ borderColor: '#C1856A', backgroundColor: 'transparent' }}
                    onPress={handleTakePhoto}
                  >
                    <View className="flex-row items-center gap-2">
                      <Camera size={20} color="#C1856A" />
                      <ButtonText className="text-[16px] font-worksans-bold" style={{ color: '#C1856A' }}>
                        Take Photo
                      </ButtonText>
                    </View>
                  </Button>

                  <Button
                    className="rounded-full border-2"
                    style={{ borderColor: '#C1856A', backgroundColor: 'transparent' }}
                    onPress={handleChooseFromGallery}
                  >
                    <View className="flex-row items-center gap-2">
                      <Upload size={20} color="#C1856A" />
                      <ButtonText className="text-[16px] font-worksans-bold" style={{ color: '#C1856A' }}>
                        Choose from Gallery
                      </ButtonText>
                    </View>
                  </Button>
                </View>
              )}

              {/* Spacer */}
              <View className="flex-1" />

              {/* Submit Button */}
              <Button
                className="rounded-full mb-3"
                style={{
                  backgroundColor: imageUri ? '#C1856A' : '#E5E7EB'
                }}
                onPress={handleSubmit}
                isDisabled={!imageUri || isLoading}
              >
                <ButtonText
                  className="text-[18px] font-worksans-bold"
                  style={{ color: imageUri ? 'white' : '#9CA3AF' }}
                >
                  {isLoading ? 'Submitting...' : 'Submit for Verification'}
                </ButtonText>
              </Button>

              {/* Skip Button */}
              <Pressable
                className="rounded-full py-3 border-2 mb-6"
                style={{ borderColor: '#C1856A' }}
                onPress={handleSkipForNow}
                disabled={isLoading}
              >
                <Text className="text-center text-[18px] font-worksans-bold" style={{ color: '#C1856A' }}>
                  Skip for now
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
