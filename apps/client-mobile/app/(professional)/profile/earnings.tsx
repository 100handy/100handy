import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, Modal, FlatList, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Download, ChevronDown, ChevronLeft, ChevronRight, Info, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useToast } from '@/components/ui/toast';
import { useFocusEffect } from '@react-navigation/native';
import {
  getProfessionalEarnings,
  getProfessionalInvoices,
  getProfessionalPayouts,
  getEarningsMonths,
  useAuthStore,
  type EarningsSummary,
  type Invoice,
  type Payout,
} from '@shared/supabase';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function formatCurrency(cents: number): string {
  return `£${(cents / 100).toFixed(2)}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function EarningsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payouts'>('invoices');
  const [refreshing, setRefreshing] = useState(false);

  // Date selection
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [availableMonths, setAvailableMonths] = useState<{ year: number; month: number }[]>([]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Data states
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const [earningsData, invoicesData, payoutsData, monthsData] = await Promise.all([
        getProfessionalEarnings(user.id, selectedYear, selectedMonth),
        getProfessionalInvoices(user.id, selectedYear, selectedMonth),
        getProfessionalPayouts(user.id, selectedYear, selectedMonth),
        getEarningsMonths(user.id),
      ]);

      setSummary(earningsData);
      setInvoices(invoicesData);
      setPayouts(payoutsData);
      setAvailableMonths(monthsData);
    } catch (error) {
      console.error('Error loading earnings data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, selectedYear, selectedMonth]);

  // Reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSelectMonth = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setShowMonthPicker(false);
  };

  const openPayoutInfo = () => {
    router.push('/(professional)/profile/payout-info');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(professional)/(tabs)/profile');
  };

  const selectedMonthLabel = `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;
  const selectedMonthIndex = availableMonths.findIndex(
    (item) => item.year === selectedYear && item.month === selectedMonth,
  );
  const previousMonth = selectedMonthIndex >= 0 ? availableMonths[selectedMonthIndex + 1] : null;
  const nextMonth = selectedMonthIndex > 0 ? availableMonths[selectedMonthIndex - 1] : null;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white px-5 py-4 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Pressable onPress={handleBack} className="mr-3">
                <ArrowLeft size={24} color="#30352d" />
              </Pressable>
              <Text className="text-[#30352d] text-[18px] font-bold">
                Earnings
              </Text>
            </View>
            <Pressable onPress={() => toast.info('Coming soon', 'Export will be available in a future update')}>
              <Download size={24} color="#30352d" />
            </Pressable>
          </View>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#C1856A" />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C1856A" />
            }
          >
            {/* Month Selector */}
            <View className="px-5 pt-4">
              <View className="flex-row items-center gap-3">
                <Pressable
                  onPress={() => previousMonth && handleSelectMonth(previousMonth.year, previousMonth.month)}
                  disabled={!previousMonth}
                  className={`w-11 h-11 rounded-full items-center justify-center border ${
                    previousMonth ? 'border-[#D9D4CE] bg-white' : 'border-[#ECECEC] bg-[#F7F7F7]'
                  }`}
                >
                  <ChevronLeft size={20} color={previousMonth ? '#30352d' : '#C7C7C7'} />
                </Pressable>

                <Pressable
                  className="bg-brand-taupe rounded-xl px-4 py-3 flex-1"
                  onPress={() => setShowMonthPicker(true)}
                >
                  <View className="flex-row items-center justify-between gap-3">
                    <View>
                      <Text className="text-white text-[11px] font-medium opacity-80">
                        Select month
                      </Text>
                      <Text className="text-white text-[16px] font-bold mt-0.5">
                        {selectedMonthLabel}
                      </Text>
                    </View>
                    <ChevronDown size={18} color="white" />
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => nextMonth && handleSelectMonth(nextMonth.year, nextMonth.month)}
                  disabled={!nextMonth}
                  className={`w-11 h-11 rounded-full items-center justify-center border ${
                    nextMonth ? 'border-[#D9D4CE] bg-white' : 'border-[#ECECEC] bg-[#F7F7F7]'
                  }`}
                >
                  <ChevronRight size={20} color={nextMonth ? '#30352d' : '#C7C7C7'} />
                </Pressable>
              </View>
            </View>

            {/* Stats Grid */}
            <View className="px-5 pt-6 pb-4">
              <View className="flex-col gap-4">
                {/* Row 1 */}
                <View className="flex-row gap-4">
                  {/* Total earned */}
                  <View className="flex-1 bg-[#F5F5F5] rounded-lg p-4">
                    <View className="flex-col gap-1">
                      <Text className="text-[#30352d] text-[12px] font-medium">
                        Total earned
                      </Text>
                      <Text className="text-[#30352d] text-[26px] font-bold">
                        {formatCurrency(summary?.totalEarned || 0)}
                      </Text>
                    </View>
                  </View>

                  {/* Sent to bank */}
                  <View className="flex-1 bg-[#F5F5F5] rounded-lg p-4">
                    <View className="flex-col gap-1">
                      <Text className="text-[#30352d] text-[12px] font-medium">
                        Sent to bank
                      </Text>
                      <Text className="text-[#30352d] text-[26px] font-bold">
                        {formatCurrency(summary?.sentToBank || 0)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Row 2 */}
                <View className="flex-row gap-4">
                  {/* Task count */}
                  <View className="flex-1 bg-[#F5F5F5] rounded-lg p-4">
                    <View className="flex-col gap-1">
                      <Text className="text-[#30352d] text-[12px] font-medium">
                        Task count
                      </Text>
                      <Text className="text-[#30352d] text-[26px] font-bold">
                        {summary?.taskCount || 0}
                      </Text>
                    </View>
                  </View>

                  {/* Hours invoiced */}
                  <View className="flex-1 bg-[#F5F5F5] rounded-lg p-4">
                    <View className="flex-col gap-1">
                      <Text className="text-[#30352d] text-[12px] font-medium">
                        Hours invoiced
                      </Text>
                      <Text className="text-[#30352d] text-[26px] font-bold">
                        {summary?.hoursInvoiced || 0}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Tabs */}
            <View className="px-5 pt-4">
              <View className="flex-row gap-4 border-b border-gray-200">
                <Pressable
                  onPress={() => setActiveTab('invoices')}
                  className={`pb-3 ${activeTab === 'invoices' ? 'border-b-2 border-[#30352d]' : ''}`}
                >
                  <Text
                    className={`text-[12px] font-bold ${
                      activeTab === 'invoices' ? 'text-[#30352d]' : 'text-gray-400'
                    }`}
                  >
                    Invoices ({invoices.length})
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab('payouts')}
                  className={`pb-3 ${activeTab === 'payouts' ? 'border-b-2 border-[#30352d]' : ''}`}
                >
                  <Text
                    className={`text-[12px] font-bold ${
                      activeTab === 'payouts' ? 'text-[#30352d]' : 'text-gray-400'
                    }`}
                  >
                    Payouts ({payouts.length})
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Content */}
            <View className="px-5 pt-6 pb-8">
              {activeTab === 'invoices' && (
                invoices.length === 0 ? (
                  <View className="flex-col gap-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-[#333a31] text-[12px] font-medium flex-1">
                        No completed tasks this month.
                      </Text>
                      <Pressable className="ml-2" onPress={openPayoutInfo}>
                        <Info size={20} color="#333a31" />
                      </Pressable>
                    </View>
                    <Pressable className="self-end" onPress={openPayoutInfo}>
                      <Text className="text-[#c1856a] text-[10px] font-medium">
                        More info
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <View className="flex-col gap-3">
                    {invoices.map((invoice) => (
                      <View
                        key={invoice.id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <View className="flex-row justify-between items-start mb-2">
                          <Text className="text-[#30352d] text-[14px] font-bold flex-1 mr-2">
                            {invoice.taskTitle}
                          </Text>
                          <Text className="text-[#30352d] text-[16px] font-bold">
                            {formatCurrency(invoice.amount)}
                          </Text>
                        </View>
                        <View className="flex-row justify-between items-center">
                          <View>
                            <Text className="text-gray-500 text-[12px]">
                              {invoice.customerName}
                            </Text>
                            <Text className="text-gray-400 text-[11px]">
                              {formatDate(invoice.scheduledDate)} • {invoice.hours}h
                            </Text>
                          </View>
                          <View
                            className={`px-2 py-1 rounded ${
                              invoice.status === 'paid'
                                ? 'bg-green-100'
                                : invoice.status === 'cancelled'
                                  ? 'bg-red-100'
                                  : 'bg-yellow-100'
                            }`}
                          >
                            <Text
                              className={`text-[10px] font-medium ${
                                invoice.status === 'paid'
                                  ? 'text-green-700'
                                  : invoice.status === 'cancelled'
                                    ? 'text-red-700'
                                    : 'text-yellow-700'
                              }`}
                            >
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )
              )}

              {activeTab === 'payouts' && (
                payouts.length === 0 ? (
                  <View className="flex-col gap-4">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-[#333a31] text-[12px] font-medium flex-1">
                        No payouts this month.
                      </Text>
                      <Pressable className="ml-2" onPress={openPayoutInfo}>
                        <Info size={20} color="#333a31" />
                      </Pressable>
                    </View>
                    <Pressable className="self-end" onPress={openPayoutInfo}>
                      <Text className="text-[#c1856a] text-[10px] font-medium">
                        More info
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <View className="flex-col gap-3">
                    {payouts.map((payout) => (
                      <View
                        key={payout.id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <View className="flex-row justify-between items-center">
                          <View>
                            <Text className="text-[#30352d] text-[14px] font-bold">
                              {formatCurrency(payout.amount)}
                            </Text>
                            <Text className="text-gray-400 text-[11px]">
                              {payout.paidAt ? formatDate(payout.paidAt) : 'Pending'}
                            </Text>
                          </View>
                          <View
                            className={`px-2 py-1 rounded ${
                              payout.status === 'paid'
                                ? 'bg-green-100'
                                : payout.status === 'failed'
                                  ? 'bg-red-100'
                                  : 'bg-yellow-100'
                            }`}
                          >
                            <Text
                              className={`text-[10px] font-medium ${
                                payout.status === 'paid'
                                  ? 'text-green-700'
                                  : payout.status === 'failed'
                                    ? 'text-red-700'
                                    : 'text-yellow-700'
                              }`}
                            >
                              {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )
              )}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowMonthPicker(false)}>
          <View className="flex-1 bg-black/50 justify-end">
            <TouchableWithoutFeedback onPress={() => {}}>
              <View className="bg-white rounded-t-3xl max-h-[72%]">
                <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
                  <Text className="text-[18px] font-bold text-[#30352d]">
                    Select Month
                  </Text>
                  <Pressable onPress={() => setShowMonthPicker(false)}>
                    <X size={24} color="#30352d" />
                  </Pressable>
                </View>
                <FlatList
                  data={availableMonths}
                  keyExtractor={(item) => `${item.year}-${item.month}`}
                  contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 16 }}
                  renderItem={({ item }) => (
                    <Pressable
                      className={`px-4 py-4 rounded-xl mb-2 ${
                        item.year === selectedYear && item.month === selectedMonth
                          ? 'bg-[#F5F0EB]'
                          : ''
                      }`}
                      onPress={() => handleSelectMonth(item.year, item.month)}
                    >
                      <View className="flex-row items-center justify-between">
                        <Text
                          className={`text-[16px] ${
                            item.year === selectedYear && item.month === selectedMonth
                              ? 'font-bold text-[#C1856A]'
                              : 'text-[#30352d]'
                          }`}
                        >
                          {MONTH_NAMES[item.month - 1]} {item.year}
                        </Text>
                        {item.year === selectedYear && item.month === selectedMonth ? (
                          <Text className="text-[12px] font-semibold text-[#C1856A]">
                            Selected
                          </Text>
                        ) : null}
                      </View>
                    </Pressable>
                  )}
                  ListEmptyComponent={
                    <View className="p-4">
                      <Text className="text-gray-500 text-center">No earnings data available</Text>
                    </View>
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}
