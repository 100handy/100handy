import React from 'react';
import { View, Text, Pressable } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { useRouter, useLocalSearchParams } from 'expo-router'; import { ChevronLeft } from 'lucide-react-native'; import { DynamicFormRenderer } from '@/components/booking'; import type { FormResponse } from '@shared/supabase';

export default function TaskFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Task details from params
  const taskerId = params.taskerId as string;
  const categoryId = typeof params.categoryId === 'string' ? params.categoryId : '';
  const categoryName = typeof params.categoryName === 'string' ? params.categoryName : '';
  const selectedDate = params.selectedDate as string;
  const selectedTime = params.selectedTime as string;

  // Validate categoryId - show error if invalid
  if (!categoryId || categoryId === 'undefined') {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center px-5 pt-4 pb-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="mr-4">
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold text-black mr-10">
            Task Form
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base font-semibold text-gray-900 mb-2 text-center">
            Invalid category
          </Text>
          <Text className="text-sm text-gray-600 text-center mb-6">
            The task category could not be determined. Please go back and try again.
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="px-8 py-3 rounded-full"
            style={{ backgroundColor: '#C1856A' }}
          >
            <Text className="text-white font-medium">Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Parse existing form responses if coming back from confirm screen
  let existingResponses = {};
  if (params.formResponses) {
    try {
      existingResponses = JSON.parse(params.formResponses as string);
    } catch (e) {
      console.error('[TaskFormScreen] Failed to parse formResponses:', e);
    }
  }

  const handleSubmit = (formResponses: FormResponse) => {
    // Navigate to confirm booking with form responses
    router.push({
      pathname: '/(client)/confirm-booking',
      params: {
        taskerId,
        categoryId,
        categoryName,
        selectedDate,
        selectedTime,
        formResponses: JSON.stringify(formResponses),
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <DynamicFormRenderer
      categoryId={categoryId}
      categoryName={categoryName}
      initialValues={existingResponses}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
