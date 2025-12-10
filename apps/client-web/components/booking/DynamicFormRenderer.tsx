'use client';

import React, { useState, useMemo } from 'react';
import { FormFieldRenderer } from './FormFieldRenderer';
import { Button } from '@/components/ui/button';
import {
  useCategoryFormFields,
  validateFormResponses,
  shouldShowField,
  groupFieldsBySection,
  type FormResponse,
} from '@shared/supabase';

interface DynamicFormRendererProps {
  categoryId: string;
  categoryName: string;
  initialValues?: FormResponse;
  onSubmit: (formResponses: FormResponse) => void;
  onCancel?: () => void;
  submitButtonText?: string;
  showCancelButton?: boolean;
}

// Helper function to format snake_case section names to Title Case
function formatSectionName(section: string): string {
  return section
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function DynamicFormRenderer({
  categoryId,
  categoryName,
  initialValues = {},
  onSubmit,
  onCancel,
  submitButtonText = 'Continue',
  showCancelButton = false,
}: DynamicFormRendererProps) {
  const [responses, setResponses] = useState<FormResponse>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch form fields for this category
  const { data: fields, isLoading, error: fetchError } = useCategoryFormFields(categoryId);

  // Filter visible fields based on show_if conditions
  const visibleFields = useMemo(() => {
    if (!fields) return [];
    return fields.filter((field) => shouldShowField(field, responses));
  }, [fields, responses]);

  // Group fields by section
  const fieldsBySection = useMemo(() => {
    return groupFieldsBySection(visibleFields);
  }, [visibleFields]);

  const handleFieldChange = (fieldKey: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    // Clear error for this field when user starts typing
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

    // Validate form responses
    const validation = validateFormResponses(fields, responses);

    if (!validation.isValid) {
      // Convert errors array to error map
      const errorMap: Record<string, string> = {};
      validation.errors.forEach((err) => {
        errorMap[err.field_key] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    // Clear errors and submit
    setErrors({});
    onSubmit(responses);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-terracotta"></div>
        <p className="ml-4 text-gray-600">Loading form...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm">
          Failed to load form fields. Please try again or contact support.
        </p>
      </div>
    );
  }

  if (!fields || fields.length === 0) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            No additional details needed for this category. You can proceed to browse available pros.
          </p>
        </div>
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            onClick={() => onSubmit({})}
            className="bg-brand-terracotta hover:bg-brand-coral text-white px-8 py-2 rounded-full"
          >
            {submitButtonText}
          </Button>
        </div>
      </div>
    );
  }

  // Get sections in order (null/undefined sections come last)
  const sections = Array.from(fieldsBySection.keys()).sort((a, b) => {
    if (a === 'general') return -1;
    if (b === 'general') return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-6">
      {/* Form Title */}
      <div>
        <h2 className="text-brand-dark font-semibold text-lg">Task options</h2>
        <p className="text-sm text-gray-600 mt-1">
          Provide details to help us match you with the right professional
        </p>
      </div>

      {/* Form Sections */}
      {sections.map((section) => {
        const sectionFields = fieldsBySection.get(section) || [];

        return (
          <div key={section} className="bg-white rounded-lg border border-gray-300 p-6">
            {section !== 'general' && (
              <h3 className="text-brand-dark font-semibold text-base mb-4">
                {formatSectionName(section)}
              </h3>
            )}

            {sectionFields.map((field) => (
              <FormFieldRenderer
                key={field.id}
                field={field}
                value={responses[field.field_key]}
                onChange={handleFieldChange}
                error={errors[field.field_key]}
              />
            ))}
          </div>
        );
      })}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        {showCancelButton && onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-brand-dark px-8 py-2 rounded-full"
          >
            Cancel
          </Button>
        )}
        <Button
          type="button"
          onClick={handleSubmit}
          className="bg-brand-terracotta hover:bg-brand-coral text-white px-8 py-2 rounded-full"
        >
          {submitButtonText}
        </Button>
      </div>

      {/* General Error Message */}
      {Object.keys(errors).length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">
            Please fix the errors above before continuing
          </p>
        </div>
      )}
    </div>
  );
}
