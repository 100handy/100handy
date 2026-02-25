import React, { useState, useEffect } from "react";
import {
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  ChevronLeft,
  X,
  PlusCircle,
  Wrench,
  Sparkles,
  Home,
  Frame,
  TruckIcon,
  Trees,
  PaintBucket,
  ClipboardList,
  MoreHorizontal,
  Droplet,
  Zap,
  Hammer,
} from "lucide-react-native";
import {
  getUserSkills,
  getHandyProfile,
  UserSkill,
} from "@shared/supabase/profile";

// Category icon and color mapping
const CATEGORY_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<any>;
    activeBgColor: string;
    inactiveBgColor: string;
    badgeBgColor: string;
  }
> = {
  Assembly: {
    icon: Wrench,
    activeBgColor: "#BFDBFE", // blue-200
    inactiveBgColor: "#DBEAFE", // blue-100
    badgeBgColor: "#3B82F6", // blue-500
  },
  Cleaning: {
    icon: Sparkles,
    activeBgColor: "#E9D5FF", // purple-200
    inactiveBgColor: "#F3E8FF", // purple-100
    badgeBgColor: "#A855F7", // purple-500
  },
  "Home Improvements": {
    icon: Home,
    activeBgColor: "#FED7AA", // orange-200
    inactiveBgColor: "#FFEDD5", // orange-100
    badgeBgColor: "#F97316", // orange-500
  },
  "Home Repairs": {
    icon: Hammer,
    activeBgColor: "#FCD34D", // amber-300
    inactiveBgColor: "#FEF3C7", // amber-100
    badgeBgColor: "#D97706", // amber-600
  },
  Mounting: {
    icon: Frame,
    activeBgColor: "#BBF7D0", // green-200
    inactiveBgColor: "#DCFCE7", // green-100
    badgeBgColor: "#16A34A", // green-600
  },
  Moving: {
    icon: TruckIcon,
    activeBgColor: "#FEF08A", // yellow-200
    inactiveBgColor: "#FEF9C3", // yellow-100
    badgeBgColor: "#CA8A04", // yellow-600
  },
  "Outdoor Maintenance": {
    icon: Trees,
    activeBgColor: "#A7F3D0", // emerald-200
    inactiveBgColor: "#D1FAE5", // emerald-100
    badgeBgColor: "#059669", // emerald-600
  },
  "Outdoor help": {
    icon: Trees,
    activeBgColor: "#A7F3D0", // emerald-200
    inactiveBgColor: "#D1FAE5", // emerald-100
    badgeBgColor: "#059669", // emerald-600
  },
  Plumbing: {
    icon: Droplet,
    activeBgColor: "#BFDBFE", // blue-200
    inactiveBgColor: "#DBEAFE", // blue-100
    badgeBgColor: "#2563EB", // blue-600
  },
  Electrical: {
    icon: Zap,
    activeBgColor: "#FDE047", // yellow-300
    inactiveBgColor: "#FEF9C3", // yellow-100
    badgeBgColor: "#EAB308", // yellow-500
  },
  Painting: {
    icon: PaintBucket,
    activeBgColor: "#FBCFE8", // pink-200
    inactiveBgColor: "#FCE7F3", // pink-100
    badgeBgColor: "#DB2777", // pink-600
  },
  "Personal Assistance": {
    icon: ClipboardList,
    activeBgColor: "#C7D2FE", // indigo-200
    inactiveBgColor: "#E0E7FF", // indigo-100
    badgeBgColor: "#4F46E5", // indigo-600
  },
  Other: {
    icon: MoreHorizontal,
    activeBgColor: "#E5E7EB", // gray-200
    inactiveBgColor: "#F3F4F6", // gray-100
    badgeBgColor: "#4B5563", // gray-600
  },
};

export default function MySkillsScreen() {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setIsLoading(true);
    const [userSkills, handyProfile] = await Promise.all([
      getUserSkills(),
      getHandyProfile(),
    ]);
    setSkills(userSkills);
    setIsVerified(handyProfile?.verification_status === "verified");
    setIsLoading(false);
  };

  const handleActivateSkill = (skillId: string) => {
    // Navigate to skill details to complete activation
    router.push({
      pathname: "/(professional)/skills/skill-details",
      params: {
        skillId,
        skillName:
          skills.find((s) => s.skill_id === skillId)?.skill?.name || "",
      },
    });
  };

  const handleEditRate = (userSkill: UserSkill) => {
    // Navigate to skill rate to edit
    router.push({
      pathname: "/(professional)/skills/skill-rate",
      params: {
        userSkillId: userSkill.id,
        skillId: userSkill.skill_id,
        skillName: userSkill.skill?.name || "",
        rate: ((userSkill.hourly_rate_cents || 0) / 100).toString(),
      },
    });
  };

  const handleEditSkill = (userSkill: UserSkill) => {
    // Navigate to skill edit screen
    router.push({
      pathname: "/(professional)/skills/skill-edit",
      params: {
        userSkillId: userSkill.id,
        skillId: userSkill.skill_id,
        skillName: userSkill.skill?.name || "",
      },
    });
  };

  const handleAddSkills = () => {
    router.push("/(professional)/skills/add-skills");
  };

  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      const category = skill.skill?.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, UserSkill[]>,
  );

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
      <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color="#1F2937" strokeWidth={2} />
        </Pressable>
        <Text
          className="flex-1 text-center text-xl font-bold text-gray-900 pr-6"
          style={{ fontFamily: "WorkSans_700Bold" }}
        >
          My skills
        </Text>
      </View>

      <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false}>
        <View className="flex-col px-4 py-6 gap-6">
          {/* Info Banner */}
          {showBanner && skills.length > 0 && (
            <View className="bg-green-100 rounded-lg p-4 flex-row items-start gap-3">
              <Text className="text-lg">🔥</Text>
              <Text
                className="flex-1 text-sm text-green-900 leading-5"
                style={{ fontFamily: "WorkSans_400Regular" }}
              >
                Here are the skills you previously chose. Now let&apos;s add
                prices!
              </Text>
              <Pressable onPress={() => setShowBanner(false)}>
                <X size={20} color="#166534" />
              </Pressable>
            </View>
          )}

          {/* Skills List */}
          {skills.length === 0 ? (
            <View className="flex-col items-center py-12 gap-4">
              <Text
                className="text-lg font-semibold text-gray-900 text-center"
                style={{ fontFamily: "WorkSans_600SemiBold" }}
              >
                No skills added yet
              </Text>
              <Text
                className="text-sm text-gray-600 text-center px-8"
                style={{ fontFamily: "WorkSans_400Regular" }}
              >
                Add skills to start receiving job requests
              </Text>
            </View>
          ) : (
            Object.entries(skillsByCategory).map(
              ([category, categorySkills]) => {
                const config =
                  CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other;
                const IconComponent = config.icon;

                return (
                  <View key={category} className="gap-4">
                    {/* Category Header */}
                    <View className="flex-row items-center gap-2">
                      <IconComponent
                        size={24}
                        color="#4B5563"
                        strokeWidth={2}
                      />
                      <Text
                        className="text-lg font-semibold text-gray-800"
                        style={{ fontFamily: "WorkSans_600SemiBold" }}
                      >
                        {category}
                      </Text>
                    </View>

                    {/* Category Skills */}
                    <View className="gap-3">
                      {categorySkills.map((userSkill) => {
                        const isActive =
                          userSkill.is_active &&
                          userSkill.hourly_rate_cents > 0;
                        const hourlyRate =
                          (userSkill.hourly_rate_cents || 0) / 100;

                        // Get dashed border color based on category
                        let dashedBorderColor = "#D1D5DB";
                        if (category === "Assembly")
                          dashedBorderColor = "#93C5FD";
                        else if (category === "Cleaning")
                          dashedBorderColor = "#D8B4FE";
                        else if (category === "Home Repairs")
                          dashedBorderColor = "#FCD34D";
                        else if (category === "Mounting")
                          dashedBorderColor = "#86EFAC";
                        else if (category === "Moving")
                          dashedBorderColor = "#FDE047";
                        else if (category === "Painting")
                          dashedBorderColor = "#FBCFE8";
                        else if (category === "Plumbing")
                          dashedBorderColor = "#93C5FD";
                        else if (category === "Electrical")
                          dashedBorderColor = "#FDE047";
                        else if (category === "Outdoor Maintenance")
                          dashedBorderColor = "#6EE7B7";
                        else if (category === "Outdoor help")
                          dashedBorderColor = "#6EE7B7";

                        return (
                          <View
                            key={userSkill.id}
                            className="rounded-xl p-4 flex-row justify-between items-center"
                            style={{
                              backgroundColor: isActive
                                ? config.activeBgColor
                                : config.inactiveBgColor,
                              ...((!isActive && {
                                borderWidth: 2,
                                borderStyle: "dashed",
                                borderColor: dashedBorderColor,
                              }) ||
                                {}),
                            }}
                          >
                            <View className="flex-1">
                              <Text
                                className="font-semibold text-gray-900"
                                style={{ fontFamily: "WorkSans_600SemiBold" }}
                              >
                                {userSkill.skill?.name}
                              </Text>
                              {isActive && userSkill.skill?.is_in_demand && (
                                <View className="flex-row gap-2 mt-2">
                                  <View
                                    className="rounded-full px-2 py-1"
                                    style={{
                                      backgroundColor: config.badgeBgColor,
                                    }}
                                  >
                                    <Text
                                      className="text-white text-[10px] font-bold tracking-wide"
                                      style={{ fontFamily: "WorkSans_700Bold" }}
                                    >
                                      IN DEMAND
                                    </Text>
                                  </View>
                                </View>
                              )}
                            </View>
                            {isActive ? (
                              <View className="flex-row gap-2">
                                <Pressable
                                  onPress={() => handleEditSkill(userSkill)}
                                  className="bg-[#C1856A] rounded-lg px-4 py-2"
                                  style={{
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3,
                                    elevation: 2,
                                  }}
                                >
                                  <Text
                                    className="text-white text-sm font-semibold"
                                    style={{
                                      fontFamily: "WorkSans_600SemiBold",
                                    }}
                                  >
                                    Edit
                                  </Text>
                                </Pressable>
                                <Pressable
                                  onPress={() => handleEditRate(userSkill)}
                                  className="bg-white border border-[#C1856A] rounded-lg px-4 py-2"
                                  style={{
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3,
                                    elevation: 2,
                                  }}
                                >
                                  <Text
                                    className="text-[#C1856A] text-sm font-semibold"
                                    style={{
                                      fontFamily: "WorkSans_600SemiBold",
                                    }}
                                  >
                                    £{hourlyRate}/hr
                                  </Text>
                                </Pressable>
                              </View>
                            ) : (
                              <View className="flex-col items-end gap-1 ml-3">
                                <Pressable
                                  onPress={() =>
                                    handleActivateSkill(userSkill.skill_id)
                                  }
                                  className="bg-[#C1856A] rounded-lg px-4 py-2"
                                  style={{
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3,
                                    elevation: 2,
                                  }}
                                >
                                  <Text
                                    className="text-white text-sm font-semibold"
                                    style={{
                                      fontFamily: "WorkSans_600SemiBold",
                                    }}
                                  >
                                    Activate
                                  </Text>
                                </Pressable>
                                {!isVerified && (
                                  <Text
                                    className="text-[10px] text-gray-500"
                                    style={{
                                      fontFamily: "WorkSans_400Regular",
                                    }}
                                  >
                                    Verify profile to go live
                                  </Text>
                                )}
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              },
            )
          )}
        </View>
      </ScrollView>

      {/* Floating Add Skills Button */}
      <View className="absolute bottom-8 right-6">
        <Pressable
          onPress={handleAddSkills}
          className="bg-white flex-row items-center space-x-2 px-4 py-2 rounded-full shadow-lg border border-gray-200 active:opacity-80"
        >
          <PlusCircle size={20} color="#C1856A" strokeWidth={2.5} />
          <Text
            className="text-[#C1856A] text-sm font-semibold"
            style={{ fontFamily: "WorkSans_600SemiBold" }}
          >
            Add skills
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
