import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Modal, ModalBackdrop, ModalContent } from '@/components/ui/modal';
import { ChevronLeft, Lock, FileText } from 'lucide-react-native';
import { router } from 'expo-router';
import { updateVerificationData, getUserProfile, getHandyProfile } from '@shared/supabase/profile';
import { useToast } from '@/components/ui/toast';
import { LocationAutocomplete, fetchPlaceDetails } from '@/components/location';

/**
 * Convert date from dd/mm/yyyy format to YYYY-MM-DD format for PostgreSQL
 * Also validates the date components to prevent invalid dates
 */
function convertDateFormat(dateStr: string): string {
  if (!dateStr) return '';

  // Check if date is already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // Parse dd/mm/yyyy format
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;

    // Parse as integers for validation
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    // Validate date components
    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
      throw new Error('Invalid date. Please enter in dd/mm/yyyy format.');
    }

    if (monthNum < 1 || monthNum > 12) {
      throw new Error('Invalid month. Please enter a valid date in dd/mm/yyyy format.');
    }

    if (dayNum < 1 || dayNum > 31) {
      throw new Error('Invalid day. Please enter a valid date in dd/mm/yyyy format.');
    }

    if (yearNum < 1900 || yearNum > 2100) {
      throw new Error('Invalid year. Please enter a valid date in dd/mm/yyyy format.');
    }

    // Validate and convert to YYYY-MM-DD
    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }

  // Return original if format is unrecognized
  return dateStr;
}

/**
 * Convert date from YYYY-MM-DD format (database) to dd/mm/yyyy format (display)
 */
function convertDateFromDatabase(dateStr: string): string {
  if (!dateStr) return '';
  
  // Check if date is already in dd/mm/yyyy format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Parse YYYY-MM-DD format
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    // Validate and convert to dd/mm/yyyy
    if (day && month && year) {
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
  }
  
  // Return original if format is unrecognized
  return dateStr;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    streetAddress: string;
    apt: string;
    city: string;
    county: string;
    postcode: string;
  };
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, formData }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop className="bg-black/40" />
      <ModalContent className="bg-white rounded-2xl mx-5" style={{ maxWidth: 350, padding: 28 }}>
        <View className="flex-col">
          {/* Title */}
          <Text className="text-[24px] font-worksans-bold text-center mb-4" style={{ color: '#30352D' }}>
            Confirm your info
          </Text>

          {/* Description */}
          <Text className="text-[15px] font-worksans-medium text-center leading-[18px] mb-5" style={{ color: '#30352D' }}>
            Let's set up your payment account! Details should match your bank.
          </Text>

          {/* Info Sections */}
          <View className="flex-col mb-4">
            <View className="mb-3">
              <Text className="text-[13px] font-worksans-bold mb-1 tracking-wide" style={{ color: '#30352D' }}>
                LEGAL FULL NAME:
              </Text>
              <Text className="text-[16px] font-worksans-medium" style={{ color: '#30352D' }}>
                {formData.firstName} {formData.lastName}
              </Text>
            </View>

            <View className="mb-3">
              <Text className="text-[13px] font-worksans-bold mb-1 tracking-wide" style={{ color: '#30352D' }}>
                DATE OF BIRTH
              </Text>
              <Text className="text-[16px] font-worksans-medium" style={{ color: '#30352D' }}>
                {formData.dateOfBirth}
              </Text>
            </View>

            <View className="mb-3">
              <Text className="text-[13px] font-worksans-bold mb-1 tracking-wide" style={{ color: '#30352D' }}>
                HOME ADDRESS
              </Text>
              <Text className="text-[16px] font-worksans-medium leading-[20px]" style={{ color: '#30352D' }}>
                {formData.streetAddress}, {formData.apt}, {formData.city}, {formData.county} {formData.postcode}
              </Text>
            </View>
          </View>

          {/* Warning Text */}
          <Text className="text-[15px] font-worksans-medium text-center leading-[18px] mb-5" style={{ color: '#30352D' }}>
            Once you confirm, you'll complete a secure identity check using your government-issued ID and a selfie. This only takes a few minutes.
          </Text>

          {/* Buttons */}
          <View className="flex-row gap-3">
            <Pressable 
              className="flex-1 rounded-full py-4 border-2"
              style={{ borderColor: '#C1856A' }}
              onPress={onClose}
            >
              <Text className="text-center text-[18px] font-worksans-bold" style={{ color: '#C1856A' }}>
                Edit
              </Text>
            </Pressable>

            <Button
              className="flex-1 rounded-full py-4"
              size="lg"
              style={{ backgroundColor: '#C1856A' }}
              onPress={onConfirm}
            >
              <ButtonText className="text-[18px] font-worksans-bold">
                Confirm
              </ButtonText>
            </Button>
          </View>
        </View>
      </ModalContent>
    </Modal>
  );
};

export default function VerifyInformation() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    streetAddress: '',
    apt: '',
    city: '',
    county: '',
    postcode: '',
  });

  // Load user profile data on mount to pre-fill form
  useEffect(() => {
    const loadProfileData = async (): Promise<void> => {
      try {
        // Get user profile (from signup - first_name, last_name, postcode)
        const userProfile = await getUserProfile();
        
        // Get handy profile (may have existing verification data)
        // This might fail if profile doesn't exist yet, which is fine
        const handyProfile = await getHandyProfile().catch(() => null);
        
        if (userProfile) {
          setFormData(prev => ({
            ...prev,
            firstName: userProfile.first_name || '',
            lastName: userProfile.last_name || '',
            postcode: userProfile.postcode || '',
          }));
        }
        
        // If handy profile has existing verification data, pre-fill those fields too
        if (handyProfile) {
          setFormData(prev => ({
            ...prev,
            dateOfBirth: handyProfile.date_of_birth 
              ? convertDateFromDatabase(handyProfile.date_of_birth) 
              : prev.dateOfBirth,
            streetAddress: handyProfile.street_address || prev.streetAddress,
            apt: handyProfile.apartment || prev.apt,
            city: handyProfile.city || prev.city,
            county: handyProfile.county || prev.county,
          }));
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        // Don't show error toast - just continue with empty form
        // This ensures the form always renders even if profile loading fails
      }
    };

    loadProfileData();
  }, []);

  const handleInputChange = (field: string, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = async (prediction: { place_id: string; description: string }): Promise<void> => {
    try {
      // Fetch place details to extract address components
      const addressComponents = await fetchPlaceDetails(prediction.place_id);

      if (addressComponents) {
        // Auto-fill all address fields from place details
        setFormData(prev => ({
          ...prev,
          streetAddress: addressComponents.streetAddress || prediction.description,
          city: addressComponents.city || prev.city,
          county: addressComponents.county || prev.county,
          postcode: addressComponents.postcode || prev.postcode,
        }));
      } else {
        // Fallback: use description if place details fetch fails
        setFormData(prev => ({ ...prev, streetAddress: prediction.description }));
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      // Fallback: use description if error occurs
      setFormData(prev => ({ ...prev, streetAddress: prediction.description }));
    }
  };

  const handleSignup = (): void => {
    setShowModal(true);
  };

  const handleConfirm = async (): Promise<void> => {
    try {
      setShowModal(false);
      setIsLoading(true);

      // Save verification data to backend
      // Convert date from dd/mm/yyyy to YYYY-MM-DD format for PostgreSQL
      const success = await updateVerificationData({
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: convertDateFormat(formData.dateOfBirth),
        street_address: formData.streetAddress,
        apartment: formData.apt,
        city: formData.city,
        county: formData.county,
        postcode: formData.postcode,
      });

      if (success) {
        // Navigate to document upload
        router.push('/(auth)/(professional)/verify-document-upload');
      } else {
        toast.error('Error saving data', 'Please sign in again and try');
      }
    } catch (error) {
      console.error('Error in handleConfirm:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      toast.error('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-col flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-2 pb-5">
              <Pressable onPress={() => router.back()}>
                <ChevronLeft size={24} color="#333A31" />
              </Pressable>
              <Text className="text-[18px] font-worksans-medium" style={{ color: '#333A31' }}>
                Verify your Information
              </Text>
              <Pressable>
                <FileText size={22} color="#333A31" />
              </Pressable>
            </View>

            {/* Info Text */}
            <View className="px-8 pb-6">
              <Text className="text-[15px] font-worksans-medium leading-[20px] mb-2" style={{ color: '#30352D' }}>
                Let's set up your payment account! Details should match your bank.
              </Text>
              <Pressable>
                <Text className="text-[15px] font-worksans-medium" style={{ color: '#C1856A' }}>
                  Why do we need this?
                </Text>
              </Pressable>
            </View>

            {/* Form */}
            <View className="px-5">
              {/* First Name */}
              <View className="mb-4">
                <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                  First Name
                </Text>
                <Input
                  variant="outline"
                  className="border-0 border-b border-gray-300 rounded-none px-0 h-9"
                >
                  <InputField
                    className="font-worksans text-[15px]"
                    style={{ color: '#30352D' }}
                    value={formData.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    placeholder=""
                  />
                </Input>
              </View>

              {/* Surname */}
              <View className="mb-4">
                <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                  Surname
                </Text>
                <Input
                  variant="outline"
                  className="border-0 border-b border-gray-300 rounded-none px-0 h-9"
                >
                  <InputField
                    className="font-worksans text-[15px]"
                    style={{ color: '#30352D' }}
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    placeholder=""
                  />
                </Input>
              </View>

              {/* Date of birth */}
              <View className="mb-4">
                <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                  Date of birth
                </Text>
                <Input
                  variant="outline"
                  className="border-0 border-b border-gray-300 rounded-none px-0 h-9"
                >
                  <InputField
                    className="font-worksans text-[15px]"
                    style={{ color: '#30352D' }}
                    value={formData.dateOfBirth}
                    onChangeText={(value) => handleInputChange('dateOfBirth', value)}
                    placeholder="dd/mm/yyyy"
                    placeholderTextColor="#9CA3AF"
                  />
                </Input>
              </View>

              {/* Street Number and Name */}
              <View className="mb-4">
                <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                  Street Number and Name
                </Text>
                <LocationAutocomplete
                  value={formData.streetAddress}
                  onChangeText={(value) => handleInputChange('streetAddress', value)}
                  onSelectLocation={handleLocationSelect}
                  placeholder=""
                  showClearButton={false}
                  inputClassName="border-0 border-b border-gray-300 rounded-none px-0 h-9"
                />
              </View>

              {/* Apt/Suite and City Row */}
              <View className="flex-row mb-4 gap-4">
                <View className="flex-1">
                  <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                    Apt / Suite
                  </Text>
                  <Input
                    variant="outline"
                    className="border-0 border-b border-gray-300 rounded-none px-0 h-9"
                  >
                    <InputField
                      className="font-worksans text-[15px]"
                      style={{ color: '#30352D' }}
                      value={formData.apt}
                      onChangeText={(value) => handleInputChange('apt', value)}
                      placeholder=""
                    />
                  </Input>
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                    City
                  </Text>
                  <Input
                    variant="outline"
                    className="border-0 border-b border-gray-300 rounded-none px-0 h-9"
                  >
                    <InputField
                      className="font-worksans text-[15px]"
                      style={{ color: '#30352D' }}
                      value={formData.city}
                      onChangeText={(value) => handleInputChange('city', value)}
                      placeholder=""
                    />
                  </Input>
                </View>
              </View>

              {/* County and Postcode Row */}
              <View className="flex-row mb-6 gap-4">
                <View className="flex-1">
                  <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                    County
                  </Text>
                  <Input
                    variant="outline"
                    className="border-0 border-b border-gray-300 rounded-none px-0 h-9"
                  >
                    <InputField
                      className="font-worksans text-[15px]"
                      style={{ color: '#30352D' }}
                      value={formData.county}
                      onChangeText={(value) => handleInputChange('county', value)}
                      placeholder=""
                    />
                  </Input>
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                    Postcode
                  </Text>
                  <Input
                    variant="outline"
                    className="border-0 border-b border-gray-300 rounded-none px-0 h-9"
                  >
                    <InputField
                      className="font-worksans text-[15px]"
                      style={{ color: '#30352D' }}
                      value={formData.postcode}
                      onChangeText={(value) => handleInputChange('postcode', value)}
                      placeholder=""
                      autoCapitalize="characters"
                    />
                  </Input>
                </View>
              </View>

              {/* Security Notice */}
              <View className="flex-row items-start mb-4 px-1">
                <Lock size={14} color="#C1856A" style={{ marginTop: 3, marginRight: 6 }} />
                <Text className="flex-1 text-[15px] font-worksans-medium leading-[20px]" style={{ color: '#C1856A' }}>
                  Your personal information is securely stored and kept confidential.
                </Text>
              </View>

              {/* Next Step Notice */}
              <View className="flex-row items-start mb-7 px-1 p-3 rounded-lg" style={{ backgroundColor: '#FFF7ED' }}>
                <FileText size={14} color="#92400E" style={{ marginTop: 3, marginRight: 6 }} />
                <Text className="flex-1 text-[14px] font-worksans-medium leading-[18px]" style={{ color: '#92400E' }}>
                  Next step: You'll complete a quick identity verification with a government ID and selfie. Have these ready!
                </Text>
              </View>

              {/* Signup Button */}
              <Button
                className="rounded-full shadow-sm mb-4"
                style={{ backgroundColor: '#C1856A' }}
                onPress={handleSignup}
                isDisabled={isLoading}
              >
                <ButtonText className="text-[18px] font-worksans-bold">
                  {isLoading ? 'Saving...' : 'Signup'}
                </ButtonText>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        formData={formData}
      />
    </View>
  );
}
