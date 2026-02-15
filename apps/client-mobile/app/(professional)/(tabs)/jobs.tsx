import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import {
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Play,
  Briefcase,
} from 'lucide-react-native';
import { useAuthStore } from '@shared/supabase';
import {
  useHandyBookings,
  type BookingWithCustomer,
} from '@shared/supabase';

type TabType = 'pending' | 'upcoming' | 'past';

interface JobCardProps {
  booking: BookingWithCustomer;
  onPress: () => void;
  showBadge?: 'new' | 'in_progress';
}

function JobCard({ booking, onPress, showBadge }: JobCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const estimatedEarnings = ((booking.hourly_rate_cents || 0) * (booking.estimated_hours || 0)) / 100;
  const customerName = booking.customer
    ? `${booking.customer.first_name || ''} ${booking.customer.last_name?.charAt(0) || ''}.`.trim()
    : 'Customer';

  return (
    <Pressable
      onPress={onPress}
      className="bg-white mx-4 mb-3 p-4 rounded-2xl border border-[#F0F0F0]"
    >
      {/* Badge */}
      {showBadge && (
        <View
          className={`self-start px-2 py-1 rounded-full mb-2 ${
            showBadge === 'new' ? 'bg-[#B8926A]' : 'bg-[#2E7D32]'
          }`}
        >
          <Text className="font-worksans-medium text-[10px] text-white uppercase">
            {showBadge === 'new' ? 'New Request' : 'In Progress'}
          </Text>
        </View>
      )}

      {/* Task Title & Category */}
      <Text className="font-worksans-bold text-[16px] text-[#30352D] mb-1">
        {booking.task_title}
      </Text>
      {booking.category && (
        <Text className="font-worksans text-[13px] text-[#6B6B6B] mb-3">
          {booking.category.name}
        </Text>
      )}

      {/* Date & Time */}
      <View className="flex-row items-center mb-2">
        <Calendar color="#B8926A" size={16} strokeWidth={1.5} />
        <Text className="font-worksans text-[14px] text-[#30352D] ml-2">
          {formatDate(booking.scheduled_date)} at {formatTime(booking.scheduled_time)}
        </Text>
      </View>

      {/* Location */}
      {booking.address && (
        <View className="flex-row items-center mb-2">
          <MapPin color="#B8926A" size={16} strokeWidth={1.5} />
          <Text
            className="font-worksans text-[14px] text-[#6B6B6B] ml-2 flex-1"
            numberOfLines={1}
          >
            {booking.address.street}, {booking.address.postcode}
          </Text>
        </View>
      )}

      {/* Divider */}
      <View className="h-[1px] bg-[#F0F0F0] my-3" />

      {/* Bottom Row: Customer, Earnings, Arrow */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-8 h-8 rounded-full bg-[#F5F5F5] items-center justify-center mr-2">
            <Text className="font-worksans-bold text-[12px] text-[#6B6B6B]">
              {customerName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="font-worksans text-[13px] text-[#30352D]">
            {customerName}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="font-worksans-bold text-[16px] text-[#30352D] mr-2">
            £{estimatedEarnings.toFixed(0)}
          </Text>
          <Text className="font-worksans text-[12px] text-[#6B6B6B] mr-2">
            est.
          </Text>
          <ChevronRight color="#B8926A" size={20} strokeWidth={2} />
        </View>
      </View>
    </Pressable>
  );
}

function EmptyState({ type }: { type: TabType }) {
  const content = {
    pending: {
      icon: <AlertCircle color="#B8926A" size={48} strokeWidth={1.5} />,
      title: 'No pending requests',
      subtitle: 'When clients book you, their requests will appear here',
    },
    upcoming: {
      icon: <Calendar color="#B8926A" size={48} strokeWidth={1.5} />,
      title: 'No upcoming jobs',
      subtitle: 'Accept requests to see your scheduled jobs here',
    },
    past: {
      icon: <CheckCircle2 color="#B8926A" size={48} strokeWidth={1.5} />,
      title: 'No completed jobs yet',
      subtitle: 'Your completed jobs will appear here',
    },
  };

  const { icon, title, subtitle } = content[type];

  return (
    <View className="flex-1 items-center justify-center py-16 px-8">
      {icon}
      <Text className="font-worksans-bold text-[18px] text-[#30352D] mt-4 text-center">
        {title}
      </Text>
      <Text className="font-worksans text-[14px] text-[#6B6B6B] mt-2 text-center">
        {subtitle}
      </Text>
    </View>
  );
}

export default function ProfessionalJobs() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [refreshing, setRefreshing] = useState(false);

  const {
    pending,
    upcoming,
    completed,
    isLoading,
    refetch,
    pendingCount,
  } = useHandyBookings(user?.id || '');

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        refetch();
      }
    }, [user?.id, refetch])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleJobPress = (bookingId: string) => {
    router.push(`/(professional)/job-details/${bookingId}`);
  };

  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: 'pending', label: 'Pending', count: pendingCount > 0 ? pendingCount : undefined },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
  ];

  const getBookingsForTab = (): BookingWithCustomer[] => {
    switch (activeTab) {
      case 'pending':
        return pending;
      case 'upcoming':
        return upcoming;
      case 'past':
        return completed;
      default:
        return [];
    }
  };

  const bookings = getBookingsForTab();

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
      {/* Header */}
      <View className="bg-white px-5 py-4 border-b border-[#F0F0F0]">
        <View className="flex-row items-center justify-center">
          <Briefcase color="#30352D" size={22} strokeWidth={2} />
          <Text className="font-worksans-bold text-[20px] text-[#30352D] ml-2">
            Jobs
          </Text>
        </View>
      </View>

      {/* Tab Bar */}
      <View className="flex-row bg-white px-4 py-2 border-b border-[#F0F0F0]">
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 items-center rounded-lg mx-1 ${
              activeTab === tab.key ? 'bg-[#B8926A]' : 'bg-[#F5F5F5]'
            }`}
          >
            <View className="flex-row items-center">
              <Text
                className={`font-worksans-medium text-[14px] ${
                  activeTab === tab.key ? 'text-white' : 'text-[#6B6B6B]'
                }`}
              >
                {tab.label}
              </Text>
              {tab.count !== undefined && (
                <View
                  className={`ml-2 px-2 py-0.5 rounded-full ${
                    activeTab === tab.key ? 'bg-white' : 'bg-[#D17852]'
                  }`}
                >
                  <Text
                    className={`font-worksans-bold text-[11px] ${
                      activeTab === tab.key ? 'text-[#B8926A]' : 'text-white'
                    }`}
                  >
                    {tab.count}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#B8926A"
          />
        }
      >
        {isLoading && !refreshing ? (
          <View className="flex-1 items-center justify-center py-16">
            <Text className="font-worksans text-[14px] text-[#6B6B6B]">
              Loading jobs...
            </Text>
          </View>
        ) : bookings.length === 0 ? (
          <EmptyState type={activeTab} />
        ) : (
          <View className="py-4">
            {bookings.map((booking) => (
              <JobCard
                key={booking.id}
                booking={booking}
                onPress={() => handleJobPress(booking.id)}
                showBadge={
                  booking.status === 'pending'
                    ? 'new'
                    : booking.status === 'in_progress'
                    ? 'in_progress'
                    : undefined
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
