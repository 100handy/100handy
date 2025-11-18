/**
 * Corrected seed script for category-specific form fields
 * Maps specification categories to actual database category names
 *
 * Run: npx tsx supabase/seed-category-forms-corrected.ts > supabase/seed-corrected.sql
 */

import type { FormFieldOption } from '../packages/shared/supabase/types/forms';

type FormFieldConfig = {
  field_key: string;
  field_type: 'text' | 'select' | 'radio' | 'checkbox' | 'number' | 'textarea' | 'address' | 'date' | 'time';
  label: string;
  description?: string;
  placeholder?: string;
  options?: FormFieldOption[];
  required: boolean;
  min_value?: number;
  max_value?: number;
  min_length?: number;
  max_length?: number;
  show_if?: Record<string, any>;
  display_order: number;
  section?: string;
};

type CategoryFormConfig = {
  category_name: string; // Actual database category name
  fields: FormFieldConfig[];
};

// Common field configurations
const COMMON_TASK_SIZE: FormFieldConfig = {
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
};

const COMMON_VEHICLE: FormFieldConfig = {
  field_key: 'vehicle_requirement',
  field_type: 'radio',
  label: 'Vehicle Requirement',
  options: [
    { value: 'not_needed', label: 'Not needed for task' },
    { value: 'car', label: 'Task requires a car' },
    { value: 'truck', label: 'Task requires a truck' },
  ],
  required: true,
  display_order: 101,
  section: 'task_details',
};

const COMMON_ADDITIONAL_DETAILS: FormFieldConfig = {
  field_key: 'additional_details',
  field_type: 'textarea',
  label: 'Tell us about the task',
  placeholder: 'For example, what supplies are needed, where to park, or timing restrictions.',
  required: false,
  max_length: 1000,
  display_order: 200,
  section: 'additional_info',
};

const MOVING_START_ADDRESS: FormFieldConfig = {
  field_key: 'start_address',
  field_type: 'address',
  label: 'Start address',
  description: 'Where should the tasker pick up from?',
  required: true,
  display_order: 1,
  section: 'location',
};

const MOVING_END_ADDRESS: FormFieldConfig = {
  field_key: 'end_address',
  field_type: 'address',
  label: 'End address',
  description: 'Where should the tasker deliver to?',
  required: true,
  display_order: 2,
  section: 'location',
};

// ============================================================================
// CATEGORY FORM CONFIGURATIONS (using actual database names)
// ============================================================================

const ALL_CATEGORY_FORMS: CategoryFormConfig[] = [
  // ASSEMBLY CATEGORIES
  {
    category_name: 'Furniture Assembly & Installation',
    fields: [
      {
        field_key: 'furniture_type',
        field_type: 'radio',
        label: 'What type of furniture do you need assembled or disassembled?',
        options: [
          { value: 'ikea', label: 'IKEA furniture items only' },
          { value: 'non_ikea', label: 'Other furniture items (non-IKEA)' },
          { value: 'both', label: 'Both IKEA and non-IKEA furniture' },
        ],
        required: true,
        display_order: 1,
        section: 'basic_info',
      },
      COMMON_TASK_SIZE,
      COMMON_VEHICLE,
      COMMON_ADDITIONAL_DETAILS,
    ],
  },
  {
    category_name: 'Desk, Bed & Dresser Assembly',
    fields: [
      {
        field_key: 'furniture_type',
        field_type: 'radio',
        label: 'What type of furniture do you need assembled?',
        options: [
          { value: 'ikea', label: 'IKEA furniture items only' },
          { value: 'non_ikea', label: 'Other furniture items (non-IKEA)' },
          { value: 'both', label: 'Both IKEA and non-IKEA furniture' },
        ],
        required: true,
        display_order: 1,
        section: 'basic_info',
      },
      COMMON_TASK_SIZE,
      COMMON_VEHICLE,
      COMMON_ADDITIONAL_DETAILS,
    ],
  },
  {
    category_name: 'Bookshelf & Storage Assembly',
    fields: [
      {
        field_key: 'furniture_type',
        field_type: 'radio',
        label: 'What type of furniture do you need assembled?',
        options: [
          { value: 'ikea', label: 'IKEA furniture items only' },
          { value: 'non_ikea', label: 'Other furniture items (non-IKEA)' },
          { value: 'both', label: 'Both IKEA and non-IKEA furniture' },
        ],
        required: true,
        display_order: 1,
        section: 'basic_info',
      },
      COMMON_TASK_SIZE,
      COMMON_VEHICLE,
      COMMON_ADDITIONAL_DETAILS,
    ],
  },
  {
    category_name: 'Office Furniture Assembly',
    fields: [
      {
        field_key: 'furniture_type',
        field_type: 'radio',
        label: 'What type of furniture do you need assembled?',
        options: [
          { value: 'ikea', label: 'IKEA furniture items only' },
          { value: 'non_ikea', label: 'Other furniture items (non-IKEA)' },
          { value: 'both', label: 'Both IKEA and non-IKEA furniture' },
        ],
        required: true,
        display_order: 1,
        section: 'basic_info',
      },
      COMMON_TASK_SIZE,
      COMMON_VEHICLE,
      COMMON_ADDITIONAL_DETAILS,
    ],
  },
  {
    category_name: 'Home Office Furniture Assembly',
    fields: [
      {
        field_key: 'furniture_type',
        field_type: 'radio',
        label: 'What type of furniture do you need assembled?',
        options: [
          { value: 'ikea', label: 'IKEA furniture items only' },
          { value: 'non_ikea', label: 'Other furniture items (non-IKEA)' },
          { value: 'both', label: 'Both IKEA and non-IKEA furniture' },
        ],
        required: true,
        display_order: 1,
        section: 'basic_info',
      },
      COMMON_TASK_SIZE,
      COMMON_VEHICLE,
      COMMON_ADDITIONAL_DETAILS,
    ],
  },
  {
    category_name: 'Outdoor & Patio Furniture Setup',
    fields: [
      {
        field_key: 'furniture_type',
        field_type: 'radio',
        label: 'What type of furniture do you need assembled?',
        options: [
          { value: 'ikea', label: 'IKEA furniture items only' },
          { value: 'non_ikea', label: 'Other furniture items (non-IKEA)' },
          { value: 'both', label: 'Both IKEA and non-IKEA furniture' },
        ],
        required: true,
        display_order: 1,
        section: 'basic_info',
      },
      COMMON_TASK_SIZE,
      COMMON_VEHICLE,
      COMMON_ADDITIONAL_DETAILS,
    ],
  },
  {
    category_name: 'Furniture Disassembly & Reassembly',
    fields: [
      {
        field_key: 'furniture_type',
        field_type: 'radio',
        label: 'What type of furniture do you need disassembled?',
        options: [
          { value: 'ikea', label: 'IKEA furniture items only' },
          { value: 'non_ikea', label: 'Other furniture items (non-IKEA)' },
          { value: 'both', label: 'Both IKEA and non-IKEA furniture' },
        ],
        required: true,
        display_order: 1,
        section: 'basic_info',
      },
      COMMON_TASK_SIZE,
      COMMON_VEHICLE,
      COMMON_ADDITIONAL_DETAILS,
    ],
  },

  // MOUNTING CATEGORIES
  {
    category_name: 'TV Wall Mounting',
    fields: [
      {
        field_key: 'tv_count',
        field_type: 'select',
        label: 'How many TVs do you need to be installed?',
        options: [
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
          { value: 5, label: '5' },
        ],
        required: true,
        display_order: 1,
        section: 'basic_info',
      },
      {
        field_key: 'help_available',
        field_type: 'radio',
        label: 'Will someone be around to help your Tasker lift the TV into place?',
        description: 'Larger TVs (60"+) may require a second person for safe mounting.',
        options: [
          { value: 'yes', label: 'Someone will be around' },
          { value: 'no_large', label: 'No one will be around. 1 or more TVs above 60"' },
          { value: 'not_needed', label: 'Not needed. No TVs above 60"' },
          { value: 'unsure', label: 'Unsure if needed' },
        ],
        required: true,
        display_order: 2,
        section: 'basic_info',
      },
      {
        field_key: 'mount_type',
        field_type: 'checkbox',
        label: 'What type of TV mount do you want to use?',
        description: 'Select all that apply',
        options: [
          { value: 'fixed', label: 'Fixed / low profile' },
          { value: 'tilting', label: 'Tilting' },
          { value: 'articulating', label: 'Articulating / full motion' },
          { value: 'other', label: 'Other / Not sure' },
        ],
        required: true,
        display_order: 3,
        section: 'mount_details',
      },
      {
        field_key: 'wall_material',
        field_type: 'radio',
        label: 'What kind of material are your walls made of?',
        description: 'You can easily test this by knocking on the wall. A hollow sound means drywall, plaster, or wood. No echo means brick or concrete.',
        options: [
          { value: 'drywall', label: 'Drywall, plaster, or wood' },
          { value: 'brick', label: 'Brick or concrete' },
          { value: 'metal', label: 'Metal' },
          { value: 'other', label: 'Other / not sure' },
        ],
        required: true,
        display_order: 4,
        section: 'mount_details',
      },
      {
        field_key: 'hide_wires',
        field_type: 'checkbox',
        label: 'Hide wires behind the wall',
        description: 'Add-on service',
        required: false,
        display_order: 5,
        section: 'addons',
      },
      {
        field_key: 'install_speakers',
        field_type: 'checkbox',
        label: 'Install speakers or soundbars',
        description: 'Add-on service',
        required: false,
        display_order: 6,
        section: 'addons',
      },
      {
        field_key: 'device_setup',
        field_type: 'textarea',
        label: 'Device & accessory setup',
        description: 'Please describe any device setup needs',
        placeholder: 'e.g., Connect streaming devices, set up smart TV features',
        required: false,
        max_length: 500,
        display_order: 7,
        section: 'addons',
      },
      COMMON_ADDITIONAL_DETAILS,
    ],
  },
  {
    category_name: 'Mounting & Wall Installation',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },

  // HOME REPAIRS
  {
    category_name: 'Door, Cabinet & Furniture Fixes',
    fields: [COMMON_TASK_SIZE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Painting & Wallpapering',
    fields: [COMMON_TASK_SIZE, COMMON_ADDITIONAL_DETAILS],
  },

  // PLUMBING
  {
    category_name: 'Plumbing & Leak Fixes',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },

  // ELECTRICAL
  {
    category_name: 'Electrical Repairs & Lighting Installation',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },

  // CLEANING
  {
    category_name: 'Standard & Deep Cleaning',
    fields: [COMMON_TASK_SIZE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Move-In / Move-Out Cleaning',
    fields: [COMMON_TASK_SIZE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Office Cleaning',
    fields: [COMMON_TASK_SIZE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Vacation Rental Cleaning',
    fields: [COMMON_TASK_SIZE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Carpet & Upholstery Cleaning',
    fields: [COMMON_TASK_SIZE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Garage, Basement & Attic Cleaning',
    fields: [COMMON_TASK_SIZE, COMMON_ADDITIONAL_DETAILS],
  },

  // MOVING
  {
    category_name: 'Local & Full-Service Moving',
    fields: [
      MOVING_START_ADDRESS,
      MOVING_END_ADDRESS,
      COMMON_TASK_SIZE,
      {
        ...COMMON_VEHICLE,
        options: [
          { value: 'car', label: 'Task requires a car' },
          { value: 'truck', label: 'Task requires a truck' },
        ],
      },
      COMMON_ADDITIONAL_DETAILS,
    ],
  },
  {
    category_name: 'Furniture & Appliance Removal',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Furniture Rearranging',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Pool Table & Large Item Moving',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Storage Unit Moving',
    fields: [
      MOVING_START_ADDRESS,
      MOVING_END_ADDRESS,
      COMMON_TASK_SIZE,
      COMMON_VEHICLE,
      COMMON_ADDITIONAL_DETAILS,
    ],
  },

  // OUTDOOR HELP
  {
    category_name: 'Gardening & Planting',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Gutter Cleaning',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Outdoor Furniture Setup',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Patio & Driveway Cleaning',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },
];

// ============================================================================
// SQL GENERATION
// ============================================================================

export function generateSeedSQL(): string {
  const sql: string[] = [];

  sql.push('-- Corrected seed data for category-specific form fields');
  sql.push('-- Maps specification to actual database category names\n');

  for (const categoryConfig of ALL_CATEGORY_FORMS) {
    sql.push(`-- Category: ${categoryConfig.category_name}`);

    for (const field of categoryConfig.fields) {
      const values = [
        `'${field.field_key}'`,
        `'${field.field_type}'`,
        `'${field.label.replace(/'/g, "''")}'`,
        field.description ? `'${field.description.replace(/'/g, "''")}'` : 'NULL',
        field.placeholder ? `'${field.placeholder.replace(/'/g, "''")}'` : 'NULL',
        field.options ? `'${JSON.stringify(field.options).replace(/'/g, "''")}'::jsonb` : 'NULL',
        field.required,
        field.min_value ?? 'NULL',
        field.max_value ?? 'NULL',
        field.min_length ?? 'NULL',
        field.max_length ?? 'NULL',
        field.show_if ? `'${JSON.stringify(field.show_if)}'::jsonb` : 'NULL',
        field.display_order,
        field.section ? `'${field.section}'` : 'NULL',
      ];

      sql.push(
        `INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)`
      );
      sql.push(`  SELECT 'field_' || gen_random_uuid()::text, id, ${values.join(', ')}`);
      sql.push(`  FROM categories WHERE name = '${categoryConfig.category_name}';`);
      sql.push('');
    }

    sql.push('');
  }

  return sql.join('\n');
}

// If running directly, output SQL
if (require.main === module) {
  console.log(generateSeedSQL());
}
