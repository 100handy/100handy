# Mobile Fixes Context

Date: 2026-03-08

## Scope
This document captures the mobile fixes implemented after the static audit, why they were made, what files changed, how they were validated, and what follow-up risks still remain.

## What Changed

### 1. Global auth bootstrap and stricter route guards
Problem:
- Auth initialization previously depended on entering through specific screens instead of being guaranteed from the root layout.
- Professional routes could still admit users before all auth, verification, and onboarding checks had settled.
- Sign-in screens duplicated routing decisions that were better handled centrally.

Changes:
- Moved auth initialization into `apps/client-mobile/app/_layout.tsx`.
- Updated `apps/client-mobile/app/index.tsx` to wait for both role resolution and pending-booking hydration before routing.
- Tightened `apps/client-mobile/app/(professional)/_layout.tsx` so authenticated professional users must also be email-verified and have completed professional onboarding before entering the professional app.
- Changed both mobile sign-in screens to route back through `/` so verification, role, onboarding, and pending-booking logic are resolved in one place:
  - `apps/client-mobile/app/(auth)/(client)/sign-in.tsx`
  - `apps/client-mobile/app/(auth)/(professional)/sign-in.tsx`

Why:
- The root route is the source of truth for auth-driven navigation.
- Enforcing onboarding from the professional layout closes direct-link and transient-failure gaps that could otherwise bypass `verify-info`.

### 2. Native callback and OTP flow consistency
Problem:
- Native deep-link callbacks needed explicit session completion.
- OTP verification, resend, and failure paths were not fully aligned for mobile signup flows.
- Resent verification emails could miss the native callback route.

Changes:
- Updated `apps/client-mobile/app/auth/callback.tsx` to explicitly complete native auth callbacks using `verifyOtp`, `exchangeCodeForSession`, or `setSession` depending on the callback payload.
- Updated `packages/shared/supabase/auth.ts` so `verifyEmailOTP()` verifies with `type: 'signup'`.
- Updated `packages/shared/supabase/auth.ts` so `resendEmailOTP()` includes the mobile redirect URL.
- Updated `apps/client-mobile/app/(auth)/verify-email.tsx` to use the shared resend helper and route back to role selection instead of the client auth surface.
- Kept both mobile OTP verification screens routing back through `/` after success.

Why:
- Native mobile must complete Supabase callback handling explicitly.
- Signup verification flows now use consistent callback, resend, verify, and fallback behavior.

### 3. Hydration-safe and durable pending-booking restore
Problem:
- Pending bookings were cleared too early after restore.
- Root routing could race persisted-store hydration.
- Restored drafts did not preserve the full saved location payload.
- Authenticated client onboarding could still regress on a later cold start if the remote metadata write failed transiently.

Changes:
- Extended `packages/shared/store/pending-booking.ts` with:
  - `hasHydrated`
  - `pendingBookingRestored`
  - `hasRestorablePendingBooking()`
  - `markPendingBookingRestored()`
- Updated `apps/client-mobile/app/index.tsx` and `apps/client-mobile/app/(auth)/(client)/onboarding.tsx` to restore drafts only after hydration and to mark them restored instead of clearing them immediately.
- Updated `apps/client-mobile/app/(client)/confirm-booking.tsx` to:
  - preserve latitude and longitude in saved pending bookings
  - restore saved frequency back into the screen params
  - only treat the matching restored draft as protected on back navigation
- Added a user-scoped local onboarding-complete fallback so a transient metadata write failure does not force authenticated clients back through onboarding on the next cold start:
  - `apps/client-mobile/app/index.tsx`
  - `apps/client-mobile/app/(auth)/(client)/onboarding.tsx`

Why:
- Draft restore should survive sign-in and remain durable until booking succeeds or the user explicitly abandons it.
- Root routing should not make pending-booking decisions before persisted state is ready.

### 4. Chat pagination, ordering, and realtime receipt correctness
Problem:
- Chat screens originally passed the wrong message shape to the list.
- Older history was not reachable from the mobile chat UI.
- Global chronological ordering would break once multiple pages were loaded.
- Optimistic insertion targeted the wrong page once history existed.
- Realtime read receipts did not refresh for senders.
- Message-update bursts could trigger redundant read mutations and refetch storms.

Changes:
- Updated `packages/shared/query/hooks/useConversations.ts` to:
  - flatten pages in globally chronological order
  - use the oldest loaded message as the next-page cursor
  - append optimistic messages to the newest page
- Updated `packages/shared/supabase/conversations.ts` to:
  - page messages with a composite `created_at + id` cursor
  - listen for both `INSERT` and `UPDATE` realtime events
  - recompute unread counters after marking messages as read
- Updated `apps/client-mobile/components/chat/ConversationMessageList.tsx` to:
  - load older history when scrolled near the top
  - show a loading indicator for older-page fetches
  - avoid auto-scrolling to bottom when only older history is prepended
- Updated both mobile chat screens to:
  - wire `fetchNextPage`, `hasNextPage`, and `isFetchingNextPage`
  - debounce realtime-driven refreshes
  - mark messages as read only for newly inserted messages from the other participant
  - render an explicit unavailable state when the conversation cannot be loaded

Why:
- This closes the major functional gaps for long-lived threads, older history access, sender-side receipt refreshes, and noisy realtime update loops.

### 5. Booking flow hardening
Problem:
- Mobile recurring checkout was still exposed even though the backend path is not safe for repeated authorizations.
- The confirm screen text understated the actual temporary payment hold amount.

Changes:
- Kept recurring booking checkout blocked on mobile and disabled recurring selections in the frequency picker.
- Updated `apps/client-mobile/app/(client)/confirm-booking.tsx` to disclose the actual temporary authorization amount based on `max(2 hours, estimatedHours)`.

Why:
- Prevents unsupported recurring checkout from being booked.
- Keeps payment-hold disclosure aligned with the amount actually authorized.

### 6. Supporting type and lint cleanup
Problem:
- The updated flow fixes still had blocking TypeScript issues and touched-file lint problems.

Changes:
- Added and re-exported shared review types for handyman reviews.
- Updated the tasker profile screen to use the shared review types.
- Fixed the stale typed route in `apps/client-mobile/components/home/CategoryCard.tsx`.
- Cleaned lint issues in the files touched during this fix set.

Why:
- Keeps the edited surface area type-safe and lint-clean even though the wider mobile app still has older lint debt.

## Validation Performed
- Ran `pnpm --filter client-mobile exec tsc --noEmit`
  - Result: passes
- Ran `pnpm --filter client-mobile lint`
  - Result: still fails repo-wide because of pre-existing issues outside the edited surface area
  - The files touched in this pass no longer appear in lint output
- Performed targeted static review before and after the follow-up fixes across:
  - auth bootstrap, verification, and routing
  - pending-booking restore and onboarding
  - chat pagination and realtime updates

## Files Changed
- `apps/client-mobile/app/_layout.tsx`
- `apps/client-mobile/app/index.tsx`
- `apps/client-mobile/app/auth/callback.tsx`
- `apps/client-mobile/app/(professional)/_layout.tsx`
- `apps/client-mobile/app/(auth)/(client)/sign-in.tsx`
- `apps/client-mobile/app/(auth)/(professional)/sign-in.tsx`
- `apps/client-mobile/app/(auth)/verify-email.tsx`
- `apps/client-mobile/app/(auth)/(client)/verify-email-otp.tsx`
- `apps/client-mobile/app/(auth)/(professional)/verify-email-otp.tsx`
- `apps/client-mobile/app/(auth)/(client)/onboarding.tsx`
- `apps/client-mobile/app/(client)/confirm-booking.tsx`
- `apps/client-mobile/app/(client)/chat/conversation.tsx`
- `apps/client-mobile/app/(professional)/chat/[conversationId].tsx`
- `apps/client-mobile/components/chat/ConversationMessageList.tsx`
- `apps/client-mobile/components/booking/FrequencySelector.tsx`
- `apps/client-mobile/app/(client)/tasker-profile.tsx`
- `apps/client-mobile/components/home/CategoryCard.tsx`
- `packages/shared/store/auth.ts`
- `packages/shared/store/pending-booking.ts`
- `packages/shared/query/hooks/useConversations.ts`
- `packages/shared/query/hooks/useHandymen.ts`
- `packages/shared/query/index.ts`
- `packages/shared/supabase/auth.ts`
- `packages/shared/supabase/conversations.ts`

## Remaining Follow-up Risks
These are the main issues still outside this fix set.

### 1. Repo-wide mobile lint debt
- `pnpm --filter client-mobile lint` still reports many older issues in untouched files, mostly JSX unescaped entities, unused variables, and hook dependency warnings.
- Those failures are outside the files changed in this implementation pass.

### 2. Runtime validation still needed on device
- The updated flows are type-checked and statically reviewed, but not yet exercised end-to-end on a real device or simulator.
- The highest-value runtime checks are:
  - email signup and resend callback flow
  - sign-in routing for both client and professional users
  - pending-booking restore after auth and after app relaunch
  - long conversation history loading and sender-side read receipt refresh

## Suggested Next Steps
1. Run a device-level smoke test for auth, pending-booking restore, and chat history.
2. Triage the remaining repo-wide mobile lint backlog separately from these functional fixes.
3. If needed, add focused logging around the composite chat cursor and realtime update path during QA to confirm expected production behavior.
