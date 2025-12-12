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
import { ChevronLeft, Check, X, Lightbulb } from 'lucide-react-native';
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
        <View className="flex-row items-center justify-between px-4 py-5 border-b border-gray-200">
          <Pressable onPress={() => router.back()}>
            <ChevronLeft size={24} color="#111827" strokeWidth={2} />
          </Pressable>
          <Text
            className="flex-1 text-center text-xl font-bold text-gray-900"
            style={{ fontFamily: 'WorkSans_700Bold' }}
          >
            {params.skillName || userSkill.skill?.name || 'Skill Details'}
          </Text>
          <View className="w-6" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-4 py-8">
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
                  className="w-full border border-gray-300 rounded-lg p-5 text-base text-gray-900 min-h-[140px]"
                  style={{ fontFamily: 'WorkSans_400Regular', lineHeight: 22 }}
                />
                <Text
                  className="absolute bottom-4 right-4 text-sm text-gray-500"
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
                  className="text-lg font-bold text-gray-900 mb-3"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  Supplies
                </Text>
                <Text
                  className="text-sm text-gray-600 mb-5"
                  style={{ fontFamily: 'WorkSans_400Regular', lineHeight: 20 }}
                >
                  Clients expect you to bring supplies, and you will only be hired if you have them.
                </Text>

                <View className="space-y-4">
                  {supplies.map((supply) => {
                    const isOwned = suppliesOwned.has(supply.id);
                    return (
                      <Pressable
                        key={supply.id}
                        onPress={() => handleToggleSupply(supply.id)}
                        className="flex-row items-start p-5 border border-gray-200 rounded-lg"
                        style={{
                          backgroundColor: isOwned ? '#F0FDF4' : 'white',
                          borderColor: isOwned ? '#10B981' : '#E5E7EB',
                        }}
                      >
                        <View
                          className="w-6 h-6 rounded border-2 items-center justify-center mr-4 mt-0.5"
                          style={{
                            borderColor: isOwned ? '#10B981' : '#D1D5DB',
                            backgroundColor: isOwned ? '#10B981' : 'white',
                          }}
                        >
                          {isOwned && <Check size={16} color="white" strokeWidth={3} />}
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-base font-semibold text-gray-900 mb-2"
                            style={{ fontFamily: 'WorkSans_600SemiBold' }}
                          >
                            {supply.name}
                          </Text>
                          {supply.description && (
                            <Text
                              className="text-sm text-gray-600"
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
        <View className="px-4 pb-8 bg-white border-t border-gray-200 pt-6">
          <View className="space-y-4">
            {/* Remove Skill */}
            <Pressable
              onPress={handleRemoveSkill}
              className="w-full border-2 border-gray-300 rounded-lg py-4 active:opacity-80"
            >
              <Text
                className="text-center text-base font-semibold text-gray-700"
                style={{ fontFamily: 'WorkSans_600SemiBold' }}
              >
                Remove this Skill
              </Text>
            </Pressable>

            {/* Tips Button */}
            {tips.length > 0 && (
              <Pressable
                onPress={() => setShowTipsModal(true)}
                className="w-full border-2 border-gray-300 rounded-lg py-3 active:opacity-80"
              >
                <Text
                  className="text-center text-base font-semibold text-gray-700"
                  style={{ fontFamily: 'WorkSans_600SemiBold' }}
                >
                  {params.skillName || userSkill.skill?.name || 'Skill'} Tips
                </Text>
              </Pressable>
            )}

            {/* View Expectations */}
            <Pressable
              onPress={handleViewExpectations}
              className="w-full border-2 border-gray-300 rounded-lg py-4 active:opacity-80"
            >
              <Text
                className="text-center text-base font-semibold text-gray-700"
                style={{ fontFamily: 'WorkSans_600SemiBold' }}
              >
                View Expectations
              </Text>
            </Pressable>

            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              className={`w-full bg-[#C1856A] rounded-lg py-5 shadow-md ${
                isSaving ? 'opacity-50' : 'active:opacity-80'
              }`}
            >
              <Text
                className="text-center text-lg font-semibold text-white"
                style={{ fontFamily: 'WorkSans_600SemiBold' }}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </Pressable>
          </View>
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
