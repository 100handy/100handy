# 100Handy Content Platform Schema

## Purpose

Define the first real data layer for editable platform content.

This schema is designed to support:

- admin-managed website pages
- page-level SEO
- navigation and global site settings
- blog publishing
- FAQs
- app-managed copy/content
- announcements

This is the first implementation step toward editing actual platform data from `admin-web`.

Migration:

- [supabase/migrations/20260523000001_create_content_platform_core.sql](/Users/berkay/Documents/100handy/supabase/migrations/20260523000001_create_content_platform_core.sql)

---

## Design Principles

1. Extend the existing `site_content` flow instead of replacing it.
2. Keep tables additive and compatible with current admin code.
3. Separate content values from metadata and publishing state.
4. Keep public-read behavior safe for published content.
5. Reuse `public.is_admin()` for write access.

---

## Existing Table Reused

## `public.site_content`

Already exists and remains the field-level page content store.

Purpose:

- stores page section fields like:
  - `hero.title`
  - `content.paragraph_1`
  - `leadership.member_1_name`

Important change in the new schema:

- `site_content.page_key` is now intended to belong to `site_pages.page_key`

So:

- `site_pages` defines the page record
- `site_content` defines editable fields for that page

---

## New Core Tables

## 1. `public.site_pages`

### Purpose

Registry of CMS-managed website pages.

### Key columns

- `page_key`
- `title`
- `slug`
- `template_key`
- `status`
- `is_system`
- `updated_by`

### Why it exists

Before this, `site_content` had page keys but no formal page records.  
Now pages have:

- a stable identity
- a canonical slug
- a publishing state
- a template type

### Relationships

- `site_content.page_key -> site_pages.page_key`
- `seo_metadata(surface_type='page', surface_key=page_key)`

### Used by

- `admin-web`: page lists, status management, page editor
- `client-web`: routing/lookup for CMS-managed public pages

---

## 2. `public.seo_metadata`

### Purpose

Central metadata store for:

- pages
- blog posts
- services
- locations
- app screens if needed later

### Key columns

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

### Why it exists

Today SEO is scattered in code across many `client-web` routes.  
This table centralizes it.

### Relationships

Logical rather than FK-based:

- `surface_type='page'` + `surface_key=site_pages.page_key`
- `surface_type='blog_post'` + `surface_key=blog_posts.slug`
- later:
  - `service_category`
  - `service_subcategory`
  - `location_page`
  - `location_service_page`

### Used by

- `admin-web`: SEO tab
- `client-web`: `metadata` / `generateMetadata`

---

## 3. `public.navigation_items`

### Purpose

Admin-managed navigation and footer links.

### Key columns

- `nav_key`
- `parent_id`
- `label`
- `href`
- `item_type`
- `location`
- `audience`
- `sort_order`
- `visible`

### Why it exists

Header/footer/site shell links are hardcoded today.  
This table lets admin control them.

### Used by

- `client-web` header
- `client-web` footer
- support/account nav variants if desired later

---

## 4. `public.site_settings`

### Purpose

Global site-level settings that do not fit page field storage cleanly.

### Key columns

- `setting_group`
- `setting_key`
- `value_json`

### Example uses

- contact details
- social links
- default CTA labels
- default SEO fallbacks
- company/legal info
- trust badges config

### Used by

- `client-web`
- `admin-web`

---

## 5. `public.blog_posts`

### Purpose

First-class admin-managed blog post content.

### Key columns

- `slug`
- `title`
- `excerpt`
- `body`
- `cover_image_url`
- `category`
- `tags`
- `author_name`
- `status`
- `published_at`

### Why it exists

Current blog content is still largely code-defined.  
This table is the base for a real blog CMS.

### Relationships

- `seo_metadata(surface_type='blog_post', surface_key=slug)`

### Used by

- `admin-web` blog CMS
- `client-web` `/blog`
- `client-web` `/blog/[slug]`

---

## 6. `public.faq_items`

### Purpose

Structured FAQs across website/app/support surfaces.

### Key columns

- `faq_group`
- `question`
- `answer`
- `sort_order`
- `visible`

### Example groups

- `client-help`
- `pro-help`
- `trust-safety`
- `service-assembly`
- `service-cleaning`

### Used by

- `client-web`
- `client-mobile`
- `admin-web`

---

## 7. `public.app_content`

### Purpose

Admin-managed mobile app content store.

### Key columns

- `platform`
- `screen_key`
- `section_key`
- `field_key`
- `value`
- `status`

### Why it exists

`client-mobile` currently hardcodes most copy.  
This table is the first real layer for editable app content.

### Example keys

- `platform = shared`
- `screen_key = auth_welcome`
- `section_key = hero`
- `field_key = title`

### Used by

- `admin-web`: app content editor
- `client-mobile`: content fetch layer with local fallbacks

---

## 8. `public.announcements`

### Purpose

Targeted platform announcements and banners.

### Key columns

- `audience`
- `placement`
- `title`
- `body`
- `cta_label`
- `cta_href`
- `starts_at`
- `ends_at`
- `active`

### Example uses

- web promo banner
- professional dashboard announcements
- temporary support notices
- feature rollout messages

### Used by

- `client-web`
- `client-mobile`
- `admin-web`

---

## Read/Write Model

## Public read

Public-facing content tables are readable for the rows that should render publicly:

- `site_pages`: published only
- `site_content`: existing public CMS content flow
- `seo_metadata`: public
- `navigation_items`: visible items
- `site_settings`: public
- `blog_posts`: published only
- `faq_items`: visible only
- `app_content`: published only
- `announcements`: active and in date range

## Admin write

All writes use:

- `public.is_admin()`

This keeps content operations inside the existing admin authorization model.

---

## Consumption Model

## `admin-web`

### Existing

- already consumes `site_content`

### Next changes

1. Page list should read `site_pages`
2. Page editor should save:
   - `site_pages`
   - `site_content`
   - `seo_metadata`
3. New editors should manage:
   - `navigation_items`
   - `site_settings`
   - `blog_posts`
   - `faq_items`
   - `app_content`
   - `announcements`

## `client-web`

### Existing

- `getPageContent(pageKey)` reads `site_content`
- metadata is still mostly code-based

### Next changes

1. public marketing pages keep reading `site_content`
2. metadata functions should read `seo_metadata`
3. header/footer should read `navigation_items`
4. sitewide config should read `site_settings`
5. blog pages should read `blog_posts`
6. FAQ/legal/support pages should read structured FAQ/policy sources

## `client-mobile`

### Existing

- mostly hardcoded content in screen components

### Next changes

1. introduce app content fetch helper
2. read `app_content` by:
   - `platform`
   - `screen_key`
3. read `announcements` for banners/notices
4. keep safe fallbacks in code to avoid broken app startup

---

## Phase 1 Scope

This migration is not “everything editable” yet.  
It is the first correct step for editing actual data.

What it enables immediately:

1. formal page records
2. centralized SEO storage
3. navigation/footer settings model
4. blog/FAQ/app-content/announcements data layer

What still needs implementation:

1. admin UI for these tables
2. `client-web` consumption of SEO/nav/settings/blog data
3. `client-mobile` consumption of `app_content`
4. service catalog tables and service/task-form migration
5. draft/preview/versioning

---

## Next Implementation Steps

1. apply the migration
2. extend `admin-web` page editor with `site_pages` + `seo_metadata`
3. build `client-web` metadata helpers against `seo_metadata`
4. migrate the first public pages:
   - `about-us`
   - `for-good`
   - `careers`
   - `contact`
   - `terms`
   - `legal`

