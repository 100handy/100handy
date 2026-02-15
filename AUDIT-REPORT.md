# 100Handy Web App - Comprehensive Audit Report

**Date:** 2026-02-15
**Scope:** Full client-web app audit: 43 pages, 96+ components, 28+ DB tables, 9 edge functions, auth system, booking/payment flows
**Auditors:** 4 parallel agents (page-auditor, booking-logic-auditor, account-auth-auditor, data-integrity-auditor)

---

## Executive Summary

| Severity | Count |
|----------|-------|
| CRITICAL BUG | 7 |
| BUG | 18 |
| MISMATCH | 3 |
| MISSING | 8 |
| WARNING | 24 |
| OK | 100+ |

The core architecture is solid. Booking flow, payment integration, auth system, and database schema are well-structured. However, there are **7 critical issues** that need immediate attention, including a payout-breaking column mismatch, unauthenticated edge functions, and competitor branding in production UI.

---

## CRITICAL ISSUES (Fix Immediately)

### 1. `create-payout` edge function uses wrong column name - ALL payouts broken
- **File:** `supabase/functions/create-payout/index.ts:59`
- **Bug:** Code queries `stripe_connect_id` but DB column is `stripe_connect_account_id`
- **Impact:** Every payout to a professional will fail with "Professional Stripe Connect account not found". No professional can ever receive money.
- **Fix:** Change `stripe_connect_id` to `stripe_connect_account_id` (3 references in the file)

### 2. Payment edge functions have NO authentication
- **Files:** `create-payment-intent`, `capture-payment`, `cancel-payment-intent`
- **Bug:** None of these functions verify the caller's JWT token. Anyone with the public anon key (exposed in client-side code) can create, capture, or cancel payment intents.
- **Impact:** Security vulnerability - unauthorized payment operations possible
- **Fix:** Add JWT auth verification similar to `send-push-notification` which does this correctly

### 3. `reviews` table has conflicting UNIQUE constraints - two-way reviews broken
- **Files:** Initial schema migration + `20251227000001_add_two_way_reviews.sql`
- **Bug:** Old `reviews_booking_id_key` UNIQUE on `booking_id` was never dropped. New `reviews_booking_reviewer_unique` on `(booking_id, reviewer_type)` was added alongside it.
- **Impact:** A professional cannot leave a review on a booking that the customer already reviewed
- **Fix:** Add migration: `ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_booking_id_key;`

### 4. "Taskrabbit" competitor branding in production UI (3 locations)
- **Files:**
  - `apps/client-web/app/task-form/page.tsx:779` - "Taskrabbit is available in your area"
  - `apps/client-web/components/landing/testimonials.tsx:56` - "Taskrabbit" in heading
  - `apps/client-web/components/marketing/testimonials.tsx:56` - Same reference
- **Fix:** Replace all instances with "100 Handy"

### 5. `cancelBooking()` has NO status guard - completed bookings can be cancelled
- **Files:** `packages/shared/supabase/bookings.ts:421` and `apps/client-web/lib/supabase/bookings.ts:343`
- **Bug:** No `.eq('status', ...)` guard. A `completed` booking can be set back to `cancelled`.
- **Fix:** Add `.in('status', ['pending', 'accepted'])` guard to both implementations

### 6. `checkBookingConflict()` not called in web booking flow - double-booking possible
- **File:** `packages/shared/supabase/bookings.ts:345` (exists but unused in web)
- **Bug:** When a customer creates a booking on web, there's no server-side check for time conflicts. Two customers can book the same handyman at overlapping times.
- **Fix:** Call `checkBookingConflict()` before creating the booking in `task-form/page.tsx`

### 7. Promo code `current_uses` never incremented after redemption
- **File:** `apps/client-web/lib/supabase/balance.ts:177-184`
- **Bug:** `applyPromoCode()` checks `current_uses < max_uses` but never increments `current_uses` after redemption. Max uses limit is effectively broken.
- **Fix:** Add `UPDATE promo_codes SET current_uses = current_uses + 1 WHERE id = ...` after redemption insert
- **Note:** A trigger `increment_promo_code_usage` exists on `promo_code_redemptions` INSERT. Verify it's active; if so, the DB trigger handles this and the code bug is a false positive.

---

## BUGS (High Priority)

### Booking Logic
| # | Bug | File | Fix |
|---|-----|------|-----|
| 8 | `acceptBooking()` (client-web) missing `.eq('status', 'pending')` guard | `apps/client-web/lib/supabase/bookings.ts:362` | Add status guard |
| 9 | `completeBooking()` (client-web) missing status guard | `apps/client-web/lib/supabase/bookings.ts:378` | Add `.eq('status', 'in_progress')` |

### Account & Auth
| # | Bug | File | Fix |
|---|-----|------|-----|
| 10 | Account page nav buttons non-functional (no Link/onClick) | `apps/client-web/app/account/page.tsx:128-136` | Wrap with `<Link>` to `/dashboard`, `/my-tasks`, `/account` |
| 11 | Account page uses custom header, missing Footer | `apps/client-web/app/account/page.tsx` | Replace with shared `<Header />` and add `<Footer />` |
| 12 | Hardcoded test phone number as fallback | `apps/client-web/app/verify-code/page.tsx:19` | Remove hardcoded `+44 7784 - 500446` |
| 13 | `UserProfile` type missing `two_factor_enabled` field | `apps/client-web/lib/supabase/types.ts` | Add `two_factor_enabled: boolean` |
| 14 | Stripe payment-methods uses `getSession()` instead of `getUser()` | `apps/client-web/lib/stripe/payment-methods.ts:31,59,83,107,131` | Replace with `getUser()` per Supabase security docs |
| 15 | SecurityTab heading says "Account" not "Account Security" | `apps/client-web/components/account/SecurityTab.tsx:29` | Fix heading text |
| 16 | "Term of service" typo (missing 's') | `apps/client-web/app/verify-code/page.tsx:229` | Change to "Terms of Service" |
| 17 | `deleteAccount()` has empty `.update({})` and calls potentially non-existent edge function | `apps/client-web/lib/supabase/account.ts:26,34` | Clean up dead code |

### Pages & UI
| # | Bug | File | Fix |
|---|-----|------|-----|
| 18 | `api/auth/[...all]/route.ts` referenced in CLAUDE.md but does NOT exist | `apps/client-web/app/api/auth/` | Investigate if auth API route is needed or update CLAUDE.md |

### Hardcoded Hex Colors (Convention Violation)
| # | File | Colors |
|---|------|--------|
| 19 | `forgot-password/page.tsx` | `#30352d`, `#C1856A`, `#f5f5f5`, `#b7b7b7` |
| 20 | `reset-password/page.tsx` | `#30352d`, `#C1856A`, `#f5f5f5`, `#b7b7b7` |
| 21 | `professionals/[id]/page.tsx` | `#C1856A`, `#30352D`, `#82BE56`, `#a67359` |
| 22 | `referral/page.tsx` | `#30352D`, `#E0E0E0`, `#D0D0D0`, `#F7F3F0`, `#C1856A`, `#6B7A6B` |
| 23 | `dashboard/page.tsx` | `#C1856A`, `#D17852`, `#F5F0EB` (SVG fills) |
| 24 | `account/loading.tsx`, `dashboard/loading.tsx`, `my-tasks/loading.tsx` | `#C1856A` spinner |
| 25 | `confirm-details.tsx`, `task-summary.tsx`, `tasker-card.tsx` | `#333A31`, `#C1856A`, `#82BE56` |

---

## MISMATCHES

| # | Issue | File | Fix |
|---|-------|------|-----|
| 1 | `help/page.tsx` uses custom inline header instead of shared `<Header />` | `app/help/page.tsx` | Replace with shared component |
| 2 | `for-business/page.tsx` uses custom header + `<a>` instead of `<Link>` | `app/for-business/page.tsx` | Use shared Header, replace `<a>` with `<Link>` |
| 3 | `elite-taskers/page.tsx` uses `<a href="/dashboard">` instead of `<Link>` | `app/elite-taskers/page.tsx:~149` | Replace with `<Link>` |

---

## MISSING FEATURES

| # | Feature | Impact | Priority |
|---|---------|--------|----------|
| 1 | No `error.tsx` files anywhere in the app | Runtime errors show Next.js default error page, not branded UI | Medium |
| 2 | No recurring booking UI in web task-form | Infrastructure exists in shared package but not exposed | Low |
| 3 | No skill-based pricing in booking flow | Always uses `handy_profiles.hourly_rate_cents`, ignores `user_skills` rates | Low |
| 4 | `all-pages` dev index missing ~20 routes | Incomplete developer navigation | Low |
| 5 | No OAuth/social login options | No Google/Apple sign-in | Low |
| 6 | No session timeout warning | Users not warned before session expiry | Low |
| 7 | No "Sign Up" link on sign-in page | Users can't navigate between auth pages easily | Medium |
| 8 | Several tables missing admin RLS policies | Admin can't manage conversations, user_skills, etc. | Medium |

---

## WARNINGS (Lower Priority)

### Security
| # | Warning | File |
|---|---------|------|
| 1 | `create-stripe-customer` and `create-stripe-connect-account` lack JWT auth | Edge functions |
| 2 | Auth store console.logs user email/phone (PII leak) | `packages/shared/store/auth.ts:70` |
| 3 | Stripe customer ID stored in localStorage | `components/account/BillingTab.tsx:24-28` |
| 4 | Auth callback `next` param not fully validated for internal redirects | `app/auth/callback/route.ts` |

### Booking Flow
| # | Warning | File |
|---|---------|------|
| 5 | Pending booking banner redirect conflicts with task-form self-restore | `pending-booking-banner.tsx:35` vs `task-form/page.tsx:269` |
| 6 | Selected handyman/date/time not persisted in URL (lost on step 3 refresh) | `task-form/page.tsx` |
| 7 | No limit on `getUserBookings()` results | `apps/client-web/lib/supabase/bookings.ts:163` |
| 8 | Payment intent created without Stripe customer ID | `task-form/page.tsx:462` |
| 9 | Auth hold amount differs from displayed estimate for small tasks (min 2h hold) | `task-form/page.tsx:458` |
| 10 | Future recurring bookings have no payment authorization | `packages/shared/supabase/recurring-bookings.ts:134` |
| 11 | Two address creation paths with different NULL handling | Shared vs client-web |
| 12 | Dual state management (Zustand + React Query) for bookings | `store/bookings.ts` vs `hooks/useBookings.ts` |
| 13 | Dual booking CRUD implementations with inconsistent status guards | Shared vs client-web |

### Account & Auth
| # | Warning | File |
|---|---------|------|
| 14 | 2FA is email OTP, not true TOTP | `security.ts:13` |
| 15 | No option to disable 2FA in UI | `SecurityTab.tsx` |
| 16 | Password change only checks length >= 8, missing complexity rules | `PasswordTab.tsx:37` |
| 17 | No rate limiting UI on OTP resend buttons | `verify-code/page.tsx` |
| 18 | Profile edit form has no field validation | `ProfileTab.tsx` |
| 19 | `useSecureNavigation` queries profiles on every mount (no caching) | `use-secure-navigation.ts` |

### Database
| # | Warning | File |
|---|---------|------|
| 20 | `bookings.payment_status` CHECK constraint dropped, never re-added | Migration `20251227000002` |
| 21 | `payments` table appears legacy/unused | Initial schema |
| 22 | No auto-generated Supabase types file (all manual) | Project-wide |
| 23 | `user_skills` has no public SELECT policy | Migrations |

### Pages
| # | Warning | File |
|---|---------|------|
| 24 | `services-by-city` all neighborhood links go to `/locations/london` | `services-by-city/page.tsx` |

---

## Detailed Reports

Individual audit reports with line-by-line analysis:
- [Pages & UI Audit](./audit-pages.md)
- [Booking & Payment Audit](./audit-booking-payment.md)
- [Account & Auth Audit](./audit-account-auth.md)
- [Data Integrity Audit](./audit-data-integrity.md)

---

## Recommended Fix Order

### Phase 1: Critical (Do Now)
1. Fix `create-payout` column name (`stripe_connect_id` -> `stripe_connect_account_id`)
2. Add JWT auth to payment edge functions
3. Drop old `reviews_booking_id_key` constraint
4. Replace "Taskrabbit" branding with "100 Handy"
5. Add status guards to `cancelBooking()`, `acceptBooking()`, `completeBooking()`

### Phase 2: High Priority (This Sprint)
6. Fix account page header/footer/navigation
7. Remove hardcoded test phone number
8. Add `checkBookingConflict()` to web booking flow
9. Verify promo code `current_uses` increment (check if DB trigger handles it)
10. Fix `getSession()` -> `getUser()` in Stripe payment methods
11. Replace all hardcoded hex colors with Tailwind tokens (~10 files)

### Phase 3: Medium Priority (Next Sprint)
12. Add root `error.tsx` error boundary
13. Fix auth page navigation (sign-up link on sign-in, etc.)
14. Add missing admin RLS policies
15. Fix `services-by-city` neighborhood links
16. Clean up dead code (`deleteAccount()` empty update)
17. Add `two_factor_enabled` to TypeScript `UserProfile` type

### Phase 4: Low Priority (Backlog)
18. Add OAuth/social login
19. Expose recurring booking UI on web
20. Implement skill-based pricing
21. Add session timeout warning
22. Add OTP resend rate limiting UI
23. Generate Supabase types file
