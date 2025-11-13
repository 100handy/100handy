import React, { useState } from 'react';
import { ScrollView, RefreshControl, Image as RNImage, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, MapPin, Calendar } from 'lucide-react-native';
import { useFavoriteHandymen } from '@shared/supabase/query';
import { useUserBookings, useAuthStore } from '@shared/supabase';
import { Loader } from '@/components/ui/loader';
import { getPastTaskersFromBookings, handymenProfilesToTaskers, type Tasker } from '@/lib/taskers';
import { useRouter } from 'expo-router';

interface EmptyStateProps {
  activeTab: 'favourite' | 'past';
}

function TaskersEmptyState({ activeTab }: EmptyStateProps) {
  const title = activeTab === 'favourite' ? "No Favourite Taskers" : "No Past Taskers";
  const description = activeTab === 'favourite' 
    ? "Browse and book taskers to add them\nto your favourites."
    : "Your previously booked taskers\nwill appear here.";

  return (
    <View className="flex-col items-center justify-center py-12 px-8">
      {/* Empty state illustration */}
      <RNImage
        source={require('@/assets/tasks-empty-state.png')}
        style={{ width: 238, height: 238, marginBottom: 24 }}
        resizeMode="contain"
      />

      {/* Title */}
      <Text 
        style={{ 
          fontSize: 24,
          fontWeight: '500',
          color: '#333a31',
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      {/* Description */}
      <Text 
        style={{ 
          fontSize: 14,
          color: '#666',
          textAlign: 'center',
          lineHeight: 20,
        }}
      >
        {description}
      </Text>
    </View>
  );
}

const TaskersScreen = () => {
  const [activeTab, setActiveTab] = useState<'favourite' | 'past'>('favourite');
  const router = useRouter();

  // Get user from auth store
  const { user } = useAuthStore();

  // Fetch favorite handymen
  const {
    data: favoriteHandymen,
    isLoading: favLoading,
    isError: favError,
    refetch: refetchFavorites
  } = useFavoriteHandymen(user?.id || '');

  // Fetch past bookings for past taskers
  const {
    past,
    cancelled,
    isLoading: bookingsLoading,
    isError: bookingsError,
    refetch: refetchBookings
  } = useUserBookings(user?.id || '');

  // Transform data
  const favoriteTaskers: Tasker[] = favoriteHandymen ? handymenProfilesToTaskers(favoriteHandymen) : [];
  const pastTaskers: Tasker[] = getPastTaskersFromBookings([...past, ...cancelled]);

  // Determine which data to show
  const taskers = activeTab === 'favourite' ? favoriteTaskers : pastTaskers;
  const isLoading = activeTab === 'favourite' ? favLoading : bookingsLoading;
  const isError = activeTab === 'favourite' ? favError : bookingsError;

  // Pull to refresh handler
  const onRefresh = () => {
    if (activeTab === 'favourite') {
      refetchFavorites();
    } else {
      refetchBookings();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-col flex-1">
        {/* Header */}
        <View className="items-center py-4 border-b border-gray-200">
          <Text className="text-lg font-bold text-[#30352d]">Taskers</Text>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-gray-200">
          <Pressable
            onPress={() => setActiveTab('favourite')}
            className="flex-1 py-3 items-center"
            style={{
              borderBottomWidth: activeTab === 'favourite' ? 2 : 0,
              borderBottomColor: '#FF6B35',
            }}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: '#333a31' }}
            >
              Favourite Taskers
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('past')}
            className="flex-1 py-3 items-center"
            style={{
              borderBottomWidth: activeTab === 'past' ? 2 : 0,
              borderBottomColor: '#FF6B35',
            }}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: '#333a31' }}
            >
              Past Taskers
            </Text>
          </Pressable>
        </View>

        {/* Taskers List */}
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }
        >
          {!user?.id ? (
            <View className="flex-col items-center justify-center py-12 px-8">
              <Text className="text-lg font-medium text-[#333a31] mb-2">
                Please sign in
              </Text>
              <Text className="text-sm text-[#666] text-center">
                You need to be signed in to view your taskers.
              </Text>
            </View>
          ) : isLoading ? (
            <Loader text="Loading taskers..." />
          ) : isError ? (
            <View className="flex-col items-center justify-center py-12 px-8">
              <Text className="text-lg font-medium text-[#333a31] mb-2">
                Error loading taskers
              </Text>
              <Text className="text-sm text-[#666] text-center mb-4">
                Something went wrong. Please try again.
              </Text>
              <Pressable
                onPress={onRefresh}
                className="bg-[#c1856a] px-6 py-3 rounded-full"
              >
                <Text className="text-white font-semibold">Retry</Text>
              </Pressable>
            </View>
          ) : taskers.length === 0 ? (
            <TaskersEmptyState activeTab={activeTab} />
          ) : (
            <View className="flex-col px-6 pt-4">
              {taskers.map((tasker) => (
                <Pressable
                  key={tasker.id}
                  className="mb-4"
                  onPress={() => {
                    // Navigate to handyman details screen
                    router.push(`/(tabs)/professionals/${tasker.id}`);
                  }}
                >
                  <View
                    className="bg-white rounded-2xl"
                    style={{
                      padding: 18,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 2,
                    }}
                  >
                    {/* Top Section: Avatar + Name/Specialty */}
                    <View className="flex-row items-start mb-6">
                      {/* Avatar */}
                      <RNImage
                        source={{ uri: tasker.avatarUrl }}
                        style={{
                          width: 74,
                          height: 74,
                          borderRadius: 37,
                          backgroundColor: '#F3F4F6',
                        }}
                      />

                      {/* Name and Specialty */}
                      <View className="flex-col flex-1 ml-3">
                        {/* Name */}
                        <Text
                          style={{ 
                            fontSize: 24, 
                            fontWeight: '500', 
                            color: '#333a31',
                            marginBottom: 4,
                          }}
                        >
                          {tasker.name}
                        </Text>

                        {/* Specialty */}
                        <Text
                          style={{ 
                            fontSize: 18, 
                            color: '#333a31',
                            fontWeight: '400',
                          }}
                        >
                          {tasker.specialty}
                        </Text>
                      </View>
                    </View>

                    {/* Bottom Section: Details stacked */}
                    <View className="flex-col" style={{ gap: 8 }}>
                      {/* Rating */}
                      <View className="flex-row items-center" style={{ gap: 6 }}>
                        <Star size={16} color="#000000" fill="#000000" strokeWidth={0} />
                        <Text
                          style={{ 
                            fontSize: 16, 
                            color: '#333a31', 
                            fontWeight: '300',
                          }}
                        >
                          {tasker.rating.toFixed(1)} ({tasker.reviewCount} reviews)
                        </Text>
                      </View>

                      {/* Location */}
                      <View className="flex-row items-center" style={{ gap: 6 }}>
                        <MapPin size={16} color="#333a31" />
                        <Text
                          style={{ 
                            fontSize: 16, 
                            color: '#333a31', 
                            fontWeight: '600',
                          }}
                        >
                          {tasker.location}
                        </Text>
                      </View>

                      {/* Last Booked */}
                      <View className="flex-row items-center" style={{ gap: 6 }}>
                        <Calendar size={16} color="#333a31" />
                        <Text
                          style={{ 
                            fontSize: 16, 
                            color: '#333a31',
                            fontWeight: '400',
                          }}
                        >
                          Last booked: {tasker.lastBooked}
                        </Text>
                      </View>

                      {/* Availability */}
                      <Text
                        style={{ 
                          fontSize: 18, 
                          color: '#c1856a',
                          fontWeight: '400',
                          marginTop: 4,
                        }}
                      >
                      {tasker.availability}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TaskersScreen;
