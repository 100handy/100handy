import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, Image } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { ChevronLeft } from 'lucide-react-native'; import { useRouter, useLocalSearchParams } from 'expo-router'; import { useHandymanProfile } from '@shared/query';
import { PullDownDismiss } from '@/components/ui/pull-down-dismiss';
import { goBackOrReplace } from '@/lib/navigation';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

export default function TaskDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const content = useAppContent('client_task_details', {
    'header.title': 'Task details',
    'notes.title': 'Anything else? (optional)',
    'notes.subtitle': 'Start the conversation',
    'notes.placeholder': 'For example, what supplies are needed, where to park, or timing restrictions.',
    'actions.submit': 'Review task',
  });

  // Task details from previous screens
  const taskerId = params.taskerId as string;
  const categoryId = params.categoryId as string;
  const categoryName = params.categoryName as string;
  const formResponses = params.formResponses as string | undefined;
  // Legacy params for backwards compatibility
  const taskSize = params.taskSize as string | undefined;
  const vehicleRequirement = params.vehicleRequirement as string | undefined;
  const selectedDate = params.selectedDate as string;
  const selectedTime = params.selectedTime as string;

  const [taskDetails, setTaskDetails] = useState('');

  // Fetch tasker profile for display
  const { data: profile } = useHandymanProfile(taskerId);

  const handleReviewTask = () => {
    // Merge additional_details into formResponses if present
    let finalFormResponses = formResponses;
    if (taskDetails.trim()) {
      try {
        const parsed = formResponses ? JSON.parse(formResponses) : {};
        parsed.additional_details = taskDetails.trim();
        finalFormResponses = JSON.stringify(parsed);
      } catch {
        finalFormResponses = JSON.stringify({ additional_details: taskDetails.trim() });
      }
    }

    router.push({
      pathname: '/(client)/confirm-booking',
      params: {
        taskerId,
        categoryId,
        categoryName,
        selectedDate,
        selectedTime,
        // Pass formResponses (new) or legacy params
        ...(finalFormResponses ? { formResponses: finalFormResponses } : {}),
        ...(taskSize ? { taskSize } : {}),
        ...(vehicleRequirement ? { vehicleRequirement } : {}),
        ...(!formResponses && taskDetails.trim() ? { taskDetails: taskDetails.trim() } : {}),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-col px-5 pt-4 pb-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center">
          <Pressable onPress={() => goBackOrReplace(router, '/(client)/(tabs)/home')} className="mr-4">
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </Pressable>
          <Text className="flex-1 text-lg font-semibold text-black">
            {getAppContentValue(content, 'header.title', 'Task details')}
          </Text>
        </View>
      </View>

      <PullDownDismiss onDismiss={() => goBackOrReplace(router, '/(client)/(tabs)/home')}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-col px-5 py-6">
            {/* Tasker Info Section */}
            <View className="flex-row items-start mb-6">
              <Image
                source={profile?.avatar_url ? { uri: profile.avatar_url } : require('@/assets/images/icon.png')}
                className="w-16 h-16 rounded-full bg-gray-100 mr-3"
              />
              <View className="flex-col flex-1">
                <Text className="text-base font-semibold text-[#30352D] mb-1">
                  {profile?.display_name || '100Handy Pro'}
                </Text>
              </View>
            </View>

            {/* Anything else section */}
            <View className="flex-col mb-6">
              <Text className="text-xl font-semibold text-black mb-2">
                {getAppContentValue(content, 'notes.title', 'Anything else? (optional)')}
              </Text>
              <Text className="text-sm text-gray-600 mb-4">
                {getAppContentValue(content, 'notes.subtitle', 'Start the conversation')}
              </Text>

              {/* Text Input */}
              <TextInput
                value={taskDetails}
                onChangeText={setTaskDetails}
                placeholder={getAppContentValue(content, 'notes.placeholder', 'For example, what supplies are needed, where to park, or timing restrictions.')}
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                className="bg-gray-50 rounded-lg px-4 py-3 text-base text-[#30352D]"
                style={{
                  minHeight: 200,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  fontFamily: 'System',
                }}
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View className="flex-col px-5 py-4 bg-white border-t border-gray-200">
          <Pressable
            onPress={handleReviewTask}
            className="w-full py-4 rounded-full items-center"
            style={{ backgroundColor: '#C1856A' }}
          >
            <Text className="text-base font-semibold text-white">
              {getAppContentValue(content, 'actions.submit', 'Review task')}
            </Text>
          </Pressable>
        </View>
      </PullDownDismiss>
    </SafeAreaView>
  );
}
