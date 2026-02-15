# Booking & Payment Logic Audit Report

**Date:** 2026-02-15
**Auditor:** booking-logic-auditor
**Scope:** Booking CRUD, payment integration, recurring bookings, pending booking flow, dynamic forms, pricing logic, React Query hooks

---

## 1. Booking Creation Flow (task-form)

### Step 1: Location Entry

- **[OK]** Location validation - `handleLocationContinue()` guards against empty `streetAddress` (`apps/client-web/app/task-form/page.tsx:344`)
- **[OK]** Google Places integration - `LocationAutocomplete` component extracts address components correctly
- **[OK]** Address deduplication - `findOrCreateAddress()` checks existing addresses by `user_id + street + postcode` (`apps/client-web/lib/supabase/addresses.ts:250-258`)
- **[OK]** SessionStorage persistence - location data saved to sessionStorage for page refresh survival (`apps/client-web/app/task-form/page.tsx:313-322`)

### Step 2: Handyman Filtering

- **[OK]** Category-based filtering - `useHandymenByCategory` hook fetches handymen by category ID
- **[OK]** Price filter - converts `hourly_rate_cents` to pounds for comparison (`apps/client-web/app/task-form/page.tsx:142-145`)
- **[OK]** Elite filter - filters by `verified` flag (`apps/client-web/app/task-form/page.tsx:148-150`)
- **[OK]** Date/time window filtering - correctly checks availability slots against candidate days and time ranges
- **[OK]** Sort options - recommended, price_low, price_high, rating, reviews
- **[OK]** Batch availability fetch - `useAvailabilityByUserIds` fetches all handymen availability in one query

### Step 3: Confirm Booking + Payment

- **[OK]** Stripe PaymentElement integration with manual capture (`capture_method: 'manual'`)
- **[OK]** Payment intent created with correct amount calculation (`apps/client-web/app/task-form/page.tsx:455-469`)
- **[OK]** Booking created only after successful payment authorization (`handlePaymentSuccess`)
- **[OK]** SessionStorage cleared on successful booking (`apps/client-web/app/task-form/page.tsx:527-528`)
- **[OK]** Redirect to booking detail page after creation (`/bookings/${booking.id}`)

### Pending Booking Flow (Unauthenticated Users)

- **[OK]** Pending booking saved to Zustand store with persistence (`packages/shared/store/pending-booking.ts`)
- **[OK]** 24-hour expiry check (`BOOKING_EXPIRY_MS = 24 * 60 * 60 * 1000`, line 73)
- **[OK]** Scheduled date/time past-check validation (`isBookingValid()`, line 147-149)
- **[OK]** Redirect to `/sign-in` with return URL
- **[OK]** Pending booking restored on authenticated return (`apps/client-web/app/task-form/page.tsx:269-289`)
- **[OK]** `PendingBookingBanner` component shows notification for unauthenticated users
- **[OK]** `PendingBookingProvider` initializes platform-specific storage on client mount
- **[WARNING]** Pending Booking Banner - When authenticated user with pending booking returns, banner redirects to `/browse-pros` but task-form has its own restore logic. The `returnPath` in pending booking points to `/task-form?category=...`, not `/browse-pros`. Potential conflict between banner redirect and task-form self-restore. (`apps/client-web/components/pending-booking-banner.tsx:35-36` vs `apps/client-web/app/task-form/page.tsx:269-289`)

### URL State Sync

- **[OK]** Step tracked via `?step=` URL parameter (`apps/client-web/app/task-form/page.tsx:332-341`)
- **[OK]** Category from URL via `?category=` parameter
- **[WARNING]** No `?handyman=` or `?date=` or `?time=` URL params - selected handyman, date, and time are only in component state. If the user refreshes on step 3 (confirmation), the selected handyman/date/time are lost and the page will revert. Only location and form responses survive refresh via sessionStorage.

### DynamicFormRenderer

- **[OK]** Fetches fields via `useCategoryFormFields(categoryId)` hook which calls `get_category_form_fields` RPC
- **[OK]** Conditional field visibility via `shouldShowField()` based on `show_if` conditions
- **[OK]** Field grouping by section with `groupFieldsBySection()`
- **[OK]** Validation via `validateFormResponses()` covers required, min/max, pattern, valid options
- **[OK]** Form responses stored as JSONB in booking record

---

## 2. Booking Status Machine

### Status Transitions

- **[OK]** `pending -> accepted` - `acceptBooking()` guards with `.eq('status', 'pending')` (`packages/shared/supabase/bookings.ts:603`)
- **[OK]** `pending -> cancelled` - `declineBooking()` guards with `.eq('status', 'pending')` (`packages/shared/supabase/bookings.ts:665`)
- **[OK]** `accepted -> in_progress` - `startBooking()` guards with `.eq('status', 'accepted')` (`packages/shared/supabase/bookings.ts:698`)
- **[OK]** `in_progress -> completed` - `completeBooking()` explicitly checks `booking.status !== 'in_progress'` (`packages/shared/supabase/bookings.ts:743`)
- **[OK]** `decline_reason` stored when professional declines (`packages/shared/supabase/bookings.ts:653-658`)

### Missing Guards

- **[BUG]** `cancelBooking()` (shared) - No status guard. Any booking can be cancelled regardless of current status. A `completed` booking could be set back to `cancelled`. Should restrict to `['pending', 'accepted']` statuses. (`packages/shared/supabase/bookings.ts:421-424`)
- **[BUG]** `cancelBooking()` (client-web) - Same issue. No `.eq('status', ...)` guard on the update query. (`apps/client-web/lib/supabase/bookings.ts:343-346`)
- **[BUG]** `acceptBooking()` (client-web) - Missing `.eq('status', 'pending')` guard unlike the shared version. Any booking could be set to `accepted`. (`apps/client-web/lib/supabase/bookings.ts:362-365`)
- **[BUG]** `completeBooking()` (client-web) - Missing status guard. No check that booking is `in_progress` before setting to `completed`. (`apps/client-web/lib/supabase/bookings.ts:378-385`)
- **[WARNING]** No transition from `pending -> in_progress` is explicitly blocked - only `accepted -> in_progress` is allowed via guard. But if someone calls the shared `startBooking()` on a pending booking, the `.eq('status', 'accepted')` guard will silently fail (returns `true` because no error, but 0 rows affected). This is correct behavior but the caller doesn't know if the update actually happened.

---

## 3. Booking Queries

- **[OK]** `getBookings()` - Joins categories and addresses via Supabase relations (`packages/shared/supabase/bookings.ts:132-138`)
- **[OK]** `getBookingById()` - Same join pattern, returns single booking
- **[OK]** `getUpcomingBookings()` - Filters by `['pending', 'accepted', 'in_progress']` statuses
- **[OK]** `getPastBookings()` - Filters by `['completed']` status
- **[OK]** `getCancelledBookings()` - Filters by `['cancelled']` status
- **[OK]** `getBookingsForHandy()` - Two-step query: bookings + separate profiles query for customer info
- **[OK]** `checkBookingConflict()` - Time overlap detection using start/end comparison (`packages/shared/supabase/bookings.ts:345-391`)
- **[OK]** Customer booking ownership check in booking detail page (`apps/client-web/app/bookings/[id]/page.tsx:41-43`)

### Client-Web Booking Queries

- **[OK]** `getUserBookings()` - Batch fetches related profiles, categories, addresses via maps (`apps/client-web/lib/supabase/bookings.ts:159-222`)
- **[OK]** `getBooking()` - Individual fetches for customer/handy profiles, category, address
- **[WARNING]** `getUserBookings()` has no limit on results. If a user has many bookings, this could be slow. (`apps/client-web/lib/supabase/bookings.ts:163-168`)

### Conflict Check Usage

- **[MISSING]** `checkBookingConflict()` is NOT called in the web task-form booking flow. When a customer creates a booking, there is no server-side check for time conflicts with the selected handyman. The function exists in `packages/shared/supabase/bookings.ts:345` but is only used in the mobile confirm-booking flow. This means two customers could book the same handyman at overlapping times on the web.

---

## 4. Payment Flow (Stripe)

### Payment Intent Creation

- **[OK]** Edge function `create-payment-intent` uses `capture_method: 'manual'` for authorization hold (`supabase/functions/create-payment-intent/index.ts:37`)
- **[OK]** Amount validation (`amount > 0`) in edge function
- **[OK]** Currency defaults to `gbp`
- **[OK]** `automatic_payment_methods` with `allow_redirects: 'never'` (cards only)
- **[WARNING]** `customerId` parameter passed to `stripe.paymentIntents.create()` as `customer` field, but in the task-form `createPaymentIntent` call, no `customerId` is passed. The payment intent is created without a Stripe customer ID. This means the customer's saved payment methods won't be pre-populated. (`apps/client-web/app/task-form/page.tsx:462-469` - no `customerId` in metadata call)

### Payment Capture

- **[OK]** Edge function `capture-payment` correctly captures via `stripe.paymentIntents.capture()` (`supabase/functions/capture-payment/index.ts:32-35`)
- **[OK]** Supports optional partial capture via `amount_to_capture`
- **[OK]** Returns `amountCaptured` for verification

### Payment Cancellation

- **[OK]** Edge function `cancel-payment-intent` checks cancellable statuses before cancelling (`supabase/functions/cancel-payment-intent/index.ts:35-43`)
- **[OK]** Handles `requires_capture` state (authorization hold) correctly
- **[OK]** Cancellation integrated in `cancelBooking()` and `declineBooking()` - releases hold on cancel/decline

### Payout to Professional

- **[OK]** Edge function `create-payout` uses `stripe.transfers.create()` with Connect account (`supabase/functions/create-payout/index.ts:95-106`)
- **[OK]** Platform fee calculation at 15% (`PLATFORM_FEE_PERCENT = 0.15`)
- **[OK]** Verifies payment intent status is `succeeded` before transfer
- **[OK]** Updates booking with `payout_status`, `payout_amount_cents`, `platform_fee_cents`, `transfer_id`
- **[OK]** Uses `transfer_group` for tracking (`booking_{bookingId}`)

### processJobCompletionPayment Orchestration

- **[OK]** Two-step flow: capture payment, then create payout (`packages/shared/supabase/payments.ts:228-275`)
- **[OK]** If capture fails, sets payment status to `failed`
- **[OK]** If payout fails after capture, reports capture as successful with payout error (manual intervention needed)
- **[OK]** Booking status set to `completed` before payment processing (correct - booking completion shouldn't depend on payment)

### Stripe Card Element

- **[OK]** Handles `payment_intent_unexpected_state` error for idempotent retries (`apps/client-web/components/payment/stripe-card-element.tsx:59-65`)
- **[OK]** Distinguishes retryable vs non-retryable Stripe errors
- **[OK]** Sets `confirmFailed` state to prevent repeated submissions on non-retryable errors
- **[OK]** Checks for `requires_capture` status as success condition (correct for manual capture flow)

---

## 5. Recurring Bookings

- **[OK]** Frequency options: weekly (15% off), biweekly (10%), monthly (5%), once (0%) (`packages/shared/supabase/bookings.ts:17-46`)
- **[OK]** `calculateDiscountedRate()` correctly computes discount (`packages/shared/supabase/recurring-bookings.ts:27-34`)
- **[OK]** `generateRecurringDates()` correctly generates future dates based on interval weeks
- **[OK]** `createRecurringBookings()` creates series record + individual booking instances
- **[OK]** Discount applied to `hourly_rate_cents` for each occurrence
- **[OK]** `recurring_series_id` links bookings to their series
- **[OK]** `cancelRecurringSeries()` cancels series + all pending/accepted bookings in series

### Issues

- **[WARNING]** Only first booking in recurring series gets `payment_intent_id`. Future bookings have no payment authorization. This means subsequent recurring bookings have `payment_status: 'pending'` and no actual payment hold. There needs to be a mechanism to create payment intents for future occurrences. (`packages/shared/supabase/recurring-bookings.ts:134`)
- **[MISSING]** No UI in client-web task-form for selecting recurring booking frequency. The recurring booking infrastructure exists in shared package but the web booking flow doesn't expose it. The `task-form/page.tsx` has no frequency selector.
- **[MISSING]** No React Query hooks for recurring booking operations (create, cancel series, get series). The `useBookings.ts` hooks file doesn't include recurring-specific hooks.

---

## 6. Pricing Logic

- **[OK]** `handyman.hourly_rate_cents` used from `HandymanProfile` for display and booking creation
- **[OK]** Price filter converts cents to pounds for comparison (`hourlyRate / 100`)
- **[OK]** Estimated total calculation: `hourly_rate_cents * estimated_hours / 100` in booking detail page

### Estimated Hours Logic

- **[OK]** Task size maps to estimated hours: small=1, medium=2.5, large=4 (`apps/client-web/app/task-form/page.tsx:457,508`)
- **[WARNING]** Authorization hold amount uses `Math.max(2, estimatedHours)` minimum 2 hours (`apps/client-web/app/task-form/page.tsx:458`), but the booking is created with the actual estimated hours (not the minimum). This means for a "small" task (1 hour), the hold is for 2 hours but the booking shows 1 hour estimated. The hold amount and estimated total shown to user may differ.

### Skill-Based Pricing

- **[MISSING]** No `user_skills.hourly_rate_cents` usage found in the web booking flow. The `handymen` query fetches `hourly_rate_cents` from `handy_profiles`, but there's no skill-based rate override. The shared supabase code references `user_skills` in `favorites.ts` and `profile.ts` but not in the booking creation path.

---

## 7. Address Management

- **[OK]** `findOrCreateAddress()` in client-web extracts postcode, city, country from Google Places components
- **[OK]** Deduplication by `user_id + street + postcode`
- **[OK]** Shared `createBooking()` has inline address deduplication with proper NULL handling for apartment field
- **[WARNING]** Two different address creation paths exist:
  1. Client-web `findOrCreateAddress()` in `lib/supabase/addresses.ts` - uses Google Places data, doesn't handle NULL apartment comparison explicitly
  2. Shared `createBooking()` in `packages/shared/supabase/bookings.ts` - handles NULL apartment with `.is('apartment', null)`

  The client-web path creates the address in `handleLocationContinue` and passes `address_id` to `createBooking`. The shared `createBooking` also creates addresses inline but takes `address_street` etc. These are different code paths with different interfaces (`address_id` vs `address_street`/`address_postcode`/etc.).

---

## 8. React Query Hooks

- **[OK]** Query key structure follows factory pattern (`bookingKeys.all > lists > list > details > detail`)
- **[OK]** `staleTime: 5 * 60 * 1000` (5 min) for customer queries, `1 min` for pending handy requests (fresher data needed)
- **[OK]** `gcTime: 10 * 60 * 1000` (10 min) for garbage collection
- **[OK]** Mutations invalidate both list and detail queries on success
- **[OK]** `useInvalidateBookings` and `useInvalidateHandyBookings` utility hooks for manual invalidation
- **[OK]** `enabled: !!userId` prevents unnecessary queries when user not loaded

### Zustand Store (Bookings)

- **[WARNING]** Both a Zustand store (`packages/shared/store/bookings.ts`) and React Query hooks (`packages/shared/query/hooks/useBookings.ts`) exist for the same booking data. This creates dual state management. The React Query hooks are the primary mechanism (used in web), but the Zustand store duplicates the same fetching logic. If both are used simultaneously, they could get out of sync.

---

## 9. Branding & Copy Issues

- **[BUG]** "Taskrabbit" branding appears in 100Handy codebase:
  - `apps/client-web/app/task-form/page.tsx:779` - "Good news! Taskrabbit is available in your area"
  - `apps/client-web/components/landing/testimonials.tsx:56` - "Taskrabbit" in testimonials heading
  - `apps/client-web/components/marketing/testimonials.tsx:56` - Same Taskrabbit reference
- **[WARNING]** Hardcoded hex colors in confirm-details and task-summary components instead of Tailwind tokens:
  - `apps/client-web/components/confirm-booking/confirm-details.tsx` - uses `#333A31`, `#C1856A` directly
  - `apps/client-web/components/confirm-booking/task-summary.tsx` - uses `#333A31`, `#C1856A`, `#82BE56` directly
  - `apps/client-web/components/browse-pros/tasker-card.tsx` - uses `#333A31`, `#C1856A`, `#82BE56`, `#a67359` directly

---

## 10. Edge Function Security

- **[WARNING]** `create-payment-intent` edge function has no authentication check. Any request with a valid body can create a payment intent. Should verify the caller's JWT/session. (`supabase/functions/create-payment-intent/index.ts`)
- **[WARNING]** `capture-payment` edge function has no authentication check. Anyone with a payment intent ID could capture it. (`supabase/functions/capture-payment/index.ts`)
- **[WARNING]** `cancel-payment-intent` edge function has no authentication check. (`supabase/functions/cancel-payment-intent/index.ts`)
- **[OK]** `create-payout` edge function uses service role key for Supabase operations (appropriate for server-side)
- **[WARNING]** `create-payout` edge function has no caller authentication either, but it does verify the booking exists and has a valid handy profile with Stripe Connect ID.

---

## 11. Duplicate Code / Architecture

- **[WARNING]** Two separate booking CRUD implementations:
  1. `packages/shared/supabase/bookings.ts` - Shared implementation with automatic joins, address creation inline, status guards
  2. `apps/client-web/lib/supabase/bookings.ts` - Web-specific implementation with manual joins, separate address handling, weaker status guards

  The web app uses `apps/client-web/lib/supabase/bookings.ts` for the task-form flow, while the React Query hooks import from `packages/shared/supabase/bookings.ts`. This split creates maintenance risk and inconsistent behavior (e.g., status guards differ).

- **[WARNING]** The client-web `createBooking()` takes `address_id` directly, while the shared `createBooking()` takes `address_street`, `address_postcode`, etc. and creates/finds the address internally. Different interfaces for the same operation.

---

## Summary of Critical Findings

### Bugs (4)
1. **cancelBooking() missing status guard** - Both shared and client-web versions allow cancelling completed bookings
2. **acceptBooking() (client-web) missing status guard** - Can accept non-pending bookings
3. **completeBooking() (client-web) missing status guard** - Can complete non-in-progress bookings
4. **"Taskrabbit" branding** - 3 instances of competitor name in production UI text

### Missing Features (3)
1. **checkBookingConflict() not called in web flow** - Double-booking possible
2. **No recurring booking UI in web** - Infrastructure exists but not exposed
3. **No skill-based pricing in booking flow** - Always uses handy_profiles.hourly_rate_cents

### Warnings (10)
1. Pending booking banner redirect conflict with task-form self-restore
2. No handyman/date/time URL state persistence (lost on step 3 refresh)
3. No limit on getUserBookings() results
4. Payment intent created without Stripe customer ID
5. Authorization hold amount differs from displayed estimated total for small tasks
6. Two different address creation paths with different NULL handling
7. Dual state management (Zustand + React Query) for bookings
8. Hardcoded hex colors instead of Tailwind tokens in booking components
9. Edge functions lack authentication checks
10. Future recurring bookings have no payment authorization

### OK Items (40+)
The core booking flow, payment integration, status machine (shared package), pricing display, query hooks, and Stripe element handling are all well-implemented.
