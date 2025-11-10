import React, { useState } from 'react';
import { ScrollView, Image as RNImage, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, MapPin, Calendar } from 'lucide-react-native';

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

interface Tasker {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  location: string;
  lastBooked: string;
  availability: string;
}

const MOCK_FAVOURITE_TASKERS: Tasker[] = [
  {
    id: '1',
    name: 'Maria Lopez',
    specialty: 'Cleaning Specialist',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    rating: 5.0,
    reviewCount: 124,
    location: 'Leytonstone, E11',
    lastBooked: '15 Oct 2025',
    availability: 'Available next week',
  },
  {
    id: '2',
    name: 'Anton Lee',
    specialty: 'Cleaning Specialist',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    rating: 5.0,
    reviewCount: 124,
    location: 'Leytonstone, E11',
    lastBooked: '15 Oct 2025',
    availability: 'Available this week',
  },
];

const MOCK_PAST_TASKERS: Tasker[] = [
  // Empty by default to show empty state
  // Uncomment to test with data:
  // {
  //   id: '3',
  //   name: 'Sarah Johnson',
  //   specialty: 'Handyman',
  //   avatarUrl: 'https://i.pravatar.cc/150?img=3',
  //   rating: 4.9,
  //   reviewCount: 98,
  //   location: 'Stratford, E15',
  //   lastBooked: '8 Oct 2025',
  //   availability: 'Available next month',
  // },
];

const TaskersScreen = () => {
  const [activeTab, setActiveTab] = useState<'favourite' | 'past'>('favourite');

  const taskers = activeTab === 'favourite' ? MOCK_FAVOURITE_TASKERS : MOCK_PAST_TASKERS;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-col flex-1">
        {/* Header */}
        <View className="items-center py-4 border-b border-gray-200">
          <Text className="text-lg font-bold text-[#30352d]">Tasks</Text>
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
        <ScrollView className="flex-1">
          {taskers.length === 0 ? (
            <TaskersEmptyState activeTab={activeTab} />
          ) : (
            <View className="flex-col px-6 pt-4">
              {taskers.map((tasker) => (
                <Pressable key={tasker.id} className="mb-4">
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
