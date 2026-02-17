import React, { useEffect } from 'react';
import { ScrollView, Image, ActivityIndicator, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Edit3,
  ChevronLeft
} from 'lucide-react-native';
import { useProfileStore } from '@shared/supabase';

interface FieldRowProps {
  label: string;
  value: string;
}

const FieldRow = ({ label, value }: FieldRowProps) => (
  <View className="flex-row px-6 py-5 items-center justify-between border-b border-gray-100">
    <Text className="font-worksans text-base text-theme-font">
      {label}
    </Text>
    <Text className="font-worksans text-base text-gray-600 text-right flex-1 ml-4">
      {value}
    </Text>
  </View>
);

export default function AccountDetailScreen() {
  const router = useRouter();
  const { profile, isLoading, fetchProfile } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = () => {
    router.push('/(professional)/profile/account-detail-edit');
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#D17852" />
      </SafeAreaView>
    );
  }

  const fullName = profile?.first_name && profile?.last_name
    ? `${profile.first_name} ${profile.last_name}`
    : 'Not set';

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name?.[0] || ''}.`
    : 'Not set';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row py-4 px-6 items-center justify-between border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="w-10">
          <ChevronLeft color="#30352D" size={24} strokeWidth={1.5} />
        </Pressable>
        <Text className="font-worksans-bold text-xl text-theme-font">
          Account detail
        </Text>
        <Pressable className="w-10 items-end" onPress={handleEdit}>
          <Edit3 color="#B8926A" size={24} strokeWidth={1.5} />
        </Pressable>
      </View>

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View className="flex-row px-6 py-8 items-center justify-between">
          <Text className="font-worksans-bold text-2xl text-theme-font">
            {displayName}
          </Text>
          <View className="w-[120px] h-[120px] rounded-full overflow-hidden bg-gray-300">
            {profile?.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                className="w-full h-full"
                style={{ width: 120, height: 120 }}
              />
            ) : (
              <View className="w-full h-full items-center justify-center bg-[#D17852]/20">
                <Text className="font-worksans-bold text-4xl text-[#D17852]">
                  {profile?.first_name?.[0] || '?'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Form Fields */}
        <View className="flex-col ">
          <FieldRow label="Name" value={fullName} />
          <FieldRow label="Email" value={profile?.email || 'Not set'} />
          <FieldRow label="Mobile phone" value={profile?.phone || 'Not set'} />
          <FieldRow label="Postcode" value={profile?.postcode || 'Not set'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}