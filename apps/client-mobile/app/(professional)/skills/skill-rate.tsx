import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronDown, ChevronUp, HelpCircle, CheckCircle2, Sparkles } from 'lucide-react-native';

const HOURLY_RATES = [17, 18, 19, 20, 25, 30];
const SUGGESTED_RATE = 18;

export default function SkillRateScreen() {
  const params = useLocalSearchParams<{ skillId: string; skillName: string }>();
  const [selectedRate, setSelectedRate] = useState(SUGGESTED_RATE);
  const [showRatePicker, setShowRatePicker] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How much will I earn with Self-Set earnings?',
      answer:
        "You set your own hourly rate for tasks in a given category. You'll always keep 100% of the hourly rate you set, plus 100% of any tips clients give you. You can adjust your hourly rate at any time within the app. Your earnings, including tips, are processed once the task is completed and invoiced.",
    },
    {
      question: 'How does the platform determine the suggested rate?',
      answer:
        'We analyze market data and rates set by other skilled professionals in your area to suggest a competitive price.',
    },
    {
      question: 'Does the platform charge fees to clients in addition to my hourly rate?',
      answer:
        'Yes, clients pay a service fee on top of your hourly rate to help us operate our platform and provide support.',
    },
  ];

  const handleContinue = () => {
    router.push({
      pathname: '/(professional)/skills/skill-experience',
      params: {
        skillId: params.skillId,
        skillName: params.skillName,
        rate: selectedRate.toString(),
      },
    });
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
            style={{ fontFamily: 'WorkSans_700Bold' }}
          >
            {params.skillName || 'General Mounting'}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* Earning Structures Section */}
          <View className="mb-6">
            <Text
              className="text-xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: 'WorkSans_700Bold' }}
            >
              Earning Structures
            </Text>
            <Text
              className="text-base text-gray-600"
              style={{ fontFamily: 'WorkSans_400Regular' }}
            >
              For this skill your earnings will be structured at a Self-Set rate, determined by you.
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
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                Self-Set Hourly
              </Text>
              <HelpCircle size={16} color="#10B981" className="ml-1" />
            </View>
            <Text
              className="text-base text-gray-600 mb-4"
              style={{ fontFamily: 'WorkSans_400Regular' }}
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
                style={{ fontFamily: 'WorkSans_500Medium' }}
              >
                ${selectedRate} per hour
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
                        style={{ fontFamily: 'WorkSans_500Medium' }}
                      >
                        {faq.question}
                      </Text>
                      <ChevronUp size={24} color="#059669" strokeWidth={2} />
                    </Pressable>
                    <View className="px-4 pb-4">
                      <Text
                        className="text-sm text-gray-600 leading-5"
                        style={{ fontFamily: 'WorkSans_400Regular' }}
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
                        style={{ fontFamily: 'WorkSans_500Medium' }}
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
          onPress={handleContinue}
          className="w-full bg-[#C1856A] rounded-full py-4 active:opacity-80"
        >
          <Text
            className="text-center font-bold text-lg text-white"
            style={{ fontFamily: 'WorkSans_700Bold' }}
          >
            Continue
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
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  Cancel
                </Text>
              </Pressable>
              <Text
                className="text-lg font-semibold text-gray-900"
                style={{ fontFamily: 'WorkSans_600SemiBold' }}
              >
                Self-Set Hourly Rate
              </Text>
              <Pressable onPress={() => setShowRatePicker(false)}>
                <Text
                  className="text-base font-semibold text-[#34D399]"
                  style={{ fontFamily: 'WorkSans_600SemiBold' }}
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
                  style={{ fontFamily: 'WorkSans_500Medium' }}
                >
                  SUGGESTED
                </Text>
              </View>
            </View>

            {/* Rate Options */}
            <View className="flex-row justify-around items-center mb-8">
              {[17, 18, 19].map((rate) => {
                const isSuggested = rate === SUGGESTED_RATE;
                const isSelected = rate === selectedRate;

                // Determine styling based on selection
                let borderColor = '#A3B899'; // Default green
                let size = 'w-28 h-28';
                let textSize = 'text-3xl';
                let textColor = 'text-gray-400';
                let bgColor = 'transparent';
                let fontWeight = 'WorkSans_400Regular';

                if (isSelected) {
                  borderColor = '#C1856A'; // Selected brown
                  size = 'w-32 h-32';
                  textSize = 'text-4xl';
                  textColor = 'text-gray-800';
                  bgColor = '#C1856A1A'; // Light brown background
                  fontWeight = 'WorkSans_500Medium';
                }

                return (
                  <Pressable
                    key={rate}
                    onPress={() => setSelectedRate(rate)}
                    className={`flex-col items-center justify-center rounded-full ${size}`}
                    style={{
                      borderWidth: 3,
                      borderColor: borderColor,
                      backgroundColor: bgColor,
                      transform: isSelected ? [{ scale: 1.05 }] : [{ scale: 1 }],
                    }}
                  >
                    <Text
                      className={`font-bold ${textSize} ${textColor}`}
                      style={{ fontFamily: 'WorkSans_700Bold' }}
                    >
                      ${rate}
                    </Text>
                    <Text
                      className={`text-xs tracking-widest ${textColor}`}
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

            {/* Info Box */}
            <View className="bg-emerald-50 p-4 rounded-lg flex-row items-center">
              <CheckCircle2 size={20} color="#10B981" className="mr-3 flex-shrink-0" />
              <Text
                className="flex-1 text-sm text-emerald-800"
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                This rate boosts your hiring chances based on demand and experience.
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
