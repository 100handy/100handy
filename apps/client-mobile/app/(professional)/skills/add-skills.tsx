import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, ChevronDown, ChevronRight, X } from 'lucide-react-native';
import { getSkillsByCategory, getUserSkills, addUserSkill, Skill } from '@shared/supabase/profile';

const CATEGORY_ICONS: Record<string, any> = {
  Assembly: '🔧',
  Cleaning: '🧹',
  'Home Improvements': '🛠️',
  Mounting: '🔩',
  Moving: '🚚',
  'Outdoor Maintenance': '🌳',
  Painting: '🎨',
  'Personal Assistance': '📋',
  Other: '📝',
};

export default function AddSkillsScreen() {
  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, Skill[]>>({});
  const [userSkillIds, setUserSkillIds] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);

    // Load all available skills
    const categorizedSkills = await getSkillsByCategory();
    setSkillsByCategory(categorizedSkills);

    // Load user's existing skills
    const userSkills = await getUserSkills();
    const skillIds = new Set(userSkills.map(us => us.skill_id));
    setUserSkillIds(skillIds);

    setIsLoading(false);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleSelectSkill = async (skill: Skill) => {
    if (userSkillIds.has(skill.id)) {
      // Already added, skip
      return;
    }

    // Add skill
    const result = await addUserSkill({ skill_id: skill.id });
    if (result) {
      setUserSkillIds(prev => new Set(prev).add(skill.id));
    }
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
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="w-10">
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text
          className="flex-1 text-center text-lg font-semibold text-[#333A31]"
          style={{ fontFamily: 'WorkSans_600SemiBold' }}
        >
          Add skills
        </Text>
        <Pressable onPress={() => router.back()} className="w-10 items-end">
          <X size={24} color="#000" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col py-4">
          {Object.entries(skillsByCategory).map(([category, skills]) => {
            const isExpanded = expandedCategories.has(category);

            return (
              <View key={category} className="flex-col border-b border-gray-100">
                {/* Category Header */}
                <Pressable
                  onPress={() => toggleCategory(category)}
                  className="px-5 py-4"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <Text className="text-xl">{CATEGORY_ICONS[category] || '📌'}</Text>
                      <Text
                        className="text-base font-semibold text-[#333A31]"
                        style={{ fontFamily: 'WorkSans_600SemiBold' }}
                      >
                        {category}
                      </Text>
                    </View>
                    {isExpanded ? (
                      <ChevronDown size={20} color="#333A31" strokeWidth={2} />
                    ) : (
                      <ChevronRight size={20} color="#333A31" strokeWidth={2} />
                    )}
                  </View>
                </Pressable>

                {/* Expanded Skills List */}
                {isExpanded && (
                  <View className="flex-col pb-2">
                    {skills.map(skill => {
                      const isSelected = userSkillIds.has(skill.id);

                      return (
                        <Pressable
                          key={skill.id}
                          onPress={() => handleSelectSkill(skill)}
                          disabled={isSelected}
                          className={`px-5 py-3 mx-5 mb-2 rounded-lg ${
                            isSelected ? 'bg-[#E8D5C4]' : 'bg-gray-50'
                          }`}
                        >
                          <View className="flex-row items-center justify-between">
                            <Text
                              className={`text-base ${
                                isSelected ? 'font-semibold text-[#333A31]' : 'text-[#666666]'
                              }`}
                              style={{
                                fontFamily: isSelected
                                  ? 'WorkSans_600SemiBold'
                                  : 'WorkSans_400Regular',
                              }}
                            >
                              {skill.name}
                            </Text>
                            {skill.is_in_demand && (
                              <View className="bg-[#8B4513] rounded px-2 py-0.5">
                                <Text
                                  className="text-[10px] font-medium text-white"
                                  style={{ fontFamily: 'WorkSans_500Medium' }}
                                >
                                  IN DEMAND
                                </Text>
                              </View>
                            )}
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
