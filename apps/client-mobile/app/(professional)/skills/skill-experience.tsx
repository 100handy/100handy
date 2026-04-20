import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Lightbulb, ShieldAlert } from 'lucide-react-native';
import { addUserSkill, updateUserSkillDetails, getHandyProfile } from '@shared/supabase/profile';
import { toast } from 'sonner-native';

const MAX_CHARS = 500;

export default function SkillExperienceScreen() {
  const params = useLocalSearchParams<{ skillId: string; skillName: string; rate: string }>();
  const [experience, setExperience] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

  useEffect(() => {
    getHandyProfile()
      .then((profile) => {
        setVerificationStatus(profile?.verification_status ?? null);
      })
      .catch(() => {
        setVerificationStatus(null);
      });
  }, []);

  const isVerified = verificationStatus === 'verified';

  const handleActivate = async () => {
    if (isSubmitting) return;

    // Check verification status before activating
    if (!isVerified) {
      Alert.alert(
        'Verification Required',
        'Complete identity verification to start receiving jobs. Your skill will be saved but won\'t be visible to clients until you\'re verified.',
        [
          { text: 'Verify Now', onPress: () => router.push('/(professional)/(tabs)/dashboard') },
          {
            text: 'Save Anyway',
            style: 'default',
            onPress: () => activateSkill(),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    await activateSkill();
  };

  const activateSkill = async () => {
    setIsSubmitting(true);
    try {
      // Convert rate from pounds to cents
      const rateValue = parseInt(params.rate);
      if (isNaN(rateValue)) {
        console.error('Invalid rate value:', params.rate);
        setIsSubmitting(false);
        return;
      }
      const rateCents = rateValue * 100;

      // Add user skill with rate (inactive if not verified)
      const userSkill = await addUserSkill({
        skill_id: params.skillId,
        hourly_rate_cents: rateCents,
        is_active: isVerified, // Only activate if verified
      });

      // Save experience description if provided
      if (userSkill && experience.trim()) {
        await updateUserSkillDetails(userSkill.id, {
          experience_description: experience.trim(),
        });
      }

      if (!isVerified) {
        toast.warning('Skill saved but inactive until identity is verified.');
      }

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
            {/* Verification Warning Banner */}
            {verificationStatus !== null && !isVerified && (
              <Pressable
                onPress={() => router.push('/(professional)/(tabs)/dashboard')}
                className="bg-[#FFF3CD] rounded-lg p-4 mb-6 flex-row items-center"
              >
                <ShieldAlert size={20} color="#856404" strokeWidth={2} />
                <View className="flex-1 ml-3">
                  <Text
                    className="text-sm font-medium text-[#856404]"
                    style={{ fontFamily: 'WorkSans_500Medium' }}
                  >
                    Complete identity verification to start receiving jobs
                  </Text>
                  <Text
                    className="text-xs text-[#856404] mt-1"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Tap here to verify your identity
                  </Text>
                </View>
              </Pressable>
            )}

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
                Let clients know what skills and tools you have and why you're the best pro for
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
