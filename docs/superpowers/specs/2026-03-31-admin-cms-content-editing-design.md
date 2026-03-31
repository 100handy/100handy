# Admin CMS: Editable Page Content

## Problem

All text and images on the client-web marketing pages are hardcoded in React components. The client wants to edit this content through the admin dashboard without developer involvement, similar to WordPress.

## Scope

- **Editable pages:** Marketing/public pages only (~15-20 pages): Home, About Us, Services, Contact, For Business, Careers, Press, Blog, Help, For Good, HandyCare, Elite Taskers, Become Tasker, Partner, Become 100 Handy Pro, Referral, Legal, Terms, Cookie Settings, Locations, etc.
- **Not editable:** Auth pages (sign-in, sign-up, forgot-password), app pages (dashboard, bookings, account, my-tasks)
- **Content types:** Plain text, rich text (paragraphs), image URLs
- **No structural changes:** Admin can change content values but cannot add/remove/reorder sections

## Architecture

### Approach: Key-Value Content Store

Each editable piece of content is identified by a composite key: `(page_key, section_key, field_key)`.

Example keys:
- `home` / `hero` / `title` = "Book trusted home services"
- `home` / `hero` / `subtitle` = "Find reliable professionals..."
- `home` / `hero` / `background_image` = "https://..."
- `about-us` / `mission` / `title` = "Our Mission"
- `about-us` / `mission` / `body` = "We connect homeowners..."

### Data Flow

```
Admin Dashboard                Supabase                    Client-Web
┌─────────────┐    upsert     ┌──────────────┐   fetch    ┌──────────────┐
│ Page Editor  │ ──────────►  │ site_content  │ ◄──────── │ Marketing    │
│ (forms)      │              │ table         │           │ Pages (RSC)  │
└─────────────┘              └──────────────┘           └──────────────┘
       │                            │                          │
       ▼                            ▼                          ▼
  Supabase Storage          RLS: public read,         Falls back to
  (image uploads)           admin-only write          hardcoded defaults
```

## Database

### Table: `site_content`

```sql
create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  section_key text not null,
  field_key text not null,
  content_type text not null check (content_type in ('text', 'rich_text', 'image_url')),
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  unique(page_key, section_key, field_key)
);

-- Indexes
create index idx_site_content_page on site_content(page_key);

-- RLS
alter table site_content enable row level security;

-- Public can read all content
create policy "Public read access" on site_content for select using (true);

-- Only admins can insert/update/delete
create policy "Admin write access" on site_content for all
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );
```

### Storage Bucket: `site-content-images`

- Public read access
- Admin-only upload
- Max file size: 10MB
- Allowed types: image/jpeg, image/png, image/webp, image/svg+xml

## Admin UI

### Location in Admin App

Under existing sidebar: **Content Management > Pages**

Replace the current hardcoded pages list with a functional page list that shows all editable marketing pages.

### Page List View (`/content/pages`)

- Table showing: Page Name, Section Count, Last Modified, Status
- Click row to edit
- Pages are defined in a config registry (not dynamic - the set of pages is fixed in code)

### Page Editor View (`/content/pages/:pageKey`)

- Page title at top
- Collapsible sections (e.g., "Hero Section", "How It Works", "CTA")
- Each section contains its fields:
  - `text` fields: single-line text input
  - `rich_text` fields: multi-line textarea (plain for now, WYSIWYG later)
  - `image_url` fields: image preview + upload button + URL display
- Save button upserts all fields for the page
- "View Page" button opens client-web URL in new tab

### Page/Section Registry

A config file in admin-web defines which pages exist and what sections/fields each has:

```ts
// src/lib/cms/page-registry.ts
export const pageRegistry = {
  home: {
    label: 'Home',
    slug: '/',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Heading' },
          subtitle: { type: 'text', label: 'Subheading' },
          background_image: { type: 'image_url', label: 'Background Image' },
        },
      },
      how_it_works: {
        label: 'How It Works',
        fields: {
          title: { type: 'text', label: 'Section Title' },
          step_1_title: { type: 'text', label: 'Step 1 Title' },
          step_1_description: { type: 'rich_text', label: 'Step 1 Description' },
          // ...
        },
      },
    },
  },
  // ... more pages
}
```

This registry:
- Defines the exact set of editable pages and fields
- Is used by both admin (to render the editor) and client-web (to know what keys to fetch)
- Lives in a shared location or is duplicated (small enough that duplication is fine)

## Client-Web Integration

### Content Fetching

Server-side fetch in Next.js RSC pages:

```ts
// lib/cms/get-page-content.ts
import { createClient } from '@supabase/supabase-js'

export async function getPageContent(pageKey: string): Promise<Record<string, string>> {
  const supabase = createClient(url, anonKey)
  const { data } = await supabase
    .from('site_content')
    .select('section_key, field_key, value')
    .eq('page_key', pageKey)

  const content: Record<string, string> = {}
  for (const row of data ?? []) {
    content[`${row.section_key}.${row.field_key}`] = row.value
  }
  return content
}
```

### Usage in Pages

```tsx
// app/page.tsx (Home)
export default async function HomePage() {
  const content = await getPageContent('home')

  return (
    <HeroSection
      title={content['hero.title'] ?? 'Default Title'}
      subtitle={content['hero.subtitle'] ?? 'Default Subtitle'}
      image={content['hero.background_image'] ?? '/images/hero.jpg'}
    />
    // ...
  )
}
```

### Fallback Strategy

Every content reference includes a hardcoded default as the second argument. This means:
- Pages work immediately without any DB content
- Migration is incremental: update one page at a time
- If DB is unreachable, pages still render with defaults

## Implementation Order

### Phase 1: Infrastructure
1. Create Supabase migration for `site_content` table + RLS
2. Create Supabase Storage bucket `site-content-images`
3. Create page registry config with 2-3 starter pages (Home, About Us, Contact)

### Phase 2: Admin Editor
4. Build page list view (replace hardcoded `/content/pages`)
5. Build page editor view with form generation from registry
6. Build image upload to Supabase Storage
7. Wire up save (upsert to `site_content`)

### Phase 3: Client-Web Integration
8. Create `getPageContent()` helper
9. Update Home page to use CMS content with fallbacks
10. Update About Us and Contact pages

### Phase 4: Expand
11. Add remaining marketing pages to registry
12. Update those pages in client-web to use CMS content

## Verification

- Create content in admin, verify it appears on client-web pages
- Delete content from DB, verify pages fall back to defaults
- Upload image in admin, verify it displays on client-web
- Verify non-admin users cannot write to `site_content` (RLS)
- Run `pnpm build` on both admin-web and client-web
