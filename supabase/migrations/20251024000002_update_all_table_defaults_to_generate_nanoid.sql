-- Update all tables to use generate_nanoid with table-specific prefixes

-- Update existing tables with nanoid() to use generate_nanoid
ALTER TABLE business_info
  ALTER COLUMN id SET DEFAULT generate_nanoid('business'::text);

ALTER TABLE promo_codes
  ALTER COLUMN id SET DEFAULT generate_nanoid('promo'::text);

ALTER TABLE promo_code_redemptions
  ALTER COLUMN id SET DEFAULT generate_nanoid('redemption'::text);

-- Add default to tables missing it
ALTER TABLE addresses
  ALTER COLUMN id SET DEFAULT generate_nanoid('address'::text);

ALTER TABLE categories
  ALTER COLUMN id SET DEFAULT generate_nanoid('category'::text);

ALTER TABLE bookings
  ALTER COLUMN id SET DEFAULT generate_nanoid('booking'::text);

ALTER TABLE reviews
  ALTER COLUMN id SET DEFAULT generate_nanoid('review'::text);

ALTER TABLE payments
  ALTER COLUMN id SET DEFAULT generate_nanoid('payment'::text);

ALTER TABLE support_tickets
  ALTER COLUMN id SET DEFAULT generate_nanoid('ticket'::text);

ALTER TABLE support_messages
  ALTER COLUMN id SET DEFAULT generate_nanoid('message'::text);
