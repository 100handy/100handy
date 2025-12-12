import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, CheckCircle2, X, Lightbulb } from 'lucide-react-native';
import {
  getUserSkills,
  updateUserSkillDetails,
  deleteUserSkill,
  UserSkill,
} from '@shared/supabase/profile';

const MAX_CHARS = 500;

// Supplies configuration per category
interface Supply {
  id: string;
  name: string;
  description?: string;
}

const SUPPLIES_BY_CATEGORY: Record<string, Supply[]> = {
  Cleaning: [
    {
      id: 'basic_supplies',
      name: 'Basic Supplies',
      description: 'Multi-purpose cleaner, dish soap, bleach, floor cleaner, sponges, paper towels, rags',
    },
    {
      id: 'mop',
      name: 'Mop',
      description: 'Swiffer Wet (or similar), steam mop, portable mop and traditional mop & bucket all qualify',
    },
    {
      id: 'vacuum',
      name: 'Vacuum',
    },
  ],
  // Add more categories as needed
};

// Tips per category (can be expanded)
const TIPS_BY_CATEGORY: Record<string, string[]> = {
  Cleaning: [
    'Always bring your own cleaning supplies to show professionalism',
    'Use eco-friendly products when possible - clients appreciate this',
    'Take before and after photos to showcase your work',
    'Focus on high-traffic areas like kitchens and bathrooms',
    'Don\'t forget to clean behind and under appliances',
    'Use proper safety equipment (gloves, masks)',
  ],
  Assembly: [
    'Read instructions thoroughly before starting',
    'Organize all parts before beginning assembly',
    'Use the right tools for each step',
    'Double-check alignment before tightening screws',
    'Test all moving parts before completing the job',
  ],
  Mounting: [
    'Always use a stud finder for heavy items',
    'Check for electrical wires and plumbing before drilling',
    'Use appropriate anchors for wall type',
    'Level everything carefully - use a laser level for best results',
    'Test the mount before leaving',
  ],
};

export default function SkillEditScreen() {
  const params = useLocalSearchParams<{ userSkillId: string; skillId: string; skillName: string }>();
  const [userSkill, setUserSkill] = useState<UserSkill | null>(null);
  const [experience, setExperience] = useState('');
  const [suppliesOwned, setSuppliesOwned] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);

  useEffect(() => {
    loadUserSkill();
  }, [params.userSkillId]);

  const loadUserSkill = async () => {
    setIsLoading(true);
    try {
      const userSkills = await getUserSkills();
      const found = userSkills.find((us) => us.id === params.userSkillId);
      if (found) {
        setUserSkill(found);
        setExperience(found.experience_description || '');
        setSuppliesOwned(new Set(found.supplies_owned || []));
      }
    } catch (error) {
      console.error('Error loading user skill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userSkill) return;

    setIsSaving(true);
    try {
      await updateUserSkillDetails(userSkill.id, {
        experience_description: experience,
        supplies_owned: Array.from(suppliesOwned),
      });
      router.back();
    } catch (error) {
      console.error('Error saving skill details:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSkill = () => {
    if (!userSkill) return;

    Alert.alert(
      'Remove Skill',
      'Are you sure you want to remove this skill? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteUserSkill(userSkill.id);
            if (success) {
              router.replace('/(professional)/skills/my-skills');
            } else {
              Alert.alert('Error', 'Failed to remove skill. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleToggleSupply = (supplyId: string) => {
    setSuppliesOwned((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(supplyId)) {
        newSet.delete(supplyId);
      } else {
        newSet.add(supplyId);
      }
      return newSet;
    });
  };

  const handleViewExpectations = () => {
    router.push({
      pathname: '/(professional)/skills/skill-details',
      params: {
        skillId: params.skillId || userSkill?.skill_id || '',
        skillName: params.skillName || userSkill?.skill?.name || '',
      },
    });
  };

  const skillCategory = userSkill?.skill?.category || '';
  const supplies = SUPPLIES_BY_CATEGORY[skillCategory] || [];
  const tips = TIPS_BY_CATEGORY[skillCategory] || [];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#C1856A" />
      </SafeAreaView>
    );
  }

  if (!userSkill) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-4">
        <Text className="text-lg text-gray-600 text-center" style={{ fontFamily: 'WorkSans_400Regular' }}>
          Skill not found
        </Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-[#C1856A] font-semibold" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
            Go Back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
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
              {params.skillName || userSkill.skill?.name || 'Skill Details'}
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-6">
            {/* Experience Description */}
            <View className="mb-8">
              <View className="relative">
                <TextInput
                  value={experience}
                  onChangeText={(text) => {
                    if (text.length <= MAX_CHARS) {
                      setExperience(text);
                    }
                  }}
                  placeholder="Add a short description about your experience..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  className="w-full border-b border-gray-300 pb-12 pt-2 text-base text-gray-900 min-h-[120px]"
                  style={{ fontFamily: 'WorkSans_400Regular', lineHeight: 22 }}
                />
                <Text
                  className="absolute bottom-2 right-0 text-sm text-gray-400"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  {experience.length}/{MAX_CHARS}
                </Text>
              </View>
            </View>

            {/* Supplies Section */}
            {supplies.length > 0 && (
              <View className="mb-8">
                <Text
                  className="text-xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  Supplies
                </Text>
                <Text
                  className="text-base text-gray-600 mb-6"
                  style={{ fontFamily: 'WorkSans_400Regular', lineHeight: 22 }}
                >
                  Clients expect you to bring supplies, and you will only be hired if you have them.
                </Text>

                <View className="gap-4">
                  {supplies.map((supply) => {
                    const isOwned = suppliesOwned.has(supply.id);
                    return (
                      <Pressable
                        key={supply.id}
                        onPress={() => handleToggleSupply(supply.id)}
                        className="flex-row items-start"
                      >
                        <View className="mr-3 mt-0.5">
                          <CheckCircle2
                            size={24}
                            color={isOwned ? '#10B981' : '#D1D5DB'}
                            fill={isOwned ? '#10B981' : 'transparent'}
                            strokeWidth={2}
                          />
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-base font-semibold text-gray-900"
                            style={{ fontFamily: 'WorkSans_600SemiBold' }}
                          >
                            {supply.name}
                          </Text>
                          {supply.description && (
                            <Text
                              className="text-sm text-gray-500 mt-1"
                              style={{ fontFamily: 'WorkSans_400Regular', lineHeight: 20 }}
                            >
                              {supply.description}
                            </Text>
                          )}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="px-6 pb-6 bg-white border-t border-gray-200 pt-4">
          <View className="gap-3">
            {/* Remove Skill */}
            <Pressable
              onPress={handleRemoveSkill}
              className="w-full border-2 border-[#C1856A] rounded-full py-4 active:opacity-80"
            >
              <Text
                className="text-center text-base font-bold text-[#C1856A]"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                Remove this Skill
              </Text>
            </Pressable>

            {/* Tips Button */}
            {tips.length > 0 && (
              <Pressable
                onPress={() => setShowTipsModal(true)}
                className="w-full border-2 border-[#C1856A] rounded-full py-4 active:opacity-80"
              >
                <Text
                  className="text-center text-base font-bold text-[#C1856A]"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  {skillCategory || 'Skill'} Tips
                </Text>
              </Pressable>
            )}

            {/* View Expectations */}
            <Pressable
              onPress={handleViewExpectations}
              className="w-full border-2 border-[#C1856A] rounded-full py-4 active:opacity-80"
            >
              <Text
                className="text-center text-base font-bold text-[#C1856A]"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                View Expectations
              </Text>
            </Pressable>

            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              className={`w-full bg-[#C1856A] rounded-full py-4 ${
                isSaving ? 'opacity-50' : 'active:opacity-80'
              }`}
            >
              <Text
                className="text-center text-base font-bold text-white"
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </Pressable>
          </View>

          {/* Home Indicator */}
          <View className="w-32 h-1 bg-gray-900 rounded-full mx-auto mt-4" />
        </View>

        {/* Tips Modal */}
        <Modal visible={showTipsModal} transparent animationType="slide" onRequestClose={() => setShowTipsModal(false)}>
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <Lightbulb size={24} color="#10B981" />
                  <Text
                    className="text-xl font-bold text-gray-900"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    {params.skillName || userSkill.skill?.name || 'Skill'} Tips
                  </Text>
                </View>
                <Pressable onPress={() => setShowTipsModal(false)}>
                  <X size={24} color="#6B7280" />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="space-y-3">
                  {tips.map((tip, index) => (
                    <View key={index} className="flex-row items-start">
                      <View className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0" />
                      <Text
                        className="flex-1 text-base text-gray-700"
                        style={{ fontFamily: 'WorkSans_400Regular' }}
                      >
                        {tip}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
