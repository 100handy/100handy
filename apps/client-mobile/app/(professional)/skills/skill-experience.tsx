import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Lightbulb } from 'lucide-react-native';
import { addUserSkill } from '@shared/supabase/profile';

const MAX_CHARS = 500;

export default function SkillExperienceScreen() {
  const params = useLocalSearchParams<{ skillId: string; skillName: string; rate: string }>();
  const [experience, setExperience] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleActivate = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Convert rate from dollars to cents
      const rateCents = parseInt(params.rate) * 100;

      // Add user skill with rate and experience
      await addUserSkill({
        skill_id: params.skillId,
        hourly_rate_cents: rateCents,
        is_active: true,
      });

      // Navigate back to my skills screen
      router.replace('/(professional)/skills/my-skills');
    } catch (error) {
      console.error('Error activating skill:', error);
      setIsSubmitting(false);
    }
  };

  const charCount = experience.length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="border-b border-gray-200">
          <View className="flex-row items-center justify-center px-4 py-4">
            <Pressable onPress={() => router.back()} className="absolute left-4">
              <ChevronLeft size={24} color="#1F2937" strokeWidth={2} />
            </Pressable>
            <Text
              className="text-lg font-bold text-gray-900"
              style={{ fontFamily: 'WorkSans_700Bold' }}
            >
              {params.skillName || 'General Mounting'}
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-6">
            {/* Title and Description */}
            <View className="mb-8">
              <Text
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                Skills & Experience
              </Text>
              <Text
                className="text-base text-gray-600"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                Let clients know what skills and tools you have and why you're the best Tasker for
                the job.
              </Text>
            </View>

            {/* Text Input */}
            <View className="relative mb-8">
              <TextInput
                value={experience}
                onChangeText={(text) => {
                  if (text.length <= MAX_CHARS) {
                    setExperience(text);
                  }
                }}
                placeholder="e.g. I have 3 years of experience, bring my own supplies, and would love to help you get the job done."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                className="w-full border border-gray-300 rounded-lg p-4 text-base text-gray-900 min-h-[120px]"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              />
              <Text
                className="absolute bottom-3 right-4 text-sm text-gray-500"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                {charCount}/{MAX_CHARS}
              </Text>
            </View>

            {/* Tips & Examples */}
            <View className="space-y-4">
              <Text
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                Tips & examples
              </Text>

              <View className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <View className="flex-row items-start p-4 bg-white">
                  <Lightbulb size={24} color="#10B981" className="mr-4 mt-0.5" />
                  <View className="flex-1">
                    <Text
                      className="font-bold text-gray-900 mb-1"
                      style={{ fontFamily: 'WorkSans_700Bold' }}
                    >
                      Stand out to clients
                    </Text>
                    <Text
                      className="text-gray-600"
                      style={{ fontFamily: 'WorkSans_400Regular' }}
                    >
                      What clients look for when booking.
                    </Text>
                  </View>
                </View>

                {/* List */}
                <View className="border-t border-gray-200 p-4 bg-white">
                  <View className="space-y-2">
                    {[
                      'Safety precautions taken (use of mask, gloves, and sanitizer)',
                      'Quality of work',
                      'Expertise and experience',
                      'Professionalism',
                      'Reliability and responsiveness',
                      'Special tools',
                    ].map((item, index) => (
                      <View key={index} className="flex-row items-start">
                        <View className="w-1 h-1 rounded-full bg-gray-400 mt-2 mr-2 flex-shrink-0" />
                        <Text
                          className="flex-1 text-gray-800"
                          style={{ fontFamily: 'WorkSans_400Regular' }}
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="px-6 py-4 bg-white border-t border-gray-200">
          <Pressable
            onPress={handleActivate}
            disabled={isSubmitting}
            className={`w-full bg-[#C1856A] rounded-full py-4 shadow-lg ${
              isSubmitting ? 'opacity-50' : 'active:opacity-80'
            }`}
          >
            <Text
              className="text-center text-lg font-bold text-white"
              style={{ fontFamily: 'WorkSans_700Bold' }}
            >
              {isSubmitting ? 'Activating...' : 'Activate'}
            </Text>
          </Pressable>
          <View className="w-32 h-1 bg-gray-900 rounded-full mx-auto mt-4" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
