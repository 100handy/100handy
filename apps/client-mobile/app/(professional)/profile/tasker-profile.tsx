import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, ChevronRight } from 'lucide-react-native';

export default function TaskerProfileScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text className="text-lg font-semibold text-[#333A31]" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
          Tasker Profile
        </Text>
        <Pressable onPress={() => router.push('/profile/profile-preview')}>
          <Eye size={24} color="#C1856A" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col px-5 py-6 gap-6">
          {/* Info Section */}
          <View className="flex-col gap-2">
            <Text className="text-xl font-bold text-[#333A31]" style={{ fontFamily: 'WorkSans_700Bold' }}>
              Why customise your profile?
            </Text>
            <Text className="text-sm text-[#666666] leading-5" style={{ fontFamily: 'WorkSans_400Regular' }}>
              Show Clients why you're the one for the job.{'\n'}This helps you stand out and set expectations.
            </Text>
          </View>

          {/* Menu Items */}
          <View className="flex-col gap-0">
            <MenuItem 
              label="Tools" 
              onPress={() => router.push('/profile/tools-screen')} 
            />
            <MenuItem 
              label="Vehicles" 
              onPress={() => {router.push('/profile/vehicles-screen')}} 
            />
            <MenuItem 
              label="Quick facts" 
              onPress={() => router.push('/profile/quick-facts')} 
            />
            <MenuItem 
              label="About me" 
              onPress={() => {router.push('/profile/about-me')}} 
            />
            <MenuItem 
              label="Business photos" 
              onPress={() => {router.push('/profile/business-photo')}} 
              isLast
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface MenuItemProps {
  label: string;
  onPress: () => void;
  isLast?: boolean;
}

function MenuItem({ label, onPress, isLast = false }: MenuItemProps) {
  return (
    <Pressable onPress={onPress}>
      <View className="flex-row" 
        className={`items-center justify-between py-4 ${!isLast ? 'border-b border-[#E5E5E5]' : ''}`}
      >
        <Text className="text-base text-[#333A31]" style={{ fontFamily: 'WorkSans_400Regular' }}>
          {label}
        </Text>
        <ChevronRight size={20} color="#999999" />
      </View>
    </Pressable>
  );
}