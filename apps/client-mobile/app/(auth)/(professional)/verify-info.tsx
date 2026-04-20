import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, Platform, Alert } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Modal, ModalBackdrop, ModalContent } from '@/components/ui/modal';
import { ChevronLeft, Lock, FileText } from 'lucide-react-native';
import { router, useNavigation } from 'expo-router';
import { updateVerificationData, getUserProfile, getHandyProfile } from '@shared/supabase/profile';
import { useAuthStore } from '@shared/supabase';
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
              className="flex-1 min-w-0 h-11 rounded-full border-2 items-center justify-center"
              style={{ borderColor: '#C1856A' }}
              onPress={onClose}
            >
              <Text className="text-center text-[18px] font-worksans-bold" style={{ color: '#C1856A' }}>
                Edit
              </Text>
            </Pressable>

            <Button
              className="flex-1 min-w-0 rounded-full"
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const toast = useToast();
  const navigation = useNavigation();
  const { signOut } = useAuthStore();
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

  const handleBack = (): void => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      // User arrived via replace() (e.g., from AuthWrapper redirect)
      // Offer to sign out so they can get back to sign-in
      Alert.alert(
        'Go back',
        'Do you want to sign out and return to the login screen?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut();
                router.replace('/(auth)/(professional)');
              } catch {
                router.replace('/(auth)/(professional)');
              }
            },
          },
        ]
      );
    }
  };

  const handleSignup = (): void => {
    // Validate required fields before showing confirmation modal
    if (!formData.firstName.trim()) {
      toast.error('Missing info', 'Please enter your first name');
      return;
    }
    if (!formData.lastName.trim()) {
      toast.error('Missing info', 'Please enter your surname');
      return;
    }
    if (!formData.dateOfBirth) {
      toast.error('Missing info', 'Please select your date of birth');
      return;
    }
    if (!formData.streetAddress.trim()) {
      toast.error('Missing info', 'Please enter your street address');
      return;
    }
    if (!formData.city.trim()) {
      toast.error('Missing info', 'Please enter your city');
      return;
    }
    if (!formData.postcode.trim()) {
      toast.error('Missing info', 'Please enter your postcode');
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = async (): Promise<void> => {
    try {
      setShowModal(false);
      setIsLoading(true);

      // Convert date from dd/mm/yyyy to YYYY-MM-DD format for PostgreSQL
      const formattedDate = convertDateFormat(formData.dateOfBirth);
      if (!formattedDate || !/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
        toast.error('Invalid date', 'Please select a valid date of birth');
        return;
      }

      // Save verification data to backend
      const success = await updateVerificationData({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        date_of_birth: formattedDate,
        street_address: formData.streetAddress.trim(),
        apartment: formData.apt.trim(),
        city: formData.city.trim(),
        county: formData.county.trim(),
        postcode: formData.postcode.trim(),
      });

      if (success) {
        // Navigate to document upload
        router.push('/(auth)/(professional)/verify-document-upload');
      } else {
        toast.error('Error saving data', 'Something went wrong. Please check your details and try again.');
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
              <Pressable onPress={handleBack} hitSlop={8}>
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
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  className="border-b border-gray-300 py-2"
                >
                  <Text
                    className="font-worksans text-[15px]"
                    style={{ color: formData.dateOfBirth ? '#30352D' : '#9CA3AF' }}
                  >
                    {formData.dateOfBirth || 'Select date of birth'}
                  </Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    value={
                      formData.dateOfBirth
                        ? new Date(convertDateFormat(formData.dateOfBirth))
                        : new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                    }
                    maximumDate={new Date()}
                    onChange={(event: DateTimePickerEvent, date?: Date) => {
                      if (Platform.OS === 'android') setShowDatePicker(false);
                      if (event.type === 'dismissed') { setShowDatePicker(false); return; }
                      if (date) {
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        handleInputChange('dateOfBirth', `${day}/${month}/${year}`);
                        if (Platform.OS === 'ios') setShowDatePicker(false);
                      }
                    }}
                  />
                )}
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
