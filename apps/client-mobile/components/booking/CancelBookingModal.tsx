import React from 'react';
import { Text } from 'react-native';
import { X } from 'lucide-react-native';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui/modal';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { useCancelBooking } from '@shared/query/hooks/useBookings';
import { useToast } from '@/components/ui/toast';
import { router } from 'expo-router';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  taskTitle: string;
}

export function CancelBookingModal({
  isOpen,
  onClose,
  bookingId,
  taskTitle,
}: CancelBookingModalProps) {
  const { mutate: cancelBooking, isPending } = useCancelBooking();
  const toast = useToast();

  const handleCancel = () => {
    cancelBooking(bookingId, {
      onSuccess: (success) => {
        if (success) {
          toast.success('Booking Cancelled', 'Your booking has been cancelled successfully.');
          onClose();
          // Navigate back to tasks list after a short delay
          setTimeout(() => {
            router.back();
          }, 500);
        } else {
          toast.error('Failed to Cancel', 'Unable to cancel your booking. Please try again.');
        }
      },
      onError: (error) => {
        console.error('Error cancelling booking:', error);
        toast.error('Failed to Cancel', 'An error occurred while cancelling your booking.');
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
      <ModalContent style={{ backgroundColor: '#FFFFFF' }}>
        <ModalHeader>
          <Text className="text-lg font-worksans-semibold flex-1" style={{ color: '#30352D' }}>
            Cancel Booking
          </Text>
          <ModalCloseButton>
            <X size={24} color="#30352D" />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <Text className="text-base font-worksans mb-2" style={{ color: '#30352D' }}>
            Are you sure you want to cancel this booking?
          </Text>
          <Text className="text-sm font-worksans mb-4" style={{ color: '#6B7280' }}>
            {taskTitle}
          </Text>
          <Text className="text-sm font-worksans" style={{ color: '#6B7280' }}>
            This action cannot be undone. Any authorized payment will be released.
          </Text>
        </ModalBody>

        <ModalFooter className="gap-3">
          <Button
            onPress={onClose}
            className="flex-1 rounded-full border border-gray-300 items-center justify-center"
            style={{ backgroundColor: '#FFFFFF' }}
            isDisabled={isPending}
          >
            <ButtonText className="font-worksans-semibold text-base text-center" style={{ color: '#30352D' }}>
              Keep Booking
            </ButtonText>
          </Button>

          <Button
            onPress={handleCancel}
            className="flex-1 rounded-full items-center justify-center"
            style={{ backgroundColor: '#DC2626' }}
            isDisabled={isPending}
          >
            {isPending && <ButtonSpinner color="white" />}
            <ButtonText className="font-worksans-semibold text-base text-center" style={{ color: '#FFFFFF' }}>
              {isPending ? 'Cancelling...' : 'Cancel Booking'}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
