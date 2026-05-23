# 100Handy Editable Surface Audit

## Purpose

This is the route-by-route and section-by-section audit for making 100Handy editable from the admin panel.

This document answers:

- what exists today
- what is hardcoded
- what is already admin-editable
- what needs SEO
- what should become CMS-managed next

This is `v1`, focused on:

1. `client-web` public surfaces
2. `client-web` reusable marketing/content sections
3. `client-mobile` high-value content surfaces
4. the admin implications for each

---

## Classification Legend

- `Editable now` = already editable in admin today
- `DB-backed` = driven by data/backend, but not necessarily admin-editable
- `Hardcoded` = content primarily lives in code
- `SEO needed` = should have admin-managed metadata
- `Target source` = where this should live after migration

---

## 1. Client Web Audit

## 1.1 Global web shell

| Surface | Route / File | Current source | Editable now | SEO needed | Target source | Priority |
|---|---|---:|---:|---:|---:|---:|
| Global metadata defaults | `app/layout.tsx` | Hardcoded | No | Yes | `seo_metadata` + `site_settings` | High |
| Header navigation | `components/marketing/header.tsx`, `components/layout/Header.tsx` | Hardcoded | No | No | `navigation_items` | High |
| Footer | `components/marketing/footer.tsx` | Hardcoded | No | No | `navigation_items` + `site_settings` | High |
| Global promo / announcements | mixed components | Hardcoded / partial | No | No | `announcements` | Medium |
| Cookie settings page | `/cookie-settings` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | Medium |

## 1.2 Home and landing pages

| Surface | Route / File | Current source | Editable now | SEO needed | Target source | Priority |
|---|---|---:|---:|---:|---:|---:|
| Home page shell | `/` | Hardcoded composition | No | Yes | `site_pages` + `site_content` + `seo_metadata` | High |
| Home hero | `components/marketing/hero.tsx` | Hardcoded | No | No | `site_content` | High |
| Home category/services row | `components/marketing/services.tsx` | Hardcoded + category-driven mix | No | No | `service_categories` + `site_content` | High |
| Home stats | `components/marketing/stats.tsx` | Hardcoded | No | No | `site_content` | Medium |
| Home popular projects | `components/marketing/popular-projects.tsx` | Hardcoded | No | No | `service_catalog` / `site_content` | Medium |
| Home testimonials | `components/marketing/testimonials.tsx` | Hardcoded | No | No | `site_content` repeater | High |
| Home guarantees | `components/marketing/guarantees.tsx` | Hardcoded | No | No | `site_content` repeater | Medium |
| Home help CTA | `components/marketing/get-help-today.tsx` | Hardcoded | No | No | `site_content` / `service_catalog` | Medium |
| `landing-v2` | `/landing-v2` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | Low |
| `welcome` | `/welcome` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | Medium |
| `referral` | `/referral` | Hardcoded + layout metadata | No | Yes | `site_content` + `seo_metadata` | Medium |

## 1.3 Brand / company pages

| Surface | Route / File | Current source | Editable now | SEO needed | Target source | Priority |
|---|---|---:|---:|---:|---:|---:|
| About Us | `/about-us` | Mixed; page exists in `pageRegistry` | Partial | Yes | `site_content` + `seo_metadata` | High |
| For Good / Handy Cares | `/for-good` | Mixed; page exists in `pageRegistry` | Partial | Yes | `site_content` + `seo_metadata` | High |
| Careers | `/careers` | Mixed; page exists in `pageRegistry` | Partial | Yes | `site_content` + `seo_metadata` | High |
| Press | `/press` | Hardcoded sections | No | Yes | `site_content` + `seo_metadata` | Medium |
| For Business | `/for-business` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | Medium |
| Partner | `/partner` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | Medium |
| HandyCare | `/handycare` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | Medium |
| 100 Handy Star | `/100-handy-star` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | Low |
| Elite Taskers | `/elite-taskers` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | Low |
| Handyman London | `/handyman-london` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | Medium |
| Wallpapering Near Me | `/wallpapering-near-me` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | Low |

## 1.4 Help, legal, and policy pages

| Surface | Route / File | Current source | Editable now | SEO needed | Target source | Priority |
|---|---|---:|---:|---:|---:|---:|
| Help hub | `/help` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | High |
| Help: account | `/help/account` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | Medium |
| Help: client | `/help/client` | Hardcoded metadata/content | No | Yes | `site_content` + `seo_metadata` | Medium |
| Help: pro | `/help/pro` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | Medium |
| Help: registration | `/help/registration` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | Medium |
| Help: policies | `/help/policies` | Hardcoded | No | Yes | `policy_pages` + `seo_metadata` | High |
| Help: partnerships | `/help/partnerships` | Hardcoded | No | Yes | `site_content` + `seo_metadata` | Low |
| Help: trust & safety | `/help/trust-safety` | Hardcoded | No | Yes | `policy_pages` + `seo_metadata` | High |
| Contact Us | `/contact` | likely CMS-target page | Partial / No | Yes | `site_content` + `seo_metadata` | High |
| Terms | `/terms` | likely registry-backed target | Partial / No | Yes | `policy_pages` + `seo_metadata` | High |
| Legal | `/legal` | Hardcoded metadata/content | No | Yes | `policy_pages` + `seo_metadata` | High |

## 1.5 Services and SEO landing surfaces

| Surface | Route / File | Current source | Editable now | SEO needed | Target source | Priority |
|---|---|---:|---:|---:|---:|---:|
| Services index | `/services` | Hardcoded composition | No | Yes | `service_catalog` + `seo_metadata` | High |
| Category landing | `/services/[category]` | DB/code mix, generated metadata in code | No | Yes | `service_categories` + `seo_metadata` | High |
| Service detail | `/services/[category]/[service]` | `servicesData` in code, metadata in code | No | Yes | `service_subcategories` + `service_seo` | High |
| Home repair shortcut | `/services/home-repair` | Hardcoded | No | Yes | `service_catalog` + `seo_metadata` | Medium |
| All services | `/all-services` | Hardcoded | No | Yes | `service_catalog` + `seo_metadata` | Medium |
| Services by city | `/services-by-city` | Hardcoded | No | Yes | `service_catalog` + `seo_metadata` | Medium |
| City landing | `/locations/[city]` | Hardcoded / data mix | No | Yes | `location_pages` + `seo_metadata` | High |
| City-service landing | `/locations/[city]/[service]` | Hardcoded / data mix | No | Yes | `location_service_pages` + `seo_metadata` | High |

## 1.6 Blog surfaces

| Surface | Route / File | Current source | Editable now | SEO needed | Target source | Priority |
|---|---|---:|---:|---:|---:|---:|
| Blog index | `/blog` | Mixed: CMS hero + hardcoded featured/posts | Partial | Yes | `blog_posts` + `site_content` + `seo_metadata` | High |
| Blog detail | `/blog/[slug]` | Code-driven post content + metadata in code | No | Yes | `blog_posts` + `seo_metadata` | High |

## 1.7 Auth and account web surfaces

These are lower-priority for full-page CMS, but should support admin-managed microcopy later.

| Surface | Route / File | Current source | Editable now | SEO needed | Target source | Priority |
|---|---|---:|---:|---:|---:|---:|
| Sign in | `/sign-in` | Hardcoded | No | Low | `app_content` or `site_content` microcopy | Low |
| Sign up | `/sign-up` | Hardcoded | No | Low | `app_content` or `site_content` microcopy | Low |
| Forgot password | `/forgot-password` | Hardcoded | No | Low | `app_content` microcopy | Low |
| Verify code | `/verify-code` | Hardcoded | No | Low | `app_content` microcopy | Low |
| Reset password | `/reset-password` | Hardcoded | No | Low | `app_content` microcopy | Low |
| Account dashboard | `/account`, `/dashboard`, `/my-tasks`, `/bookings/[id]` | Product/data-driven | No | No | Leave product-driven; editable microcopy only | Low |

---

## 2. Web Reusable Section Audit

These are the shared sections most worth migrating into CMS-backed repeaters and structured blocks.

| Section | Current source | Target source | Priority |
|---|---:|---:|---:|
| Marketing hero | Hardcoded | `site_content` | High |
| Testimonials | Hardcoded | `site_content` repeater | High |
| Stats | Hardcoded | `site_content` or `site_settings` | Medium |
| Guarantees | Hardcoded | `site_content` repeater | Medium |
| Popular projects | Hardcoded | `service_catalog` | Medium |
| Press sections | Hardcoded | `site_content` repeater | Medium |
| Careers sections | Registry/CMS target | `site_content` | High |
| FAQ blocks | Hardcoded | `faq_items` | High |
| Footer columns | Hardcoded | `navigation_items` + `site_settings` | High |
| Header links | Hardcoded | `navigation_items` | High |

---

## 3. Client Mobile Audit

Mobile does not need full-page SEO, but it does need a content management layer for copy, announcements, support, and app-specific guidance.

## 3.1 Auth and onboarding

| Surface | Route / File | Current source | Editable now | Target source | Priority |
|---|---:|---:|---:|---:|---:|
| Welcome | `(auth)/welcome.tsx` | Hardcoded | No | `app_content` | High |
| Client start | `(auth)/(client)/start.tsx` | Hardcoded | No | `app_content` | High |
| Client sign in | `(auth)/(client)/sign-in.tsx` | Hardcoded | No | `app_content` | Medium |
| Client sign up | `(auth)/(client)/sign-up.tsx` | Hardcoded | No | `app_content` | Medium |
| Client onboarding | `(auth)/(client)/onboarding.tsx` | Hardcoded | No | `app_content` | High |
| Terms and privacy | `(auth)/(client)/terms-and-privacy.tsx` | Hardcoded | No | `app_content` or shared policy source | High |
| Pro sign in | `(auth)/(professional)/sign-in.tsx` | Hardcoded | No | `app_content` | Medium |
| Pro sign up | `(auth)/(professional)/sign-up.tsx` | Hardcoded | No | `app_content` | Medium |
| Pro verify info | `(auth)/(professional)/verify-info.tsx` | Hardcoded | No | `app_content` | High |
| Pro verify document upload | `(auth)/(professional)/verify-document-upload.tsx` | Hardcoded | No | `app_content` | High |
| Forgot/reset/verify flows | `(auth)/*` | Hardcoded | No | `app_content` | Medium |

## 3.2 Client home and browse surfaces

| Surface | Route / File | Current source | Editable now | Target source | Priority |
|---|---:|---:|---:|---:|---:|
| Home tab | `(client)/(tabs)/home.tsx` | Hardcoded + service/category data mix | No | `app_content` + `service_catalog` | High |
| Search services | `(client)/search-services.tsx` | Hardcoded + category data | No | `service_catalog` + `app_content` | High |
| Select tasker | `(client)/select-tasker.tsx` | Product/data-driven + microcopy hardcoded | No | microcopy to `app_content` | Medium |
| Task form | `(client)/task-form.tsx` | Product/data-driven + hardcoded helper text | No | `task_form_content` + `app_content` | High |
| Task details | `(client)/task-details.tsx` | Product/data-driven + hardcoded copy | No | `task_form_content` + `app_content` | Medium |
| Confirm booking | `(client)/confirm-booking.tsx` | Product/data-driven + hardcoded copy | No | `task_form_content` + `app_content` | Medium |

## 3.3 Client support, profile, and utility content

| Surface | Route / File | Current source | Editable now | Target source | Priority |
|---|---:|---:|---:|---:|---:|
| Support chat | `(client)/support/message-support.tsx` | Hardcoded UX copy | No | `app_content` | High |
| Support tickets | `(client)/support/tickets.tsx` | Hardcoded UX copy | No | `app_content` | Medium |
| Profile tab | `(client)/(tabs)/profile.tsx` | Hardcoded menu labels/copy | No | `app_content` | Medium |
| Notifications | `(client)/notifications.tsx`, profile notifications | Hardcoded | No | `app_content` | Low |
| Promotions / redemptions | profile routes | Hardcoded | No | `promo_banners` + `app_content` | Medium |
| Payments / payment methods | profile routes | Product/data-driven | No | microcopy to `app_content` | Low |
| Privacy / account security | profile routes | Hardcoded legal/support copy | No | `app_content` + shared policy source | Medium |

## 3.4 Professional app content surfaces

| Surface | Route / File | Current source | Editable now | Target source | Priority |
|---|---:|---:|---:|---:|---:|
| Pro dashboard onboarding tasks | `(professional)/(tabs)/dashboard.tsx` + components | Hardcoded | No | `app_content` | High |
| Announcements | `(professional)/announcements.tsx` | Hardcoded or product-driven | No | `announcements` + `app_content` | High |
| Add profile photo | `(professional)/add-profile-photo.tsx` | Hardcoded guidance | No | `app_content` | Medium |
| Set availability / work area guidance | `(professional)/set-availability.tsx`, `set-work-area.tsx` | Hardcoded | No | `app_content` | Medium |
| Skills setup copy | `skills/*` | Hardcoded | No | `app_content` | Medium |
| Profile/about/promote/quick facts | profile routes | Hardcoded | No | `app_content` | Medium |
| Earnings / payouts / direct deposit microcopy | profile routes | Hardcoded | No | `app_content` | Low |
| Support / notifications | profile routes | Hardcoded | No | `app_content` | Medium |

## 3.5 Mobile content rollout priority

### First mobile content batch

1. auth welcome / start / sign-in / sign-up copy
2. onboarding copy
3. support/help content
4. announcements/promos
5. legal/support microcopy
6. task-form helper copy

### Keep product-driven for now

1. booking state logic
2. pricing logic
3. payment logic
4. jobs/task operational lists
5. deep profile business flows

---

## 4. SEO Audit

## 4.1 Already defined in code today

These public web routes already have some explicit metadata in code:

- `app/layout.tsx`
- `/about-us`
- `/for-good`
- `/careers`
- `/press`
- `/blog`
- `/blog/[slug]`
- `/help`
- `/help/account`
- `/help/client`
- `/help/partnerships`
- `/help/policies`
- `/help/pro`
- `/help/registration`
- `/cookie-settings`
- `/legal`
- `/terms`
- `/100-handy-star`
- `/elite-taskers`
- `/services/[category]`
- `/services/[category]/[service]`

## 4.2 Missing admin control

Even where metadata exists in code, it is still:

- hardcoded
- scattered
- not editor-friendly
- not centrally reviewed

## 4.3 SEO rollout priority

### Tier 1

- home
- services index
- category pages
- service pages
- location pages
- blog index
- blog posts
- about
- careers
- contact
- legal / terms / help hubs

### Tier 2

- press
- referral
- for-business
- elite-taskers
- brand landing pages

### Tier 3

- auth pages where indexing may be intentionally disabled

---

## 5. Recommended CMS Targets by Surface Type

| Surface type | Recommended source |
|---|---|
| Public marketing/info page copy | `site_content` |
| Public page SEO | `seo_metadata` |
| Header/footer links | `navigation_items` |
| Global contact/social/defaults | `site_settings` |
| Blogs | `blog_posts` + `seo_metadata` |
| FAQs | `faq_items` |
| Legal/policy content | `policy_pages` or `site_content` |
| Service/category content | `service_categories`, `service_subcategories`, `service_seo` |
| Task form helper content | `task_form_content` |
| Mobile screen copy | `app_content` |
| Banners / promos / notices | `announcements`, `promo_banners` |

---

## 6. Immediate Build Order

### Step 1

Finish admin placeholders and expose all real sections in the sidebar.

### Step 2

Formalize the CMS schema:

- `site_pages`
- `site_content`
- `seo_metadata`
- `navigation_items`
- `blog_posts`
- `faq_items`
- `app_content`
- `announcements`
- `service_catalog`

### Step 3

Migrate public web marketing/info pages first:

- `/`
- `/about-us`
- `/for-good`
- `/careers`
- `/contact`
- `/terms`
- `/legal`
- `/help/*`

### Step 4

Add SEO editor support to all public pages and blogs.

### Step 5

Build blog CMS.

### Step 6

Build navigation/footer/global settings editor.

### Step 7

Build service catalog editor and task-form content editor.

### Step 8

Build `app_content` and migrate mobile auth/onboarding/support/promos copy.

---

## 7. Next Artifact After This One

The next document to create should be:

- `admin-build-backlog.md`

It should convert this audit into implementation tickets with:

- schema work
- admin UI work
- `client-web` migration work
- `client-mobile` migration work
- SEO work
- priority / effort

