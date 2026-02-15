import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  User,
  DollarSign,
  FileText,
  CheckCircle2,
  XCircle,
  Play,
  Flag,
  Star,
} from 'lucide-react-native';
import { toast } from 'sonner-native';
import {
  useBookingById,
  useAcceptBooking,
  useDeclineBooking,
  useStartBooking,
  useCompleteBooking,
  useHasReviewedBooking,
  useRetryPayment,
} from '@shared/supabase';
import { getBookingPaymentDetails } from '@shared/supabase/payments';

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-start py-3 border-b border-[#F0F0F0]">
      <View className="w-8">{icon}</View>
      <View className="flex-1">
        <Text className="font-worksans text-[12px] text-[#6B6B6B] mb-1">
          {label}
        </Text>
        <Text className="font-worksans-medium text-[15px] text-[#30352D]">
          {value}
        </Text>
      </View>
    </View>
  );
}

function ActionButton({
  onPress,
  label,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
}: {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  const bgColor = {
    primary: 'bg-[#B8926A]',
    secondary: 'bg-white border border-[#B8926A]',
    danger: 'bg-white border border-[#D32F2F]',
  }[variant];

  const textColor = {
    primary: 'text-white',
    secondary: 'text-[#B8926A]',
    danger: 'text-[#D32F2F]',
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      className={`flex-1 py-4 rounded-xl items-center justify-center flex-row ${bgColor} ${
        disabled || loading ? 'opacity-50' : ''
      }`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#B8926A'} />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`font-worksans-bold text-[16px] ${textColor}`}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { data: booking, isLoading, error, refetch } = useBookingById(id || null);
  const { data: hasReviewed } = useHasReviewedBooking(id || '', 'handy');
  const acceptMutation = useAcceptBooking();
  const declineMutation = useDeclineBooking();
  const startMutation = useStartBooking();
  const completeMutation = useCompleteBooking();
  const retryPaymentMutation = useRetryPayment();
  const [paymentDetails, setPaymentDetails] = useState<{
    payoutStatus: string | null;
    paymentIntentId: string | null;
  }>({ payoutStatus: null, paymentIntentId: null });

  // Fetch payment details for completed bookings
  React.useEffect(() => {
    if (booking?.status === 'completed' && id) {
      getBookingPaymentDetails(id).then((details) => {
        if (details) {
          setPaymentDetails({
            payoutStatus: details.payoutStatus,
            paymentIntentId: details.paymentIntentId,
          });
        }
      });
    }
  }, [booking?.status, id]);

  const handleRetryPayment = async () => {
    if (!id || !paymentDetails.paymentIntentId) return;
    setActionLoading('retry');
    try {
      const result = await retryPaymentMutation.mutateAsync({
        bookingId: id,
        paymentIntentId: paymentDetails.paymentIntentId,
      });
      if (result.success && result.payoutResult) {
        toast.success('Payment processed successfully!');
        setPaymentDetails((prev) => ({ ...prev, payoutStatus: 'transferred' }));
        refetch();
      } else {
        toast.error(result.error || 'Payment retry failed. Please try again later.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeaveReview = () => {
    router.push(`/(professional)/review/${id}`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleAccept = async () => {
    if (!id) return;
    setActionLoading('accept');
    try {
      const success = await acceptMutation.mutateAsync(id);
      if (success) {
        toast.success('Job accepted!');
        router.back();
      } else {
        toast.error('Failed to accept job');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = () => {
    Alert.alert(
      'Decline Job Request',
      'Are you sure you want to decline this job? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            setActionLoading('decline');
            try {
              const success = await declineMutation.mutateAsync({
                bookingId: id,
                reason: 'Declined by professional',
              });
              if (success) {
                toast.success('Job declined');
                router.back();
              } else {
                toast.error('Failed to decline job');
              }
            } catch (error) {
              toast.error('Something went wrong');
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleStart = async () => {
    if (!id) return;
    setActionLoading('start');
    try {
      const success = await startMutation.mutateAsync(id);
      if (success) {
        toast.success('Job started!');
      } else {
        toast.error('Failed to start job');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = () => {
    Alert.alert(
      'Complete Job',
      'Are you sure this job is complete? The client will be charged and you will receive payment.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            if (!id) return;
            setActionLoading('complete');
            try {
              const result = await completeMutation.mutateAsync({
                bookingId: id,
                processPayment: true,
              });
              if (result.success) {
                if (result.paymentProcessed) {
                  toast.success('Job completed! Payment processed successfully.');
                  router.back();
                } else if (result.payoutFailed || result.error) {
                  toast.success('Job completed!');
                  toast.warning('Payment processing failed. You can retry from this screen.');
                  setPaymentDetails((prev) => ({
                    ...prev,
                    payoutStatus: 'failed',
                  }));
                } else {
                  toast.success('Job completed!');
                  router.back();
                }
              } else {
                toast.error(result.error || 'Failed to complete job');
              }
            } catch (error) {
              toast.error('Something went wrong');
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleOpenMaps = () => {
    if (!booking?.address) return;
    const address = `${booking.address.street}, ${booking.address.postcode}`;
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://maps.apple.com/?q=${encodedAddress}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5] items-center justify-center">
        <ActivityIndicator size="large" color="#B8926A" />
        <Text className="font-worksans text-[14px] text-[#6B6B6B] mt-4">
          Loading job details...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !booking) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5]">
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-[#F0F0F0]">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft color="#30352D" size={24} />
          </Pressable>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <XCircle color="#D32F2F" size={48} strokeWidth={1.5} />
          <Text className="font-worksans-bold text-[18px] text-[#30352D] mt-4 text-center">
            Job not found
          </Text>
          <Text className="font-worksans text-[14px] text-[#6B6B6B] mt-2 text-center">
            This job may have been cancelled or doesn't exist.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const estimatedEarnings = ((booking.hourly_rate_cents || 0) * (booking.estimated_hours || 0)) / 100;
  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending Approval', color: '#B8926A' },
    accepted: { label: 'Accepted', color: '#2E7D32' },
    in_progress: { label: 'In Progress', color: '#1565C0' },
    completed: { label: 'Completed', color: '#6B6B6B' },
    cancelled: { label: 'Cancelled', color: '#D32F2F' },
  };

  const status = statusLabels[booking.status] || statusLabels.pending;

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-[#F0F0F0]">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft color="#30352D" size={24} />
        </Pressable>
        <Text className="font-worksans-bold text-[18px] text-[#30352D] ml-2 flex-1">
          Job Details
        </Text>
        {/* Status Badge */}
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: `${status.color}20` }}
        >
          <Text
            className="font-worksans-medium text-[12px]"
            style={{ color: status.color }}
          >
            {status.label}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Task Info Card */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-2xl">
          <Text className="font-worksans-bold text-[20px] text-[#30352D] mb-1">
            {booking.task_title}
          </Text>
          {booking.category && (
            <Text className="font-worksans text-[14px] text-[#6B6B6B]">
              {booking.category.name}
            </Text>
          )}
        </View>

        {/* Details Card */}
        <View className="bg-white mx-4 mt-3 p-4 rounded-2xl">
          <Text className="font-worksans-bold text-[16px] text-[#30352D] mb-2">
            Job Details
          </Text>

          <InfoRow
            icon={<Calendar color="#B8926A" size={18} strokeWidth={1.5} />}
            label="Date"
            value={formatDate(booking.scheduled_date)}
          />

          <InfoRow
            icon={<Clock color="#B8926A" size={18} strokeWidth={1.5} />}
            label="Time"
            value={formatTime(booking.scheduled_time)}
          />

          <Pressable onPress={handleOpenMaps}>
            <InfoRow
              icon={<MapPin color="#B8926A" size={18} strokeWidth={1.5} />}
              label="Location"
              value={
                booking.address
                  ? `${booking.address.street}${
                      booking.address.apartment ? `, ${booking.address.apartment}` : ''
                    }\n${booking.address.postcode}${
                      booking.address.city ? `, ${booking.address.city}` : ''
                    }`
                  : 'No address provided'
              }
            />
          </Pressable>

          <InfoRow
            icon={<DollarSign color="#B8926A" size={18} strokeWidth={1.5} />}
            label="Estimated Earnings"
            value={`£${estimatedEarnings.toFixed(2)} (${booking.estimated_hours}h at £${(
              booking.hourly_rate_cents / 100
            ).toFixed(0)}/hr)`}
          />
        </View>

        {/* Task Description Card */}
        {booking.task_details && (
          <View className="bg-white mx-4 mt-3 p-4 rounded-2xl">
            <View className="flex-row items-center mb-3">
              <FileText color="#B8926A" size={18} strokeWidth={1.5} />
              <Text className="font-worksans-bold text-[16px] text-[#30352D] ml-2">
                Task Description
              </Text>
            </View>
            <Text className="font-worksans text-[14px] text-[#30352D] leading-5">
              {booking.task_details}
            </Text>
          </View>
        )}

        {/* Customer Card */}
        <View className="bg-white mx-4 mt-3 mb-6 p-4 rounded-2xl">
          <View className="flex-row items-center mb-3">
            <User color="#B8926A" size={18} strokeWidth={1.5} />
            <Text className="font-worksans-bold text-[16px] text-[#30352D] ml-2">
              Customer
            </Text>
          </View>

          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-[#F5F5F5] items-center justify-center">
              <Text className="font-worksans-bold text-[18px] text-[#6B6B6B]">
                C
              </Text>
            </View>
            <View className="flex-1 ml-3">
              <Text className="font-worksans-medium text-[15px] text-[#30352D]">
                Customer
              </Text>
              <Text className="font-worksans text-[13px] text-[#6B6B6B]">
                Contact available after accepting
              </Text>
            </View>
          </View>

          {/* Contact buttons - only show for accepted/in_progress */}
          {(booking.status === 'accepted' || booking.status === 'in_progress') && (
            <View className="flex-row gap-3 mt-4">
              <Pressable
                className="flex-1 flex-row items-center justify-center py-3 bg-[#F5F5F5] rounded-xl"
                onPress={() => {
                  // TODO: Navigate to chat
                  toast.info('Chat feature coming soon');
                }}
              >
                <MessageCircle color="#30352D" size={18} strokeWidth={1.5} />
                <Text className="font-worksans-medium text-[14px] text-[#30352D] ml-2">
                  Message
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 flex-row items-center justify-center py-3 bg-[#F5F5F5] rounded-xl"
                onPress={() => {
                  // TODO: Phone call
                  toast.info('Phone feature coming soon');
                }}
              >
                <Phone color="#30352D" size={18} strokeWidth={1.5} />
                <Text className="font-worksans-medium text-[14px] text-[#30352D] ml-2">
                  Call
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {booking.status !== 'cancelled' && (
        <View className="bg-white px-4 py-4 border-t border-[#F0F0F0]">
          {booking.status === 'pending' && (
            <View className="flex-row gap-3">
              <ActionButton
                onPress={handleDecline}
                label="Decline"
                variant="danger"
                loading={actionLoading === 'decline'}
                icon={<XCircle color="#D32F2F" size={18} />}
              />
              <ActionButton
                onPress={handleAccept}
                label="Accept Job"
                variant="primary"
                loading={actionLoading === 'accept'}
                icon={<CheckCircle2 color="#fff" size={18} />}
              />
            </View>
          )}

          {booking.status === 'accepted' && (
            <ActionButton
              onPress={handleStart}
              label="Start Job"
              variant="primary"
              loading={actionLoading === 'start'}
              icon={<Play color="#fff" size={18} />}
            />
          )}

          {booking.status === 'in_progress' && (
            <ActionButton
              onPress={handleComplete}
              label="Complete Job"
              variant="primary"
              loading={actionLoading === 'complete'}
              icon={<Flag color="#fff" size={18} />}
            />
          )}

          {booking.status === 'completed' && paymentDetails.payoutStatus === 'failed' && (
            <View className="mb-3">
              <View className="bg-[#FFF3CD] px-4 py-3 rounded-xl mb-3 flex-row items-center">
                <DollarSign color="#856404" size={18} strokeWidth={1.5} />
                <Text className="font-worksans text-[13px] text-[#856404] ml-2 flex-1">
                  Payment to you failed. Tap below to retry.
                </Text>
              </View>
              <ActionButton
                onPress={handleRetryPayment}
                label="Retry Payment"
                variant="primary"
                loading={actionLoading === 'retry'}
                icon={<DollarSign color="#fff" size={18} />}
              />
            </View>
          )}

          {booking.status === 'completed' && !hasReviewed && (
            <ActionButton
              onPress={handleLeaveReview}
              label="Rate Client"
              variant="secondary"
              icon={<Star color="#B8926A" size={18} />}
            />
          )}

          {booking.status === 'completed' && hasReviewed && (
            <View className="flex-row items-center justify-center py-2">
              <Star color="#B8926A" size={18} fill="#B8926A" />
              <Text className="font-worksans text-[14px] text-[#6B6B6B] ml-2">
                You've rated this client
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
