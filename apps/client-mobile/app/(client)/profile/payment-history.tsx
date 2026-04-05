import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Receipt } from 'lucide-react-native';
import Header from '@/components/Header';
import { useQuery } from '@tanstack/react-query';
import { getClientPaymentHistory, type PaymentHistoryEntry } from '@shared/supabase/payments';
import { useAuthStore } from '@shared/store/auth';

function StatusBadge({ status }: { status: string | null }) {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    authorized: { label: 'Held', bg: '#FEF3C7', text: '#92400E' },
    captured: { label: 'Paid', bg: '#D1FAE5', text: '#065F46' },
    pending: { label: 'Pending', bg: '#E5E7EB', text: '#374151' },
    cancelled: { label: 'Cancelled', bg: '#FEE2E2', text: '#991B1B' },
    refunded: { label: 'Refunded', bg: '#DBEAFE', text: '#1E40AF' },
    failed: { label: 'Failed', bg: '#FEE2E2', text: '#991B1B' },
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

function PaymentRow({ entry }: { entry: PaymentHistoryEntry }) {
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
        <StatusBadge status={entry.paymentStatus} />
      </View>
    </Pressable>
  );
}

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: history, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['paymentHistory', user?.id],
    queryFn: () => user?.id ? getClientPaymentHistory(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Payment History" onBackPress={() => router.back()} showBellIcon={false} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
        </View>
      ) : !history || history.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Receipt size={48} color="#D1D5DB" strokeWidth={1.5} />
          <Text className="text-base font-worksans-semibold mt-4" style={{ color: '#30352D' }}>
            No payments yet
          </Text>
          <Text className="text-sm font-worksans text-center mt-2" style={{ color: '#6B7280' }}>
            Your payment history will appear here after you complete a booking.
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#C1856A" />}
        >
          {history.map((entry) => (
            <PaymentRow key={entry.id} entry={entry} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
