/**
 * Type definitions for category-specific form fields system
 */

export type FormFieldType =
  | 'text'      // Single-line text input
  | 'textarea'  // Multi-line text input
  | 'number'    // Numeric input
  | 'select'    // Dropdown selection (single choice)
  | 'radio'     // Radio buttons (single choice)
  | 'checkbox'  // Checkboxes (multiple choice or single toggle)
  | 'address'   // Address input (for moving start/end addresses)
  | 'date'      // Date picker
  | 'time';     // Time picker

export interface FormFieldOption {
  value: string | number | boolean;
  label: string;
  description?: string;
}

export interface FormField {
  id: string;
  category_id: string;
  field_key: string;
  field_type: FormFieldType;
  label: string;
  description?: string | null;
  placeholder?: string | null;
  options?: FormFieldOption[] | null;

  // Validation
  required: boolean;
  min_value?: number | null;
  max_value?: number | null;
  min_length?: number | null;
  max_length?: number | null;
  pattern?: string | null;

  // Conditional logic
  show_if?: Record<string, any> | null;

  // Display
  display_order: number;
  section?: string | null;

  // Metadata
  created_at: string;
  updated_at: string;

  // From get_category_form_fields function
  source_category_id?: string;
}

export type FormResponse = Record<string, any>;

export interface FormValidationError {
  field_key: string;
  message: string;
}

export interface FormSection {
  name: string;
  fields: FormField[];
}

// Common form field configurations that can be reused across categories
export const COMMON_TASK_SIZE_FIELD: Omit<FormField, 'id' | 'category_id' | 'created_at' | 'updated_at' | 'source_category_id'> = {
  field_key: 'task_size',
  field_type: 'radio',
  label: 'Task Size',
  description: 'How long do you estimate this task will take?',
  options: [
    { value: 'small', label: 'Small - Est. 1 hr' },
    { value: 'medium', label: 'Medium - Est. 2-3 hrs' },
    { value: 'large', label: 'Large - Est. 4+ hrs' },
  ],
  required: true,
  display_order: 100,
  section: 'task_details',
  show_if: null,
  placeholder: null,
  min_value: null,
  max_value: null,
  min_length: null,
  max_length: null,
  pattern: null,
};

export const COMMON_VEHICLE_FIELD: Omit<FormField, 'id' | 'category_id' | 'created_at' | 'updated_at' | 'source_category_id'> = {
  field_key: 'vehicle_requirement',
  field_type: 'radio',
  label: 'Vehicle Requirement',
  description: 'Does the tasker need to bring a vehicle?',
  options: [
    { value: 'not_needed', label: 'Not needed for task' },
    { value: 'car', label: 'Task requires a car' },
    { value: 'truck', label: 'Task requires a truck' },
  ],
  required: true,
  display_order: 101,
  section: 'task_details',
  show_if: null,
  placeholder: null,
  min_value: null,
  max_value: null,
  min_length: null,
  max_length: null,
  pattern: null,
};

export const COMMON_ADDITIONAL_DETAILS_FIELD: Omit<FormField, 'id' | 'category_id' | 'created_at' | 'updated_at' | 'source_category_id'> = {
  field_key: 'additional_details',
  field_type: 'textarea',
  label: 'Tell us about the task',
  description: 'Add any additional details or requirements for this task',
  placeholder: 'For example, what supplies are needed, where to park, or timing restrictions.',
  required: false,
  display_order: 200,
  section: 'additional_info',
  show_if: null,
  options: null,
  min_value: null,
  max_value: null,
  min_length: null,
  max_length: 1000,
  pattern: null,
};
