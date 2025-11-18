/**
 * Seed script for category-specific form fields
 * Based on "Categories For Each Job.md" document
 *
 * Run this to populate the category_form_fields table with all form configurations
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
  category_name: string;
  fields: FormFieldConfig[];
};

// Common field configurations that are reused across categories
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

// Moving-specific fields (start/end addresses)
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
// ASSEMBLY CATEGORY FORMS
// ============================================================================

const ASSEMBLY_FORMS: CategoryFormConfig[] = [
  {
    category_name: 'Furniture assembly',
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
    category_name: 'IKEA assembly',
    fields: [
      {
        field_key: 'ikea_code',
        field_type: 'text',
        label: 'IKEA Product Code',
        description: 'Enter the IKEA product code if you have it',
        placeholder: 'e.g., 404.045.10',
        required: false,
        display_order: 1,
        section: 'basic_info',
      },
      COMMON_TASK_SIZE,
      COMMON_VEHICLE,
      COMMON_ADDITIONAL_DETAILS,
    ],
  },
  {
    category_name: 'Office furniture assembly',
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
    category_name: 'Wardrobe assembly',
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
    category_name: 'Crib assembly',
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
];

// ============================================================================
// MOUNTING CATEGORY FORMS
// ============================================================================

const MOUNTING_FORMS: CategoryFormConfig[] = [
  {
    category_name: 'TV mounting',
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
        description: 'You can easily test this by knocking on the wall. A hollow sound means your wall is most likely drywall, plaster, or wood. If you hear no echo, your wall is more likely brick or concrete.',
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
    category_name: 'Wall mounting',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Put up shelves',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Hanging pictures and artwork',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Light installation',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Install curtains and blinds',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },
];

// ============================================================================
// HOME REPAIRS CATEGORY FORMS
// ============================================================================

const HOME_REPAIRS_FORMS: CategoryFormConfig[] = [
  'Minor home repairs',
  'Door, cabinet, and furniture repairs',
  'Windsor and blinds repair',
  'Sealing and caulking',
  'Flooring and tiling help',
  'Light carpentry',
  'Indoor painting',
].map((name) => ({
  category_name: name,
  fields: [COMMON_TASK_SIZE, COMMON_ADDITIONAL_DETAILS],
}));

// ============================================================================
// PLUMBING CATEGORY FORMS
// ============================================================================

const PLUMBING_FORMS: CategoryFormConfig[] = [
  'Leak fixing',
  'Drain unblocking',
  'Tap replacement',
  'Washing machine installation',
  'Water filter installation',
].map((name) => ({
  category_name: name,
  fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
}));

// ============================================================================
// ELECTRICAL CATEGORY FORMS
// ============================================================================

const ELECTRICAL_FORMS: CategoryFormConfig[] = [
  'Light installation',
  'Sockets installation and repair',
  'Switches Installation and repair',
  'Cables repair',
].map((name) => ({
  category_name: name,
  fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
}));

// ============================================================================
// CLEANING CATEGORY FORMS (NO vehicle requirement)
// ============================================================================

const CLEANING_FORMS: CategoryFormConfig[] = [
  'Clean',
  'Deep clean',
  'Party clean up',
  'End of tenancy',
  'Office cleaning',
  'AirBnB cleaning',
].map((name) => ({
  category_name: name,
  fields: [COMMON_TASK_SIZE, COMMON_ADDITIONAL_DETAILS], // No vehicle for cleaning
}));

// ============================================================================
// MOVING CATEGORY FORMS (includes start/end address)
// ============================================================================

const MOVING_FORMS: CategoryFormConfig[] = [
  {
    category_name: 'Van assisted moving help',
    fields: [
      MOVING_START_ADDRESS,
      MOVING_END_ADDRESS,
      COMMON_TASK_SIZE,
      {
        ...COMMON_VEHICLE,
        options: [
          { value: 'car', label: 'Task requires a car' },
          { value: 'truck', label: 'Task requires a truck' },
        ], // Remove "not needed" option
      },
      COMMON_ADDITIONAL_DETAILS,
    ],
  },
  {
    category_name: 'Moving help',
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
    category_name: 'Waste and furniture removal',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Heavy lifting and loading',
    fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
  },
  {
    category_name: 'Packing and moving',
    fields: [
      MOVING_START_ADDRESS,
      MOVING_END_ADDRESS,
      COMMON_TASK_SIZE,
      COMMON_VEHICLE,
      COMMON_ADDITIONAL_DETAILS,
    ],
  },
  {
    category_name: 'Full service movers',
    fields: [
      MOVING_START_ADDRESS,
      MOVING_END_ADDRESS,
      COMMON_TASK_SIZE,
      COMMON_VEHICLE,
      COMMON_ADDITIONAL_DETAILS,
    ],
  },
];

// ============================================================================
// OUTDOOR HELP CATEGORY FORMS
// ============================================================================

const OUTDOOR_FORMS: CategoryFormConfig[] = [
  'Gardening',
  'Lawn care',
  'Landscaping',
  'Leaf raking and removal',
  'Roof and gutter cleaning',
  'Branch and hedge trimming',
].map((name) => ({
  category_name: name,
  fields: [COMMON_TASK_SIZE, COMMON_VEHICLE, COMMON_ADDITIONAL_DETAILS],
}));

// ============================================================================
// ALL CATEGORY FORMS
// ============================================================================

export const ALL_CATEGORY_FORMS: CategoryFormConfig[] = [
  ...ASSEMBLY_FORMS,
  ...MOUNTING_FORMS,
  ...HOME_REPAIRS_FORMS,
  ...PLUMBING_FORMS,
  ...ELECTRICAL_FORMS,
  ...CLEANING_FORMS,
  ...MOVING_FORMS,
  ...OUTDOOR_FORMS,
];

// ============================================================================
// SQL GENERATION FUNCTION
// ============================================================================

/**
 * Generate SQL INSERT statements for all category form fields
 * This should be run against the database to populate form configurations
 */
export function generateSeedSQL(): string {
  const sql: string[] = [];

  sql.push('-- Seed data for category-specific form fields');
  sql.push('-- Generated from seed-category-forms.ts\n');

  for (const categoryConfig of ALL_CATEGORY_FORMS) {
    sql.push(`-- Category: ${categoryConfig.category_name}`);

    for (const field of categoryConfig.fields) {
      const values = [
        `'${field.field_key}'`, // field_key
        `'${field.field_type}'`, // field_type
        `'${field.label.replace(/'/g, "''")}'`, // label (escape quotes)
        field.description ? `'${field.description.replace(/'/g, "''")}'` : 'NULL', // description
        field.placeholder ? `'${field.placeholder.replace(/'/g, "''")}'` : 'NULL', // placeholder
        field.options ? `'${JSON.stringify(field.options).replace(/'/g, "''")}'::jsonb` : 'NULL', // options
        field.required, // required
        field.min_value ?? 'NULL', // min_value
        field.max_value ?? 'NULL', // max_value
        field.min_length ?? 'NULL', // min_length
        field.max_length ?? 'NULL', // max_length
        field.show_if ? `'${JSON.stringify(field.show_if)}'::jsonb` : 'NULL', // show_if
        field.display_order, // display_order
        field.section ? `'${field.section}'` : 'NULL', // section
      ];

      sql.push(
        `INSERT INTO category_form_fields (category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)`
      );
      sql.push(`  SELECT id, ${values.join(', ')}`);
      sql.push(`  FROM categories WHERE name = '${categoryConfig.category_name}';`);
      sql.push('');
    }

    sql.push('');
  }

  return sql.join('\n');
}

// If running this script directly, output the SQL
if (require.main === module) {
  console.log(generateSeedSQL());
}
