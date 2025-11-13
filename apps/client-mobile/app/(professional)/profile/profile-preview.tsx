import React, { useEffect } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useProfessionalProfileStore } from '@shared/supabase';

export default function ProfilePreviewScreen() {
  const { tools, vehicles, quickFacts, aboutMe, syncCalendars, loadProfile } = useProfessionalProfileStore();

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text
          className="flex-1 text-center text-lg font-semibold text-[#333A31] pr-6"
          style={{ fontFamily: 'WorkSans_600SemiBold' }}
        >
          Profile Preview
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col px-5 py-6 gap-6">
          {/* About Me Section */}
          {aboutMe && (
            <View className="flex-col gap-2">
              <Text
                className="text-lg font-semibold text-[#333A31]"
                style={{ fontFamily: 'WorkSans_600SemiBold' }}
              >
                About Me
              </Text>
              <Text
                className="text-base text-[#666666] leading-5"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                {aboutMe}
              </Text>
            </View>
          )}

          {/* Tools Section */}
          {tools.length > 0 && (
            <View className="flex-col gap-2">
              <Text
                className="text-lg font-semibold text-[#333A31]"
                style={{ fontFamily: 'WorkSans_600SemiBold' }}
              >
                Tools I Have
              </Text>
              <View className="flex-col gap-2">
                {tools.map((tool, index) => (
                  <View className="flex-row" key={index} className="items-center gap-2">
                    <Text className="text-[#D17852] text-base">•</Text>
                    <Text
                      className="text-base text-[#333A31]"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      {tool}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Vehicles Section */}
          {vehicles.length > 0 && (
            <View className="flex-col gap-2">
              <Text
                className="text-lg font-semibold text-[#333A31]"
                style={{ fontFamily: 'WorkSans_600SemiBold' }}
              >
                My Vehicles
              </Text>
              <View className="flex-col gap-2">
                {vehicles.map((vehicle, index) => (
                  <View className="flex-row" key={index} className="items-center gap-2">
                    <Text className="text-[#D17852] text-base">•</Text>
                    <Text
                      className="text-base text-[#333A31]"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      {vehicle}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Quick Facts Section */}
          {quickFacts.length > 0 && (
            <View className="flex-col gap-2">
              <Text
                className="text-lg font-semibold text-[#333A31]"
                style={{ fontFamily: 'WorkSans_600SemiBold' }}
              >
                Quick Facts
              </Text>
              <View className="flex-col gap-2">
                {quickFacts.map((fact, index) => (
                  <View className="flex-row" key={index} className="items-center gap-2">
                    <Text className="text-[#D17852] text-base">•</Text>
                    <Text
                      className="text-base text-[#333A31]"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      {fact}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Calendar Settings Section */}
          <View className="flex-col gap-2">
            <Text
              className="text-lg font-semibold text-[#333A31]"
              style={{ fontFamily: 'WorkSans_600SemiBold' }}
            >
              Calendar Settings
            </Text>
            <Text
              className="text-base text-[#666666]"
              style={{ fontFamily: 'WorkSans_400Regular' }}
            >
              Calendar sync: {syncCalendars ? 'Enabled' : 'Disabled'}
            </Text>
          </View>

          {/* Empty State */}
          {!aboutMe && tools.length === 0 && vehicles.length === 0 && quickFacts.length === 0 && (
            <View className="flex-col items-center py-12 gap-4">
              <Text
                className="text-lg font-semibold text-[#333A31] text-center"
                style={{ fontFamily: 'WorkSans_600SemiBold' }}
              >
                No profile information yet
              </Text>
              <Text
                className="text-sm text-[#666666] text-center px-8"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                Start customizing your profile to show clients why you're the best for the job.
              </Text>
              <Pressable
                onPress={() => router.back()}
                className="mt-4 bg-[#D17852] rounded-full px-6 py-3"
              >
                <Text
                  className="text-white text-base font-semibold"
                  style={{ fontFamily: 'WorkSans_600SemiBold' }}
                >
                  Customize Profile
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
