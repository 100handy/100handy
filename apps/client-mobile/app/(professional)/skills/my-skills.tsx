import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeft, X, Plus } from 'lucide-react-native';
import { getUserSkills, updateUserSkill, UserSkill } from '@shared/supabase/profile';

export default function MySkillsScreen() {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setIsLoading(true);
    const userSkills = await getUserSkills();
    setSkills(userSkills);
    setIsLoading(false);
  };

  const handleToggleActive = async (skillId: string, currentValue: boolean) => {
    // Optimistic update
    setSkills(prev =>
      prev.map(s => (s.id === skillId ? { ...s, is_active: !currentValue } : s))
    );

    // Update in database
    await updateUserSkill(skillId, { is_active: !currentValue });
  };

  const handleAddSkills = () => {
    router.push('/(professional)/skills/add-skills');
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
      <HStack className="items-center px-5 py-4 border-b border-gray-100">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text
          className="flex-1 text-center text-lg font-semibold text-[#333A31] pr-6"
          style={{ fontFamily: 'WorkSans_600SemiBold' }}
        >
          My Skills
        </Text>
      </HStack>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <VStack className="px-5 py-6 gap-6">
          {/* Info Banner */}
          {showBanner && skills.length > 0 && (
            <Box className="bg-[#E5E5E5] rounded-lg px-4 py-3">
              <HStack className="items-start justify-between">
                <Text
                  className="flex-1 text-sm text-[#333A31] leading-5"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  Here are skills you previously chose. Now let's add prices!
                </Text>
                <Pressable onPress={() => setShowBanner(false)} className="ml-2">
                  <X size={20} color="#333A31" />
                </Pressable>
              </HStack>
            </Box>
          )}

          {/* Skills List */}
          {skills.length === 0 ? (
            <VStack className="items-center py-12 gap-4">
              <Text
                className="text-lg font-semibold text-[#333A31] text-center"
                style={{ fontFamily: 'WorkSans_600SemiBold' }}
              >
                No skills added yet
              </Text>
              <Text
                className="text-sm text-[#666666] text-center px-8"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                Add skills to start receiving job requests
              </Text>
            </VStack>
          ) : (
            <VStack className="gap-6">
              {skills.map(userSkill => (
                <VStack key={userSkill.id} className="gap-2">
                  {/* Skill Category Label */}
                  <Text
                    className="text-base font-medium text-[#333A31]"
                    style={{ fontFamily: 'WorkSans_500Medium' }}
                  >
                    {userSkill.skill?.name}
                  </Text>

                  {/* Skill Card */}
                  <Box className="bg-[#E8D5C4] border-2 border-dashed border-[#D17852] rounded-lg p-4">
                    <VStack className="gap-3">
                      {/* Skill Name */}
                      <Text
                        className="text-lg font-semibold text-[#333A31]"
                        style={{ fontFamily: 'WorkSans_600SemiBold' }}
                      >
                        {userSkill.skill?.name}
                      </Text>

                      {/* Badges and Toggle */}
                      <HStack className="items-center justify-between">
                        <HStack className="items-center gap-2">
                          {userSkill.skill?.is_in_demand && (
                            <Box className="bg-[#8B4513] rounded px-2 py-1">
                              <Text
                                className="text-xs font-medium text-white"
                                style={{ fontFamily: 'WorkSans_500Medium' }}
                              >
                                IN DEMAND
                              </Text>
                            </Box>
                          )}
                        </HStack>

                        {/* Active Toggle */}
                        <Pressable
                          onPress={() => handleToggleActive(userSkill.id, userSkill.is_active)}
                          className={`px-4 py-1.5 rounded ${
                            userSkill.is_active ? 'bg-[#8B4513]' : 'bg-gray-400'
                          }`}
                        >
                          <Text
                            className="text-xs font-semibold text-white"
                            style={{ fontFamily: 'WorkSans_600SemiBold' }}
                          >
                            {userSkill.is_active ? 'ACTIVE' : 'INACTIVE'}
                          </Text>
                        </Pressable>
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              ))}
            </VStack>
          )}
        </VStack>
      </ScrollView>

      {/* Add Skills Button */}
      <Box className="px-5 pb-6 pt-4 bg-white border-t border-gray-100">
        <Pressable
          onPress={handleAddSkills}
          className="flex-row items-center justify-center gap-2 py-3"
        >
          <Plus size={20} color="#D17852" strokeWidth={2.5} />
          <Text
            className="text-base font-semibold text-[#D17852]"
            style={{ fontFamily: 'WorkSans_600SemiBold' }}
          >
            Add skills
          </Text>
        </Pressable>
      </Box>
    </SafeAreaView>
  );
}
