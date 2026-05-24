import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Receipt } from 'lucide-react-native';
import Header from '@/components/Header';
import { useQuery } from '@tanstack/react-query';
import { getClientPaymentHistory, type PaymentHistoryEntry } from '@shared/supabase/payments';
import { useAuthStore } from '@shared/store/auth';
import { goBackOrReplace } from '@/lib/navigation';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

const DEFAULT_CONTENT = {
  'header.title': 'Payment History',
  'loading.text': 'Loading payment history...',
  'empty.title': 'No payments yet',
  'empty.body': 'Your payment history will appear here after you complete a booking.',
  'errors.missing_booking': 'Booking not found',
  'status.authorized': 'Held',
  'status.captured': 'Paid',
  'status.pending': 'Pending',
  'status.cancelled': 'Cancelled',
  'status.refunded': 'Refunded',
  'status.failed': 'Failed',
} as const;

function StatusBadge({ status, label }: { status: string | null; label: string }) {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    authorized: { label, bg: '#FEF3C7', text: '#92400E' },
    captured: { label, bg: '#D1FAE5', text: '#065F46' },
    pending: { label, bg: '#E5E7EB', text: '#374151' },
    cancelled: { label, bg: '#FEE2E2', text: '#991B1B' },
    refunded: { label, bg: '#DBEAFE', text: '#1E40AF' },
    failed: { label, bg: '#FEE2E2', text: '#991B1B' },
  };
  const c = config[status || 'pending'] || config.pending!;
  return (
    <View className="px-2 py-1 rounded-full" style={{ backgroundColor: c.bg }}>
      <Text className="text-xs font-worksans-medium" style={{ color: c.text }}>
        {c.label}
      </Text>
    </View>
  );
}

function PaymentRow({
  entry,
  statusLabels,
}: {
  entry: PaymentHistoryEntry
  statusLabels: Record<string, string>
}) {
  const router = useRouter();
  const date = new Date(entry.scheduledDate);
  const formatted = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Pressable
      onPress={() => router.push(`/(client)/booking-details/${entry.bookingId}`)}
      className="flex-row items-center px-5 py-4 border-b border-gray-100"
    >
      <View className="flex-1">
        <Text className="text-sm font-worksans-semibold" style={{ color: '#30352D' }}>
          {entry.taskTitle}
        </Text>
        <Text className="text-xs font-worksans mt-1" style={{ color: '#6B7280' }}>
          {entry.taskerName} · {formatted}
        </Text>
      </View>
      <View className="items-end gap-1">
        <Text className="text-sm font-worksans-semibold" style={{ color: '#30352D' }}>
          £{(entry.amountCents / 100).toFixed(2)}
        </Text>
        <StatusBadge status={entry.paymentStatus} label={statusLabels[entry.paymentStatus || 'pending'] || statusLabels.pending} />
      </View>
    </Pressable>
  );
}

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const content = useAppContent('client_payment_history', DEFAULT_CONTENT);

  const { data: history, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['paymentHistory', user?.id],
    queryFn: () => user?.id ? getClientPaymentHistory(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  const statusLabels = {
    authorized: getAppContentValue(content, 'status.authorized', DEFAULT_CONTENT['status.authorized']),
    captured: getAppContentValue(content, 'status.captured', DEFAULT_CONTENT['status.captured']),
    pending: getAppContentValue(content, 'status.pending', DEFAULT_CONTENT['status.pending']),
    cancelled: getAppContentValue(content, 'status.cancelled', DEFAULT_CONTENT['status.cancelled']),
    refunded: getAppContentValue(content, 'status.refunded', DEFAULT_CONTENT['status.refunded']),
    failed: getAppContentValue(content, 'status.failed', DEFAULT_CONTENT['status.failed']),
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={getAppContentValue(content, 'header.title', DEFAULT_CONTENT['header.title'])} onBackPress={() => goBackOrReplace(router, '/(client)/profile/payments')} showBellIcon={false} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
          <Text className="text-sm font-worksans mt-4" style={{ color: '#6B7280' }}>
            {getAppContentValue(content, 'loading.text', DEFAULT_CONTENT['loading.text'])}
          </Text>
        </View>
      ) : !history || history.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Receipt size={48} color="#D1D5DB" strokeWidth={1.5} />
          <Text className="text-base font-worksans-semibold mt-4" style={{ color: '#30352D' }}>
            {getAppContentValue(content, 'empty.title', DEFAULT_CONTENT['empty.title'])}
          </Text>
          <Text className="text-sm font-worksans text-center mt-2" style={{ color: '#6B7280' }}>
            {getAppContentValue(content, 'empty.body', DEFAULT_CONTENT['empty.body'])}
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#C1856A" />}
        >
          {history.map((entry) => (
            <PaymentRow key={entry.id} entry={entry} statusLabels={statusLabels} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
