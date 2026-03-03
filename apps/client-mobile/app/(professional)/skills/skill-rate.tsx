import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  Edit3,
} from "lucide-react-native";
import { updateUserSkill, getSkillRateSuggestions } from "@shared/supabase/profile";
import { toast } from "sonner-native";

const DEFAULT_HOURLY_RATES = [17, 18, 19, 20, 25, 30];
const DEFAULT_SUGGESTED_RATE = 18;
const DEFAULT_MIN_RATE = 10;
const DEFAULT_MAX_RATE = 200;

export default function SkillRateScreen() {
  const params = useLocalSearchParams<{
    userSkillId?: string;
    skillId: string;
    skillName: string;
    rate?: string;
  }>();
  const [isSavingRate, setIsSavingRate] = useState(false);

  const [hourlyRates, setHourlyRates] = useState<number[]>(DEFAULT_HOURLY_RATES);
  const [minRate, setMinRate] = useState(DEFAULT_MIN_RATE);
  const [maxRate, setMaxRate] = useState(DEFAULT_MAX_RATE);

  useEffect(() => {
    if (!params.skillId) return;
    getSkillRateSuggestions(params.skillId).then((suggestions) => {
      if (suggestions.suggestedRates.length > 0) {
        setHourlyRates(suggestions.suggestedRates);
      }
      const newMin = suggestions.minRate ?? DEFAULT_MIN_RATE;
      const newMax = suggestions.maxRate ?? DEFAULT_MAX_RATE;
      if (suggestions.minRate !== null) setMinRate(newMin);
      if (suggestions.maxRate !== null) setMaxRate(newMax);
      // Clamp selectedRate to the server-provided bounds
      setSelectedRate((prev) => Math.min(newMax, Math.max(newMin, prev)));
    }).catch(() => {
      // Fallback to defaults already set in state — no action needed
    });
  }, [params.skillId]);

  const parsedParamRate = Number.parseInt(params.rate ?? "", 10);
  const initialRate =
    Number.isNaN(parsedParamRate) ||
    parsedParamRate < DEFAULT_MIN_RATE ||
    parsedParamRate > DEFAULT_MAX_RATE
      ? DEFAULT_SUGGESTED_RATE
      : parsedParamRate;

  const [selectedRate, setSelectedRate] = useState(initialRate);
  const [showRatePicker, setShowRatePicker] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customRateText, setCustomRateText] = useState("");
  const [customRateError, setCustomRateError] = useState("");

  const faqs = [
    {
      question: "How much will I earn with Self-Set earnings?",
      answer:
        "You set your own hourly rate for tasks in a given category. You'll always keep 100% of the hourly rate you set, plus 100% of any tips clients give you. You can adjust your hourly rate at any time within the app. Your earnings, including tips, are processed once the task is completed and invoiced.",
    },
    {
      question: "How does the platform determine the suggested rate?",
      answer:
        "We analyze market data and rates set by other skilled professionals in your area to suggest a competitive price.",
    },
    {
      question:
        "Does the platform charge fees to clients in addition to my hourly rate?",
      answer:
        "Yes, clients pay a service fee on top of your hourly rate to help us operate our platform and provide support.",
    },
  ];

  const handleContinue = () => {
    router.push({
      pathname: "/(professional)/skills/skill-experience",
      params: {
        skillId: params.skillId,
        skillName: params.skillName,
        rate: selectedRate.toString(),
      },
    });
  };

  const isEditMode = Boolean(params.userSkillId);

  const handleSaveEditedRate = async () => {
    if (!params.userSkillId || isSavingRate) return;

    setIsSavingRate(true);
    try {
      const updated = await updateUserSkill(params.userSkillId, {
        hourly_rate_cents: selectedRate * 100,
      });

      if (!updated) {
        toast.error("Update failed", {
          description: "Could not update rate. Please try again.",
        });
        return;
      }

      toast.success("Rate updated");
      router.replace("/(professional)/skills/my-skills");
    } catch (error) {
      console.error("Error updating skill rate:", error);
      toast.error("Update failed", {
        description: "Could not update rate. Please try again.",
      });
    } finally {
      setIsSavingRate(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="border-b border-gray-200">
        <View className="flex-row items-center justify-center px-4 py-4">
          <Pressable onPress={() => router.back()} className="absolute left-4">
            <ChevronLeft size={24} color="#1F2937" strokeWidth={2} />
          </Pressable>
          <Text
            className="text-lg font-bold text-gray-900"
            style={{ fontFamily: "WorkSans_700Bold" }}
          >
            {params.skillName || "General Mounting"}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* Earning Structures Section */}
          <View className="mb-6">
            <Text
              className="text-xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "WorkSans_700Bold" }}
            >
              Earning Structures
            </Text>
            <Text
              className="text-base text-gray-600"
              style={{ fontFamily: "WorkSans_400Regular" }}
            >
              For this skill your earnings will be structured at a Self-Set
              rate, determined by you.
            </Text>
          </View>

          <View className="h-px bg-gray-200 my-6" />

          {/* Self-Set Hourly Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <View className="relative mr-3">
                <View className="w-8 h-8 items-center justify-center">
                  <Text className="text-2xl">👤</Text>
                </View>
                <View className="absolute -top-1 -right-1">
                  <Sparkles size={12} color="#EAB308" fill="#EAB308" />
                </View>
              </View>
              <Text
                className="text-base font-bold text-gray-900"
                style={{ fontFamily: "WorkSans_700Bold" }}
              >
                Self-Set Hourly
              </Text>
              <HelpCircle size={16} color="#10B981" className="ml-1" />
            </View>
            <Text
              className="text-base text-gray-600 mb-4"
              style={{ fontFamily: "WorkSans_400Regular" }}
            >
              This structure offers an hourly rate determined by you.
            </Text>

            {/* Rate Selector */}
            <Pressable
              onPress={() => setShowRatePicker(true)}
              className="flex-row items-center justify-between p-4 border-2 border-green-600 rounded-lg"
            >
              <Text
                className="text-base text-gray-900"
                style={{ fontFamily: "WorkSans_500Medium" }}
              >
                £{selectedRate} per hour
              </Text>
              <ChevronDown size={24} color="#1F2937" />
            </Pressable>
          </View>

          {/* FAQs Section */}
          <View className="space-y-2">
            {faqs.map((faq, index) => (
              <View key={index}>
                {expandedFAQ === index && (
                  <View className="rounded-lg bg-emerald-50 mb-2">
                    <Pressable
                      onPress={() => toggleFAQ(index)}
                      className="flex-row items-center justify-between p-4"
                    >
                      <Text
                        className="flex-1 font-medium text-gray-900 pr-2"
                        style={{ fontFamily: "WorkSans_500Medium" }}
                      >
                        {faq.question}
                      </Text>
                      <ChevronUp size={24} color="#059669" strokeWidth={2} />
                    </Pressable>
                    <View className="px-4 pb-4">
                      <Text
                        className="text-sm text-gray-600 leading-5"
                        style={{ fontFamily: "WorkSans_400Regular" }}
                      >
                        {faq.answer}
                      </Text>
                    </View>
                  </View>
                )}
                {expandedFAQ !== index && (
                  <>
                    <Pressable
                      onPress={() => toggleFAQ(index)}
                      className="flex-row items-center justify-between p-4"
                    >
                      <Text
                        className="flex-1 font-medium text-gray-900 pr-2"
                        style={{ fontFamily: "WorkSans_500Medium" }}
                      >
                        {faq.question}
                      </Text>
                      <ChevronDown size={24} color="#6B7280" strokeWidth={2} />
                    </Pressable>
                    <View className="h-px bg-gray-200" />
                  </>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="px-4 py-4 bg-white border-t border-gray-200">
        <Pressable
          onPress={isEditMode ? handleSaveEditedRate : handleContinue}
          disabled={isSavingRate}
          className={`w-full bg-[#C1856A] rounded-full py-4 ${
            isSavingRate ? "opacity-50" : "active:opacity-80"
          }`}
        >
          <Text
            className="text-center font-bold text-lg text-white"
            style={{ fontFamily: "WorkSans_700Bold" }}
          >
            {isEditMode ? (isSavingRate ? "Saving..." : "Save") : "Continue"}
          </Text>
        </Pressable>
      </View>

      {/* Rate Picker Modal */}
      <Modal
        visible={showRatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRatePicker(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-2xl pt-4 pb-8 px-6">
            {/* Handle Bar */}
            <View className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

            {/* Header */}
            <View className="flex-row items-center justify-between py-2 mb-6">
              <Pressable onPress={() => setShowRatePicker(false)}>
                <Text
                  className="text-base text-gray-600"
                  style={{ fontFamily: "WorkSans_400Regular" }}
                >
                  Cancel
                </Text>
              </Pressable>
              <Text
                className="text-lg font-semibold text-gray-900"
                style={{ fontFamily: "WorkSans_600SemiBold" }}
              >
                Self-Set Hourly Rate
              </Text>
              <Pressable
                onPress={() => {
                  if (showCustomInput) {
                    const num = parseInt(customRateText);
                    if (
                      !customRateText ||
                      isNaN(num) ||
                      num < minRate ||
                      num > maxRate
                    ) {
                      setCustomRateError(
                        `Rate must be between £${minRate} and £${maxRate}`,
                      );
                      return;
                    }
                    setSelectedRate(num);
                  }
                  setShowRatePicker(false);
                  setShowCustomInput(false);
                  setCustomRateError("");
                }}
              >
                <Text
                  className="text-base font-semibold text-[#34D399]"
                  style={{ fontFamily: "WorkSans_600SemiBold" }}
                >
                  Save
                </Text>
              </Pressable>
            </View>

            {/* Suggested Badge */}
            <View className="flex-row justify-center mb-8">
              <View className="flex-row items-center bg-emerald-50 px-3 py-1 rounded-full">
                <CheckCircle2 size={16} color="#10B981" className="mr-2" />
                <Text
                  className="text-xs font-medium text-emerald-600 tracking-wider"
                  style={{ fontFamily: "WorkSans_500Medium" }}
                >
                  SUGGESTED
                </Text>
              </View>
            </View>

            {/* Rate Options */}
            <View
              className="flex-row flex-wrap justify-center items-center mb-4"
              style={{ gap: 12 }}
            >
              {hourlyRates.map((rate: number) => {
                const isSelected = rate === selectedRate && !showCustomInput;

                // Determine styling based on selection
                let borderColor = "#A3B899"; // Default green
                let size = "w-20 h-20";
                let textSize = "text-xl";
                let textColor = "text-gray-400";
                let bgColor = "transparent";
                let fontWeight = "WorkSans_400Regular";

                if (isSelected) {
                  borderColor = "#C1856A"; // Selected brown
                  size = "w-24 h-24";
                  textSize = "text-2xl";
                  textColor = "text-gray-800";
                  bgColor = "#C1856A1A"; // Light brown background
                  fontWeight = "WorkSans_500Medium";
                }

                return (
                  <Pressable
                    key={rate}
                    onPress={() => {
                      setSelectedRate(rate);
                      setShowCustomInput(false);
                      setCustomRateError("");
                    }}
                    className={`flex-col items-center justify-center rounded-full ${size}`}
                    style={{
                      borderWidth: 3,
                      borderColor: borderColor,
                      backgroundColor: bgColor,
                      transform: isSelected
                        ? [{ scale: 1.05 }]
                        : [{ scale: 1 }],
                    }}
                  >
                    <Text
                      className={`font-bold ${textSize} ${textColor}`}
                      style={{ fontFamily: "WorkSans_700Bold" }}
                    >
                      £{rate}
                    </Text>
                    <Text
                      className={`text-[10px] tracking-widest ${textColor}`}
                      style={{
                        fontFamily: fontWeight,
                      }}
                    >
                      PER HOUR
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Custom Rate Option */}
            {!showCustomInput ? (
              <Pressable
                onPress={() => {
                  setShowCustomInput(true);
                  setCustomRateText(
                    hourlyRates.includes(selectedRate)
                      ? ""
                      : selectedRate.toString(),
                  );
                }}
                className="flex-row items-center justify-center py-3 mb-4"
              >
                <Edit3 size={16} color="#C1856A" strokeWidth={2} />
                <Text
                  className="text-sm font-medium text-[#C1856A] ml-2"
                  style={{ fontFamily: "WorkSans_500Medium" }}
                >
                  Enter custom rate
                </Text>
              </Pressable>
            ) : (
              <View className="mb-4">
                <View className="flex-row items-center justify-center mb-2">
                  <Text
                    className="text-base text-gray-700 mr-2"
                    style={{ fontFamily: "WorkSans_500Medium" }}
                  >
                    £
                  </Text>
                  <TextInput
                    value={customRateText}
                    onChangeText={(text) => {
                      // Only allow digits
                      const cleaned = text.replace(/[^0-9]/g, "");
                      setCustomRateText(cleaned);
                      setCustomRateError("");
                      const num = parseInt(cleaned);
                      if (
                        cleaned &&
                        !isNaN(num) &&
                        num >= minRate &&
                        num <= maxRate
                      ) {
                        setSelectedRate(num);
                      }
                    }}
                    placeholder={`${minRate}-${maxRate}`}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    autoFocus
                    className="border-b-2 border-[#C1856A] text-center text-2xl font-bold text-gray-800 w-24 pb-1"
                    style={{ fontFamily: "WorkSans_700Bold" }}
                  />
                  <Text
                    className="text-sm text-gray-500 ml-2"
                    style={{ fontFamily: "WorkSans_400Regular" }}
                  >
                    per hour
                  </Text>
                </View>
                {customRateError ? (
                  <Text
                    className="text-xs text-red-500 text-center"
                    style={{ fontFamily: "WorkSans_400Regular" }}
                  >
                    {customRateError}
                  </Text>
                ) : (
                  <Text
                    className="text-xs text-gray-400 text-center"
                    style={{ fontFamily: "WorkSans_400Regular" }}
                  >
                    Enter a rate between £{minRate} and £{maxRate}
                  </Text>
                )}
              </View>
            )}

            {/* Info Box */}
            <View className="bg-emerald-50 p-4 rounded-lg flex-row items-center">
              <CheckCircle2
                size={20}
                color="#10B981"
                className="mr-3 flex-shrink-0"
              />
              <Text
                className="flex-1 text-sm text-emerald-800"
                style={{ fontFamily: "WorkSans_400Regular" }}
              >
                This rate boosts your hiring chances based on demand and
                experience.
              </Text>
            </View>

            {/* Bottom Indicator */}
            <View className="w-36 h-1.5 bg-gray-800 rounded-full mx-auto mt-8" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
