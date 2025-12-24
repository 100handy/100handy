import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, Text, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import {
  useCategoryFormFields,
  validateFormResponses,
  shouldShowField,
  groupFieldsBySection,
  type FormResponse,
} from '@shared/supabase';
import { FormFieldRenderer } from './FormFieldRenderer';

interface DynamicFormRendererProps {
  categoryId: string;
  categoryName: string;
  initialValues?: FormResponse;
  onSubmit: (responses: FormResponse) => void;
  onCancel?: () => void;
}

export function DynamicFormRenderer({
  categoryId,
  categoryName,
  initialValues = {},
  onSubmit,
  onCancel,
}: DynamicFormRendererProps) {
  const router = useRouter();
  const { data: fields, isLoading, isError } = useCategoryFormFields(categoryId);
  const [responses, setResponses] = useState<FormResponse>(initialValues);

  // Debug logging to trace categoryId issues
  console.log('[DynamicFormRenderer] categoryId:', categoryId);
  console.log('[DynamicFormRenderer] categoryName:', categoryName);
  console.log('[DynamicFormRenderer] fields:', fields?.length ?? 'undefined', 'isLoading:', isLoading, 'isError:', isError);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Update responses when initial values change
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      setResponses(initialValues);
    }
  }, [initialValues]);

  // Filter visible fields based on conditional logic
  const visibleFields = useMemo(() => {
    if (!fields) return [];
    return fields.filter((field) => shouldShowField(field, responses));
  }, [fields, responses]);

  // Group fields by section
  const fieldsBySection = useMemo(() => {
    return groupFieldsBySection(visibleFields);
  }, [visibleFields]);

  // Validate on every change if submit was attempted
  useEffect(() => {
    if (attemptedSubmit && fields) {
      const validation = validateFormResponses(fields, responses);
      const errorMap: Record<string, string> = {};
      validation.errors.forEach((err) => {
        errorMap[err.field_key] = err.message;
      });
      setErrors(errorMap);
    }
  }, [responses, attemptedSubmit, fields]);

  const handleChange = (fieldKey: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    // Clear error for this field
    if (errors[fieldKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    if (!fields) return;

    setAttemptedSubmit(true);

    const validation = validateFormResponses(fields, responses);

    if (validation.isValid) {
      onSubmit(responses);
    } else {
      // Convert errors to map
      const errorMap: Record<string, string> = {};
      validation.errors.forEach((err) => {
        errorMap[err.field_key] = err.message;
      });
      setErrors(errorMap);

      // Scroll to first error (optional enhancement)
      // Could use a ref to scroll to the first error field
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-col flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
          <Text className="text-sm text-gray-600 mt-3">Loading form...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !fields) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-col flex-1 items-center justify-center px-6">
          <Text className="text-lg font-semibold text-[#30352D] mb-2 text-center">
            Error loading form
          </Text>
          <Text className="text-sm text-gray-600 text-center mb-4">
            Unable to load form configuration for this category
          </Text>
          <Pressable
            onPress={handleCancel}
            className="px-6 py-3 rounded-full"
            style={{ backgroundColor: '#C1856A' }}
          >
            <Text className="text-base font-semibold text-white">Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // If no fields configured, show message
  if (fields.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-col px-5 pt-4 pb-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Pressable onPress={handleCancel} className="mr-4">
              <ChevronLeft size={24} color="#000000" strokeWidth={2} />
            </Pressable>
            <Text className="flex-1 text-center text-lg font-semibold text-black mr-10">
              {categoryName}
            </Text>
            <Pressable onPress={handleCancel}>
              <Text className="text-base" style={{ color: '#C1856A' }}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-col flex-1 items-center justify-center px-6">
          <Text className="text-lg font-semibold text-[#30352D] mb-2 text-center">
            No form configured
          </Text>
          <Text className="text-sm text-gray-600 text-center mb-4">
            This category doesn't have any additional questions yet
          </Text>
          <Pressable
            onPress={() => onSubmit({})}
            className="px-6 py-3 rounded-full"
            style={{ backgroundColor: '#C1856A' }}
          >
            <Text className="text-base font-semibold text-white">Continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-col px-5 pt-4 pb-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={handleCancel} className="mr-4">
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold text-black mr-10">
            {categoryName}
          </Text>
          <Pressable onPress={handleCancel}>
            <Text className="text-base" style={{ color: '#C1856A' }}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col px-5 py-6">
          {/* Render fields grouped by section */}
          {Array.from(fieldsBySection.entries()).map(([sectionName, sectionFields], index) => (
            <View key={sectionName} className={index > 0 ? 'mt-8' : ''}>
              {/* Section header (if not 'general') */}
              {sectionName !== 'general' && (
                <Text className="text-lg font-bold text-[#30352D] mb-4 capitalize">
                  {sectionName.replace(/_/g, ' ')}
                </Text>
              )}

              {/* Render fields in this section */}
              {sectionFields.map((field) => (
                <FormFieldRenderer
                  key={field.id}
                  field={field}
                  value={responses[field.field_key]}
                  onChange={handleChange}
                  error={errors[field.field_key]}
                />
              ))}
            </View>
          ))}

          {/* Validation summary */}
          {attemptedSubmit && Object.keys(errors).length > 0 && (
            <View className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <Text className="text-sm font-semibold text-red-700 mb-2">
                Please fix the following errors:
              </Text>
              {Object.values(errors).map((error, index) => (
                <Text key={index} className="text-sm text-red-600 ml-2">
                  • {error}
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Submit Button */}
      <View className="flex-col px-5 py-4 bg-white border-t border-gray-200">
        <Pressable
          onPress={handleSubmit}
          className="w-full py-4 rounded-full items-center"
          style={{ backgroundColor: '#C1856A' }}
        >
          <Text className="text-base font-semibold text-white">Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
