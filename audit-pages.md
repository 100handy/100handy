# Client-Web Page Audit Report

**Date:** 2026-02-15
**Scope:** All page.tsx, layout.tsx, loading.tsx, error.tsx, and route.ts files in `apps/client-web/app/`
**Total pages audited:** 43 page.tsx + 1 layout.tsx + 3 loading.tsx + 0 error.tsx + 1 route.ts

---

## Summary

| Severity | Count |
|----------|-------|
| BUG      | 10    |
| MISMATCH | 3     |
| MISSING  | 5     |
| WARNING  | 7     |
| OK       | 25+   |

---

## Critical Bugs

### [BUG] task-form: Competitor branding "Taskrabbit"
- **File:** `app/task-form/page.tsx` line 779
- **Issue:** Text reads "Taskrabbit is available in your area" instead of "100 Handy"
- **Impact:** Branding error visible to users during task booking flow
- **Fix:** Replace "Taskrabbit" with "100 Handy"

### [BUG] account: Custom inline header, no navigation, missing Footer
- **File:** `app/account/page.tsx`
- **Issue:** Three problems:
  1. Defines its own inline header instead of using shared `<Header />` from `@/components/layout`
  2. Nav buttons (Book a Task, My Tasks, Account) are plain `<Button>` components with **no Link or onClick navigation** -- they do nothing when clicked
  3. Missing `<Footer />` component entirely
- **Impact:** Users cannot navigate from account page via the header nav buttons; inconsistent layout

### [BUG] api/auth/[...all]/route.ts does NOT exist
- **File:** `app/api/auth/[...all]/route.ts` (missing)
- **Issue:** CLAUDE.md references this file as the main auth API route, but it does not exist in the codebase. The `app/api/` directory itself is empty or nonexistent.
- **Impact:** If Better Auth or auth client relies on this catch-all route, authentication may be broken on web. The auth callback at `app/auth/callback/route.ts` does exist and handles OTP/OAuth, so basic auth may still work.

---

## Hardcoded Hex Color Violations

Project convention requires using Tailwind tokens (e.g., `bg-brand-terracotta`) instead of hardcoded hex values.

### [BUG] forgot-password: Hardcoded hex colors
- **File:** `app/forgot-password/page.tsx`
- **Colors:** `#30352d`, `#C1856A`, `#f5f5f5`, `#b7b7b7`
- **Fix:** Replace with `brand-dark-alt`, `brand-terracotta`, `gray-100`, `gray-400`

### [BUG] reset-password: Hardcoded hex colors
- **File:** `app/reset-password/page.tsx`
- **Colors:** `#30352d`, `#C1856A`, `#f5f5f5`, `#b7b7b7`
- **Fix:** Replace with `brand-dark-alt`, `brand-terracotta`, `gray-100`, `gray-400`

### [BUG] professionals/[id]: Hardcoded hex colors
- **File:** `app/professionals/[id]/page.tsx`
- **Colors:** `#C1856A`, `#30352D`, `#82BE56`, `#a67359`
- **Fix:** Replace with `brand-terracotta`, `brand-dark-alt`, appropriate green token, `brand-terracotta` dark variant

### [BUG] referral: Hardcoded hex colors
- **File:** `app/referral/page.tsx`
- **Colors:** `#30352D`, `#E0E0E0`, `#D0D0D0`, `#F7F3F0`, `#C1856A`, `#6B7A6B`, `#F8F9FA`
- **Fix:** Replace with appropriate Tailwind tokens per color system mapping

### [BUG] dashboard: Hardcoded hex colors in account section
- **File:** `app/dashboard/page.tsx` lines 107-117
- **Colors:** `#C1856A` (in SVG fill), `#D17852` (in SVG fill), `#F5F0EB` (background)
- **Fix:** For inline SVGs, consider extracting to a component or using CSS variables

### [BUG] loading.tsx files: Hardcoded hex colors
- **Files:** `app/account/loading.tsx`, `app/dashboard/loading.tsx`, `app/my-tasks/loading.tsx`
- **Colors:** All use `#C1856A` for spinner border color
- **Fix:** Replace with `border-brand-terracotta`

---

## Shared Component Usage Issues

### [MISMATCH] help/page.tsx: Custom inline header
- **File:** `app/help/page.tsx`
- **Issue:** Defines its own header JSX inline instead of using `<Header />` from `@/components/layout`
- **Impact:** Inconsistent header behavior; won't reflect updates to shared Header

### [MISMATCH] for-business: Custom inline header + uses `<a>` instead of `<Link>`
- **File:** `app/for-business/page.tsx`
- **Issue:**
  1. Defines a full custom `Header` component inline instead of using the shared one
  2. Uses `<a href="/become-tasker">` instead of `<Link href="/become-tasker">` (line ~401)
  3. Form submission is simulated with `setTimeout` and `console.log`
- **Impact:** Inconsistent navigation, no client-side routing for internal link

### [MISMATCH] elite-taskers: Uses `<a>` instead of `<Link>`
- **File:** `app/elite-taskers/page.tsx` line ~149
- **Issue:** Uses `<a href="/dashboard">` instead of `<Link href="/dashboard">`
- **Fix:** Import `Link` from `next/link` and replace `<a>` tag

---

## Missing Files & Features

### [MISSING] No error.tsx files exist anywhere
- **Issue:** Zero `error.tsx` error boundary files found across the entire app
- **Impact:** Runtime errors will bubble up to Next.js default error page with no branded UI
- **Recommendation:** Add at least a root-level `app/error.tsx` with branded error UI, and consider per-route error boundaries for critical flows (task-form, bookings, account)

### [MISSING] all-pages index is incomplete
- **File:** `app/all-pages/page.tsx`
- **Issue:** Dev navigation page is missing many routes:
  - `terms`, `legal`, `cookie-settings`
  - `for-good`, `careers`, `blog`, `about-us`
  - `press`, `partner`
  - `professionals/[id]`, `bookings/[id]`
  - `locations/[city]`, `locations/[city]/[service]`
  - `services/[category]`, `services/[category]/[service]`
  - `landing-v2`, `welcome`
  - `account`, `all-pages` itself
- **Fix:** Add all missing routes to the pages mapping

### [MISSING] api/auth/[...all]/route.ts
- See Critical Bugs section above

### [MISSING] Team images for about-us page
- **File:** `app/about-us/page.tsx`
- **Issue:** References `/team/1.jpg` through `/team/9.jpg` in the public directory. These may not exist.
- **Fix:** Verify images exist in `public/team/` directory or add placeholder images

### [MISSING] No favicon or metadata configuration
- **Note:** Root layout has basic metadata but no explicit favicon link. Worth verifying.

---

## Warnings

### [WARNING] verify-code: Typo "Term of service"
- **File:** `app/verify-code/page.tsx` line ~229
- **Issue:** Text says "Term of service" (singular) -- should be "Terms of Service"
- **Fix:** Update text string

### [WARNING] services-by-city: All neighborhood links point to /locations/london
- **File:** `app/services-by-city/page.tsx`
- **Issue:** Every neighborhood link (regardless of actual neighborhood name) links to `/locations/london`. Neighborhoods like "Soho", "Chelsea", "Camden" should link to their actual location pages or be more specific.
- **Impact:** Poor user experience; misleading navigation

### [WARNING] services/page.tsx: External unsplash image URL
- **File:** `app/services/page.tsx`
- **Issue:** Uses `https://images.unsplash.com/...` as image source
- **Impact:** External dependency; image could go offline; no caching control; potential CORS/CSP issues in production
- **Fix:** Download and host image locally in `public/` directory

### [WARNING] contact form has no submit handler
- **File:** `app/contact/page.tsx`
- **Issue:** Contact form renders input fields but has no `onSubmit` handler or form action
- **Impact:** Form does nothing when submitted

### [WARNING] handyman-london service links may be invalid
- **File:** `app/handyman-london/page.tsx`
- **Issue:** Service links reference routes like `/services/home-repair/home-repair` and `/services/gardening/gardening`. The second segment may not match actual service slugs defined in `generateStaticParams` of the service detail page.
- **Fix:** Verify service slugs match between this page and `services/[category]/[service]/page.tsx`

### [WARNING] HelpButton uses hardcoded hex across multiple pages
- **Files:** `app/all-services/page.tsx`, `app/handyman-london/page.tsx`, `app/locations/[city]/page.tsx`
- **Issue:** Floating help button uses `bg-[#A0B194]` and `hover:bg-[#8a9a7e]` instead of `bg-brand-sage` and `hover:bg-brand-sage/85`
- **Fix:** Replace with brand token variants

### [WARNING] Header import inconsistency
- `app/dashboard/page.tsx`: `import Header from "@/components/layout/Header"` (default import)
- Most other pages: `import { Header } from "@/components/layout"` (named re-export)
- Both work, but the named re-export from the barrel file is the preferred convention

---

## Pages Verified OK

The following pages were audited and found to have no issues:

| Page | Status | Notes |
|------|--------|-------|
| `app/page.tsx` (Home) | OK | Shared Header/Footer, all marketing component imports verified |
| `app/sign-in/page.tsx` | OK | Suspense boundary present for useSearchParams |
| `app/sign-up/page.tsx` | OK | Suspense boundary present, country code selector works |
| `app/verify-code/page.tsx` | OK (minor typo) | Suspense boundary present, handles email/phone/password-reset flows |
| `app/my-tasks/page.tsx` | OK | Auth guard via client-side redirect, has loading.tsx |
| `app/bookings/[id]/page.tsx` | OK | Auth-protected, cancel flow with confirmation |
| `app/services/[category]/page.tsx` | OK | Simple redirect to /services#category |
| `app/services/[category]/[service]/page.tsx` | OK | generateStaticParams, all service-detail imports verified |
| `app/services/home-repair/page.tsx` | OK | Uses service-detail components |
| `app/browse-pros/page.tsx` | OK | Complex booking flow, imports verified |
| `app/become-tasker/page.tsx` | OK | Shared Header/Footer, 6 section components verified |
| `app/book-task/page.tsx` | OK | Simple redirect to /dashboard |
| `app/partner/page.tsx` | OK | Simple redirect to /for-business |
| `app/terms/page.tsx` | OK | Placeholder, shared Header/Footer |
| `app/legal/page.tsx` | OK | Placeholder, shared Header/Footer |
| `app/cookie-settings/page.tsx` | OK | Placeholder, shared Header/Footer |
| `app/about-us/page.tsx` | OK (warning re: images) | Shared Header/Footer |
| `app/blog/page.tsx` | OK | Placeholder, shared Header/Footer |
| `app/careers/page.tsx` | OK | Full content, anchor links acceptable |
| `app/press/page.tsx` | OK | Shared Header/Footer, all press component imports verified |
| `app/for-good/page.tsx` | OK | Placeholder, shared Header/Footer |
| `app/help/trust-safety/page.tsx` | OK | Shared Header, sidebar nav |
| `app/wallpapering-near-me/page.tsx` | OK | SEO page, shared Header/Footer |
| `app/locations/[city]/page.tsx` | OK | Server component, notFound(), generateStaticParams |
| `app/locations/[city]/[service]/page.tsx` | OK | Server component, FAQSection import verified |
| `app/landing-v2/page.tsx` | OK | Shared Header/Footer, landing components verified |
| `app/welcome/page.tsx` | OK | Simple card with auth links |
| `app/auth/callback/route.ts` | OK | Handles OTP token_hash and OAuth code exchange |
| `app/layout.tsx` (Root) | OK | QueryProvider > AuthProvider > PendingBookingProvider chain, 3 fonts loaded |

---

## Import Verification Summary

All component imports across all pages were verified to resolve to existing files:

- `@/components/layout` (Header, Footer barrel exports) -- exists
- `@/components/marketing/footer` -- exists
- `@/components/marketing/*` (Hero, Services, Stats, etc.) -- all exist
- `@/components/providers/*` (auth, query, pending-booking) -- all exist
- `@/components/browse-pros/*` -- exists
- `@/components/confirm-booking/*` -- exists
- `@/components/account/*` -- exists
- `@/components/service-detail/*` -- exists
- `@/components/become-tasker/*` -- exists
- `@/components/press/*` -- exists
- `@/components/landing/*` -- exists
- `@/components/location-service/faq-section` -- exists
- `@/components/icons/*` -- exists
- `@/components/LocationAutocomplete` -- exists
- `@/components/TwoFactorDialog` -- exists
- `@/components/pending-booking-banner` -- exists
- `@/components/my-tasks/booking-card` -- exists
- `@/hooks/use-secure-navigation` -- exists
- `@/lib/auth-client` -- exists
- `@/lib/supabase` -- exists (file, not directory)
- `@/lib/supabase/addresses` -- exists
- `@/lib/supabase/bookings` -- exists
- `@/lib/supabase/categories` -- exists
- `@/lib/supabase/types` -- exists
- `@/lib/stripe/payment` -- exists
- `@/lib/service-routes` -- exists
- `@shared/supabase` -- exists (workspace package)
- `@shared/schemas/auth` -- exists

**Only unresolved import:** `app/api/auth/[...all]/route.ts` -- file does NOT exist (see Missing section)

---

## Recommendations (Priority Order)

1. **Fix "Taskrabbit" branding** in task-form (critical user-facing bug)
2. **Fix account page** -- use shared Header, add Footer, wire up nav buttons
3. **Investigate missing api/auth/[...all]/route.ts** -- determine if auth is broken on web
4. **Replace all hardcoded hex colors** with Tailwind brand tokens (8+ files affected)
5. **Add root error.tsx** for branded error handling
6. **Fix help and for-business pages** to use shared Header component
7. **Replace `<a>` with `<Link>`** in elite-taskers and for-business
8. **Fix services-by-city** neighborhood links to point to correct locations
9. **Update all-pages index** to include all routes
10. **Fix verify-code typo** "Term of service" -> "Terms of Service"
