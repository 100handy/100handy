# 100Handy Mobile App Audit Report

**Date:** 2026-02-15
**Scope:** `apps/client-mobile/` - Expo 53 + React Native
**Audited by:** 4 parallel agents (client-flow, professional-flow, shared-logic, infra-config)

---

## Executive Summary

Comprehensive audit of 50+ screens across client and professional flows, shared data layer, and infrastructure. Found **25 TypeScript errors**, **21 bugs**, **8 DB/code mismatches**, **10 missing features**, and **40+ warnings**.

**Most Critical Findings:**
1. Recurring booking columns referenced in code **don't exist in the live database** (migration never applied)
2. `app.json` and `app.config.js` conflict - camera permissions missing from active config
3. iOS Universal Links broken (placeholder domain `auth.yourdomain.com`)
4. No role guard on client layout - professionals can access client screens
5. Dollar signs ($) used instead of pounds (£) in skill rate screens
6. 25 TypeScript compilation errors
7. Mock/fake data displayed to real users (reviews, ratings, tasker names)

---

## Table of Contents

1. [Database & Schema Mismatches](#1-database--schema-mismatches)
2. [Bugs - Runtime Crashes & Logic Errors](#2-bugs---runtime-crashes--logic-errors)
3. [Missing Features](#3-missing-features)
4. [Security Concerns](#4-security-concerns)
5. [TypeScript Errors](#5-typescript-errors)
6. [Warnings - Edge Cases & Code Quality](#6-warnings---edge-cases--code-quality)
7. [Hardcoded Colors (Convention Violation)](#7-hardcoded-colors-convention-violation)
8. [Items Verified as OK](#8-items-verified-as-ok)

---

## 1. Database & Schema Mismatches

### MISMATCH-1: Recurring booking columns don't exist in live DB [CRITICAL]
**Files:** `packages/shared/supabase/bookings.ts`, `recurring-bookings.ts`, `earnings.ts`
**Details:** Code references `recurring_series_id`, `occurrence_number`, `discount_percent`, `discount_amount_cents`, `original_hourly_rate_cents` on the `bookings` table and a `recurring_booking_series` table. Migration file `20260114000001_add_recurring_bookings.sql` exists but was **never applied** to the live database. All recurring booking features will crash at runtime.
**Verified:** `SELECT column_name FROM information_schema.columns WHERE table_name='bookings' AND column_name IN (...)` returns empty.
**Fix:** Apply the migration or remove recurring booking code until ready.

### MISMATCH-2: `payment_status` has no CHECK constraint [HIGH]
**File:** `packages/shared/supabase/payments.ts:4`
**Details:** Code defines `PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'cancelled' | 'refunded'`. Migration `20251227000002` dropped the CHECK constraint and never re-added one. The column is unconstrained TEXT - any string can be written. Data integrity risk.
**Fix:** Re-add CHECK constraint: `ALTER TABLE bookings ADD CONSTRAINT bookings_payment_status_check CHECK (payment_status IN ('pending', 'authorized', 'captured', 'failed', 'cancelled', 'refunded'));`

### MISMATCH-3: Wrong FK in earnings invoice query [HIGH]
**File:** `packages/shared/supabase/earnings.ts:114`
**Details:** Uses `profiles!bookings_customer_id_fkey(first_name, last_name)` but `bookings_customer_id_fkey` references `auth.users`, NOT `profiles`. Should use `profiles!bookings_customer_profile_fkey`. Will cause PostgREST errors or return null customer names.
**Fix:** Change FK reference to `bookings_customer_profile_fkey`.

### MISMATCH-4: `handy_categories` has no constraints in live DB
**Details:** Table exists but `information_schema.table_constraints` returns no constraints. The initial schema defines `PRIMARY KEY (handy_id, category_id)` but it may not have been applied. Could allow duplicate entries.

### MISMATCH-5: `app.json` vs `app.config.js` discrepancies [HIGH]
**Files:** `apps/client-mobile/app.json`, `apps/client-mobile/app.config.js`
**Details:** Both files exist but `app.config.js` takes precedence, making `app.json` dead code. Key discrepancies:
- Slug: `"handy"` vs `"100handy"`
- Camera permission: in `app.json` only, missing from `app.config.js`
- `NSCameraUsageDescription`: in `app.json` only, missing from active config
- `@stripe/stripe-identity-react-native` plugin: in `app.json` only
- Merchant ID: `merchant.com.yourco.handy` (placeholder) vs `merchant.com.oxdpr.handy`
**Fix:** Consolidate into `app.config.js` only. Add missing camera permissions and Stripe Identity plugin.

---

## 2. Bugs - Runtime Crashes & Logic Errors

### BUG-1: Figma API URL as image source [CRITICAL]
**File:** `app/(auth)/(client)/terms-and-privacy.tsx:59`
**Details:** Image source is `https://www.figma.com/api/mcp/asset/56376e0d-...` - a temporary Figma MCP URL that will break in production.
**Fix:** Replace with a local asset.

### BUG-2: Mock data shown to real users [HIGH]
**File:** `app/(client)/tasker-profile.tsx:103, 316`
**Details:** Rating histogram ALWAYS uses mock data regardless of API data. New taskers with 0 reviews show fake reviews from "Adam A.", "Jake W.", etc. `ratingBreakdown` never uses real data.
**Fix:** Remove mock data fallback. Show empty state for new taskers.

### BUG-3: Dollar sign ($) instead of pound (£) [HIGH]
**Files:** `app/(professional)/skills/my-skills.tsx:343`, `skill-rate.tsx:122, 282`
**Details:** Shows `$17/hr` instead of `£17/hr`. UK-based app using wrong currency symbol.
**Fix:** Replace `$` with `£` in all rate displays.

### BUG-4: Rate picker only shows 3 of 6 rates
**File:** `app/(professional)/skills/skill-rate.tsx:246`
**Details:** `HOURLY_RATES = [17, 18, 19, 20, 25, 30]` but modal only renders first 3 rates ($17-$19).
**Fix:** Render all 6 rate options.

### BUG-5: Unsafe `as string` type assertions on route params [HIGH]
**Files:** `verify-email-otp.tsx:12`, `task-form.tsx:29`, `chat/conversation.tsx:21`, `task-details.tsx`, `tasker-profile.tsx`, `booking-success.tsx`
**Details:** If user navigates directly to screen without params, value is `undefined` displayed as "undefined" or causes `JSON.parse(undefined)` crash.
**Fix:** Add runtime validation: `const email = params.email ?? ''` with redirect if missing.

### BUG-6: Professional sign-in race condition
**File:** `app/(auth)/(professional)/sign-in.tsx:28-33`
**Details:** `user` is read from store BEFORE `checkAuth()` returns. `user?.user_metadata?.role` may be stale. Also, any user signing in via professional sign-in gets force-converted to `'handy'` role if metadata is missing.
**Fix:** Read user AFTER `checkAuth()` completes. Don't auto-assign 'handy' role.

### BUG-7: "Not now" button has no handler
**File:** `app/(auth)/(professional)/sign-up.tsx:63-66`
**Details:** Pressable rendered with no `onPress` - does nothing when tapped.
**Fix:** Add navigation handler (skip to professional dashboard or back).

### BUG-8: Typos on professional welcome screen
**File:** `app/(auth)/(professional)/index.tsx:121-122`
**Details:** "By singing up" → "By signing up", "Term of service" → "Terms of Service"
**Fix:** Correct the text.

### BUG-9: Fragile comma-split address parsing
**File:** `app/(client)/location.tsx:35`
**Details:** `streetAddress.split(',')` is position-dependent. "123 Main St, London" extracts "London" as country. "123 Main St, Apt 4B, London, UK" works differently.
**Fix:** Use structured address components from Google Places API instead of string splitting.

### BUG-10: `cancelBooking()` silent failure for in-progress bookings
**File:** `packages/shared/supabase/bookings.ts:421-425`
**Details:** Only cancels `['pending', 'accepted']` bookings. For `in_progress` bookings, update matches 0 rows but returns `true` - caller thinks cancellation succeeded.
**Fix:** Check affected row count or include `in_progress` in the filter.

### BUG-11: Elite screen groups by skill name instead of category
**File:** `app/(professional)/elite/index.tsx:43`
**Details:** Groups skills by `skill.skill?.name` instead of `skill.skill?.category`. Each skill appears as its own header.
**Fix:** Group by `skill.skill?.category`.

### BUG-12: NaN risk in earnings calculations
**Files:** `app/(professional)/(tabs)/jobs.tsx:58`, `app/(professional)/job-details/[id].tsx:294`
**Details:** `hourly_rate_cents * estimated_hours / 100` - if either is null/undefined, produces NaN.
**Fix:** Add null checks with fallback to 0.

### BUG-13: `task-form.tsx` renders with invalid categoryId
**File:** `app/(client)/task-form.tsx:23-25`
**Details:** When `categoryId` is undefined or 'undefined', error is logged but `DynamicFormRenderer` still renders with invalid prop.
**Fix:** Show error screen or redirect when categoryId is invalid.

### BUG-14: Legacy screens show hardcoded fake data
**File:** `app/(auth)/(professional)/verify-final-summary.tsx:69-82`
**Details:** Shows "Mike W.", 5.0 rating, 124 reviews - all fake placeholder data.
**Fix:** Remove legacy screens entirely.

### BUG-15: Profile `handleGo100Task` has no user-facing error feedback
**File:** `app/(client)/(tabs)/profile.tsx:90-91`
**Details:** `switchToProfessionalRole()` failure only logs to console - user gets no error toast.
**Fix:** Add error toast on failure.

### BUG-16: Silent availability validation failure (tab version)
**File:** `app/(professional)/(tabs)/bookings.tsx:119`
**Details:** `if (selectionEnd <= selectionStart) { return; }` - silently returns with no user feedback. The standalone version shows a toast.
**Fix:** Add user-facing toast error message.

### BUG-17: `parseInt(params.rate)` without NaN check
**File:** `app/(professional)/skills/skill-experience.tsx:21`
**Details:** If rate param is missing, silently produces NaN cents.
**Fix:** Validate and provide fallback.

### BUG-18: Duplicate JSX attributes in profile-preview
**File:** `app/(professional)/profile/profile-preview.tsx:61, 86, 111`
**Details:** JSX elements have multiple attributes with the same name (TypeScript error TS17001).
**Fix:** Remove duplicate attributes.

### BUG-19: Onboarding text typos
**File:** `app/(auth)/(client)/onboarding.tsx:41, 55, 57`
**Details:** "Life at you fingertips" → "your", "140,00 +" → "140,000+", "backround" → "background"
**Fix:** Correct the text.

### BUG-20: Associated domain is placeholder
**Files:** `app.json:14`, `app.config.js:25`
**Details:** `applinks:auth.yourdomain.com` - iOS Universal Links won't work for email verification, password reset, OAuth callbacks.
**Fix:** Replace with actual production domain.

### BUG-21: `handleAcceptCookies` only logs to console
**File:** `app/(client)/(tabs)/profile.tsx:112-116`
**Details:** Cookie preferences are never persisted.
**Fix:** Save to AsyncStorage or backend.

---

## 3. Missing Features

### MISSING-1: No pagination on conversations or messages
**Files:** `app/(client)/(tabs)/messages.tsx`, `app/(client)/chat/conversation.tsx`
**Details:** FlatList loads all items at once. Performance degradation with large datasets.

### MISSING-2: No pagination on jobs list
**File:** `app/(professional)/(tabs)/jobs.tsx`
**Details:** All bookings loaded at once.

### MISSING-3: Promo code is cosmetic only
**File:** `app/(client)/confirm-booking.tsx:668-700`
**Details:** Input exists but promoCode state is never sent to backend. No validation or discount application.

### MISSING-4: Export transactions is a TODO stub
**File:** `app/(professional)/profile/export-transactions.tsx:30-32`
**Details:** `handleSendEmail` only logs to console.

### MISSING-5: Chat/phone features are TODO in job details
**File:** `app/(professional)/job-details/[id].tsx:431-442`
**Details:** Both show "feature coming soon" toast.

### MISSING-6: Performance tab is entirely placeholder data
**File:** `app/(professional)/(tabs)/performance.tsx`
**Details:** All values hardcoded: "£0", "--/5" rating, "0 tasks", "0% elite progress". No real data integration.

### MISSING-7: Past taskers show placeholder data
**Files:** `lib/bookings.ts:110-112`, `lib/taskers.ts:67-68`
**Details:** `taskerName` always returns "Tasker", rating hardcoded to 5.0, reviewCount to 0.

### MISSING-8: Marketing opt-out preference not persisted
**File:** `app/(auth)/(client)/terms-and-privacy.tsx:13`
**Details:** `marketingAccepted` state is never saved anywhere.

### MISSING-9: Announcements has no backend
**File:** `app/(professional)/announcements.tsx`
**Details:** Only shows empty state.

### MISSING-10: Non-functional UI elements
- "Contact customer support" link not tappable (`verify-email-otp.tsx:163`)
- "See full profile" link has no handler (`tasker-profile.tsx:266-269`)
- Notification bell icon has no handler (`profile.tsx:188-190`)
- Country selector has no handler (`(auth)/(professional)/index.tsx:30`)
- Terms/Privacy links not tappable (`(auth)/(professional)/index.tsx:122-127`)

---

## 4. Security Concerns

### SEC-1: 2FA check completely bypassed [HIGH]
**File:** `hooks/useSecureNavigation.ts:17-19`
**Details:** `_requiresSecurity` parameter is accepted but ignored. Comment says "kept for backwards compatibility (not enforced)". Profile menu items mark Account, Password, Payment as `requiresSecurity: true` but check does nothing.
**Fix:** Implement actual 2FA enforcement or remove the flag.

### SEC-2: No role guard on client layout [MEDIUM]
**File:** `app/(client)/_layout.tsx`
**Details:** No auth or role check. A professional can navigate to `/(client)/...` routes. The professional layout has a guard but the client layout does not.
**Fix:** Add role guard similar to professional layout.

### SEC-3: Non-atomic role switch [MEDIUM]
**File:** `packages/shared/supabase/profile.ts`
**Details:** `switchToProfessionalRole()` updates `profiles.role` BEFORE `auth.updateUser()`. If auth update fails, user is in inconsistent state (profiles says 'handy', auth says 'customer').
**Fix:** Use a transaction or implement rollback logic.

### SEC-4: Professional onboarding check commented out
**File:** `app/index.tsx:124-128`
**Details:** Code that redirects unverified professionals to verification is commented out. Unverified professionals go straight to dashboard.

### SEC-5: `verify-document-upload` allows skipping verification
**File:** `app/(auth)/(professional)/verify-document-upload.tsx:72-77`
**Details:** `handleSkipForNow` marks onboarding complete without verification.

### SEC-6: Default avatar uses third-party service
**File:** `app/(client)/(tabs)/profile.tsx:195`
**Details:** Uses `https://i.pravatar.cc/150?u=default` - third-party random avatar service. Privacy concern and reliability risk.
**Fix:** Use a local default avatar asset.

### SEC-7: Password in URL navigation params
**File:** `app/(auth)/(professional)/verify-otp.tsx:13`
**Details:** `password` received via URL params - sensitive data exposed in navigation state.
**Fix:** Pass via secure store or context, not URL params.

### SEC-8: `payment_status` unconstrained
**Details:** (See MISMATCH-2) Any string can be written to payment_status column.

---

## 5. TypeScript Errors

**25 compilation errors** found via `npx tsc --noEmit`:

| File | Error | Description |
|------|-------|-------------|
| `verify-document-upload.tsx` | TS2339 (x3) | `.status` doesn't exist on type `void` |
| `(client)/(tabs)/tasks.tsx` | TS2322, TS2339 | `bookingId` type mismatch (string vs number), `.id` missing |
| `booking-details/[id].tsx` | TS2339 (x2) | `.handy_name` doesn't exist on `BookingWithRelations` |
| `profile-preview.tsx` | TS17001 (x3) | Duplicate JSX attributes |
| `(tabs)/tasks.tsx` | TS17001 (x2) | Duplicate JSX attributes |
| `(tabs)/tasks/details.tsx` | TS2769 (x2) | `size` prop doesn't exist on `Text` |
| `ExpandablePasswordRow.tsx` | TS2722 | Possibly undefined invocation |
| `MessageBubble.tsx` | TS2769, TS2339 | `unknown` not assignable to `ReactNode`, `.map` on `{}` |
| `LocationSelectionSheet.tsx` | TS2305, TS7006 | Missing `Location` export, implicit `any` |
| `button/index.tsx` | TS2322 (x3) | `null` not assignable to variant types |
| `input/index.tsx` | TS2322 (x2) | `null` not assignable to variant types |
| `modal/index.tsx` | TS2322 | `null` not assignable to size type |

---

## 6. Warnings - Edge Cases & Code Quality

### Data Layer Warnings

| ID | File | Issue |
|----|------|-------|
| W-1 | `bookings.ts:cancelBooking` | Dynamic import of payments.ts is fragile circular-dep workaround |
| W-2 | `bookings.ts:getBookings` | `.limit()` then `.range()` - range may override limit |
| W-3 | `conversations.ts:getConversationByBooking` | `.single()` without `.limit(1)` - throws if duplicate conversations exist |
| W-4 | `useHandymen.ts:getSkillIdFromCategoryId` | `ilike` name matching between categories and skills is fragile |
| W-5 | `useBookings.ts:invalidateUserBookings` | Accepts userId but invalidates ALL list queries |
| W-6 | `recurring-bookings.ts` | Only first booking in series gets payment intent - no mechanism for future payments |
| W-7 | `recurring-bookings.ts:cancelRecurringSeries` | Doesn't release payment authorization holds |
| W-8 | `store/bookings.ts` | Duplicates React Query hooks - potential data inconsistency |
| W-9 | `useConversations.ts:useSendMessage` | `supabase.auth.getUser()` in onMutate adds latency to optimistic update |
| W-10 | `profile.ts:deleteUserAvatar` | URL path extraction via `.pop()` is fragile if URL format changes |
| W-11 | `availability.ts:saveDayAvailability` | Rollback re-inserts with original IDs - may fail on unique constraints |

### Client Flow Warnings

| ID | File | Issue |
|----|------|-------|
| W-12 | `confirm-booking.tsx:248-319` | Sequential validations (work area → availability → conflict) should be parallelized |
| W-13 | `confirm-booking.tsx:734` | Hardcoded "£7.46/hr Trust and Support fee" text |
| W-14 | `confirm-booking.tsx:148` | `estimatedHours` defaults to 2.5 if task_size missing |
| W-15 | `search-services.tsx:16-54` | Fragile keyword matching to categorize services |
| W-16 | `location.tsx:28` | `handleSelectLocation` receives `any` - structured address data not extracted |
| W-17 | `onboarding.tsx` | Pending booking restoration exists in BOTH onboarding and root index (race condition) |
| W-18 | `booking-details/[id].tsx:51-53` | Contact handyman navigates to messages tab, not specific conversation |
| W-19 | `review/[bookingId].tsx` | Uses `sonner-native` toast while others use `@/components/ui/toast` |
| W-20 | `taskers.tsx` | Availability text is hardcoded ("Available this week" / "Check availability") |
| W-21 | `sign-up.tsx` | "Not now" sets `HAS_ACCEPTED_TERMS=true` even though user hasn't accepted |
| W-22 | `terms-and-privacy.tsx:40` | Title says "Term & Privacy" - missing 's' |
| W-23 | `useUserBookings(user?.id || '')` | Passing empty string when no user - hook may query with empty ID |

### Professional Flow Warnings

| ID | File | Issue |
|----|------|-------|
| W-24 | `verify-info.tsx:45` | Date validation allows Feb 31, no minimum age check |
| W-25 | `verify-otp.tsx:14` | `JSON.parse(metadata)` from URL params with no try-catch |
| W-26 | `dashboard.tsx` | `fetchOnboardingProgress` called from both useEffect AND useFocusEffect (double-fetch) |
| W-27 | `bookings.tsx` | `daysOfWeek` computed once with `useMemo([], [])` - won't update past midnight |
| W-28 | `work-area.tsx` | No self-intersecting polygon validation, no minimum area |
| W-29 | `job-details/[id].tsx:234-236` | Job marked complete even if payment capture fails (warning toast only) |
| W-30 | `direct-deposit.tsx:69-70` | Stripe Connect uses web URLs not mobile deep links |
| W-31 | `chat-templates.tsx:72-77` | Fragile `formatTemplateName` assumes underscore naming |
| W-32 | `skill-edit.tsx:33-51` | Supplies only defined for "Cleaning" category |
| W-33 | `profile.tsx` | Menu items use relative paths that may resolve incorrectly |
| W-34 | `set-availability.tsx` + `set-work-area.tsx` | Near-duplicate of tab versions (code duplication) |
| W-35 | Legacy screens | 4 legacy verification screens still registered in auth layout |

### Infrastructure Warnings

| ID | File | Issue |
|----|------|-------|
| W-36 | `app.config.js:41` | Google Maps API key falls back to `'YOUR_GOOGLE_MAPS_API_KEY'` placeholder |
| W-37 | `_layout.tsx:141-149` | Deep link listener logs URL but does nothing (dead code) |
| W-38 | `index.tsx:54-61` | Both branches of onboarding check route to same place (dead code) |
| W-39 | `(auth)/_layout.tsx` | `verify-email.tsx`, `reset-password.tsx`, `verify-otp.tsx` exist but not registered |
| W-40 | `(tabs)/_layout.tsx` | Root-level `(tabs)` may be legacy dead code (superseded by `(client)/(tabs)`) |
| W-41 | `auth/callback.tsx:24` | Fixed 1500ms timeout for Supabase to process deep link (fragile) |
| W-42 | `supabaseClient.native.ts:6-7` | Non-null assertions on env vars - undefined if not set |
| W-43 | `StripeProviderWrapper.tsx:18` | Empty string fallback for Stripe key - silently fails |
| W-44 | `eas.json:40-42` | Production submit config is empty |
| W-45 | `assets/fonts/` | 29 font files (4.9MB) but only 8 loaded - 21 unused (~3MB waste) |
| W-46 | `supabase/config.toml:72` | `site_url` points to callback path, not root URL |
| W-47 | `supabase/config.toml:82-83` | No production URLs configured (TODO) |
| W-48 | `index.tsx:35` | useEffect with 6 dependencies may cause redundant navigation |
| W-49 | Multiple files | `console.log` statements left in production code |

---

## 7. Hardcoded Colors (Convention Violation)

The project convention requires using Tailwind color tokens, not hardcoded hex values. **50+ instances** of hardcoded hex colors found across virtually every screen:

**Non-brand colors in use (not in design system):**
- `#FF6B35` - used as tab active color (not a brand token)
- `#D17852` - used in sign-in prompts (not a brand token)
- `#B8926A` - used in review screen (not brand-taupe `#B29D88`)
- `#7EC04B` / `#82BE56` - used for success states (not brand-sage `#A0B194`)
- `#4A5347`, `#3E433D` - dark greens (not brand-dark `#333A31`)

**Worst offenders (10+ instances each):**
- `app/(client)/(tabs)/profile.tsx` - 20+ hardcoded colors
- `app/(client)/(tabs)/taskers.tsx` - 15+ hardcoded colors
- `app/(auth)/(client)/onboarding.tsx` - 10+ hardcoded colors
- `app/(client)/confirm-booking.tsx` - 8+ hardcoded colors
- `app/(client)/(tabs)/messages.tsx` - 7+ hardcoded colors

---

## 8. Items Verified as OK

### Database Schema (Verified via Supabase SQL)
- `bookings.payment_status` - TEXT column exists (no constraint though)
- `bookings.decline_reason`, `started_at`, `completed_at` - all exist
- `bookings.payout_status`, `payout_amount_cents`, `platform_fee_cents` - all exist
- `reviews` table - has `reviews_booking_reviewer_unique` constraint (correct)
- `handy_categories` table exists
- `professional_work_areas` table exists
- `professional_availability` table exists

### Working Correctly
- Auth state management (Zustand store with proper subscription cleanup)
- Pending booking store (24h expiry, platform-agnostic storage)
- Role guard on professional layout
- Push notification setup with device validation and token dedup
- No open redirect in auth callback
- No hardcoded secrets in source files
- Platform-specific Supabase clients (AsyncStorage vs localStorage)
- Metro config native-only module exclusion
- Work area ray-casting algorithm
- Availability save with rollback
- Review duplicate prevention via `reviews_booking_reviewer_unique`
- Payment authorization hold pattern in confirm-booking
- Booking cancellation payment release (best-effort)
- EAS build profiles (dev/preview/production)
- Real-time chat subscription with cleanup

---

## Recommended Priority Order

### P0 - Fix Before Production
1. Apply recurring bookings migration OR remove code references (MISMATCH-1)
2. Fix `app.config.js` - add camera permissions, Stripe Identity plugin (MISMATCH-5)
3. Replace placeholder `auth.yourdomain.com` domain (BUG-20)
4. Fix $ → £ currency symbols (BUG-3)
5. Fix 25 TypeScript errors
6. Remove or replace Figma API URL (BUG-1)
7. Remove mock data fallbacks - show empty states instead (BUG-2)
8. Add role guard to client layout (SEC-2)
9. Re-add `payment_status` CHECK constraint (MISMATCH-2)
10. Fix FK reference in earnings (MISMATCH-3)

### P1 - Fix Soon
11. Fix unsafe `as string` assertions on route params (BUG-5)
12. Fix professional sign-in race condition (BUG-6)
13. Implement 2FA enforcement or remove flags (SEC-1)
14. Fix rate picker showing only 3 of 6 rates (BUG-4)
15. Fix NaN risk in earnings calculations (BUG-12)
16. Fix silent cancellation failure (BUG-10)
17. Fix address parsing (BUG-9)
18. Remove 4 legacy verification screens

### P2 - Improve
19. Add pagination to conversations, messages, jobs
20. Replace hardcoded colors with Tailwind tokens
21. Remove unused font files (~3MB savings)
22. Implement promo code backend
23. Implement export transactions
24. Use mobile deep links for Stripe Connect
25. Add confirmation dialog for role switch
26. Remove code duplication (availability/work-area standalone vs tab)
27. Clean up console.log statements
