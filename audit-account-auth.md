# Audit Report: Account & Auth System

**Date:** 2026-02-15
**Auditor:** account-auth-auditor
**Scope:** Authentication pages, account management, 2FA, session management, security helpers

---

## 1. Sign-Up Flow

- **[OK]** Sign-Up Page (`apps/client-web/app/sign-up/page.tsx`) - Form fields present: firstName, lastName, email, password, phone, postcode, terms checkbox
- **[OK]** Zod validation via `signUpSchema` in `packages/shared/schemas/auth.ts` - proper validation for all fields (8+ char password with uppercase/lowercase/number, email, phone regex, postcode min 2 chars)
- **[OK]** Country code selector with +44 (UK) and +91 (India) options
- **[OK]** Terms checkbox required before submit (`agreedToTerms` state, disabled button when unchecked)
- **[OK]** User created with `role: 'customer'` in user metadata via Supabase auth (`supabase-auth.ts:65`)
- **[OK]** After signup, redirect to `/verify-code?email=...&redirect=...`
- **[OK]** Proper safe redirect validation (must start with `/`, not `//`)
- **[OK]** Suspense boundary with loading spinner
- **[WARNING]** Sign-Up - `signUpSchema` does NOT use `createSignUpSchema()` factory function for country-specific postcode validation (`packages/shared/schemas/auth.ts:55-63`). The country code from the selector is not passed to validation. Postcode validation only checks min 2 chars regardless of selected country.
- **[BUG]** Sign-Up - `firstName`/`lastName` fields in the form use `register("firstName")` and `register("lastName")` but these are sent to Supabase as a combined `name` field split by space at `supabase-auth.ts:56-57`. If `lastName` contains spaces, the split logic on `signUp.email()` re-splits incorrectly (first word becomes first_name, rest becomes last_name). This round-trip name concatenation+splitting is fragile.
- **[WARNING]** Sign-Up - The sign-up form does not show a "Sign In" link from the main form area (it's below the form at line 332). However, the sign-in page does not have a corresponding "Sign Up" link. Users on sign-in cannot easily navigate to sign-up.

## 2. Sign-In Flow

- **[OK]** Sign-In Page (`apps/client-web/app/sign-in/page.tsx`) - Email + password with Zod validation via `signInSchema`
- **[OK]** Redirect param support with safe redirect validation
- **[OK]** Error handling via `onError` callback with toast notification
- **[OK]** Forgot password link to `/forgot-password`
- **[OK]** Links to Terms of Service, Privacy Policy (`/terms`), and Cookie Settings (`/cookie-settings`)
- **[OK]** Suspense boundary with loading spinner
- **[WARNING]** Sign-In - `signInSchema` requires minimum 6 chars for password (`packages/shared/schemas/auth.ts:25`), while `signUpSchema` requires 8+ chars with complexity rules. This means sign-in validation is weaker but functionally acceptable since it validates existing passwords.
- **[MISSING]** Sign-In - No "Sign Up" link on the sign-in page. Users who don't have an account cannot navigate to sign-up from this page.

## 3. Password Reset Flow

- **[OK]** Forgot Password Page (`apps/client-web/app/forgot-password/page.tsx`) - Email input with Zod validation
- **[OK]** Sends OTP via `authClient.resetPassword.sendOTP()` which calls `supabase.auth.resetPasswordForEmail()`
- **[OK]** Redirects to `/verify-code?email=...&reset=true`
- **[OK]** Verify Code Page handles password reset flow (`isPasswordReset === true` branch)
- **[OK]** After OTP verified, redirects to `/reset-password`
- **[OK]** Reset Password Page - password + confirmPassword with Zod validation (8+ chars, uppercase, lowercase, number)
- **[OK]** Password visibility toggle (show/hide) for both fields
- **[OK]** Success state with "Go to Sign In" button
- **[BUG]** Forgot Password Page (`forgot-password/page.tsx:79,88,96,110`) - Uses hardcoded hex color `#30352d` instead of Tailwind token `brand-dark-alt`. Multiple instances throughout the file.
- **[BUG]** Forgot Password Page (`forgot-password/page.tsx:135-136`) - Uses hardcoded hex colors `#C1856A` and `#f5f5f5` instead of Tailwind tokens `brand-terracotta` and `gray-100`.
- **[BUG]** Reset Password Page (`reset-password/page.tsx`) - Same hardcoded hex color issue throughout: `#30352d`, `#C1856A`, `#f5f5f5`, `#b7b7b7` instead of Tailwind tokens.
- **[WARNING]** Reset Password - The `token` search param is retrieved (`reset-password/page.tsx:23`) but never used. The page relies on the Supabase session being set by the OTP verification flow, not on a token parameter.
- **[WARNING]** Reset Password - `updatePassword` in `supabase-auth.ts:209` calls `supabase.auth.updateUser({ password })` which requires an active session. If the user navigated directly to `/reset-password` without completing OTP verification, this would fail silently or with an error.

## 4. Verify Code Page

- **[OK]** Verify Code Page (`apps/client-web/app/verify-code/page.tsx`) - Handles three flows: email signup verification, password reset OTP, phone OTP
- **[OK]** Code input restricted to 6 digits only
- **[OK]** Resend code functionality for all three flows
- **[OK]** Submit disabled until code is exactly 6 digits
- **[WARNING]** Verify Code - Hardcoded fallback phone number `"+44 7784 - 500446"` at line 19: `const phoneNumber = searchParams.get("phone") || "+44 7784 - 500446"`. This appears to be test data left in production code.
- **[WARNING]** Verify Code - The `otpSchema` from `packages/shared/schemas/auth.ts:84-88` is defined but NOT used in the verify-code page. The page uses manual validation (`code.length !== 6`) instead of the Zod schema.
- **[BUG]** Verify Code (`verify-code/page.tsx:229`) - Text says "Term of service" (singular, missing 's') instead of "Terms of Service" to match other pages.

## 5. Auth Callback Route

- **[OK]** Auth Callback (`apps/client-web/app/auth/callback/route.ts`) - Handles token_hash flow (email confirmation, password reset) and code flow (OAuth/PKCE)
- **[OK]** Proper error handling with fallback redirect to `/sign-in`
- **[OK]** Uses server-side Supabase client with cookie handling
- **[OK]** Default redirect to `/dashboard` if no `next` param
- **[WARNING]** Auth Callback - The `next` parameter is not validated against open redirect attacks. Any URL path can be specified. While it uses `new URL(next, request.url)` which prevents absolute URL redirects, it could still redirect to unintended paths like `/api/...` or other internal routes.

## 6. Supabase Auth Client (`lib/supabase-auth.ts`)

- **[OK]** Comprehensive auth wrapper with consistent callback pattern (onRequest, onResponse, onError, onSuccess)
- **[OK]** Sign-up stores `role: 'customer'`, `first_name`, `last_name`, `full_name`, `postcode` in user metadata
- **[OK]** Email OTP verification uses `type: 'email'`
- **[OK]** Password reset OTP uses `type: 'recovery'`
- **[OK]** Phone OTP uses `type: 'sms'`
- **[OK]** Email resend uses `type: 'signup'`
- **[WARNING]** `resetPassword.email()` and `resetPassword.sendOTP()` both call `supabase.auth.resetPasswordForEmail()` with different `redirectTo` values (`/auth/callback?next=/reset-password` vs `/reset-password`). The `sendOTP` method redirects directly to `/reset-password` which may not work since the auth callback needs to exchange the token first.
- **[WARNING]** The `signUp.email()` method throws the error after calling `onError`, meaning the calling code may catch an unhandled rejection in addition to the callback. This double-error-reporting pattern is consistent across all methods.

## 7. Middleware & Route Protection

- **[OK]** Middleware (`apps/client-web/middleware.ts`) - Uses `updateSession()` for auth token refresh
- **[OK]** Protected routes: `/dashboard`, `/profile`, `/my-tasks`, `/account` - redirects unauthenticated users to `/sign-in` with redirect param
- **[OK]** Auth routes (`/sign-in`, `/sign-up`) redirect authenticated users to `/dashboard`
- **[OK]** Homepage (`/`) redirects authenticated users to `/dashboard`
- **[OK]** Cookie-based session persistence via `@supabase/ssr` with proper `getAll`/`setAll` cookie handlers
- **[WARNING]** Middleware - `/verify-code`, `/forgot-password`, `/reset-password` are NOT in the `authRoutes` list, so authenticated users can still access these pages. This may be intentional (to support password changes while logged in) but could confuse users.
- **[MISSING]** Middleware - No CSRF protection or rate limiting at the middleware level. This is handled by Supabase's built-in protections, but additional middleware-level protection could be beneficial.

## 8. Supabase Client (`lib/supabase.ts`)

- **[OK]** Singleton browser client pattern to avoid multiple subscriptions
- **[OK]** Uses `@supabase/ssr` `createBrowserClient` with proper cookie options
- **[OK]** Secure cookies in production (`secure: process.env.NODE_ENV === 'production'`)
- **[WARNING]** SSR fallback returns empty object `{} as SupabaseClient` which would cause runtime errors if accidentally used server-side. This is mitigated by the comment saying it should never be used, but is still fragile.

## 9. Account Page (11 Tabs)

- **[OK]** Account Page (`apps/client-web/app/account/page.tsx`) - 11 tabs: Profile, Password, Security, Notifications, Billing Info, VAT ID, Cancel a Task, Business Information, Balance, Transactions, Delete Account
- **[OK]** Protected sections (balance, transactions) require 2FA, triggers TwoFactorDialog if not enabled
- **[OK]** Desktop sidebar + mobile select dropdown navigation
- **[OK]** Pending section stored when 2FA dialog opens, navigated to after success
- **[WARNING]** Account Page - The header at line 122-148 is a custom duplicated header, NOT using the shared `<Header>` component from `@/components/layout`. The nav buttons (Book a Task, My Tasks, Account) use `<Button variant="ghost">` with no navigation - they don't link anywhere.
- **[BUG]** Account Page - Nav buttons "Book a Task", "My Tasks", "Account" in header (lines 128-136) have no `onClick` handlers or `Link` wrappers. They are non-functional buttons that look clickable but do nothing.
- **[WARNING]** Account Page - "Cancel a Task" tab (lines 86-100) has a "Go to My Tasks" button that doesn't navigate anywhere - no `onClick` or `Link` wrapper.

## 10. Profile Tab

- **[OK]** ProfileTab (`components/account/ProfileTab.tsx`) - View/edit mode with first_name, last_name, phone, postcode fields
- **[OK]** Avatar upload with 5MB limit and image type validation
- **[OK]** Avatar upload uses hidden `<input type="file">` + button click pattern
- **[OK]** 2FA check before allowing profile edit (triggers TwoFactorDialog)
- **[OK]** Email shown as read-only in edit mode
- **[OK]** Log out button with sign-out flow
- **[OK]** Uses `useProfile()` React Query hook for data fetching/mutation
- **[WARNING]** ProfileTab - No input validation on profile edit form fields. Users can save empty strings for first_name, last_name, phone, postcode. No Zod schema or validation rules applied to the edit form.

## 11. Password Tab

- **[OK]** PasswordTab (`components/account/PasswordTab.tsx`) - Current password + new password + confirm password
- **[OK]** 2FA check before allowing password edit
- **[OK]** Client-side validation: passwords match, min 8 chars
- **[OK]** Uses `updatePasswordWithVerification()` which verifies current password first via `signInWithPassword()`
- **[WARNING]** PasswordTab - Client-side password validation at line 37-39 only checks length >= 8, NOT the full complexity rules (uppercase, lowercase, number) that `signUpSchema` and `resetPasswordSchema` enforce. Users could change their password to one without uppercase/number requirements.
- **[WARNING]** `verifyCurrentPassword()` in `password.ts:50` uses `supabase.auth.signInWithPassword()` to verify the current password. The comment says "This will not affect the current session" but this IS using the same client instance (singleton), so it may potentially refresh the session or create side effects.

## 12. Security Tab (2FA)

- **[OK]** SecurityTab (`components/account/SecurityTab.tsx`) - Shows 2FA status and activate button
- **[OK]** Button disabled after 2FA is enabled with "Activated" text
- **[OK]** Uses `isTwoFactorEnabled()` to check status from profiles table
- **[WARNING]** SecurityTab - No option to disable 2FA. The `disableTwoFactor()` function exists in `security.ts:91-108` but is never exposed in the UI. Once enabled, 2FA cannot be disabled by the user.
- **[BUG]** SecurityTab - The heading says "Account" (`line 29`) instead of "Account Security" which is the menu item label. Inconsistent with other tabs that match their menu labels.

## 13. TwoFactorDialog

- **[OK]** TwoFactorDialog (`components/TwoFactorDialog.tsx`) - Two-step flow: send code -> verify code
- **[OK]** Auto-start option (`autoStart` prop)
- **[OK]** Code input restricted to 6 digits only
- **[OK]** Resend code functionality
- **[OK]** Dialog state resets on close
- **[WARNING]** TwoFactorDialog - The 2FA implementation uses email OTP via `signInWithOtp()` (`security.ts:13`), NOT a proper TOTP/authenticator app flow. This means the "2FA" is essentially just email verification, not true two-factor authentication. An attacker with email access already has the "second factor."
- **[WARNING]** TwoFactorDialog - The `enableTwoFactor()` function sends an OTP using `signInWithOtp()` which could potentially sign in the user if the OTP is verified. The `verifyTwoFactor()` function then calls `verifyOtp()` with `type: 'email'` which may create a new session. The intent is just to verify email ownership, but the side effect could affect the current session state.

## 14. Secure Navigation Hook

- **[OK]** `useSecureNavigation` hook (`hooks/use-secure-navigation.ts`) - Checks 2FA status on mount, provides `canAccessSection()` and `refreshTwoFactorStatus()`
- **[OK]** Loading state while checking 2FA status
- **[WARNING]** `useSecureNavigation` - The 2FA check queries the `profiles` table on every mount. No caching or session-level persistence. Every component using this hook makes a separate API call.

## 15. Notifications Tab

- **[OK]** NotificationsTab (`components/account/NotificationsTab.tsx`) - Matrix of task updates + promotional x email/sms/push
- **[OK]** Local state for unsaved changes with Save/Cancel buttons
- **[OK]** Uses `useNotificationSettings()` hook with React Query
- **[OK]** Notification settings defaults to sensible values (task updates on, marketing off) when no record exists

## 16. Billing Tab (Stripe)

- **[OK]** BillingTab (`components/account/BillingTab.tsx`) - Lists payment methods with add/set-default/delete operations
- **[OK]** Stripe Elements integration via `AddPaymentMethodModal` component
- **[OK]** Skeleton loading state
- **[OK]** Empty state with "Add Your First Card" CTA
- **[OK]** Delete confirmation with `confirm()` dialog
- **[WARNING]** BillingTab - Stores Stripe customer ID in `localStorage` (line 24-28, 44). If the user clears localStorage or uses a different browser, a new customer might be created. Also, localStorage is accessible to any JavaScript on the same domain.
- **[WARNING]** BillingTab - `handleAddCard()` at line 59-71 may use a stale `customerId` if it was set but the customer was deleted from Stripe. The `createSetupIntent` call could fail with a confusing error.
- **[BUG]** Stripe Payment Methods (`lib/stripe/payment-methods.ts`) - Uses `getSession()` at lines 31, 59, 83, 107, 131 instead of `getUser()`. The Supabase docs recommend using `getUser()` for security-sensitive operations because `getSession()` reads from local storage and can be tampered with. The session token could be expired/invalid.

## 17. Business Tab (VAT + Business Info)

- **[OK]** BusinessTab (`components/account/BusinessTab.tsx`) - Dual mode: VAT ID editing and Business Info editing
- **[OK]** VAT ID validation: UK format `GB` followed by 9 or 12 digits (`business.ts:106-107`)
- **[OK]** Upsert pattern: checks for existing record, creates or updates accordingly
- **[WARNING]** BusinessTab - No loading state shown while business info is being fetched. The form shows empty fields until data loads, which could be confusing.

## 18. Balance Tab

- **[OK]** BalanceTab (`components/account/BalanceTab.tsx`) - Shows balance and promo code redemption
- **[OK]** Balance calculated from redeemed promo codes minus payments
- **[OK]** Promo code validation: checks existence, expiry, max uses, duplicate redemption
- **[OK]** Balance displayed in pounds with 2 decimal places
- **[WARNING]** Balance Tab - Protected by 2FA requirement at the account page level, which is good
- **[BUG]** `applyPromoCode()` in `balance.ts:177-184` - Does NOT increment `current_uses` on the `promo_codes` table after redemption. The max uses check reads `current_uses` but never updates it. This means the max_uses limit is effectively broken - codes can be used unlimited times by different users.

## 19. Transactions Tab

- **[OK]** TransactionsTab (`components/account/TransactionsTab.tsx`) - Shows transaction history with date/task/amount/status
- **[OK]** Download as CSV or PDF with year filter
- **[OK]** Year selector populated from actual transaction data
- **[OK]** PDF generation via dynamic `jsPDF` import (code splitting)
- **[WARNING]** TransactionsTab - The download buttons use hardcoded hex color `#2D6A4F` (line 164, 171) instead of a Tailwind token. This green color doesn't match the brand palette.

## 20. Delete Account Tab

- **[OK]** DeleteAccountTab (`components/account/DeleteAccountTab.tsx`) - Confirmation dialog before deletion
- **[OK]** Creates support ticket rather than immediate deletion (safer approach)
- **[OK]** Signs out user after deletion request
- **[WARNING]** Delete Account - The `deleteAccount()` function in `account.ts:9-50` has an empty `.update({})` call at line 26 (the update object has no fields). This function appears to be a dead code path since `requestAccountDeletion()` is the one actually used.
- **[BUG]** Delete Account (`account.ts:34`) - Calls `supabase.functions.invoke('delete-user')` which may not exist as an edge function. No verification was done that this function is deployed. If it fails, the function silently falls through to sign-out.

## 21. Auth Store (Shared Package)

- **[OK]** `useAuthStore` (`packages/shared/store/auth.ts`) - Zustand store for auth state management
- **[OK]** Tracks user, session, loading, email/phone verification, role, onboarding status
- **[OK]** Listens for auth state changes via `onAuthStateChange`
- **[OK]** Proper subscription cleanup
- **[WARNING]** Auth Store - The `onAuthStateChange` listener at line 70 logs user phone/email to console. This should be removed for production to avoid leaking PII in browser console logs.

## 22. Type Definitions

- **[BUG]** `UserProfile` type in `types.ts` is missing the `two_factor_enabled` field. The `security.ts` module reads and writes `two_factor_enabled` on the `profiles` table, but the TypeScript type doesn't include it. This means TypeScript won't catch errors if this field name changes.

## 23. Cross-Cutting Concerns

- **[WARNING]** Hardcoded Colors - Multiple auth pages use hardcoded hex colors instead of Tailwind tokens: `forgot-password/page.tsx`, `reset-password/page.tsx`. The `sign-in` and `sign-up` pages correctly use Tailwind tokens.
- **[WARNING]** Error Types - Multiple files use `catch (error: any)` instead of proper error typing. Files: `PasswordTab.tsx:50`, `BillingTab.tsx:49,69,79,93`, `BusinessTab.tsx:34,47`, `DeleteAccountTab.tsx:29`.
- **[WARNING]** No Rate Limiting - No client-side throttling on OTP resend buttons. Users can spam "Resend code" repeatedly. While Supabase has server-side rate limits, the UI should show a cooldown timer.
- **[MISSING]** No session timeout/expiry indicator. Users are not warned when their session is about to expire.
- **[MISSING]** No "remember me" option on sign-in page.
- **[MISSING]** No OAuth/social login options (Google, Apple, etc.) on sign-in/sign-up pages.

---

## Summary

### Critical Issues (BUGs)
1. **Promo code max_uses not incremented** (`balance.ts`) - allows unlimited redemptions
2. **Hardcoded phone number in verify-code page** - test data in production
3. **Non-functional nav buttons in account header** - broken UX
4. **Missing `two_factor_enabled` in TypeScript types** - type safety gap
5. **Stripe `getSession()` used instead of `getUser()`** - security concern
6. **"Account" heading in Security tab** instead of "Account Security"
7. **"Term of service" typo** in verify-code page
8. **`deleteAccount()` has empty update** and calls potentially non-existent edge function

### Notable Warnings
1. **2FA is email-based OTP, not true TOTP** - weaker than expected
2. **No disable 2FA option** in the UI
3. **Password change validation weaker than sign-up** (missing complexity rules)
4. **Hardcoded hex colors** in forgot-password and reset-password pages
5. **Stripe customer ID in localStorage** - potential security concern
6. **No rate limiting on OTP resend**
7. **Console logging of PII** in auth store
8. **Country-specific postcode validation not used** in sign-up
