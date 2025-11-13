import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';

interface CancelVerificationModalProps {
  visible: boolean;
  onResume: () => void;
  onCancel: () => void;
}

export const CancelVerificationModal: React.FC<CancelVerificationModalProps> = ({
  visible,
  onResume,
  onCancel,
}) => {
  return (
    <Modal isOpen={visible} onClose={onResume}>
      <ModalBackdrop />
      <ModalContent>
        <ModalBody className="pb-6">
          <View className="w-full px-6 pt-4 flex-col">
            {/* Title */}
            <Text className="text-[20px] font-worksans-bold text-center mb-3" style={{ color: '#30352D' }}>
              Cancel Verification
            </Text>

            {/* Message */}
            <Text className="text-[15px] font-worksans-medium text-center leading-[20px] mb-6" style={{ color: '#30352D' }}>
              Are you sure you want to cancel?
            </Text>

            {/* Buttons */}
            <View className="gap-3 w-full flex-row">
              <Pressable
                className="flex-1 rounded-full py-3 border-2"
                style={{ borderColor: '#C1856A' }}
                onPress={onResume}
              >
                <Text className="text-center text-[16px] font-worksans-bold" style={{ color: '#C1856A' }}>
                  Resume
                </Text>
              </Pressable>

              <Button
                className="flex-1 rounded-full py-3"
                style={{ backgroundColor: '#C1856A' }}
                onPress={onCancel}
              >
                <ButtonText className="text-[16px] font-worksans-bold">
                  Cancel
                </ButtonText>
              </Button>
            </View>
          </View>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
