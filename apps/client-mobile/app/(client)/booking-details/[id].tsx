import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { useLocalSearchParams, router } from 'expo-router'; import {   ChevronLeft, Calendar, Clock, MapPin, AlertCircle, Info, Edit, Star, MessageCircle, CheckCircle2, } from 'lucide-react-native'; import type { BookingStatus } from '@shared/supabase/bookings'; import { subscribeToBookingUpdates, unsubscribeFromBookingUpdates } from '@shared/supabase/bookings'; import { bookingKeys, useBookingById } from '@shared/query/hooks/useBookings'; import { useHasReviewedBooking } from '@shared/query/hooks/useReviews'; import { useAuthStore } from '@shared/store/auth'; import { useExistingConversationByBooking } from '@shared/query';
import { useQueryClient } from '@tanstack/react-query';
import { BookingStatusBadge } from '@/components/booking/BookingStatusBadge';
import { HandymanCard } from '@/components/booking/HandymanCard';
import { PricingBreakdown } from '@/components/booking/PricingBreakdown';
import { NextStepsGuide } from '@/components/booking/NextStepsGuide';
import { CancelBookingModal } from '@/components/booking/CancelBookingModal';
import { Button, ButtonText } from '@/components/ui/button';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';

function StatusBanner({ status, taskerName }: { status: BookingStatus; taskerName?: string }) {
  if (status === 'pending') {
    return (
      <View className="bg-green-50 border-b border-green-200 px-5 py-4">
        <View className="flex-row gap-3">
          <View className="w-6 h-6 rounded-full bg-green-600 items-center justify-center">
            <Text className="text-white text-xs">✓</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-worksans-semibold mb-1" style={{ color: '#065F46' }}>
              Booking Confirmed!
            </Text>
            <Text className="text-sm font-worksans" style={{ color: '#047857' }}>
              Your payment has been authorized and your booking request has been sent to the
              handyman.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (status === 'accepted') {
    return (
      <View className="bg-blue-50 border-b border-blue-200 px-5 py-4">
        <View className="flex-row gap-3">
          <View className="w-6 h-6 rounded-full bg-blue-600 items-center justify-center">
            <Text className="text-white text-xs">✓</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-worksans-semibold mb-1" style={{ color: '#1E40AF' }}>
              Pro Accepted!
            </Text>
            <Text className="text-sm font-worksans" style={{ color: '#1D4ED8' }}>
              {taskerName || 'Your 100Handy Pro'} has accepted your booking and will arrive at the
              scheduled time.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (status === 'in_progress') {
    return (
      <View className="bg-blue-50 border-b border-blue-200 px-5 py-4">
        <View className="flex-row gap-3">
          <View className="w-6 h-6 rounded-full bg-blue-600 items-center justify-center">
            <Text className="text-white text-xs font-worksans-bold">⚡</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-worksans-semibold mb-1" style={{ color: '#1E40AF' }}>
              Task In Progress!
            </Text>
            <Text className="text-sm font-worksans" style={{ color: '#1D4ED8' }}>
              Your 100Handy Pro is currently working on your job.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (status === 'completed') {
    return (
      <View className="bg-green-50 border-b border-green-200 px-5 py-4">
        <View className="flex-row gap-3">
          <View className="w-6 h-6 rounded-full bg-green-600 items-center justify-center">
            <Text className="text-white text-xs">✓</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-worksans-semibold mb-1" style={{ color: '#065F46' }}>
              Task Complete!
            </Text>
            <Text className="text-sm font-worksans" style={{ color: '#047857' }}>
              Your task has been finished. Don&apos;t forget to leave a review!
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (status === 'cancelled') {
    return (
      <View className="bg-red-50 border-b border-red-200 px-5 py-4">
        <View className="flex-row gap-3">
          <View className="w-6 h-6 rounded-full bg-red-600 items-center justify-center">
            <Text className="text-white text-xs">✕</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-worksans-semibold mb-1" style={{ color: '#991B1B' }}>
              Booking Cancelled
            </Text>
            <Text className="text-sm font-worksans" style={{ color: '#DC2626' }}>
              Any authorized payment has been released.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return null;
}

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [showFeedbackFollowUp, setShowFeedbackFollowUp] = useState(false);

  const {
    data: booking,
    isLoading,
    isError,
    error,
  } = useBookingById(id || null);

  const queryClient = useQueryClient();
  const { data: conversation } = useExistingConversationByBooking(id || '');
  const { data: hasReviewed } = useHasReviewedBooking(id || '', 'customer');

  // Subscribe to real-time booking status updates
  useEffect(() => {
    if (!id) return;
    const channel = subscribeToBookingUpdates(id, () => {
      // Invalidate the booking query to refetch with fresh data
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    });
    return () => {
      unsubscribeFromBookingUpdates(channel);
    };
  }, [id, queryClient]);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Not scheduled';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string | undefined) => {
    if (!timeStr) return 'Not scheduled';
    const [hours, minutes] = timeStr.split(':');
    if (!hours || !minutes) return 'Not scheduled';
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleContactHandyman = () => {
    if (conversation?.id) {
      router.push({
        pathname: '/(client)/chat/conversation',
        params: { conversationId: conversation.id },
      });
    } else {
      router.push('/(client)/(tabs)/messages');
    }
  };

  const handleLeaveReview = () => {
    setShowFeedbackPrompt(false);
    setShowFeedbackFollowUp(false);
    if (id) {
      router.push(`/(client)/review/${id}`);
    }
  };

  const handleDismissFeedbackPrompt = () => {
    setShowFeedbackPrompt(false);
    setShowFeedbackFollowUp(false);
  };

  const handleFeedbackNo = () => {
    setShowFeedbackFollowUp(true);
  };

  const handleShareMoreFeedback = () => {
    handleDismissFeedbackPrompt();
    router.push('/(client)/profile/support');
  };

  const handleEditBooking = () => {
    if (id && booking) {
      router.push({
        pathname: '/(client)/edit-booking',
        params: { bookingId: id },
      });
    }
  };

  useEffect(() => {
    if (booking?.status === 'completed' && !hasReviewed) {
      setShowFeedbackPrompt(true);
      setShowFeedbackFollowUp(false);
    }
  }, [booking?.status, hasReviewed]);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
          <Text className="mt-4 text-base font-worksans" style={{ color: '#6B7280' }}>
            Loading booking details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (isError || !booking) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-5 py-4 flex-row items-center border-b border-gray-200 bg-white">
          <Pressable onPress={() => router.back()} className="mr-3">
            <ChevronLeft size={24} color="#30352D" />
          </Pressable>
          <Text className="text-lg font-worksans-semibold" style={{ color: '#30352D' }}>
            Booking Details
          </Text>
        </View>

        {/* Error content */}
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4">
            <AlertCircle size={32} color="#DC2626" />
          </View>
          <Text className="text-xl font-worksans-semibold mb-2 text-center" style={{ color: '#30352D' }}>
            {error?.message || 'Booking Not Found'}
          </Text>
          <Text className="text-base font-worksans text-center mb-6" style={{ color: '#6B7280' }}>
            We couldn&apos;t find the booking you&apos;re looking for.
          </Text>
          <Button
            onPress={() => router.back()}
            className="rounded-full"
            style={{ backgroundColor: '#C1856A' }}
          >
            <ButtonText className="font-worksans-semibold" style={{ color: 'white' }}>
              Go Back
            </ButtonText>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // Verify user owns the booking
  if (booking.customer_id !== user?.id) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-5 py-4 flex-row items-center border-b border-gray-200 bg-white">
          <Pressable onPress={() => router.back()} className="mr-3">
            <ChevronLeft size={24} color="#30352D" />
          </Pressable>
          <Text className="text-lg font-worksans-semibold" style={{ color: '#30352D' }}>
            Booking Details
          </Text>
        </View>

        {/* Permission denied */}
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4">
            <AlertCircle size={32} color="#DC2626" />
          </View>
          <Text className="text-xl font-worksans-semibold mb-2 text-center" style={{ color: '#30352D' }}>
            Access Denied
          </Text>
          <Text className="text-base font-worksans text-center mb-6" style={{ color: '#6B7280' }}>
            You do not have permission to view this booking.
          </Text>
          <Button
            onPress={() => router.back()}
            className="rounded-full"
            style={{ backgroundColor: '#C1856A' }}
          >
            <ButtonText className="font-worksans-semibold" style={{ color: 'white' }}>
              Go Back
            </ButtonText>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const taskerName = booking.handy_profile
    ? `${booking.handy_profile.first_name ?? ''} ${booking.handy_profile.last_name ?? ''}`.trim()
    : undefined;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-5 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="mr-3">
          <ChevronLeft size={24} color="#30352D" />
        </Pressable>
        <Text className="text-lg font-worksans-semibold flex-1" style={{ color: '#30352D' }}>
          Booking Details
        </Text>
      </View>

      {/* Status Banner */}
      <StatusBanner status={booking.status} taskerName={taskerName} />

      <ScrollView className="flex-1">
        <View className="px-5 py-6 gap-4">
          {/* Title and Status */}
          <View className="bg-white rounded-lg border border-gray-200 p-4">
            <Text className="text-xl font-worksans-bold mb-2" style={{ color: '#30352D' }}>
              {booking.task_title}
            </Text>
            <Text className="text-sm font-worksans mb-3" style={{ color: '#6B7280' }}>
              Booking #{booking.id}
            </Text>
            <View className="flex-row gap-2">
              <BookingStatusBadge status={booking.status} />
            </View>
          </View>

          {/* Handyman Info */}
          {booking.handy_id && (
            <HandymanCard
              name={taskerName || 'Assigned Handyman'}
              avatar={booking.handy_profile?.avatar_url}
              hourlyRateCents={booking.hourly_rate_cents}
              onContactPress={handleContactHandyman}
            />
          )}

          {/* Schedule */}
          <View className="bg-white rounded-lg border border-gray-200 p-4">
            <Text className="text-xs font-worksans-medium text-gray-500 mb-3">SCHEDULE</Text>
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <Calendar size={20} color="#9CA3AF" />
                <Text className="text-sm font-worksans" style={{ color: '#30352D' }}>
                  {formatDate(booking.scheduled_date)}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Clock size={20} color="#9CA3AF" />
                <Text className="text-sm font-worksans" style={{ color: '#30352D' }}>
                  {formatTime(booking.scheduled_time)}
                </Text>
              </View>
            </View>
          </View>

          {/* Location */}
          {booking.address && (
            <View className="bg-white rounded-lg border border-gray-200 p-4">
              <Text className="text-xs font-worksans-medium text-gray-500 mb-3">LOCATION</Text>
              <View className="flex-row gap-2">
                <MapPin size={20} color="#9CA3AF" className="mt-0.5" />
                <View className="flex-1">
                  <Text className="text-sm font-worksans mb-1" style={{ color: '#30352D' }}>
                    {booking.address.street}
                  </Text>
                  {booking.address.apartment && (
                    <Text className="text-sm font-worksans mb-1" style={{ color: '#30352D' }}>
                      {booking.address.apartment}
                    </Text>
                  )}
                  <Text className="text-sm font-worksans" style={{ color: '#30352D' }}>
                    {booking.address.city}, {booking.address.postcode}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Task Details */}
          {booking.task_details && (
            <View className="bg-white rounded-lg border border-gray-200 p-4">
              <Text className="text-xs font-worksans-medium text-gray-500 mb-3">
                TASK DETAILS
              </Text>
              <Text className="text-sm font-worksans" style={{ color: '#30352D' }}>
                {booking.task_details}
              </Text>
            </View>
          )}

          {/* Pricing */}
          <PricingBreakdown
            hourlyRateCents={booking.hourly_rate_cents}
            estimatedHours={booking.estimated_hours}
          />

          {/* Edit Booking - only for pending */}
          {booking.status === 'pending' && (
            <Button
              onPress={handleEditBooking}
              variant="outline"
              className="rounded-full border-gray-300"
            >
              <View className="flex-row items-center gap-2">
                <Edit size={18} color="#C1856A" />
                <ButtonText className="font-worksans-semibold" style={{ color: '#C1856A' }}>
                  Edit Booking
                </ButtonText>
              </View>
            </Button>
          )}

          {/* Action Buttons */}
          {(booking.status === 'accepted' || booking.status === 'in_progress') && (
            <Button
              onPress={handleContactHandyman}
              className="rounded-full"
              style={{ backgroundColor: '#C1856A' }}
            >
              <View className="flex-row items-center gap-2">
                <MessageCircle size={18} color="white" />
                <ButtonText className="font-worksans-semibold" style={{ color: 'white' }}>
                  Contact Pro
                </ButtonText>
              </View>
            </Button>
          )}

          {booking.status === 'completed' && !hasReviewed && (
            <Button
              onPress={handleLeaveReview}
              className="rounded-full"
              style={{ backgroundColor: '#C1856A' }}
            >
              <View className="flex-row items-center gap-2">
                <Star size={18} color="white" />
                <ButtonText className="font-worksans-semibold" style={{ color: 'white' }}>
                  Leave a Review
                </ButtonText>
              </View>
            </Button>
          )}

          {booking.status === 'completed' && hasReviewed && (
            <View className="bg-green-50 rounded-lg border border-green-200 p-4 flex-row items-center gap-3">
              <CheckCircle2 size={20} color="#059669" />
              <Text className="text-sm font-worksans-semibold flex-1" style={{ color: '#065F46' }}>
                You&apos;ve reviewed this booking
              </Text>
            </View>
          )}

          {/* Cancel Button */}
          {(booking.status === 'pending' || booking.status === 'accepted') && (
            <Button
              onPress={() => setShowCancelModal(true)}
              variant="outline"
              className="rounded-full border-red-300"
            >
              <ButtonText className="font-worksans-semibold" style={{ color: '#DC2626' }}>
                Cancel Booking
              </ButtonText>
            </Button>
          )}

          {/* Payment hold release warning */}
          {booking.status === 'cancelled' && booking.payment_hold_release_failed === true && (
            <View className="bg-amber-50 rounded-lg border border-amber-200 p-4 flex-row items-start gap-3">
              <AlertCircle size={20} color="#D97706" />
              <Text className="text-sm font-worksans flex-1" style={{ color: '#92400E' }}>
                Your card hold may take up to 7 days to be released automatically. Contact support if it persists.
              </Text>
            </View>
          )}

          {/* In-progress cancellation info */}
          {booking.status === 'in_progress' && (
            <View className="bg-blue-50 rounded-lg border border-blue-200 p-4 flex-row items-start gap-3">
              <Info size={20} color="#1D4ED8" />
              <Text className="text-sm font-worksans flex-1" style={{ color: '#1E40AF' }}>
                This booking is in progress and cannot be cancelled. Contact your 100Handy Pro if you need to discuss any changes.
              </Text>
            </View>
          )}

          {/* Next Steps */}
          <NextStepsGuide status={booking.status} />
        </View>
      </ScrollView>

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        bookingId={booking.id}
        taskTitle={booking.task_title}
        scheduledDate={booking.scheduled_date}
        scheduledTime={booking.scheduled_time}
        recurringSeriesId={booking.recurring_series_id}
      />

      <Modal isOpen={showFeedbackPrompt} onClose={handleDismissFeedbackPrompt}>
        <ModalBackdrop />
        <ModalContent className="bg-white">
          <ModalBody>
            <View className="px-5 py-6">
              <Text className="text-2xl font-worksans-bold text-[#30352D] mb-2">
                Leave in-app feedback?
              </Text>
              <Text className="text-base text-gray-600 mb-6">
                Your feedback helps us improve 100Handy and helps other clients choose the right pro.
              </Text>

              {!showFeedbackFollowUp ? (
                <>
                  <View className="flex-row gap-3">
                    <Pressable
                      onPress={handleLeaveReview}
                      className="flex-1 py-4 rounded-full items-center"
                      style={{ backgroundColor: '#C1856A' }}
                    >
                      <Text className="text-white font-worksans-semibold text-base">Yes</Text>
                    </Pressable>
                    <Pressable
                      onPress={handleFeedbackNo}
                      className="flex-1 py-4 rounded-full items-center border"
                      style={{ borderColor: '#D1D5DB' }}
                    >
                      <Text className="text-[#30352D] font-worksans-semibold text-base">No</Text>
                    </Pressable>
                  </View>
                  <Pressable onPress={handleDismissFeedbackPrompt} className="mt-4 items-center">
                    <Text className="text-sm text-gray-500">Maybe later</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text className="text-sm text-gray-600 mb-5">
                    Would you like to tell us more about your experience instead?
                  </Text>
                  <Pressable
                    onPress={handleShareMoreFeedback}
                    className="w-full py-4 rounded-full items-center"
                    style={{ backgroundColor: '#30352D' }}
                  >
                    <Text className="text-white font-worksans-semibold text-base">Tell us more</Text>
                  </Pressable>
                  <Pressable onPress={handleDismissFeedbackPrompt} className="mt-4 items-center">
                    <Text className="text-sm text-gray-500">Close</Text>
                  </Pressable>
                </>
              )}
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
