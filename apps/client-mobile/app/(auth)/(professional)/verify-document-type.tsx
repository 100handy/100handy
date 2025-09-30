import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeft, X, CreditCard, BookOpen, IdCard, FileText } from 'lucide-react-native';
import { router } from 'expo-router';
import { CancelVerificationModal, DocumentTypeOption } from '@/components/verification';

type DocumentType = 'driver_license' | 'passport' | 'national_id' | 'residency_permit' | null;

export default function VerifyDocumentType() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentType>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleClose = (): void => {
    setShowCancelModal(true);
  };

  const handleBack = (): void => {
    router.back();
  };

  const handleResume = (): void => {
    setShowCancelModal(false);
  };

  const handleCancel = (): void => {
    setShowCancelModal(false);
    router.push('/(auth)/(professional)/sign-in');
  };

  const handleDocumentSelect = (documentType: DocumentType): void => {
    setSelectedDocument(documentType);
    // Automatically navigate to next step
    router.push('/(auth)/(professional)/verify-final-summary');
  };

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <VStack className="flex-1">
            {/* Header */}
            <HStack className="items-center justify-between px-4 pt-2 pb-6">
              <Pressable onPress={handleBack}>
                <ChevronLeft size={20} color="#30352D" />
              </Pressable>
              <Pressable onPress={handleClose}>
                <X size={20} color="#30352D" />
              </Pressable>
            </HStack>

            {/* Content */}
            <VStack className="flex-1">
              <Box className="px-6">
                {/* Title */}
                <Text className="text-[22px] font-worksans-bold mb-4" style={{ color: '#30352D' }}>
                  Upload a photo ID
                </Text>

                {/* Subtitle */}
                <Text className="text-[15px] font-worksans-medium leading-[20px] mb-1" style={{ color: '#30352D' }}>
                  We require a photo of a government ID to{'\n'}verify your identity.
                </Text>

                {/* Instructions */}
                <Text className="text-[14px] font-worksans-medium leading-[20px] mb-4" style={{ color: '#30352D' }}>
                  Choose 1 of the following options
                </Text>
              </Box>

              {/* Document Options */}
              <VStack>
                <DocumentTypeOption
                  icon={<CreditCard size={18} color="white" />}
                  label="Driver License"
                  selected={selectedDocument === 'driver_license'}
                  onPress={() => handleDocumentSelect('driver_license')}
                />
                
                <DocumentTypeOption
                  icon={<BookOpen size={18} color="white" />}
                  label="Passport"
                  selected={selectedDocument === 'passport'}
                  onPress={() => handleDocumentSelect('passport')}
                />
                
                <DocumentTypeOption
                  icon={<IdCard size={18} color="white" />}
                  label="National ID"
                  selected={selectedDocument === 'national_id'}
                  onPress={() => handleDocumentSelect('national_id')}
                />
                
                <DocumentTypeOption
                  icon={<FileText size={18} color="white" />}
                  label="Residency Permit"
                  selected={selectedDocument === 'residency_permit'}
                  onPress={() => handleDocumentSelect('residency_permit')}
                />
              </VStack>

              {/* Spacer */}
              <Box className="flex-1" />
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>

      {/* Cancel Verification Modal */}
      <CancelVerificationModal
        visible={showCancelModal}
        onResume={handleResume}
        onCancel={handleCancel}
      />
    </Box>
  );
}
