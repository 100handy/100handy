import React, { useMemo } from 'react';
import { Text, View } from 'react-native'; import { X, AlertTriangle } from 'lucide-react-native'; import {   Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, } from '@/components/ui/modal'; import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button'; import { useCancelBooking, bookingKeys } from '@shared/query/hooks/useBookings'; import { cancelRecurringSeries } from '@shared/supabase';
import { useToast } from '@/components/ui/toast'; import { useAuthStore } from '@shared/store';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  taskTitle: string;
  scheduledDate?: string;
  scheduledTime?: string;
  recurringSeriesId?: string | null;
}

export function CancelBookingModal({
  isOpen,
  onClose,
  bookingId,
  taskTitle,
  scheduledDate,
  scheduledTime,
  recurringSeriesId,
}: CancelBookingModalProps) {
  const { mutate: cancelBooking, isPending } = useCancelBooking();
  const toast = useToast();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [isCancellingSeries, setIsCancellingSeries] = React.useState(false);

  const isWithin24Hours = useMemo(() => {
    if (!scheduledDate || !scheduledTime) return false;
    const scheduled = new Date(`${scheduledDate}T${scheduledTime}`);
    const now = new Date();
    const hoursUntil = (scheduled.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntil > 0 && hoursUntil < 24;
  }, [scheduledDate, scheduledTime]);

  const handleCancelSingle = () => {
    if (!user?.id) return;
    cancelBooking(
      { bookingId, customerId: user.id },
      {
        onSuccess: (result) => {
          if (result.success) {
            if (result.cancellationFeeCharged) {
              toast.success('Booking Cancelled', 'A one-hour cancellation fee has been charged as the booking was within 24 hours of the scheduled start time.');
            } else {
              toast.success('Booking Cancelled', 'Your booking has been cancelled successfully.');
            }
            onClose();
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
      }
    );
  };

  const handleCancelSeries = async () => {
    if (!recurringSeriesId || !user?.id) return;
    setIsCancellingSeries(true);
    try {
      const success = await cancelRecurringSeries(recurringSeriesId, user.id);
      if (success) {
        queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
        queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
        toast.success('Series Cancelled', 'All future bookings in this series have been cancelled.');
        onClose();
        setTimeout(() => {
          router.back();
        }, 500);
      } else {
        toast.error('Failed to Cancel', 'Unable to cancel the series. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling series:', error);
      toast.error('Failed to Cancel', 'An error occurred while cancelling the series.');
    } finally {
      setIsCancellingSeries(false);
    }
  };

  const isProcessing = isPending || isCancellingSeries;

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

          {isWithin24Hours && (
            <View className="flex-row items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <AlertTriangle size={18} color="#D97706" />
              <Text className="flex-1 text-sm font-worksans" style={{ color: '#92400E' }}>
                This booking is less than 24 hours away. A cancellation fee of one hour may apply.
              </Text>
            </View>
          )}

          <Text className="text-sm font-worksans" style={{ color: '#6B7280' }}>
            This action cannot be undone.
          </Text>
        </ModalBody>

        <ModalFooter className="flex-col gap-3">
          <Button
            onPress={handleCancelSingle}
            className="w-full rounded-full items-center justify-center"
            style={{ backgroundColor: '#DC2626' }}
            isDisabled={isProcessing}
          >
            {isPending && <ButtonSpinner color="white" />}
            <ButtonText className="font-worksans-semibold text-base text-center" style={{ color: '#FFFFFF' }}>
              {isPending ? 'Cancelling...' : recurringSeriesId ? 'Cancel This Booking' : 'Cancel Booking'}
            </ButtonText>
          </Button>

          {recurringSeriesId && (
            <Button
              onPress={handleCancelSeries}
              className="w-full rounded-full items-center justify-center border border-red-300"
              style={{ backgroundColor: '#FFFFFF' }}
              isDisabled={isProcessing}
            >
              {isCancellingSeries && <ButtonSpinner color="#DC2626" />}
              <ButtonText className="font-worksans-semibold text-base text-center" style={{ color: '#DC2626' }}>
                {isCancellingSeries ? 'Cancelling...' : 'Cancel Entire Series'}
              </ButtonText>
            </Button>
          )}

          <Button
            onPress={onClose}
            className="w-full rounded-full border border-gray-300 items-center justify-center"
            style={{ backgroundColor: '#FFFFFF' }}
            isDisabled={isProcessing}
          >
            <ButtonText className="font-worksans-semibold text-base text-center" style={{ color: '#30352D' }}>
              Keep Booking
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
