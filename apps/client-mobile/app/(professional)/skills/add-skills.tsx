import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X,
  Wrench,
  Sparkles,
  Home,
  Frame,
  TruckIcon,
  Trees,
  PaintBucket,
  ClipboardList,
  MoreHorizontal,
  PlusCircle,
  Droplet,
  Zap,
  Hammer,
} from 'lucide-react-native';
import { getSkillsByCategory, getUserSkills, Skill } from '@shared/supabase/profile';
import { goBackOrReplace } from '@/lib/navigation';

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  Assembly: Wrench,
  Cleaning: Sparkles,
  'Home Improvements': Home,
  'Home Repairs': Hammer,
  Mounting: Frame,
  Moving: TruckIcon,
  'Outdoor Maintenance': Trees,
  'Outdoor help': Trees,
  Painting: PaintBucket,
  Plumbing: Droplet,
  Electrical: Zap,
  'Personal Assistance': ClipboardList,
  Other: MoreHorizontal,
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

    // Navigate to skill details flow
    router.push({
      pathname: '/(professional)/skills/skill-details',
      params: {
        skillId: skill.id,
        skillName: skill.name,
      },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#C1856A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white shadow-sm">
        <View className="flex-row items-center justify-between px-4 py-4">
          <Pressable onPress={() => goBackOrReplace(router, '/(professional)/skills/my-skills')}>
            <ChevronLeft size={28} color="#1F2937" strokeWidth={2} />
          </Pressable>
          <Text
            className="flex-1 text-center text-xl font-bold text-gray-900"
            style={{ fontFamily: 'WorkSans_700Bold' }}
          >
            Add skills
          </Text>
          <Pressable onPress={() => goBackOrReplace(router, '/(professional)/skills/my-skills')}>
            <X size={28} color="#1F2937" strokeWidth={2} />
          </Pressable>
        </View>
        <View className="border-b border-gray-200" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col py-4">
          {Object.entries(skillsByCategory).map(([category, skills]) => {
            const isExpanded = expandedCategories.has(category);
            const IconComponent = CATEGORY_ICONS[category] || MoreHorizontal;

            return (
              <View key={category} className="flex-col border-b border-gray-200">
                {/* Category Header */}
                <Pressable
                  onPress={() => toggleCategory(category)}
                  className="px-4 py-4"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-4 flex-1">
                      <IconComponent size={24} color="#4B5563" strokeWidth={2} />
                      <Text
                        className="text-lg font-medium text-gray-800"
                        style={{ fontFamily: 'WorkSans_500Medium' }}
                      >
                        {category}
                      </Text>
                    </View>
                    {isExpanded ? (
                      <ChevronUp size={28} color="#4B5563" strokeWidth={2} />
                    ) : (
                      <ChevronDown size={28} color="#4B5563" strokeWidth={2} />
                    )}
                  </View>
                </Pressable>

                {/* Expanded Skills List */}
                {isExpanded && (
                  <View className="flex-col pb-4 px-4 pl-10">
                    {skills.map(skill => {
                      const isSelected = userSkillIds.has(skill.id);

                      return (
                        <View
                          key={skill.id}
                          className="flex-row items-start justify-between py-3"
                        >
                          <View className="flex-1 flex-col gap-1">
                            <Text
                              className={`text-base font-medium ${
                                isSelected ? 'text-gray-900' : 'text-gray-900'
                              }`}
                              style={{ fontFamily: 'WorkSans_500Medium' }}
                            >
                              {skill.name}
                            </Text>
                            {skill.description && (
                              <Text
                                className="text-sm text-gray-600 mt-1"
                                style={{ fontFamily: 'WorkSans_400Regular' }}
                              >
                                {skill.description}
                              </Text>
                            )}
                            {skill.is_in_demand && (
                              <View className="mt-2">
                                <View className="bg-gray-200 self-start rounded px-2 py-1">
                                  <Text
                                    className="text-xs font-semibold text-gray-700"
                                    style={{ fontFamily: 'WorkSans_600SemiBold' }}
                                  >
                                    IN DEMAND
                                  </Text>
                                </View>
                              </View>
                            )}
                          </View>
                          <Pressable
                            onPress={() => handleSelectSkill(skill)}
                            disabled={isSelected}
                            className="ml-4 self-center p-2"
                          >
                            <PlusCircle
                              size={28}
                              color={isSelected ? '#9CA3AF' : '#6B7280'}
                              strokeWidth={2}
                            />
                          </Pressable>
                        </View>
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
