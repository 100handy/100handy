import { supabase } from './supabaseClient';
import type { FormField, FormResponse } from './types/forms';

/**
 * Get all form fields for a category, including inherited fields from parent categories
 */
export async function getCategoryFormFields(categoryId: string): Promise<FormField[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_category_form_fields', { cat_id: categoryId });

    if (error) {
      console.error('Error fetching category form fields:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCategoryFormFields:', error);
    throw error;
  }
}

/**
 * Get form fields only for a specific category (no inheritance)
 */
export async function getDirectCategoryFormFields(categoryId: string): Promise<FormField[]> {
  try {
    const { data, error } = await supabase
      .from('category_form_fields')
      .select('*')
      .eq('category_id', categoryId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching direct category form fields:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDirectCategoryFormFields:', error);
    throw error;
  }
}

/**
 * Validate form responses against field requirements
 */
export function validateFormResponses(
  fields: FormField[],
  responses: FormResponse
): { isValid: boolean; errors: Array<{ field_key: string; message: string }> } {
  const errors: Array<{ field_key: string; message: string }> = [];

  for (const field of fields) {
    const value = responses[field.field_key];

    // Check conditional logic (show_if)
    if (field.show_if) {
      const shouldShow = Object.entries(field.show_if).every(
        ([key, expectedValue]) => responses[key] === expectedValue
      );
      if (!shouldShow) continue; // Skip validation if field is hidden
    }

    // Required field validation
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field_key: field.field_key,
        message: `${field.label} is required`,
      });
      continue;
    }

    // Skip further validation if field is empty and not required
    if (value === undefined || value === null || value === '') continue;

    // Type-specific validation
    switch (field.field_type) {
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push({
            field_key: field.field_key,
            message: `${field.label} must be a valid number`,
          });
          break;
        }
        if (field.min_value !== null && field.min_value !== undefined && value < field.min_value) {
          errors.push({
            field_key: field.field_key,
            message: `${field.label} must be at least ${field.min_value}`,
          });
        }
        if (field.max_value !== null && field.max_value !== undefined && value > field.max_value) {
          errors.push({
            field_key: field.field_key,
            message: `${field.label} must be at most ${field.max_value}`,
          });
        }
        break;

      case 'text':
      case 'textarea':
        if (typeof value !== 'string') {
          errors.push({
            field_key: field.field_key,
            message: `${field.label} must be text`,
          });
          break;
        }
        if (field.min_length !== null && field.min_length !== undefined && value.length < field.min_length) {
          errors.push({
            field_key: field.field_key,
            message: `${field.label} must be at least ${field.min_length} characters`,
          });
        }
        if (field.max_length !== null && field.max_length !== undefined && value.length > field.max_length) {
          errors.push({
            field_key: field.field_key,
            message: `${field.label} must be at most ${field.max_length} characters`,
          });
        }
        if (field.pattern && !new RegExp(field.pattern).test(value)) {
          errors.push({
            field_key: field.field_key,
            message: `${field.label} format is invalid`,
          });
        }
        break;

      case 'select':
      case 'radio':
        // Validate that value is one of the valid options
        if (field.options && field.options.length > 0) {
          const validValues = field.options.map((opt) => opt.value);
          if (!validValues.includes(value)) {
            errors.push({
              field_key: field.field_key,
              message: `${field.label} has an invalid selection`,
            });
          }
        }
        break;

      case 'checkbox':
        // For checkbox, value can be boolean or array of values
        if (Array.isArray(value)) {
          // Multiple checkboxes - validate each value
          if (field.options && field.options.length > 0) {
            const validValues = field.options.map((opt) => opt.value);
            const invalidValues = value.filter((v) => !validValues.includes(v));
            if (invalidValues.length > 0) {
              errors.push({
                field_key: field.field_key,
                message: `${field.label} has invalid selections`,
              });
            }
          }
        } else if (typeof value !== 'boolean') {
          errors.push({
            field_key: field.field_key,
            message: `${field.label} must be a boolean or array`,
          });
        }
        break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Group form fields by section
 */
export function groupFieldsBySection(fields: FormField[]): Map<string, FormField[]> {
  const grouped = new Map<string, FormField[]>();

  for (const field of fields) {
    const section = field.section || 'general';
    if (!grouped.has(section)) {
      grouped.set(section, []);
    }
    grouped.get(section)!.push(field);
  }

  return grouped;
}

/**
 * Check if a field should be shown based on show_if conditions
 */
export function shouldShowField(field: FormField, responses: FormResponse): boolean {
  if (!field.show_if) return true;

  return Object.entries(field.show_if).every(
    ([key, expectedValue]) => responses[key] === expectedValue
  );
}
