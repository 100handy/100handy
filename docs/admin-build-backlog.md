# 100Handy Admin Build Backlog

## Purpose

Turn the audit into an execution backlog for making the 100Handy admin panel capable of editing platform content across:

- website pages
- blogs
- SEO
- navigation / footer
- FAQs / legal / support
- service catalog
- mobile app copy and support content

This backlog is grouped by workstream and ordered for practical delivery.

---

## Workstream A: Admin Foundation

## A1. Finish placeholder admin routes

### Goal

Remove placeholder production routes from `admin-web`.

### Current placeholder routes

From `apps/admin-web/src/App.tsx`:

- `/tasks/open`
- `/tasks/scheduled`
- `/tasks/completed`
- `/tasks/cancelled`
- `/tasks/questions`
- `/content/page-settings`
- `/accounts`
- `/notifications`

### Tasks

1. Replace each placeholder route with a real page component.
2. Decide whether the page is:
   - real now
   - hidden for later
   - should be removed entirely
3. Add list/detail/edit state where appropriate.

### Deliverable

- no `<div className="p-6">...Page</div>` production routes left

### Priority

`P0`

---

## A2. Fix sidebar coverage

### Goal

Expose all working admin sections in navigation.

### Missing / hidden sections

- Dashboard
- Accounts
- Finance
- Insights
- Promotions
- Support
- Notifications

### Tasks

1. Extend `apps/admin-web/src/components/sidebar.tsx`
2. group sections clearly:
   - Operations
   - Content
   - Finance
   - Support
   - Settings
3. ensure active state and nested state work for all groups

### Deliverable

- sidebar exposes all live admin capability

### Priority

`P0`

---

## A3. Standardize admin page primitives

### Goal

Avoid one-off patterns as the admin panel expands.

### Tasks

1. establish shared page shell
2. shared table pattern
3. shared empty state
4. shared save bar / success toast
5. shared loading/error components
6. shared field group layout

### Deliverable

- reusable admin UI patterns

### Priority

`P1`

---

## Workstream B: CMS Schema and Backend

## B1. Formalize page content schema

### Goal

Move from partial `site_content` usage to a stable page system.

### Tables

1. `site_pages`
2. `site_content`

### Tasks

1. define page row structure
2. connect page registry keys to `site_pages.page_key`
3. add status fields:
   - draft
   - published
4. add timestamps and ownership

### Deliverable

- stable website page content model

### Priority

`P0`

---

## B2. Create SEO metadata model

### Goal

Make SEO first-class in admin.

### Table

- `seo_metadata`

### Fields

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

### Tasks

1. create schema
2. define lookup strategy for web routes
3. define fallback precedence:
   - page-specific
   - content-type default
   - global default

### Deliverable

- all public web surfaces can pull metadata from one source

### Priority

`P0`

---

## B3. Create navigation and site settings model

### Goal

Move shared site structure out of code.

### Tables

- `navigation_items`
- `site_settings`

### Tasks

1. header nav schema
2. footer nav schema
3. contact/social schema
4. default CTA and trust settings
5. sitewide announcement settings

### Deliverable

- site shell becomes configurable

### Priority

`P1`

---

## B4. Create blog model

### Goal

Support real admin blog publishing.

### Tables

- `blog_posts`
- `blog_categories`
- `blog_tags`

### Tasks

1. define post structure
2. draft/published support
3. cover image support
4. SEO relationship or embedded metadata
5. publish date / sort order

### Deliverable

- blog content can be managed without code

### Priority

`P1`

---

## B5. Create support and FAQ content model

### Goal

Manage support/legal/help content in admin.

### Tables

- `faq_items`
- `policy_pages`
- `support_blocks`

### Tasks

1. FAQ item schema
2. policy page schema
3. support content blocks
4. category/grouping logic

### Deliverable

- help/legal/support surfaces can be updated operationally

### Priority

`P1`

---

## B6. Create app content model

### Goal

Support admin-managed content for the mobile app.

### Table

- `app_content`

### Fields

- `platform`
- `screen_key`
- `section_key`
- `field_key`
- `value`
- `status`
- `updated_at`

### Tasks

1. define content-key naming convention
2. define fallback behavior in app
3. define shared vs iOS vs Android support

### Deliverable

- mobile copy can be managed from admin

### Priority

`P1`

---

## B7. Create service catalog model

### Goal

Manage service/category content centrally.

### Tables

- `service_categories`
- `service_subcategories`
- `service_seo`
- `task_form_content`

### Tasks

1. define category hierarchy
2. define descriptions and helper copy
3. define SEO fields for services
4. define task-form labels/help text

### Deliverable

- website and app service content use one managed source

### Priority

`P1`

---

## Workstream C: Admin Content UI

## C1. Expand page editor

### Goal

Make page editing production-ready.

### Tasks

1. extend field types
   - `textarea`
   - `markdown`
   - `slug`
   - `url`
   - `boolean`
   - `select`
   - `repeater`
   - `date`
2. add page metadata area
3. add draft/publish status
4. add preview link
5. add changed-by / changed-at

### Deliverable

- admin page editor can support full marketing/info pages

### Priority

`P0`

---

## C2. Add SEO editor UI

### Goal

Expose metadata editing inside admin.

### Tasks

1. add SEO tab to page editor
2. add SEO editor to blogs
3. add SEO editor to service pages
4. add preview snippet:
   - title
   - description
   - social card preview

### Deliverable

- non-engineers can manage SEO directly

### Priority

`P0`

---

## C3. Add navigation/footer editor

### Goal

Allow admin editing of shared site shell.

### Tasks

1. header navigation editor
2. footer link editor
3. social/contact fields
4. ordering and visibility controls

### Deliverable

- header/footer become admin-managed

### Priority

`P1`

---

## C4. Add blog CMS UI

### Goal

Allow create/edit/publish for blog posts.

### Tasks

1. post list
2. create post
3. edit post
4. draft/published state
5. tags/categories
6. cover image upload
7. SEO tab

### Deliverable

- full admin blog workflow

### Priority

`P1`

---

## C5. Add FAQ / policy / support editors

### Goal

Move help and legal content into editor flows.

### Tasks

1. FAQ CRUD
2. policy page editing
3. support block editing
4. ordering and grouping

### Deliverable

- support/legal can be maintained without code deploys

### Priority

`P1`

---

## C6. Add mobile content editor

### Goal

Edit app content through admin.

### Tasks

1. app screen content list
2. app screen field editor
3. platform filter:
   - shared
   - iOS
   - Android
4. preview or key explorer

### Deliverable

- admin can manage mobile text/content surfaces

### Priority

`P2`

---

## C7. Add service catalog editor

### Goal

Control categories/subcategories/help/SEO from admin.

### Tasks

1. category CRUD
2. subcategory CRUD
3. descriptions
4. display order
5. icons/images
6. FAQs per service
7. task-form help text
8. SEO fields

### Deliverable

- services become centrally managed

### Priority

`P1`

---

## Workstream D: Client Web Migration

## D1. Migrate public marketing/info pages

### Goal

Stop hardcoding content in major public pages.

### First pages

- `/`
- `/about-us`
- `/for-good`
- `/careers`
- `/contact`
- `/terms`
- `/legal`
- `/help`
- `/help/account`
- `/help/client`
- `/help/pro`
- `/help/registration`
- `/help/policies`
- `/help/trust-safety`

### Tasks

1. identify page sections
2. add to `pageRegistry`
3. replace hardcoded values with CMS reads
4. add safe defaults

### Deliverable

- public marketing/info pages are CMS-backed

### Priority

`P0`

---

## D2. Migrate shared marketing sections

### Goal

Avoid repeating content config per page.

### Sections

- hero
- testimonials
- stats
- guarantees
- popular projects
- CTA blocks

### Deliverable

- reusable CMS-backed section system

### Priority

`P1`

---

## D3. Migrate blog frontend

### Goal

Use admin-managed posts instead of code-defined arrays.

### Tasks

1. blog index from DB
2. blog detail from DB
3. category filters from DB
4. related posts from DB
5. SEO from DB

### Deliverable

- blog pages are no longer code-content-driven

### Priority

`P1`

---

## D4. Migrate service and location SEO surfaces

### Goal

Control service landing SEO and copy from admin.

### Tasks

1. category landing content
2. service detail content
3. location page content
4. location-service page content
5. metadata for all above

### Deliverable

- services SEO becomes manageable and scalable

### Priority

`P1`

---

## D5. Wire navigation/footer/global settings

### Goal

Consume admin-managed global shell content.

### Tasks

1. replace hardcoded nav items
2. replace footer links/content
3. replace contact/social globals
4. add sitewide promo banner support

### Deliverable

- shared web shell is admin-controlled

### Priority

`P1`

---

## Workstream E: Client Mobile Migration

## E1. Add app content loading layer

### Goal

Give `client-mobile` a safe content source.

### Tasks

1. create `app_content` fetch layer
2. cache locally
3. add fallback behavior
4. avoid blocking boot on content fetch

### Deliverable

- app can consume admin-managed copy safely

### Priority

`P1`

---

## E2. Migrate auth and onboarding content

### Goal

Make the most visible app content editable first.

### Surfaces

- auth welcome
- client start
- sign in / sign up
- professional sign in / sign up
- onboarding screens
- verification guidance

### Deliverable

- core auth/onboarding copy editable without app code change

### Priority

`P1`

---

## E3. Migrate support/help/promotions content

### Goal

Make operational app messaging flexible.

### Surfaces

- support chat/tickets copy
- promotions
- announcements
- empty states
- legal/help text

### Deliverable

- operational mobile messaging editable in admin

### Priority

`P1`

---

## E4. Migrate service/task helper content

### Goal

Unify service/task form messaging across app and web.

### Surfaces

- service browse copy
- task-form helper text
- booking helper copy
- category hints

### Deliverable

- task flow content centrally managed

### Priority

`P2`

---

## Workstream F: Publishing, Preview, and Governance

## F1. Draft / publish model

### Goal

Avoid instant production changes by accident.

### Tasks

1. draft/published fields
2. publish action
3. unpublish action
4. scheduled publish support

### Priority

`P1`

---

## F2. Preview system

### Goal

Preview changes before publish.

### Tasks

1. page preview URLs
2. blog preview URLs
3. service preview support
4. staged content reads

### Priority

`P2`

---

## F3. Version history and rollback

### Goal

Make content changes safe and auditable.

### Tasks

1. revision records
2. last editor tracking
3. rollback action

### Priority

`P2`

---

## F4. Permissions

### Goal

Separate content editing from ops/finance access.

### Roles

- super admin
- content editor
- SEO editor
- support admin
- finance admin
- operations admin

### Priority

`P2`

---

## Suggested Delivery Order

## Milestone 1

- A1 finish placeholders
- A2 fix sidebar
- B1 formalize page schema
- B2 create SEO schema
- C1 expand page editor
- C2 add SEO editor

## Milestone 2

- D1 migrate public marketing/info pages
- D5 wire navigation/footer/global settings
- B3 navigation/site settings schema

## Milestone 3

- B4 blog model
- C4 blog CMS UI
- D3 blog frontend migration

## Milestone 4

- B5 support/legal/FAQ schema
- C5 support/legal/FAQ editors
- D1 remaining help/legal migrations

## Milestone 5

- B7 service catalog schema
- C7 service catalog editor
- D4 service/location SEO migration
- E4 task helper content

## Milestone 6

- B6 app content schema
- C6 app content editor
- E1 app content loading
- E2 auth/onboarding migration
- E3 support/promotions migration

## Milestone 7

- F1 draft/publish
- F2 preview
- F3 versioning
- F4 permissions

---

## Immediate Next Tickets

If starting right now, do these first:

1. implement admin placeholder route audit and cleanup
2. add full sidebar coverage
3. design and migrate `seo_metadata`
4. extend page editor with SEO tab
5. migrate `/about-us`, `/for-good`, `/careers`, `/contact`, `/terms`, `/legal`

