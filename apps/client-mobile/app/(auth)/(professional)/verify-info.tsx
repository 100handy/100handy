import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Modal, ModalBackdrop, ModalContent } from '@/components/ui/modal';
import { ChevronLeft, Lock, FileText } from 'lucide-react-native';
import { router } from 'expo-router';

interface ConfirmModalProps {
  visible: boolean;
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

const ConfirmModal: React.FC<ConfirmModalProps> = ({ visible, onClose, onConfirm, formData }) => {
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalBackdrop className="bg-black/40" />
      <ModalContent className="bg-white rounded-2xl mx-5" style={{ maxWidth: 350, padding: 24 }}>
        <VStack>
          {/* Title */}
          <Text className="text-[20px] font-worksans-bold text-center mb-4" style={{ color: '#30352D' }}>
            Confirm your info
          </Text>

          {/* Description */}
          <Text className="text-[13px] font-worksans-medium text-center leading-[18px] mb-5" style={{ color: '#30352D' }}>
            Let's set up your payment account! Details should match your bank.
          </Text>

          {/* Info Sections */}
          <VStack className="mb-4">
            <Box className="mb-3">
              <Text className="text-[11px] font-worksans-bold mb-1 tracking-wide" style={{ color: '#30352D' }}>
                LEGAL FULL NAME:
              </Text>
              <Text className="text-[15px] font-worksans-medium" style={{ color: '#30352D' }}>
                {formData.firstName} {formData.lastName}
              </Text>
            </Box>

            <Box className="mb-3">
              <Text className="text-[11px] font-worksans-bold mb-1 tracking-wide" style={{ color: '#30352D' }}>
                DATE OF BIRTH
              </Text>
              <Text className="text-[15px] font-worksans-medium" style={{ color: '#30352D' }}>
                {formData.dateOfBirth}
              </Text>
            </Box>

            <Box className="mb-3">
              <Text className="text-[11px] font-worksans-bold mb-1 tracking-wide" style={{ color: '#30352D' }}>
                HOME ADDRESS
              </Text>
              <Text className="text-[15px] font-worksans-medium leading-[20px]" style={{ color: '#30352D' }}>
                {formData.streetAddress}, {formData.apt}, {formData.city}, {formData.county} {formData.postcode}
              </Text>
            </Box>
          </VStack>

          {/* Warning Text */}
          <Text className="text-[13px] font-worksans-medium text-center leading-[18px] mb-5" style={{ color: '#30352D' }}>
            Once you confirm, you will be taken to a Secure identity check. This will only take a few minutes.
          </Text>

          {/* Buttons */}
          <HStack className="gap-3">
            <Pressable 
              className="flex-1 rounded-full py-3 border-2"
              style={{ borderColor: '#C1856A' }}
              onPress={onClose}
            >
              <Text className="text-center text-[16px] font-worksans-bold" style={{ color: '#C1856A' }}>
                Edit
              </Text>
            </Pressable>

            <Button
              className="flex-1 rounded-full py-3"
              style={{ backgroundColor: '#C1856A' }}
              onPress={onConfirm}
            >
              <ButtonText className="text-[16px] font-worksans-bold">
                Confirm
              </ButtonText>
            </Button>
          </HStack>
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export default function VerifyInformation() {
  const [showModal, setShowModal] = useState(false);
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

  const handleInputChange = (field: string, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = (): void => {
    setShowModal(true);
  };

  const handleConfirm = (): void => {
    setShowModal(false);
    // Navigate to verification getting started
    router.push('/(auth)/(professional)/verify-getting-started');
  };

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <VStack className="flex-1">
            {/* Header */}
            <HStack className="items-center justify-between px-5 pt-2 pb-5">
              <Pressable onPress={() => router.back()}>
                <ChevronLeft size={24} color="#333A31" />
              </Pressable>
              <Text className="text-[18px] font-worksans-medium" style={{ color: '#333A31' }}>
                Verify your Information
              </Text>
              <Pressable>
                <FileText size={22} color="#333A31" />
              </Pressable>
            </HStack>

            {/* Info Text */}
            <Box className="px-8 pb-6">
              <Text className="text-[15px] font-worksans-medium leading-[20px] mb-2" style={{ color: '#30352D' }}>
                Let's set up your payment account! Details should match your bank.
              </Text>
              <Pressable>
                <Text className="text-[15px] font-worksans-medium" style={{ color: '#C1856A' }}>
                  Why do we need this?
                </Text>
              </Pressable>
            </Box>

            {/* Form */}
            <Box className="px-5">
              {/* First Name */}
              <Box className="mb-4">
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
              </Box>

              {/* Surname */}
              <Box className="mb-4">
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
              </Box>

              {/* Date of birth */}
              <Box className="mb-4">
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
                    placeholder=""
                  />
                </Input>
              </Box>

              {/* Street Number and Name */}
              <Box className="mb-4">
                <Text className="text-[15px] font-worksans-medium mb-2" style={{ color: '#30352D' }}>
                  Street Number and Name
                </Text>
                <Input
                  variant="outline"
                  className="border-0 border-b border-gray-300 rounded-none px-0 h-9"
                >
                  <InputField
                    className="font-worksans text-[15px]"
                    style={{ color: '#30352D' }}
                    value={formData.streetAddress}
                    onChangeText={(value) => handleInputChange('streetAddress', value)}
                    placeholder=""
                  />
                </Input>
              </Box>

              {/* Apt/Suite and City Row */}
              <HStack className="mb-4 gap-4">
                <Box className="flex-1">
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
                </Box>
                <Box className="flex-1">
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
                </Box>
              </HStack>

              {/* County and Postcode Row */}
              <HStack className="mb-6 gap-4">
                <Box className="flex-1">
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
                </Box>
                <Box className="flex-1">
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
                </Box>
              </HStack>

              {/* Security Notice */}
              <HStack className="items-start mb-7 px-1">
                <Lock size={14} color="#C1856A" style={{ marginTop: 3, marginRight: 6 }} />
                <Text className="flex-1 text-[15px] font-worksans-medium leading-[20px]" style={{ color: '#C1856A' }}>
                  Your personal information is securely stored and kept confidential.
                </Text>
              </HStack>

              {/* Signup Button */}
              <Button
                className="rounded-full shadow-sm mb-4"
                style={{ backgroundColor: '#C1856A' }}
                onPress={handleSignup}
              >
                <ButtonText className="text-[18px] font-worksans-bold">
                  Signup
                </ButtonText>
              </Button>
            </Box>
          </VStack>
        </ScrollView>
      </SafeAreaView>

      {/* Confirmation Modal */}
      <ConfirmModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        formData={formData}
      />
    </Box>
  );
}
