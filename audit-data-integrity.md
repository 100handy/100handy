# Data Integrity & Database Audit Report

**Date:** 2026-02-15
**Auditor:** data-integrity-auditor
**Scope:** Database schema (28+ tables), RLS policies, edge functions, TypeScript-DB alignment

---

## CRITICAL FINDINGS

### **[BUG]** create-payout uses wrong column name `stripe_connect_id` instead of `stripe_connect_account_id`
- **File:** `supabase/functions/create-payout/index.ts:59`
- **Impact:** Payout to professional will ALWAYS fail with "Professional Stripe Connect account not found"
- **Details:** The migration `20251216000001_add_stripe_connect_to_handy_profiles.sql` creates the column as `stripe_connect_account_id`. All other edge functions (`create-stripe-connect-account`, `create-stripe-account-link`, `get-stripe-connect-status`) correctly use `stripe_connect_account_id`. But `create-payout` queries `stripe_connect_id` (line 59) and checks `handyProfile?.stripe_connect_id` (line 63), and uses it as `destination` (line 98). This means **no professional can ever receive a payout**.
- **Fix:** Change all references from `stripe_connect_id` to `stripe_connect_account_id` in `create-payout/index.ts`.

### **[BUG]** reviews table has conflicting UNIQUE constraints preventing two-way reviews
- **File:** `supabase/migrations/20251022000000_initial_schema.sql:236` and `supabase/migrations/20251227000001_add_two_way_reviews.sql:15`
- **Impact:** A professional cannot leave a review on a booking that the customer already reviewed (or vice versa).
- **Details:** The initial schema creates `CONSTRAINT "reviews_booking_id_key" UNIQUE ("booking_id")` which enforces only ONE review per booking. The two-way reviews migration adds `CONSTRAINT reviews_booking_reviewer_unique UNIQUE (booking_id, reviewer_type)` to allow one review per (booking, reviewer_type) pair. But the old `reviews_booking_id_key` was never dropped. If both constraints are active in the database, the old constraint blocks any second review.
- **Fix:** Add a migration to drop `reviews_booking_id_key`: `ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_booking_id_key;`

### **[BUG]** Edge functions `create-payment-intent`, `capture-payment`, `cancel-payment-intent` have NO authentication
- **Files:**
  - `supabase/functions/create-payment-intent/index.ts` - No auth check
  - `supabase/functions/capture-payment/index.ts` - No auth check
  - `supabase/functions/cancel-payment-intent/index.ts` - No auth check
- **Impact:** Any unauthenticated caller can create payment intents, capture payments, or cancel payment authorizations by calling these functions directly. This is a security vulnerability.
- **Details:** Compare with `send-push-notification/index.ts` and `delete-user-account/index.ts` which properly verify the JWT via `Authorization` header. The payment functions accept a JSON body and call Stripe directly without verifying who is making the request.
- **Note:** Supabase Edge Functions do require the `anon` key or `service_role` key via `apikey` header by default, which provides a basic layer. However, anyone with the public anon key (exposed in client-side code) can call these functions.
- **Fix:** Add JWT auth verification to all three payment functions, similar to `send-push-notification`.

---

## Schema Verification (28 Tables)

### 1. profiles
- **[OK]** Table exists with correct columns: `user_id`, `role`, `first_name`, `last_name`, `phone`, `postcode`, `avatar_url`, `rating`, `jobs_completed`, `created_at`
- **[OK]** FK `profiles_user_id_fkey` to `auth.users(id)` ON DELETE CASCADE
- **[OK]** RLS enabled with own-profile management + admin policies
- **[OK]** Added columns via migrations: `two_factor_enabled`, `stripe_customer_id`, `privacy_*` (4 cols), `identity_verified`, `referral_code`
- **[OK]** Indexes: `profiles_postcode_idx`, `profiles_role_idx`, `profiles_two_factor_enabled_idx`, `idx_profiles_stripe_customer_id`, `idx_profiles_identity_verified`, `profiles_referral_code_unique`, `idx_profiles_role_admin`
- **[OK]** TypeScript `UserProfile` interface matches all DB columns

### 2. bookings
- **[OK]** Table exists with correct columns including all lifecycle columns (`decline_reason`, `started_at`, `completed_at`, `payment_intent_id`, `payment_status`, `payout_status`, `payout_amount_cents`, `platform_fee_cents`, `transfer_id`, `form_responses`)
- **[OK]** Recurring columns present: `recurring_series_id`, `occurrence_number`, `discount_percent`, `discount_amount_cents`, `original_hourly_rate_cents`
- **[OK]** FKs to `auth.users`, `categories`, `addresses` + profile FKs (`bookings_customer_profile_fkey`, `bookings_handy_profile_fkey`)
- **[OK]** RLS: customer/handy can read/update own bookings, customer can create, admin full access
- **[OK]** Indexes: `bookings_customer_idx`, `bookings_handy_idx`, `bookings_status_idx`, `bookings_payment_intent_id_idx`, `idx_bookings_recurring_series_id`
- **[WARNING]** `payment_status` CHECK constraint was dropped in migration `20251227000002` and never re-added (commented out). The column is now a plain TEXT with no validation.
- **[OK]** TypeScript `Booking` interface matches all DB columns

### 3. addresses
- **[OK]** Table, columns, FK, RLS all correct
- **[OK]** Migrated to nanoid via `20251023000003`

### 4. categories
- **[OK]** Restructured to hierarchical with `parent_id`, `level`, `display_order`
- **[OK]** Self-referencing FK `categories_parent_id_fkey`
- **[OK]** Self-parent CHECK `categories_no_self_parent`
- **[OK]** RLS: anyone can read, admin can CRUD
- **[OK]** Current data has 8 main categories + 45 subcategories with text IDs (e.g., `cat_assembly`)

### 5. handy_profiles
- **[OK]** Table exists with all columns from initial schema + verification fields + Stripe Connect fields + profile extras (tools, vehicles, quick_facts, about_me, sync_calendars)
- **[OK]** FK to `auth.users(id)` + FK to `profiles(user_id)` via `handy_profiles_profiles_id_fkey`
- **[OK]** CHECK constraints: `handy_profiles_verification_status_check`, `handy_profiles_document_type_check`, `handy_profiles_stripe_connect_status_check`
- **[OK]** RLS: public read, owner manage, admin full access
- **[OK]** Auto-create via trigger on new user signup when role is 'handy'

### 6. reviews
- **[OK]** Table has `reviewer_type` ('customer'|'handy'), `private_notes` columns for two-way reviews
- **[OK]** Rating CHECK (1-5)
- **[BUG]** Conflicting UNIQUE constraints (see critical findings above)
- **[OK]** RLS: public can read customer reviews, professionals can only read own handy reviews, proper insert policies for both reviewer types
- **[OK]** TypeScript matches DB columns

### 7. payments
- **[OK]** Table exists with FK to bookings
- **[OK]** RLS: booking parties can read, service role can manage, admin full access
- **[WARNING]** The `payments` table appears to be legacy/unused. The codebase primarily uses `bookings.payment_status` and `bookings.payment_intent_id` for payment tracking. The `balance.ts` code does read from `payments` table but the main payment flow (create-payment-intent, capture, payout) only writes to `bookings` table columns. Consider whether this table should be deprecated.

### 8. conversations
- **[OK]** Table with `client_id`, `tasker_id`, `last_message_at`, unread counts
- **[OK]** UNIQUE constraint on `(client_id, tasker_id)` for one conversation per pair
- **[OK]** RLS: participants can read/update/create
- **[OK]** Trigger `update_conversation_on_message` correctly updates unread counts

### 9. conversation_messages
- **[OK]** FK to conversations, FK to auth.users, optional FK to bookings
- **[OK]** `message_type` CHECK ('text'|'system'|'image')
- **[OK]** RLS: participants can read/send, recipients can mark as read

### 10. user_skills
- **[OK]** FK to skills + auth.users, UNIQUE(user_id, skill_id)
- **[OK]** Columns: `hourly_rate_cents`, `is_active`, `experience_description`, `supplies_owned`
- **[OK]** RLS: owner CRUD

### 11. skills
- **[OK]** UNIQUE(category, name), columns: `category`, `name`, `description`, `icon_name`, `is_in_demand`
- **[OK]** RLS: anyone can read

### 12. professional_availability
- **[OK]** `day_of_week` CHECK (0-6), `valid_time_range` CHECK (end > start)
- **[OK]** RLS: owner manage, anyone can view

### 13. professional_work_areas
- **[OK]** UNIQUE(user_id), `coordinates` JSONB
- **[OK]** RLS: owner CRUD, anyone can view

### 14. category_form_fields
- **[OK]** FK to categories, UNIQUE(category_id, field_key)
- **[OK]** `field_type` CHECK
- **[OK]** RLS: anyone read, admin manage
- **[OK]** Function `get_category_form_fields` for recursive hierarchy

### 15. notification_settings
- **[OK]** FK to auth.users, columns match code usage
- **[OK]** Marketing columns: `marketing_sms`, `marketing_push` (from migration 9)
- **[OK]** RLS: owner manage, admin read/update

### 16. consents
- **[OK]** FK, RLS, columns all correct

### 17. business_info
- **[OK]** FK, RLS (full CRUD for owner, admin read/update)
- **[OK]** `updated_at` trigger

### 18. favorites
- **[OK]** Composite PK (customer_id, handy_id), FKs to auth.users
- **[OK]** RLS: customer manage own, admin read

### 19. support_tickets
- **[OK]** Enhanced columns: `priority`, `assigned_to`, `resolved_at`, `last_message_at`, `updated_at`
- **[OK]** RLS: owner manage, admin full access

### 20. support_messages
- **[OK]** FK to support_tickets, enhanced columns: `message_type`, `attachment_*`, `read_at`, `metadata`
- **[OK]** RLS: ticket owner read/create, admin manage

### 21. promo_codes
- **[OK]** `amount_cents` CHECK > 0, `max_uses` CHECK > 0, `current_uses` CHECK >= 0
- **[OK]** `valid_uses` CHECK (current_uses <= max_uses)
- **[OK]** RLS: anyone read active codes, admin CRUD
- **[OK]** Auto-increment trigger on redemption

### 22. promo_code_redemptions
- **[OK]** FKs to auth.users + promo_codes, UNIQUE(user_id, promo_code_id)
- **[OK]** RLS: owner read/insert, admin read

### 23. chat_templates
- **[OK]** FK to auth.users, UNIQUE(user_id, template_type)
- **[OK]** `template_type` CHECK now allows 'default', 'ongoing', 'custom_%'
- **[OK]** RLS: owner CRUD

### 24. business_photos
- **[OK]** FKs to auth.users + user_skills
- **[OK]** RLS: owner CRUD + public read
- **[OK]** TypeScript matches

### 25. device_push_tokens
- **[OK]** FK to auth.users, UNIQUE(user_id, expo_push_token)
- **[OK]** `platform` CHECK ('ios'|'android')
- **[OK]** RLS: owner manage all (FOR ALL policy)

### 26. skill_sets
- **[OK]** FK to skills, `skill_type` CHECK ('required'|'additional')
- **[OK]** RLS: anyone read

### 27. skill_tools
- **[OK]** FK to skills, UNIQUE(skill_id, tool_name)
- **[OK]** RLS: anyone read

### 28. handy_categories
- **[OK]** Composite PK (handy_id, category_id), FKs to auth.users + categories
- **[OK]** RLS: public read, owner manage, admin manage

### 29. recurring_booking_series (not in original 28 list)
- **[OK]** FK to auth.users (customer, handy), FK to categories
- **[OK]** `discount_percent` CHECK (0-100), `booking_frequency` enum
- **[OK]** RLS: customer read/create/update, professional read

---

## Edge Functions Audit

### create-payment-intent
- **[BUG]** No authentication/authorization check (see critical findings)
- **[OK]** CORS handling
- **[OK]** Input validation for amount
- **[OK]** Correct Stripe API usage (manual capture)

### capture-payment
- **[BUG]** No authentication/authorization check (see critical findings)
- **[OK]** CORS, input validation, correct Stripe API

### cancel-payment-intent
- **[BUG]** No authentication/authorization check (see critical findings)
- **[OK]** CORS, input validation, correct status check before cancellation

### create-payout
- **[BUG]** Wrong column name `stripe_connect_id` (see critical findings)
- **[OK]** CORS, auth via service role key
- **[OK]** Correct platform fee calculation (15%)
- **[OK]** Updates booking with payout details

### create-stripe-customer
- **[OK]** CORS, input validation
- **[OK]** Idempotent (checks existing stripe_customer_id first)
- **[WARNING]** No JWT auth verification - relies only on service role key for DB access

### create-stripe-connect-account
- **[OK]** CORS, input validation, environment check
- **[OK]** Idempotent (returns existing account link if account exists)
- **[OK]** Good error handling with partial success support
- **[WARNING]** No JWT auth verification

### send-push-notification
- **[OK]** Full JWT auth verification
- **[OK]** CORS handling
- **[OK]** Respects notification preferences
- **[OK]** Validates conversation/booking membership (prevents spoofing)

### delete-user-account
- **[OK]** Full JWT auth verification
- **[OK]** CORS handling
- **[OK]** Uses admin client for actual deletion
- **[WARNING]** Deletes profile before auth user, but CASCADE on FK should handle related data anyway. The explicit profile delete is somewhat redundant.

### _shared/cors.ts
- **[OK]** `Access-Control-Allow-Origin: *` - standard for Supabase edge functions
- **[OK]** Allows required headers

---

## TypeScript-DB Alignment

### Column Name Mismatches
- **[MISMATCH]** `supabase/functions/create-payout/index.ts:59` - Code references `stripe_connect_id` but DB column is `stripe_connect_account_id`

### Enum/Status Value Alignment
- **[OK]** `BookingStatus` type matches `booking_status` enum values
- **[OK]** `PaymentStatus` type matches allowed payment_status values
- **[OK]** `PayoutStatus` type matches allowed payout_status values
- **[OK]** `user_role` enum matches code values ('customer', 'handy', 'admin')
- **[OK]** `ReviewerType` matches CHECK constraint ('customer', 'handy')
- **[WARNING]** `bookings.payment_status` has no CHECK constraint in DB (was dropped). Code defines `PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'cancelled' | 'refunded'` but DB accepts any text value.

### Join/FK Usage
- **[OK]** `bookings.ts` correctly uses `category:categories(*)` and `address:addresses(*)`
- **[OK]** `earnings.ts` correctly uses named FK `profiles!bookings_customer_id_fkey` for customer profile join (line 114)
- **[OK]** `reviews.ts` correctly uses `booking:bookings(...)` with nested `category:categories(name)`
- **[OK]** `conversations.ts` fetches profiles separately (correct since conversations FK to auth.users not profiles)

### Generated Types
- **[WARNING]** No auto-generated Supabase types file found (e.g., `database.types.ts`). All types are manually defined. This means schema changes require manual type updates across multiple files.

---

## RLS Policy Completeness

### Tables with RLS enabled: ALL 28+ tables - **[OK]**

### Policy Coverage Summary
| Table | SELECT | INSERT | UPDATE | DELETE | Admin |
|-------|--------|--------|--------|--------|-------|
| profiles | Own + handy + admin | Admin | Own + admin | - | Yes |
| bookings | Parties + admin | Customer + admin | Parties + admin | Admin | Yes |
| addresses | Own + admin | Own + admin | Own + admin | Own + admin | Yes |
| categories | Anyone | Admin | Admin | Admin | Yes |
| handy_profiles | Anyone + admin | Own + admin | Own + admin | Admin | Yes |
| reviews | Customer public / handy private + admin | Customer + handy (with checks) | Own | Admin | Yes |
| payments | Parties + admin + service_role | Admin | Admin | - | Yes |
| conversations | Participants | Participants | Participants | - | No |
| conversation_messages | Participants | Participants (sender check) | Recipients (mark read) | - | No |
| notification_settings | Own + admin | - | Own + admin | - | Yes |
| favorites | Own + admin | Own | - | - | Yes |
| consents | Own + admin | Own | Own | - | Yes |
| support_tickets | Own + admin | Own + admin | Admin | - | Yes |
| support_messages | Own tickets + admin | Own tickets | Admin | - | Yes |
| business_info | Own + admin | Own | Own + admin | Own | Yes |
| promo_codes | Active + admin | Admin | Admin | Admin | Yes |
| promo_code_redemptions | Own + admin | Own | - | - | Yes |
| chat_templates | Own | Own | Own | Own | No |
| user_skills | Own | Own | Own | Own | No |
| skills | Anyone | - | - | - | No |
| professional_availability | Anyone | Own | Own | Own | No |
| professional_work_areas | Anyone | Own | Own | Own | No |
| category_form_fields | Anyone | Admin | Admin | Admin | Yes |
| business_photos | Own + public | Own | Own | Own | No |
| device_push_tokens | Own (FOR ALL) | Own | Own | Own | No |
| skill_sets | Anyone | - | - | - | No |
| skill_tools | Anyone | - | - | - | No |
| handy_categories | Public + admin | Own + admin | - | - | Yes |
| recurring_booking_series | Customer + handy | Customer | Customer | - | No |

### Missing Policies
- **[MISSING]** `conversations` - No admin policies. Admins cannot view/manage user conversations for support purposes.
- **[MISSING]** `conversation_messages` - No admin policies.
- **[MISSING]** `user_skills` - No admin or public-read policies. Customers cannot view a professional's skills when browsing.
- **[MISSING]** `chat_templates` - No admin policies.
- **[MISSING]** `professional_availability` - No admin policies.
- **[MISSING]** `professional_work_areas` - No admin policies.
- **[MISSING]** `business_photos` - No admin policies.
- **[MISSING]** `device_push_tokens` - No admin policies (probably fine - sensitive).
- **[MISSING]** `recurring_booking_series` - No admin policies.
- **[MISSING]** `bookings` - No DELETE policy for customers (customers cannot delete their own cancelled bookings).

### RLS Notes
- **[WARNING]** `profiles` SELECT policy allows reading handy profiles only (`role = 'handy'`). A customer cannot see another customer's profile even if needed for conversation display. The code works around this by fetching profiles via separate queries in the conversation/booking code, which succeeds because the `Admins can read all profiles` policy covers admin access, and individual users have the "own profile" policy.
- **[WARNING]** `user_skills` has no public SELECT policy. If a client tries to view a professional's skills (e.g., on their public profile), the query would return empty results via RLS. The `getBookingsForHandy` and similar functions don't join user_skills so this may not be an issue currently, but would be if a client-facing skill display is built.

---

## Trigger & Function Summary

| Function | Trigger | Table | Purpose |
|----------|---------|-------|---------|
| `handle_new_user` | `on_auth_user_created` | `auth.users` | Creates profile, notification_settings, handy_profile |
| `update_business_info_updated_at` | `BEFORE UPDATE` | `business_info` | Auto-update `updated_at` |
| `update_chat_templates_updated_at` | `BEFORE UPDATE` | `chat_templates` | Auto-update `updated_at` |
| `update_user_skills_updated_at` | `BEFORE UPDATE` | `user_skills` | Auto-update `updated_at` |
| `update_conversation_on_message` | `AFTER INSERT` | `conversation_messages` | Update conversation unread counts & last_message_at |
| `update_ticket_last_message` | `AFTER INSERT` | `support_messages` | Update ticket last_message_at |
| `update_support_tickets_updated_at` | `BEFORE UPDATE` | `support_tickets` | Auto-update `updated_at` |
| `update_professional_work_areas_updated_at` | `BEFORE UPDATE` | `professional_work_areas` | Auto-update `updated_at` |
| `update_professional_availability_updated_at` | `BEFORE UPDATE` | `professional_availability` | Auto-update `updated_at` |
| `increment_promo_code_usage` | `AFTER INSERT` | `promo_code_redemptions` | Increment promo code usage count |
| `is_admin()` | - | - | Helper function for admin RLS checks (SECURITY DEFINER) |
| `get_category_form_fields()` | - | - | Recursive category form fields |

---

## Summary of Issues by Severity

### Critical (3)
1. **`create-payout` uses wrong column name** - Payouts to professionals will always fail
2. **`reviews` conflicting UNIQUE constraints** - Two-way reviews broken
3. **Payment edge functions have no auth** - Security vulnerability

### Warning (7)
1. `bookings.payment_status` has no CHECK constraint after being dropped
2. `payments` table appears legacy/unused - potential confusion
3. No auto-generated Supabase types file
4. Several tables missing admin RLS policies (conversations, user_skills, etc.)
5. `user_skills` has no public SELECT policy for client-facing skill browsing
6. `profiles` SELECT only allows reading 'handy' role profiles
7. `create-stripe-customer` and `create-stripe-connect-account` lack JWT auth verification

### OK (everything else)
- All 28+ tables have RLS enabled
- FK relationships are correctly defined
- CHECK constraints are in place for critical values
- Indexes exist for common query patterns
- TypeScript types generally match DB schema
- Trigger functions work correctly
- Handle_new_user trigger properly creates profile + notification_settings + handy_profile
