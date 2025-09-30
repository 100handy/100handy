import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { DollarSign, Clock, Star, TrendingUp } from 'lucide-react-native';
import Header from '@/components/Header';

export default function ProfessionalDashboard() {
  return (
    <SafeAreaView className="flex-1 bg-bg-secondary">
      <Header 
        title="Dashboard" 
        onBackPress={() => {}} 
        onBellPress={() => {}} 
        showFilterIcon={false}
        showBellIcon={true}
      />

      <ScrollView className="flex-1 p-4">
        {/* Stats Cards */}
        <VStack className="space-y-4 mb-6">
          <HStack className="space-x-4">
            <Box className="flex-1 bg-white rounded-xl p-4 shadow-sm">
              <HStack className="items-center justify-between mb-2">
                <Text className="font-worksans text-text-secondary text-sm">Today's Earnings</Text>
                <DollarSign color="#10B981" size={20} />
              </HStack>
              <Text className="font-worksans-bold text-2xl text-text-primary">$127.50</Text>
            </Box>
            <Box className="flex-1 bg-white rounded-xl p-4 shadow-sm">
              <HStack className="items-center justify-between mb-2">
                <Text className="font-worksans text-text-secondary text-sm">Active Jobs</Text>
                <Clock color="#F59E0B" size={20} />
              </HStack>
              <Text className="font-worksans-bold text-2xl text-text-primary">3</Text>
            </Box>
          </HStack>
          
          <HStack className="space-x-4">
            <Box className="flex-1 bg-white rounded-xl p-4 shadow-sm">
              <HStack className="items-center justify-between mb-2">
                <Text className="font-worksans text-text-secondary text-sm">Rating</Text>
                <Star color="#F59E0B" size={20} />
              </HStack>
              <Text className="font-worksans-bold text-2xl text-text-primary">4.9</Text>
            </Box>
            <Box className="flex-1 bg-white rounded-xl p-4 shadow-sm">
              <HStack className="items-center justify-between mb-2">
                <Text className="font-worksans text-text-secondary text-sm">This Week</Text>
                <TrendingUp color="#10B981" size={20} />
              </HStack>
              <Text className="font-worksans-bold text-2xl text-text-primary">$892</Text>
            </Box>
          </HStack>
        </VStack>

        {/* Quick Actions */}
        <VStack className="space-y-4">
          <Heading className="font-worksans-bold text-lg text-text-primary mb-2">
            Quick Actions
          </Heading>
          
          <Pressable className="bg-white rounded-xl p-4 shadow-sm">
            <HStack className="items-center justify-between">
              <VStack>
                <Text className="font-worksans-bold text-text-primary text-base">Find New Jobs</Text>
                <Text className="font-worksans text-text-secondary text-sm">Browse available tasks</Text>
              </VStack>
              <Text className="font-worksans-bold text-clay-orange">12</Text>
            </HStack>
          </Pressable>
          
          <Pressable className="bg-white rounded-xl p-4 shadow-sm">
            <HStack className="items-center justify-between">
              <VStack>
                <Text className="font-worksans-bold text-text-primary text-base">My Schedule</Text>
                <Text className="font-worksans text-text-secondary text-sm">View upcoming appointments</Text>
              </VStack>
              <Text className="font-worksans-bold text-clay-orange">3</Text>
            </HStack>
          </Pressable>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
