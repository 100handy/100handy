import React, { useState, useEffect } from 'react';
import { ScrollView, Linking, ActivityIndicator, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { getUserSkills, UserSkill } from '@shared/supabase/profile';

export default function BusinessPhotosScreen() {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setIsLoading(true);
    const userSkills = await getUserSkills();
    setSkills(userSkills);
    setIsLoading(false);
  };

  const handleGoToSkillsRates = () => {
    router.push('/(professional)/skills/my-skills');
  };

  const handleLearnMore = () => {
    // Open photo policy link
    const policyUrl = 'https://example.com/photo-policy'; // Replace with actual URL
    Linking.openURL(policyUrl).catch(err => console.error('Failed to open URL:', err));
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#D17852" />
      </SafeAreaView>
    );
  }

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
          Business Photos
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col px-5 py-6 gap-6">
          {/* Empty State - Show when no skills */}
          {skills.length === 0 && (
            <View className="flex-col gap-4 items-center py-8">
            {/* Title */}
            <Text 
              className="text-lg font-semibold text-[#333A31] text-center" 
              style={{ fontFamily: 'WorkSans_600SemiBold' }}
            >
              You have no skills added
            </Text>

            {/* Description */}
            <Text 
              className="text-sm text-[#666666] leading-5 text-center px-4" 
              style={{ fontFamily: 'WorkSans_400Regular' }}
            >
              Go to your Skills & Rates and add your skills. You Can then come back here to upload your business Photos.
            </Text>

            {/* Go to Skills & Rates Link */}
            <Pressable 
              onPress={handleGoToSkillsRates}
              className="mt-2"
            >
              <Text 
                className="text-base font-medium text-[#D17852]" 
                style={{ fontFamily: 'WorkSans_500Medium' }}
              >
                Go Skills & Rates
              </Text>
            </Pressable>

            {/* Policy Link */}
            <View className="flex-col mt-4 items-center">
              <View className="flex-row flex-wrap justify-center">
                <Text 
                  className="text-sm text-[#666666]" 
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  Learn more about our accepted photo policy{' '}
                </Text>
                <Pressable onPress={handleLearnMore}>
                  <Text 
                    className="text-sm text-[#D17852]" 
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    here
                  </Text>
                </Pressable>
                <Text 
                  className="text-sm text-[#666666]" 
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  .
                </Text>
              </View>
            </View>
            </View>
          )}

          {/* Skills-based Photo Upload - Show when skills exist */}
          {skills.length > 0 && (
            <View className="flex-col gap-4">
              <Text
                className="text-sm text-[#666666] leading-5"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                Add photos for each of your skills to showcase your work and attract more clients.
              </Text>

              {/* Skills List with Photo Upload */}
              {skills.map(userSkill => (
                <View key={userSkill.id} className="flex-col gap-2">
                  {/* Skill Name */}
                  <Text
                    className="text-base font-semibold text-[#333A31]"
                    style={{ fontFamily: 'WorkSans_600SemiBold' }}
                  >
                    {userSkill.skill?.name}
                  </Text>

                  {/* Photo Upload Placeholder */}
                  <Pressable
                    className="border-2 border-dashed border-[#D17852] rounded-lg p-8 items-center justify-center bg-[#FFF8F5]"
                    onPress={() => {
                      // TODO: Implement photo picker
                      console.log('Upload photo for', userSkill.skill?.name);
                    }}
                  >
                    <Text
                      className="text-sm font-medium text-[#D17852]"
                      style={{ fontFamily: 'WorkSans_500Medium' }}
                    >
                      + Add Photos
                    </Text>
                  </Pressable>
                </View>
              ))}

              {/* Policy Link */}
              <View className="flex-col mt-2 items-center">
                <View className="flex-row flex-wrap justify-center">
                  <Text
                    className="text-sm text-[#666666]"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Learn more about our accepted photo policy{' '}
                  </Text>
                  <Pressable onPress={handleLearnMore}>
                    <Text
                      className="text-sm text-[#D17852]"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      here
                    </Text>
                  </Pressable>
                  <Text
                    className="text-sm text-[#666666]"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    .
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}