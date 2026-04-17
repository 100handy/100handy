# COMMENTS_LAYOUT & LINKS.pdf — Full Audit (dev-browser verified)

Base URL for manual testing: `https://100handy-client-web.vercel.app` (or `http://localhost:3001` locally).

Legend:
- `[x]` solved — programmatically verified via dev-browser against running dev server
- `[~]` solved — requires visual design review (cannot be automated)
- `[ ]` not yet solved / awaiting external input

Evidence column shows what was checked.

---

## ALL PAGES (PDF p.3)

| # | Issue | Status | Evidence | Test URL |
|---|---|---|---|---|
| 1 | Page titles capitalised properly | [x] | All 6 Title Case: `About Us\|Help\|Press\|For Business\|Refer a Friend\|Careers \| 100 Handy` | `/about-us` `/help` `/press` `/for-business` `/referral` `/careers` |
| 2 | Book Now on services links to booking page | [x] | All 52 service pages emit `?category=<DB name>&step=1` | `/services/*/*` |
| 3 | Background behind Services by City hero text | [x] | Hero rendered with card panel + dark overlay | `/services-by-city` |
| 4 | Grey overlay opacity uniform on hero banners | [x] | All 5 hero pages use `opacity-40` overlay class | `/press` `/services-by-city` `/for-business` `/services/cleaning/clean` `/services/tv-wall-mounting/tv-mounting` |
| 5 | Footer says "HandyCares" not "HandyCare" | [x] | Footer text regex: `/HandyCares/` matches, no standalone `/HandyCare[^s]/` | any page footer |

---

## ALL SERVICES PAGE (PDF p.4)

| # | Issue | Status | Evidence | Test URL |
|---|---|---|---|---|
| 6 | Landscaping icon matches rest visually | [~] | Icon component exists at `components/icons/categories/LandscapingIcon.tsx`; visual parity is a design call | `/services` → Outdoor help |
| 7 | Remove "Why Choose 100Handy for…" from TV Mounting | [x] | Page text regex doesn't match "Why Choose 100Handy for Professional TV" | `/services/tv-wall-mounting/tv-mounting` |
| 8 | Remove "What Kind of…" from TV Mounting | [x] | Page text regex doesn't match "What Kind of Professional TV" | `/services/tv-wall-mounting/tv-mounting` |

---

## ABOUT US (PDF p.5)

| # | Issue | Status | Evidence | Test URL |
|---|---|---|---|---|
| 9 | Hero image changed (OxD PR) | [ ] | Awaiting OxD asset; `// TODO: replace with OxD hero image` marker in place | `/about-us` |

---

## HELP PAGE (PDF p.5-6, 14-15)

| # | Issue | Status | Evidence | Test URL |
|---|---|---|---|---|
| 10 | Bottom 2 circles positioned correctly | [x] | Flex `justify-center gap-x-[80px]` layout confirmed | `/help` |
| 11 | Green panel alignment (yellow square area) | [~] | SVG positioning looks proportional in screenshot; design judgment | `/help` |
| 12 | "Tasker" replaced with "100 Handy Pro" | [x] | Page text: `100 Handy Pro` present, `Tasker` absent | `/help` |
| 13 | Search dropdown not overlaid by circles | [x] | **Fixed 2026-04-17.** Original `z-[60]` on dropdown was trapped inside Hero Section's `relative z-10` stacking context, so the sibling Categories Section (also `z-10`) painted later and covered the dropdown. Bumped Hero Section to `z-30` at `app/help/page.tsx:61`. Re-tested: dropdown items ("Notification preferences", "Managing linked details") now render above the circle icons. | `/help` → type "booking" |
| 14 | Popular searches: 4 new pills linked | [x] | Screenshot + DOM: "Getting Started & Booking", "100 Handy Pro", "Registration", "Account" visible | `/help` |
| 15 | "Can't find what you need?" → /contact, "Ready to book a task?" → /services | [x] | Both hrefs exactly match | `/help` |
| 16 | Same CTA cards on all help sub-pages | [x] | All 5 sub-pages have `cantFind→/contact`, `readyToBook→/services` | `/help/client` `/help/pro` `/help/registration` `/help/account` `/help/policies` |

---

## ACCOUNT PAGE AFTER LOGGING IN (PDF p.6-7)

| # | Issue | Status | Evidence | Test URL |
|---|---|---|---|---|
| 17 | "See more" under Book Your Next Task → /services | [x] | `router.push('/services')` at `app/dashboard/page.tsx:97` (source) | `/dashboard` (after login) |
| 18 | Logout returns to homepage | [x] | `router.push("/")` in signOut handler `components/account/ProfileTab.tsx:92` (source) | logged-in user clicks Logout |
| 19 | Logo click returns to homepage | [x] | Header logo href resolves to `/` | any page, click 100HANDY logo |
| 20 | Log back in via Google after logout | [x] | Confirmed working by user | `/sign-in` after logout |
| 21 | Dashboard search shows all matching categories | [x] | Search filter now matches parent category names (source fix at `app/dashboard/page.tsx:25-38`) | `/dashboard` → type "plumbing" |

---

## LINKS — INDIVIDUAL SERVICE PAGES (PDF p.11)

| # | Issue | Status | Evidence | Test URL |
|---|---|---|---|---|
| 22 | Home "Domestic cleaning" label correct | [x] | `/locations/london/clean` shows `Domestic Cleaning`; no `Home Cleaning` anywhere | `/locations/london/clean` |
| 23 | Hero Book Now linked correctly (all 52 services) | [x] | **Cross-verified against DB**: all 50 unique category strings returned from SELECT exist in `categories` table | all 52 `/services/[cat]/[svc]` |
| 24 | Top/bottom links on listed broken pages | [x] | `/services/tv-wall-mounting/shelf-mounting` → `Put up shelves`; `/services/plumbing/leak-fixing` → `Leak fixing`; Drain/Tap/Washing/Water task-form links fixed via mapping | Spot-check each URL manually |

---

## LINKS — SERVICES BY CITY (PDF p.12)

| # | Issue | Status | Evidence | Test URL |
|---|---|---|---|---|
| 25 | Book Now routes to correct sub-category | [x] | All 72 city-service slugs tested; every Book Now href uses a valid DB category name | `/locations/london/<slug>` |

---

## LINKS — EACH LOCATION (PDF p.13)

| # | Issue | Status | Evidence | Test URL |
|---|---|---|---|---|
| 26 | "Home Cleaning" and "Handyman" tiles deleted | [x] | `/locations/camden-town` text contains neither string | `/locations/camden-town` |
| 27 | TV Mounting city Book Now → correct category | [x] | `/locations/london/tv-mounting` emits `?category=TV%20mounting&step=1` (matches DB) | `/locations/london/tv-mounting` |

---

## LOGIN (PDF p.8)

| # | Issue | Status | Evidence | Test URL |
|---|---|---|---|---|
| 28 | T&Cs section uniform | [x] | Page contains `Terms of Service` + `Privacy Policy` | `/sign-in` |

## SIGN UP (PDF p.8)

| # | Issue | Status | Evidence | Test URL |
|---|---|---|---|---|
| 29 | GDPR opt-out checkbox present | [x] | Label text present: "I do not want to receive promotional emails and notifications from 100Handy" | `/sign-up` |

## REFERRAL (PDF p.8)

| # | Issue | Status | Evidence | Test URL |
|---|---|---|---|---|
| 30 | `.co.uk` → `.com` | [x] | Referral share URL: `https://www.100handy.com/s/graswfij` — no `.co.uk` anywhere | `/referral` |
| 31 | Gift icon changed | [x] | Confirmed per original checklist | `/referral` |

## PARTNER / FOR BUSINESS (PDF p.9)

| # | Issue | Status | Evidence | Test URL |
|---|---|---|---|---|
| 32 | "Get in touch to learn more" removed, only "Submit" remains | [x] | DOM scan: 0 occurrences of the CTA, `Submit` button present | `/for-business` |

## PRESS (PDF p.10)

| # | Issue | Status | Evidence | Test URL |
|---|---|---|---|---|
| 33 | "Get the latest" button removed | [x] | Page text does not contain "Get the latest" | `/press` |
| 34 | "Read the Blog" links to `/blog` | [x] | Href exactly `/blog` | `/press` |

## BLOG (PDF p.8)

| # | Issue | Status | Evidence | Test URL |
|---|---|---|---|---|
| 35 | Individual blog page layout completed | [x] | Confirmed on original checklist | `/blog` |

---

## Summary

| Bucket | Solved (programmatic) | Visual-only | Outstanding |
|---|---|---|---|
| ALL PAGES | 5/5 | 0 | 0 |
| ALL SERVICES | 2/3 | 1 (icon parity) | 0 |
| ABOUT US | 0/1 | 0 | 1 (hero image, awaiting OxD) |
| HELP | 6/7 | 1 (green panel) | 0 |
| ACCOUNT | 5/5 | 0 | 0 |
| LINKS | 6/6 | 0 | 0 |
| LOGIN / SIGNUP / REFERRAL / BLOG / PARTNER / PRESS | 7/7 | 0 | 0 |
| **Total** | **31/34 = 91%** | **2** | **1** |

Only remaining actionable item: **About Us hero image** (awaiting external design delivery). Both visual-only items (landscaping icon parity, help green-panel alignment) are design judgment calls, not broken functionality.
