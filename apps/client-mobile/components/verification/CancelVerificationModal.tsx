import React from 'react';
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent } from '@/components/ui/actionsheet';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';

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
    <Actionsheet isOpen={visible} onClose={onResume}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="pb-6">
        <VStack className="w-full px-6 pt-4">
          {/* Title */}
          <Text className="text-[20px] font-worksans-bold text-center mb-3" style={{ color: '#30352D' }}>
            Cancel Verification
          </Text>

          {/* Message */}
          <Text className="text-[15px] font-worksans-medium text-center leading-[20px] mb-6" style={{ color: '#30352D' }}>
            Are you sure you want to cancel?
          </Text>

          {/* Buttons */}
          <HStack className="gap-3 w-full">
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
          </HStack>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};
