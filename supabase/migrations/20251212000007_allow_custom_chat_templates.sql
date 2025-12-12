-- Allow custom chat templates by updating the check constraint
-- Drop the existing constraint that only allows 'default' and 'ongoing'
ALTER TABLE chat_templates DROP CONSTRAINT IF EXISTS chat_templates_template_type_check;

-- Add new constraint that allows default, ongoing, or any custom_ prefixed types
ALTER TABLE chat_templates ADD CONSTRAINT chat_templates_template_type_check
CHECK (
  template_type = 'default'
  OR template_type = 'ongoing'
  OR template_type LIKE 'custom_%'
);
