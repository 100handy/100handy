import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { getSkillSets, getSkillTools, SkillSet, SkillTool } from '@shared/supabase/profile';

export default function SkillDetailsScreen() {
  const params = useLocalSearchParams<{ skillId: string; skillName: string }>();
  const [requiredSkillSets, setRequiredSkillSets] = useState<SkillSet[]>([]);
  const [additionalSkillSets, setAdditionalSkillSets] = useState<SkillSet[]>([]);
  const [requiredTools, setRequiredTools] = useState<SkillTool[]>([]);
  const [additionalTools, setAdditionalTools] = useState<SkillTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSkillData();
  }, [params.skillId]);

  const loadSkillData = async () => {
    if (!params.skillId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [skillSets, tools] = await Promise.all([
        getSkillSets(params.skillId),
        getSkillTools(params.skillId),
      ]);

      // Separate required and additional skill sets
      const required = skillSets.filter((s) => s.skill_type === 'required');
      const additional = skillSets.filter((s) => s.skill_type === 'additional');

      // Separate required and additional tools
      const reqTools = tools.filter((t) => t.is_required);
      const addTools = tools.filter((t) => !t.is_required);

      setRequiredSkillSets(required);
      setAdditionalSkillSets(additional);
      setRequiredTools(reqTools);
      setAdditionalTools(addTools);
    } catch (error) {
      console.error('Error loading skill data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    router.push({
      pathname: '/(professional)/skills/skill-rate',
      params: {
        skillId: params.skillId,
        skillName: params.skillName,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111827" strokeWidth={2} />
        </Pressable>
        <Text
          className="flex-1 text-center text-xl font-bold text-gray-900"
          style={{ fontFamily: 'WorkSans_700Bold' }}
        >
          {params.skillName || 'General Mounting'}
        </Text>
        <View className="w-6" />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-4 py-8">
            {/* Skills and Tools Section */}
            {(requiredSkillSets.length > 0 || requiredTools.length > 0) && (
              <View className="mb-8">
                <Text
                  className="text-lg font-bold text-gray-900 mb-4"
                  style={{ fontFamily: 'WorkSans_700Bold' }}
                >
                  Skills and tools clients expect
                </Text>
                
                {/* Required Skill Sets */}
                {requiredSkillSets.length > 0 && (
                  <View className="space-y-2 mb-4">
                    {requiredSkillSets.map((skillSet) => (
                      <View key={skillSet.id} className="flex-row items-start">
                        <View className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2 mr-3" />
                        <Text
                          className="flex-1 text-gray-700 leading-6"
                          style={{ fontFamily: 'WorkSans_400Regular' }}
                        >
                          {skillSet.description}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Required Tools */}
                {requiredTools.length > 0 && (
                  <View className="mt-4 bg-green-100 rounded-lg p-4">
                    <View className="space-y-2">
                      {requiredTools.map((tool) => (
                        <View key={tool.id} className="flex-row items-start">
                          <View className="w-1.5 h-1.5 rounded-full bg-gray-800 mt-2 mr-3" />
                          <Text
                            className="flex-1 text-gray-800 leading-6"
                            style={{ fontFamily: 'WorkSans_400Regular' }}
                          >
                            {tool.tool_name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Additional Skills Section */}
            {(additionalSkillSets.length > 0 || additionalTools.length > 0) && (
              <>
                <View className="h-px bg-gray-200 my-8" />
                <View className="mb-24">
                  <Text
                    className="text-lg font-bold text-gray-900 mb-4"
                    style={{ fontFamily: 'WorkSans_700Bold' }}
                  >
                    Additional skills and tools
                  </Text>
                  
                  {/* Additional Skill Sets */}
                  {additionalSkillSets.length > 0 && (
                    <View className="space-y-2 mb-4">
                      {additionalSkillSets.map((skillSet) => (
                        <View key={skillSet.id} className="flex-row items-start">
                          <View className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2 mr-3" />
                          <Text
                            className="flex-1 text-gray-700 leading-6"
                            style={{ fontFamily: 'WorkSans_400Regular' }}
                          >
                            {skillSet.description}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Additional Tools */}
                  {additionalTools.length > 0 && (
                    <View className="mt-4 bg-green-100 rounded-lg p-4">
                      <View className="space-y-2">
                        {additionalTools.map((tool) => (
                          <View key={tool.id} className="flex-row items-start">
                            <View className="w-1.5 h-1.5 rounded-full bg-gray-800 mt-2 mr-3" />
                            <Text
                              className="flex-1 text-gray-800 leading-6"
                              style={{ fontFamily: 'WorkSans_400Regular' }}
                            >
                              {tool.tool_name}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}

            {/* Fallback message if no data */}
            {requiredSkillSets.length === 0 &&
              additionalSkillSets.length === 0 &&
              requiredTools.length === 0 &&
              additionalTools.length === 0 && (
                <View className="mb-24">
                  <Text
                    className="text-base text-gray-600 text-center"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    No skill details available for this skill.
                  </Text>
                </View>
              )}
          </View>
        </ScrollView>
      )}

      {/* Footer Button */}
      <View className="px-4 pb-6 bg-white">
        <Pressable
          onPress={handleContinue}
          className="w-full bg-[#C1856A] rounded-full py-4 shadow-md active:opacity-80"
        >
          <Text
            className="text-center text-lg font-semibold text-white"
            style={{ fontFamily: 'WorkSans_600SemiBold' }}
          >
            Agree & continue
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
