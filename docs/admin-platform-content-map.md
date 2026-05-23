# 100Handy Admin Platform Content Map

## Goal

Make the `admin-web` app the control surface for editable platform content across:

- `client-web`
- `client-mobile`
- blogs
- SEO / metadata
- navigation / footer
- FAQs / legal / support
- service and task-form content
- announcements and promos

This document is the implementation map. It separates:

- what already exists
- what is partially done
- what is missing
- the order to build it

---

## 1. Current Status

### 1.1 Admin foundation

Status: `partial`

Already in place:

- admin auth flow
- admin-only route protection
- dashboard shell
- users / tasks / handys / finance / support / promotions / notifications routes
- content management routes

Core files:

- `apps/admin-web/src/App.tsx`
- `apps/admin-web/src/contexts/AuthContext.tsx`
- `apps/admin-web/src/components/sidebar.tsx`

Gaps:

- several placeholder routes still exist
- some working admin sections are not exposed in the sidebar

### 1.2 Website page editing

Status: `partially real`

Already in place:

- page registry
- page list
- page editor
- `site_content` API
- image upload to storage

Core files:

- `apps/admin-web/src/lib/cms/page-registry.ts`
- `apps/admin-web/src/lib/api/site-content.ts`
- `apps/admin-web/src/pages/content/pages.tsx`
- `apps/admin-web/src/pages/content/page-editor.tsx`

What this means:

- some public website pages can already become CMS-driven
- but not all website sections are currently wired to it

### 1.3 Blogs

Status: `partial`

Already in place:

- admin page for blogs exists
- public blog pages exist

Gaps:

- no confirmed end-to-end blog CMS publishing flow
- SEO/editorial workflow needs to be formalized

### 1.4 SEO / metadata

Status: `mostly missing as admin capability`

Current state:

- `client-web/app/layout.tsx` has hardcoded default metadata
- public routes likely define metadata in code or rely on defaults
- no central admin SEO editor is currently visible

What is missing:

- page-level meta title
- meta description
- OG image
- canonical URL
- robots flags
- JSON-LD / structured data
- blog SEO
- service/location SEO

### 1.5 Mobile app content editing

Status: `missing as a real admin system`

Current state:

- `client-mobile` is mostly code-driven
- copy and content are spread across screen components
- there is no platform-wide `app_content` CMS flow yet

What is missing:

- app copy editor
- screen-level content registry
- admin-managed app FAQs/help/announcements
- app-level banners/promos/legal copy controls

### 1.6 Navigation / footer / global settings

Status: `missing as a full system`

Current state:

- web navigation and footer appear component-driven
- no formal admin-managed global settings layer is visible yet

### 1.7 FAQs / legal / support content

Status: `partial`

Already in place:

- admin routes exist for FAQs and support-related sections
- public legal/help pages exist

Gaps:

- not yet unified under one clear content model
- SEO/schema support not formalized

### 1.8 Service catalog / task-form content

Status: `partial`

Current state:

- categories and services exist across web/app/backend
- task form and service detail content exist in code

Gaps:

- not centrally editable from admin as a structured catalog
- service landing SEO not centrally managed
- task-form help content is not fully CMS-driven

---

## 2. Definition of Done

The platform is considered "fully editable" only when all of the following are true:

1. Every public website page has admin-managed content fields.
2. Every public website page has admin-managed SEO fields.
3. Blogs are fully managed in admin.
4. Header/footer/navigation are managed in admin.
5. FAQs, legal pages, and support pages are managed in admin.
6. Service and sub-service content is managed in admin.
7. Key mobile app content is managed in admin.
8. All content has draft/publish/version tracking.
9. Editors can preview changes before publish.
10. Permissions exist so not every admin can edit everything.

---

## 3. Platform Inventory by Area

## 3.1 Admin web

### Real or mostly real areas

- auth flow
- dashboard
- users
- handys
- task list / task details
- finance sections
- content pages editor

### Placeholder or incomplete areas

From `apps/admin-web/src/App.tsx`:

- `/tasks/open`
- `/tasks/scheduled`
- `/tasks/completed`
- `/tasks/cancelled`
- `/tasks/questions`
- `/content/page-settings`
- `/accounts`
- `/notifications`

### Hidden but existing areas

Routes exist, but sidebar does not fully expose them:

- dashboard
- finance
- insights
- promotions
- support
- accounts
- notifications

## 3.2 Client web

### Public marketing/info surfaces to migrate into CMS

High priority:

- `/`
- `/about-us`
- `/for-good`
- `/careers`
- `/contact`
- `/terms`
- `/legal`
- `/press`
- `/become-tasker`
- `/become-100-handy-pro`
- `/for-business`
- `/all-services`
- `/services`
- `/services/[category]`
- `/services/[category]/[service]`
- `/locations/[city]`
- `/locations/[city]/[service]`
- `/blog`
- `/blog/[slug]`
- `/help/*`

### Reusable components that should become content-driven

Examples:

- `components/marketing/hero.tsx`
- `components/marketing/services.tsx`
- `components/marketing/stats.tsx`
- `components/marketing/testimonials.tsx`
- `components/marketing/guarantees.tsx`
- `components/marketing/how-it-works.tsx`
- `components/marketing/footer.tsx`
- `components/marketing/header.tsx`

### User-account surfaces

These are product/account flows, not pure CMS content:

- `/account`
- `/dashboard`
- `/my-tasks`
- `/browse-pros`
- `/task-form`
- `/bookings/[id]`

These may need editable microcopy, but not full CMS page ownership.

## 3.3 Client mobile

### High-value CMS-managed app content candidates

Start with these:

- `(auth)/welcome`
- `(auth)/(client)/start`
- `(auth)/(client)/sign-in`
- `(auth)/(client)/sign-up`
- `(auth)/(professional)/sign-in`
- `(auth)/(professional)/sign-up`
- support/help screens
- profile empty states
- promotions / announcements
- legal/support text
- onboarding guidance
- verification guidance

### Product/data screens that should stay primarily product-driven

- booking flows
- payment flows
- jobs/tasks operational lists
- profile edit forms
- dynamic booking details

These may use CMS for labels/help text, but not for core business logic.

---

## 4. Required Data Model

## 4.1 Website page content

Use / extend:

- `site_content`

Add or formalize:

- `site_pages`

Suggested fields:

- `page_key`
- `slug`
- `title`
- `template_key`
- `status`
- `created_at`
- `updated_at`

## 4.2 SEO metadata

Create:

- `seo_metadata`

Suggested fields:

- `surface_type`
- `surface_key`
- `meta_title`
- `meta_description`
- `og_title`
- `og_description`
- `og_image_url`
- `twitter_title`
- `twitter_description`
- `twitter_image_url`
- `canonical_url`
- `robots_index`
- `robots_follow`
- `schema_json`
- `updated_at`

## 4.3 Navigation / footer

Create:

- `navigation_items`
- `site_settings`

Use for:

- header nav
- footer nav
- social links
- default CTAs
- contact details
- trust text

## 4.4 Blog CMS

Create or formalize:

- `blog_posts`
- `blog_categories`
- `blog_tags`

## 4.5 FAQ / support / legal

Create or formalize:

- `faq_items`
- `policy_pages`
- `support_blocks`

## 4.6 Mobile app content

Create:

- `app_content`

Suggested keys:

- `platform`
- `screen_key`
- `section_key`
- `field_key`
- `value`
- `status`
- `updated_at`

## 4.7 Announcements and promos

Create:

- `announcements`
- `promo_banners`

## 4.8 Service catalog

Create or extend:

- `service_categories`
- `service_subcategories`
- `service_seo`
- `task_form_content`

---

## 5. Delivery Plan

## Phase 1: Finish the admin shell

### Goal

Make `admin-web` complete enough to serve as the main control plane.

### Work

1. Replace placeholder admin routes with real pages.
2. Expose all existing admin sections in the sidebar.
3. Standardize admin page patterns:
   - list view
   - editor view
   - save feedback
   - loading/error states

### Done when

- no placeholder production routes remain
- all major sections are reachable from navigation

## Phase 2: Formalize CMS schema

### Goal

Create a stable backend model for editable surfaces.

### Work

1. finalize `site_content` model
2. add `site_pages`
3. add `seo_metadata`
4. add `navigation_items`
5. add `blog_posts`
6. add `faq_items`
7. add `app_content`
8. add `announcements`
9. add `service_catalog` tables

### Done when

- every target content type has a defined source of truth

## Phase 3: Complete website page editing

### Goal

Make all public marketing/info pages editable.

### Work

1. expand `pageRegistry`
2. add missing pages to the registry
3. move hardcoded sections into `site_content`
4. support richer field types:
   - text
   - rich text
   - image
   - repeater
   - boolean
   - slug
   - link

### Done when

- marketing/info pages no longer require code edits for copy/image changes

## Phase 4: SEO and metadata

### Goal

Make SEO editable for all public pages and blogs.

### Work

1. add SEO tab to page editor
2. add SEO tab to blog editor
3. wire metadata generation in `client-web` to admin data
4. support:
   - meta title
   - meta description
   - OG image
   - canonical
   - robots
   - structured data

### Done when

- all public pages and blogs have admin-managed SEO

## Phase 5: Blog CMS

### Goal

Make blogs fully admin-driven.

### Work

1. post list
2. create/edit post
3. draft/published
4. cover image
5. tags/categories
6. SEO fields
7. preview

### Done when

- publishing a blog requires no code changes

## Phase 6: Navigation, footer, and global site settings

### Goal

Move global web structure into admin control.

### Work

1. header nav editor
2. footer editor
3. social links editor
4. contact/settings editor
5. global banner/announcement editor

### Done when

- site-wide structure and shared CTAs are editable in admin

## Phase 7: FAQs, legal, and support

### Goal

Make support/legal content updateable without deploys.

### Work

1. FAQ editor
2. legal page editor
3. support/help block editor
4. FAQ schema support
5. SEO for these surfaces

### Done when

- legal/support changes do not require engineering deploys

## Phase 8: Service catalog and task-form content

### Goal

Unify service editing across web and app.

### Work

1. service category editor
2. subcategory editor
3. descriptions / FAQs / help text
4. order / visibility / feature flags
5. per-service SEO
6. task-form helper content

### Done when

- service content is centrally managed

## Phase 9: Mobile app content layer

### Goal

Make key app content admin-editable.

### Work

1. create `app_content`
2. build admin editor for app screens
3. migrate:
   - auth copy
   - onboarding copy
   - support/help copy
   - app announcements
   - empty states
   - policy/help microcopy

### Done when

- app text/content changes do not always require a release

## Phase 10: Media library

### Goal

Centralize image and asset management.

### Work

1. upload UI
2. tags/folders
3. alt text
4. usage references
5. replace asset safely

### Done when

- editors can manage visual assets from admin cleanly

## Phase 11: Draft / preview / publish / version history

### Goal

Make the system safe for non-engineers.

### Work

1. draft/published state
2. preview links
3. scheduling
4. version history
5. rollback
6. edited by / edited at

### Done when

- editors can preview and safely publish content

## Phase 12: Permissions

### Goal

Separate operational and content privileges.

### Roles

- super admin
- content editor
- SEO editor
- support admin
- finance admin
- operations admin

### Done when

- access is role-appropriate

---

## 6. Recommended Execution Order

### Sprint 1

- full platform audit
- finish admin placeholders
- expand sidebar
- define CMS schema

### Sprint 2

- expand page registry
- migrate public marketing/info pages
- add SEO model and editor

### Sprint 3

- build blog CMS
- add navigation/footer/global settings

### Sprint 4

- move FAQs/legal/support into CMS
- add structured SEO/schema support

### Sprint 5

- build service catalog editor
- unify service content for web/app

### Sprint 6

- build `app_content`
- migrate app content surfaces

### Sprint 7

- media library
- draft/publish/version history
- permissions

---

## 7. First Concrete Work Items

These should be done first.

### Task 1: Full editable-surface inventory

Create a spreadsheet or markdown audit with columns:

- `surface`
- `platform`
- `route/file`
- `current source`
- `editable now`
- `seo needed`
- `future source`
- `priority`

### Task 2: Placeholder admin route audit

Replace all placeholder routes with tracked implementation tickets.

### Task 3: SEO schema design

Define:

- page-level metadata
- blog-level metadata
- service-level metadata
- location-level metadata
- default fallback rules

### Task 4: Public website migration list

Start with:

- home
- about
- careers
- for-good
- contact
- terms/legal
- help
- service landing pages

### Task 5: App content migration list

Start with:

- welcome/auth
- onboarding
- support/help
- promotions
- announcements
- legal/help copy

---

## 8. Immediate Next Step

The next artifact to create is:

- `editable-surface-audit.md`

This should be a route-by-route inventory of:

- `client-web`
- `client-mobile`
- `admin-web`

with CMS and SEO implications for each.

