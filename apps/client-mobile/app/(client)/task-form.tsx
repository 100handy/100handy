import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { DynamicFormRenderer } from '@/components/booking';
import type { FormResponse } from '@shared/supabase';

export default function TaskFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Task details from params
  const taskerId = params.taskerId as string;
  const categoryId = params.categoryId as string;
  const categoryName = params.categoryName as string;
  const selectedDate = params.selectedDate as string;
  const selectedTime = params.selectedTime as string;

  // Parse existing form responses if coming back from confirm screen
  const existingResponses = params.formResponses
    ? JSON.parse(params.formResponses as string)
    : {};

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
