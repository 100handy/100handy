import React, { useState, useEffect } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, CheckCircle2, X, Lightbulb } from "lucide-react-native";
import {
  getUserSkills,
  updateUserSkillDetails,
  deleteUserSkill,
  UserSkill,
} from "@shared/supabase/profile";
import { goBackOrReplace } from '@/lib/navigation';

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
      id: "basic_supplies",
      name: "Basic Supplies",
      description:
        "Multi-purpose cleaner, dish soap, bleach, floor cleaner, sponges, paper towels, rags",
    },
    {
      id: "mop",
      name: "Mop",
      description:
        "Swiffer Wet (or similar), steam mop, portable mop and traditional mop & bucket all qualify",
    },
    {
      id: "vacuum",
      name: "Vacuum",
    },
  ],
  Assembly: [
    {
      id: "screwdriver_set",
      name: "Screwdriver Set",
      description: "Flathead and Phillips screwdrivers in various sizes",
    },
    {
      id: "allen_keys",
      name: "Allen Keys / Hex Keys",
      description: "Metric and imperial sizes for furniture assembly",
    },
    {
      id: "power_drill",
      name: "Power Drill",
      description: "Cordless drill with various drill bits",
    },
    {
      id: "measuring_tape",
      name: "Measuring Tape",
      description: "At least 5m/16ft measuring tape",
    },
    {
      id: "level",
      name: "Spirit Level",
      description: "For ensuring items are straight and level",
    },
    {
      id: "hammer",
      name: "Hammer",
      description: "Claw hammer for assembly tasks",
    },
  ],
  Mounting: [
    {
      id: "stud_finder",
      name: "Stud Finder",
      description: "Electronic stud finder for locating wall studs",
    },
    {
      id: "drill",
      name: "Power Drill",
      description: "With masonry and wood drill bits",
    },
    {
      id: "level",
      name: "Spirit Level",
      description: "Or laser level for precise alignment",
    },
    {
      id: "anchors",
      name: "Wall Anchors",
      description: "Various sizes for different wall types",
    },
    {
      id: "screws",
      name: "Assorted Screws",
      description: "Different lengths and types for various mounts",
    },
  ],
  "Home Repairs": [
    {
      id: "toolkit",
      name: "Basic Toolkit",
      description: "Hammer, screwdrivers, pliers, wrench set",
    },
    {
      id: "caulk_gun",
      name: "Caulk Gun",
      description: "For sealing and waterproofing",
    },
    {
      id: "patch_kit",
      name: "Drywall Patch Kit",
      description: "For repairing holes in walls",
    },
    {
      id: "paint_supplies",
      name: "Paint Supplies",
      description: "Brushes, rollers, painter's tape, drop cloths",
    },
  ],
  "Home Improvements": [
    {
      id: "power_tools",
      name: "Power Tools",
      description: "Circular saw, jigsaw, or multi-tool",
    },
    {
      id: "measuring_tools",
      name: "Measuring Tools",
      description: "Tape measure, laser measure, combination square",
    },
    {
      id: "safety_gear",
      name: "Safety Equipment",
      description: "Safety glasses, work gloves, dust mask",
    },
    {
      id: "fasteners",
      name: "Assorted Fasteners",
      description: "Screws, nails, anchors, brackets",
    },
  ],
  Moving: [
    {
      id: "dolly",
      name: "Hand Truck / Dolly",
      description: "For moving heavy boxes and furniture",
    },
    {
      id: "furniture_sliders",
      name: "Furniture Sliders",
      description: "To move heavy furniture without damage",
    },
    {
      id: "moving_blankets",
      name: "Moving Blankets",
      description: "For protecting furniture during transport",
    },
    {
      id: "straps",
      name: "Moving Straps",
      description: "For securing items and easier lifting",
    },
    {
      id: "boxes",
      name: "Moving Boxes",
      description: "Various sizes for packing items",
    },
  ],
  "Outdoor Maintenance": [
    {
      id: "lawn_mower",
      name: "Lawn Mower",
      description: "Push mower or ride-on depending on job size",
    },
    {
      id: "trimmer",
      name: "String Trimmer",
      description: "For edging and hard-to-reach areas",
    },
    {
      id: "hedge_trimmer",
      name: "Hedge Trimmer",
      description: "Manual or electric hedge clippers",
    },
    {
      id: "rake",
      name: "Rake & Shovel",
      description: "For garden maintenance and cleanup",
    },
    {
      id: "blower",
      name: "Leaf Blower",
      description: "For efficient yard cleanup",
    },
  ],
  Plumbing: [
    {
      id: "pipe_wrench",
      name: "Pipe Wrench",
      description: "Adjustable wrench for pipes and fittings",
    },
    {
      id: "plunger",
      name: "Plunger",
      description: "For clearing blocked drains and toilets",
    },
    {
      id: "plumber_tape",
      name: "Plumber's Tape",
      description: "For sealing threaded pipe connections",
    },
    {
      id: "drain_snake",
      name: "Drain Snake",
      description: "For clearing stubborn clogs",
    },
    {
      id: "basin_wrench",
      name: "Basin Wrench",
      description: "For working in tight spaces under sinks",
    },
  ],
  Electrical: [
    {
      id: "voltage_tester",
      name: "Voltage Tester",
      description: "Non-contact voltage detector for safety",
    },
    {
      id: "wire_stripper",
      name: "Wire Stripper",
      description: "For preparing electrical wires",
    },
    {
      id: "multimeter",
      name: "Multimeter",
      description: "For testing voltage, current, and resistance",
    },
    {
      id: "electrical_tape",
      name: "Electrical Tape",
      description: "For insulating wire connections",
    },
    {
      id: "wire_nuts",
      name: "Wire Nuts",
      description: "Assorted sizes for connecting wires",
    },
  ],
  Painting: [
    {
      id: "brushes",
      name: "Paint Brushes",
      description: "Various sizes for different surfaces",
    },
    {
      id: "rollers",
      name: "Paint Rollers",
      description: "With extension poles for walls and ceilings",
    },
    {
      id: "trays",
      name: "Paint Trays",
      description: "For holding paint while rolling",
    },
    {
      id: "tape",
      name: "Painter's Tape",
      description: "For clean edges and masking",
    },
    {
      id: "drop_cloths",
      name: "Drop Cloths",
      description: "For protecting floors and furniture",
    },
    {
      id: "caulk_gun",
      name: "Caulk Gun",
      description: "For sealing gaps before painting",
    },
  ],
  "Personal Assistance": [
    {
      id: "laptop",
      name: "Laptop/Tablet",
      description: "For administrative and organizational tasks",
    },
    {
      id: "phone",
      name: "Smartphone",
      description: "For communication and scheduling",
    },
    {
      id: "organizer",
      name: "Organizational Tools",
      description: "Planners, folders, labels, storage bins",
    },
    {
      id: "vehicle",
      name: "Reliable Vehicle",
      description: "For errands and transportation tasks",
    },
  ],
  Other: [
    {
      id: "basic_tools",
      name: "Basic Hand Tools",
      description: "General toolkit for miscellaneous tasks",
    },
    {
      id: "measuring_tape",
      name: "Measuring Tape",
      description: "For accurate measurements",
    },
    {
      id: "safety_gear",
      name: "Safety Equipment",
      description: "Gloves, safety glasses as needed",
    },
  ],
};

// Tips per category (can be expanded)
const TIPS_BY_CATEGORY: Record<string, string[]> = {
  Cleaning: [
    "Always bring your own cleaning supplies to show professionalism",
    "Use eco-friendly products when possible - clients appreciate this",
    "Take before and after photos to showcase your work",
    "Focus on high-traffic areas like kitchens and bathrooms",
    "Don't forget to clean behind and under appliances",
    "Use proper safety equipment (gloves, masks)",
  ],
  Assembly: [
    "Read instructions thoroughly before starting",
    "Organize all parts before beginning assembly",
    "Use the right tools for each step",
    "Double-check alignment before tightening screws",
    "Test all moving parts before completing the job",
  ],
  Mounting: [
    "Always use a stud finder for heavy items",
    "Check for electrical wires and plumbing before drilling",
    "Use appropriate anchors for wall type",
    "Level everything carefully - use a laser level for best results",
    "Test the mount before leaving",
  ],
  "Home Repairs": [
    "Always assess the full scope before starting",
    "Have backup materials in case of mistakes",
    "Protect floors and furniture with drop cloths",
    "Clean up thoroughly after completing repairs",
    "Take photos before and after for documentation",
  ],
  "Home Improvements": [
    "Plan the project thoroughly before starting",
    "Measure twice, cut once",
    "Have all materials ready before beginning",
    "Work systematically from top to bottom",
    "Allow proper drying/curing time between steps",
  ],
  Moving: [
    "Label all boxes with contents and destination room",
    "Protect fragile items with bubble wrap or blankets",
    "Use proper lifting techniques to avoid injury",
    "Take photos of furniture before disassembling",
    "Keep important documents and valuables separate",
  ],
  "Outdoor Maintenance": [
    "Check weather forecast before scheduling outdoor work",
    "Clear debris before starting lawn or garden work",
    "Use ear protection when operating loud equipment",
    "Dispose of yard waste properly according to local regulations",
    "Water plants early morning or evening to prevent evaporation",
  ],
  Plumbing: [
    "Always shut off water supply before starting",
    "Have a bucket ready to catch any residual water",
    "Know when to call a licensed plumber for complex issues",
    "Test all connections thoroughly before finishing",
    "Clean up any water spills immediately to prevent damage",
  ],
  Electrical: [
    "Always turn off power at the breaker before working",
    "Use a voltage tester to confirm power is off",
    "Never work on live electrical components",
    "Follow local electrical codes and regulations",
    "Know when to call a licensed electrician",
  ],
  Painting: [
    "Proper prep is 80% of a good paint job",
    "Use primer on new or repaired surfaces",
    "Apply thin, even coats rather than thick layers",
    "Allow proper drying time between coats",
    "Remove tape carefully while paint is still slightly tacky",
  ],
  "Personal Assistance": [
    "Communicate clearly and confirm details",
    "Be punctual and professional at all times",
    "Maintain confidentiality with personal information",
    "Keep detailed notes and follow up on tasks",
    "Ask clarifying questions when instructions are unclear",
  ],
  Other: [
    "Communicate clearly with clients about expectations",
    "Arrive on time and prepared for the task",
    "Ask questions if requirements are unclear",
    "Provide updates on progress throughout the job",
    "Ensure client satisfaction before completing the task",
  ],
};

export default function SkillEditScreen() {
  const params = useLocalSearchParams<{
    userSkillId: string;
    skillId: string;
    skillName: string;
  }>();
  const [userSkill, setUserSkill] = useState<UserSkill | null>(null);
  const [experience, setExperience] = useState("");
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
        setExperience(found.experience_description || "");
        setSuppliesOwned(new Set(found.supplies_owned || []));
      }
    } catch (error) {
      console.error("Error loading user skill:", error);
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
      goBackOrReplace(router, '/(professional)/skills/my-skills');
    } catch (error) {
      console.error("Error saving skill details:", error);
      Alert.alert("Error", "Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSkill = () => {
    if (!userSkill) return;

    Alert.alert(
      "Remove Skill",
      "Are you sure you want to remove this skill? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const success = await deleteUserSkill(userSkill.id);
            if (success) {
              router.replace("/(professional)/skills/my-skills");
            } else {
              Alert.alert("Error", "Failed to remove skill. Please try again.");
            }
          },
        },
      ],
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
      pathname: "/(professional)/skills/skill-details",
      params: {
        skillId: params.skillId || userSkill?.skill_id || "",
        skillName: params.skillName || userSkill?.skill?.name || "",
      },
    });
  };

  const skillCategory = userSkill?.skill?.category || "";
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
        <Text
          className="text-lg text-gray-600 text-center"
          style={{ fontFamily: "WorkSans_400Regular" }}
        >
          Skill not found
        </Text>
        <Pressable onPress={() => goBackOrReplace(router, '/(professional)/skills/my-skills')} className="mt-4">
          <Text
            className="text-[#C1856A] font-semibold"
            style={{ fontFamily: "WorkSans_600SemiBold" }}
          >
            Go Back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="border-b border-gray-200">
          <View className="flex-row items-center justify-center px-4 py-4">
            <Pressable
              onPress={() => router.back()}
              className="absolute left-4"
            >
              <ChevronLeft size={24} color="#1F2937" strokeWidth={2} />
            </Pressable>
            <Text
              className="text-lg font-bold text-gray-900"
              style={{ fontFamily: "WorkSans_700Bold" }}
            >
              {params.skillName || userSkill.skill?.name || "Skill Details"}
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
                  style={{ fontFamily: "WorkSans_400Regular", lineHeight: 22 }}
                />
                <Text
                  className="absolute bottom-2 right-0 text-sm text-gray-400"
                  style={{ fontFamily: "WorkSans_400Regular" }}
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
                  style={{ fontFamily: "WorkSans_700Bold" }}
                >
                  Supplies
                </Text>
                <Text
                  className="text-base text-gray-600 mb-6"
                  style={{ fontFamily: "WorkSans_400Regular", lineHeight: 22 }}
                >
                  Clients expect you to bring supplies, and you will only be
                  hired if you have them.
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
                            color={isOwned ? "#10B981" : "#D1D5DB"}
                            fill={isOwned ? "#10B981" : "transparent"}
                            strokeWidth={2}
                          />
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-base font-semibold text-gray-900"
                            style={{ fontFamily: "WorkSans_600SemiBold" }}
                          >
                            {supply.name}
                          </Text>
                          {supply.description && (
                            <Text
                              className="text-sm text-gray-500 mt-1"
                              style={{
                                fontFamily: "WorkSans_400Regular",
                                lineHeight: 20,
                              }}
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
                style={{ fontFamily: "WorkSans_700Bold" }}
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
                  style={{ fontFamily: "WorkSans_700Bold" }}
                >
                  {skillCategory || "Skill"} Tips
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
                style={{ fontFamily: "WorkSans_700Bold" }}
              >
                View Expectations
              </Text>
            </Pressable>

            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              className={`w-full bg-[#C1856A] rounded-full py-4 ${
                isSaving ? "opacity-50" : "active:opacity-80"
              }`}
            >
              <Text
                className="text-center text-base font-bold text-white"
                style={{ fontFamily: "WorkSans_700Bold" }}
              >
                {isSaving ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </View>

          {/* Home Indicator */}
          <View className="w-32 h-1 bg-gray-900 rounded-full mx-auto mt-4" />
        </View>

        {/* Tips Modal */}
        <Modal
          visible={showTipsModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTipsModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <Lightbulb size={24} color="#10B981" />
                  <Text
                    className="text-xl font-bold text-gray-900"
                    style={{ fontFamily: "WorkSans_700Bold" }}
                  >
                    {params.skillName || userSkill.skill?.name || "Skill"} Tips
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
                        style={{ fontFamily: "WorkSans_400Regular" }}
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
