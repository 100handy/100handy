import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';
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
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-col flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pt-2 pb-6">
              <Pressable onPress={handleBack}>
                <ChevronLeft size={20} color="#30352D" />
              </Pressable>
              <Pressable onPress={handleClose}>
                <X size={20} color="#30352D" />
              </Pressable>
            </View>

            {/* Content */}
            <View className="flex-col flex-1">
              <View className="px-6">
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
              </View>

              {/* Document Options */}
              <View className="flex-col">
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
              </View>

              {/* Spacer */}
              <View className="flex-1" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Cancel Verification Modal */}
      <CancelVerificationModal
        visible={showCancelModal}
        onResume={handleResume}
        onCancel={handleCancel}
      />
    </View>
  );
}
