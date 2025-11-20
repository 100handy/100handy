import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

export default function SkillDetailsScreen() {
  const params = useLocalSearchParams<{ skillId: string; skillName: string }>();

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

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-8">
          {/* Skills and Tools Section */}
          <View className="mb-8">
            <Text
              className="text-lg font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'WorkSans_700Bold' }}
            >
              Skills and tools clients expect
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-start">
                <View className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2 mr-3" />
                <Text
                  className="flex-1 text-gray-700 leading-6"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  Experience mounting a variety of items, including shelves, curtains, and artwork.
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2 mr-3" />
                <Text
                  className="flex-1 text-gray-700 leading-6"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  Knowledge of different wall types and appropriate mounting hardware.
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2 mr-3" />
                <Text
                  className="flex-1 text-gray-700 leading-6"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  Ability to ensure items are level and securely fastened.
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2 mr-3" />
                <Text
                  className="flex-1 text-gray-700 leading-6"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  Knowledge of how to safely work around in-wall gas, electrical, and plumbing.
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2 mr-3" />
                <Text
                  className="flex-1 text-gray-700 leading-6"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  Ability to anchor or mount furniture to walls.
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2 mr-3" />
                <Text
                  className="flex-1 text-gray-700 leading-6"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  Full-service capabilities, including unboxing and cleanup.
                </Text>
              </View>
            </View>

            {/* Tools List */}
            <View className="mt-4 bg-green-100 rounded-lg p-4">
              <View className="space-y-2">
                <View className="flex-row items-start">
                  <View className="w-1.5 h-1.5 rounded-full bg-gray-800 mt-2 mr-3" />
                  <Text
                    className="flex-1 text-gray-800 leading-6"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Power drill
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <View className="w-1.5 h-1.5 rounded-full bg-gray-800 mt-2 mr-3" />
                  <Text
                    className="flex-1 text-gray-800 leading-6"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Level
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <View className="w-1.5 h-1.5 rounded-full bg-gray-800 mt-2 mr-3" />
                  <Text
                    className="flex-1 text-gray-800 leading-6"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Stud finder
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <View className="w-1.5 h-1.5 rounded-full bg-gray-800 mt-2 mr-3" />
                  <Text
                    className="flex-1 text-gray-800 leading-6"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Screwdrivers / Screws
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <View className="w-1.5 h-1.5 rounded-full bg-gray-800 mt-2 mr-3" />
                  <Text
                    className="flex-1 text-gray-800 leading-6"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Wall anchors
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <View className="w-1.5 h-1.5 rounded-full bg-gray-800 mt-2 mr-3" />
                  <Text
                    className="flex-1 text-gray-800 leading-6"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Tape measure
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <View className="w-1.5 h-1.5 rounded-full bg-gray-800 mt-2 mr-3" />
                  <Text
                    className="flex-1 text-gray-800 leading-6"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Drop cloth
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <View className="w-1.5 h-1.5 rounded-full bg-gray-800 mt-2 mr-3" />
                  <Text
                    className="flex-1 text-gray-800 leading-6"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    6-foot ladder
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="h-px bg-gray-200 my-8" />

          {/* Additional Skills Section */}
          <View className="mb-24">
            <Text
              className="text-lg font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'WorkSans_700Bold' }}
            >
              Additional skills and tools
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-start">
                <View className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2 mr-3" />
                <Text
                  className="flex-1 text-gray-700 leading-6"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  Experience with heavy items like large mirrors or cabinets.
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2 mr-3" />
                <Text
                  className="flex-1 text-gray-700 leading-6"
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  Ability to create gallery walls or complex arrangements.
                </Text>
              </View>
            </View>

            {/* Additional Tools */}
            <View className="mt-4 bg-green-100 rounded-lg p-4">
              <View className="space-y-2">
                <View className="flex-row items-start">
                  <View className="w-1.5 h-1.5 rounded-full bg-gray-800 mt-2 mr-3" />
                  <Text
                    className="flex-1 text-gray-800 leading-6"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Hammer drill
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <View className="w-1.5 h-1.5 rounded-full bg-gray-800 mt-2 mr-3" />
                  <Text
                    className="flex-1 text-gray-800 leading-6"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Laser level
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <View className="w-1.5 h-1.5 rounded-full bg-gray-800 mt-2 mr-3" />
                  <Text
                    className="flex-1 text-gray-800 leading-6"
                    style={{ fontFamily: 'WorkSans_400Regular' }}
                  >
                    Painter's tape
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

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
