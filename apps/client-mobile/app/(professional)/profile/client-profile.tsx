import React from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react-native';
import { supabase } from '@shared/supabase';

function useClientProfile(userId: string) {
  return useQuery({
    queryKey: ['professional-client-profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, avatar_url, postcode, created_at')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export default function ClientProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = typeof params.userId === 'string' ? params.userId : '';
  const fallbackName =
    typeof params.name === 'string' && params.name.trim().length > 0
      ? params.name
      : 'Client';

  const { data: profile, isLoading, isError } = useClientProfile(userId);

  const displayName =
    profile
      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || fallbackName
      : fallbackName;

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
        <Pressable onPress={() => router.back()} className="w-10">
          <ChevronLeft size={24} color="#30352D" strokeWidth={2} />
        </Pressable>
        <Text className="text-xl font-bold text-[#30352D]">Client Profile</Text>
        <View className="w-10" />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A5347" />
          <Text className="mt-3 text-sm text-[#666666]">Loading profile...</Text>
        </View>
      ) : isError || !profile ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base font-semibold text-[#30352D] mb-2 text-center">
            Profile unavailable
          </Text>
          <Text className="text-sm text-[#666666] text-center">
            This client profile could not be loaded right now.
          </Text>
        </View>
      ) : (
        <View className="flex-1 px-5 py-6">
          <View className="items-center border border-[#EAEAEA] rounded-3xl px-6 py-8">
            <Image
              source={
                profile.avatar_url
                  ? { uri: profile.avatar_url }
                  : require('@/assets/images/icon.png')
              }
              className="w-24 h-24 rounded-full bg-gray-100"
            />
            <Text className="mt-4 text-2xl font-semibold text-[#30352D] text-center">
              {displayName}
            </Text>

            {profile.postcode ? (
              <Text className="mt-2 text-sm text-[#666666] text-center">
                Postcode: {profile.postcode}
              </Text>
            ) : null}

            {memberSince ? (
              <Text className="mt-2 text-sm text-[#666666] text-center">
                Member since {memberSince}
              </Text>
            ) : null}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
