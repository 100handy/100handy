# Admin CMS: Editable Page Content — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow admins to edit text and images on marketing pages through the admin dashboard, with client-web pages fetching content from Supabase and falling back to hardcoded defaults.

**Architecture:** Key-value content store in a `site_content` Supabase table. Admin-web gets a page editor that reads a registry of editable fields per page and renders a form. Client-web fetches page content server-side and passes it to components, with hardcoded fallbacks.

**Tech Stack:** Supabase (Postgres + Storage + RLS), React Query (admin), Next.js RSC (client-web), TypeScript

---

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `supabase/migrations/20260331000001_add_site_content.sql` | DB migration: table + RLS + storage bucket |
| `apps/admin-web/src/lib/cms/page-registry.ts` | Registry defining all editable pages, sections, and fields |
| `apps/admin-web/src/lib/api/site-content.ts` | React Query hooks for fetching/saving site content |
| `apps/admin-web/src/pages/content/page-editor.tsx` | Admin page editor UI (form generated from registry) |
| `apps/client-web/lib/cms.ts` | `getPageContent()` server-side helper for fetching CMS data |

### Modified Files

| File | Change |
|------|--------|
| `apps/admin-web/src/pages/content/pages.tsx` | Replace hardcoded page list with registry-driven list |
| `apps/admin-web/src/App.tsx` | Add route for `/content/pages/:pageKey` |
| `apps/client-web/app/about-us/page.tsx` | Wire up CMS content with fallbacks |
| `apps/client-web/app/contact/page.tsx` | Wire up CMS content with fallbacks |

---

### Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/20260331000001_add_site_content.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- Site Content CMS table
-- Stores editable text and image content for marketing pages
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

-- Index for fast page lookups
create index idx_site_content_page on public.site_content(page_key);

-- Enable RLS
alter table public.site_content enable row level security;

-- Anyone can read content (public marketing pages)
create policy "Public read access"
  on public.site_content for select
  using (true);

-- Only admins can write content
create policy "Admin insert access"
  on public.site_content for insert
  with check (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

create policy "Admin update access"
  on public.site_content for update
  using (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

create policy "Admin delete access"
  on public.site_content for delete
  using (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

-- Auto-update updated_at timestamp
create or replace function public.update_site_content_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger site_content_updated_at
  before update on public.site_content
  for each row execute function public.update_site_content_timestamp();

-- Storage bucket for CMS images
insert into storage.buckets (id, name, public)
values ('site-content-images', 'site-content-images', true)
on conflict (id) do nothing;

-- Anyone can view site content images
create policy "Public read site content images"
  on storage.objects for select
  using (bucket_id = 'site-content-images');

-- Only admins can upload site content images
create policy "Admin upload site content images"
  on storage.objects for insert
  with check (
    bucket_id = 'site-content-images'
    and exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

-- Admins can update/delete site content images
create policy "Admin manage site content images"
  on storage.objects for update
  using (
    bucket_id = 'site-content-images'
    and exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

create policy "Admin delete site content images"
  on storage.objects for delete
  using (
    bucket_id = 'site-content-images'
    and exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );
```

- [ ] **Step 2: Apply the migration locally**

Run: `pnpm supabase:reset` or `npx supabase db push` (depending on local setup)
Expected: Migration applies without errors, `site_content` table visible in Supabase dashboard

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260331000001_add_site_content.sql
git commit -m "feat: add site_content table and storage bucket for CMS"
```

---

### Task 2: Page Registry

**Files:**
- Create: `apps/admin-web/src/lib/cms/page-registry.ts`

- [ ] **Step 1: Create the page registry with starter pages**

```ts
export type FieldType = 'text' | 'rich_text' | 'image_url'

export interface FieldDefinition {
  type: FieldType
  label: string
  placeholder?: string
}

export interface SectionDefinition {
  label: string
  fields: Record<string, FieldDefinition>
}

export interface PageDefinition {
  label: string
  slug: string
  sections: Record<string, SectionDefinition>
}

export const pageRegistry: Record<string, PageDefinition> = {
  home: {
    label: 'Home',
    slug: '/',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Heading', placeholder: 'Book trusted help for your home — fast.' },
          subtitle: { type: 'text', label: 'Subheading', placeholder: 'Assembly, repairs, cleaning...' },
        },
      },
      how_it_works: {
        label: 'How It Works',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'How it works' },
          step_1_title: { type: 'text', label: 'Step 1 Title', placeholder: 'Describe your task' },
          step_1_description: { type: 'rich_text', label: 'Step 1 Description', placeholder: 'Tell us what you need done...' },
          step_2_title: { type: 'text', label: 'Step 2 Title', placeholder: 'Get matched' },
          step_2_description: { type: 'rich_text', label: 'Step 2 Description', placeholder: 'We match you with...' },
          step_3_title: { type: 'text', label: 'Step 3 Title', placeholder: 'Get it done' },
          step_3_description: { type: 'rich_text', label: 'Step 3 Description', placeholder: 'Your Tasker arrives...' },
        },
      },
      get_help_today: {
        label: 'Get Help Today CTA',
        fields: {
          title: { type: 'text', label: 'CTA Heading', placeholder: 'Get help today' },
          subtitle: { type: 'text', label: 'CTA Subheading', placeholder: 'Book a tasker now' },
          background_image: { type: 'image_url', label: 'Background Image' },
        },
      },
    },
  },
  'about-us': {
    label: 'About Us',
    slug: '/about-us',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'About Us' },
        },
      },
      content: {
        label: 'Main Content',
        fields: {
          heading: { type: 'text', label: 'Heading', placeholder: 'Making life simpler, one neighborhood at a time.' },
          paragraph_1: { type: 'rich_text', label: 'Paragraph 1', placeholder: 'We believe that the best help is local...' },
          paragraph_2: { type: 'rich_text', label: 'Paragraph 2', placeholder: 'We know that for every overwhelming to-do list...' },
        },
      },
      leadership: {
        label: 'Leadership Team',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Leadership Team' },
        },
      },
    },
  },
  contact: {
    label: 'Contact Us',
    slug: '/contact',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          breadcrumb: { type: 'text', label: 'Breadcrumb Text', placeholder: '100Handy Support / Submit a request' },
          title: { type: 'text', label: 'Page Title', placeholder: 'Contact Us' },
        },
      },
      cards: {
        label: 'Contact Cards',
        fields: {
          card_1_title: { type: 'text', label: 'Card 1 Title', placeholder: 'Message us' },
          card_1_text: { type: 'text', label: 'Card 1 Text', placeholder: 'Click here to reach out!' },
          card_2_title: { type: 'text', label: 'Card 2 Title', placeholder: 'Send us an email' },
          card_2_text: { type: 'text', label: 'Card 2 Text', placeholder: 'Available every day' },
          card_3_title: { type: 'text', label: 'Card 3 Title', placeholder: 'Give us a call' },
          card_3_text: { type: 'text', label: 'Card 3 Text', placeholder: 'Toll free for US and Canada' },
        },
      },
      form: {
        label: 'Email Form',
        fields: {
          title: { type: 'text', label: 'Form Title', placeholder: 'Send us an email' },
          subtitle: { type: 'text', label: 'Form Subtitle', placeholder: 'Please provide detailed information below...' },
        },
      },
    },
  },
}

/** Get all page keys */
export function getPageKeys(): string[] {
  return Object.keys(pageRegistry)
}

/** Get a flat list of all field keys for a page (e.g. "hero.title") */
export function getPageFieldKeys(pageKey: string): string[] {
  const page = pageRegistry[pageKey]
  if (!page) return []
  const keys: string[] = []
  for (const [sectionKey, section] of Object.entries(page.sections)) {
    for (const fieldKey of Object.keys(section.fields)) {
      keys.push(`${sectionKey}.${fieldKey}`)
    }
  }
  return keys
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin-web/src/lib/cms/page-registry.ts
git commit -m "feat: add CMS page registry with Home, About Us, Contact definitions"
```

---

### Task 3: Admin API Hooks for Site Content

**Files:**
- Create: `apps/admin-web/src/lib/api/site-content.ts`

- [ ] **Step 1: Create the React Query hooks**

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { FieldType } from '@/lib/cms/page-registry'

export interface SiteContentRow {
  id: string
  page_key: string
  section_key: string
  field_key: string
  content_type: string
  value: string
  updated_at: string
  updated_by: string | null
}

/**
 * Fetch all content for a given page
 * Returns a map of "section_key.field_key" -> value
 */
export function usePageContent(pageKey: string) {
  return useQuery({
    queryKey: ['admin', 'site-content', pageKey],
    queryFn: async (): Promise<Record<string, string>> => {
      const { data, error } = await supabase
        .from('site_content')
        .select('section_key, field_key, value')
        .eq('page_key', pageKey)

      if (error) throw error

      const content: Record<string, string> = {}
      for (const row of data ?? []) {
        content[`${row.section_key}.${row.field_key}`] = row.value
      }
      return content
    },
    enabled: !!pageKey,
  })
}

/**
 * Fetch the last updated timestamp for each page (for the page list)
 */
export function useAllPagesLastUpdated() {
  return useQuery({
    queryKey: ['admin', 'site-content', 'last-updated'],
    queryFn: async (): Promise<Record<string, string>> => {
      const { data, error } = await supabase
        .from('site_content')
        .select('page_key, updated_at')
        .order('updated_at', { ascending: false })

      if (error) throw error

      const lastUpdated: Record<string, string> = {}
      for (const row of data ?? []) {
        if (!lastUpdated[row.page_key]) {
          lastUpdated[row.page_key] = row.updated_at
        }
      }
      return lastUpdated
    },
  })
}

interface SaveContentParams {
  pageKey: string
  fields: Array<{
    section_key: string
    field_key: string
    content_type: FieldType
    value: string
  }>
}

/**
 * Save (upsert) all content fields for a page
 */
export function useSavePageContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageKey, fields }: SaveContentParams) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const rows = fields
        .filter((f) => f.value.trim() !== '')
        .map((f) => ({
          page_key: pageKey,
          section_key: f.section_key,
          field_key: f.field_key,
          content_type: f.content_type,
          value: f.value,
          updated_by: user.id,
        }))

      if (rows.length === 0) return

      const { error } = await supabase
        .from('site_content')
        .upsert(rows, { onConflict: 'page_key,section_key,field_key' })

      if (error) throw error
    },
    onSuccess: (_, { pageKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-content', pageKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-content', 'last-updated'] })
    },
  })
}

/**
 * Upload an image to the site-content-images bucket
 * Returns the public URL
 */
export async function uploadContentImage(file: File, pageKey: string, fieldKey: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${pageKey}/${fieldKey}-${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('site-content-images')
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage
    .from('site-content-images')
    .getPublicUrl(path)

  return data.publicUrl
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin-web/src/lib/api/site-content.ts
git commit -m "feat: add React Query hooks for CMS site content CRUD"
```

---

### Task 4: Admin Page Editor UI

**Files:**
- Create: `apps/admin-web/src/pages/content/page-editor.tsx`

- [ ] **Step 1: Create the page editor component**

```tsx
import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronDown, Save, ExternalLink, Upload, Loader2, Check } from 'lucide-react'
import Header from '@/components/header'
import { pageRegistry } from '@/lib/cms/page-registry'
import { usePageContent, useSavePageContent, uploadContentImage } from '@/lib/api/site-content'
import type { FieldType } from '@/lib/cms/page-registry'

export default function PageEditorPage() {
  const { pageKey } = useParams<{ pageKey: string }>()
  const pageDef = pageKey ? pageRegistry[pageKey] : undefined
  const { data: savedContent, isLoading } = usePageContent(pageKey ?? '')
  const saveContentMutation = useSavePageContent()

  // Local form state: "section.field" -> value
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Initialize form with saved content or placeholders
  useEffect(() => {
    if (!pageDef) return
    const initial: Record<string, string> = {}
    const expanded: Record<string, boolean> = {}
    for (const [sectionKey, section] of Object.entries(pageDef.sections)) {
      expanded[sectionKey] = true
      for (const fieldKey of Object.keys(section.fields)) {
        const key = `${sectionKey}.${fieldKey}`
        initial[key] = savedContent?.[key] ?? ''
      }
    }
    setFormValues(initial)
    setExpandedSections(expanded)
  }, [pageDef, savedContent])

  const handleFieldChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleImageUpload = async (key: string, file: File) => {
    if (!pageKey) return
    const url = await uploadContentImage(file, pageKey, key.replace('.', '-'))
    handleFieldChange(key, url)
  }

  const handleSave = async () => {
    if (!pageKey || !pageDef) return
    setSaveSuccess(false)

    const fields: Array<{ section_key: string; field_key: string; content_type: FieldType; value: string }> = []
    for (const [sectionKey, section] of Object.entries(pageDef.sections)) {
      for (const [fieldKey, fieldDef] of Object.entries(section.fields)) {
        const value = formValues[`${sectionKey}.${fieldKey}`] ?? ''
        if (value.trim()) {
          fields.push({
            section_key: sectionKey,
            field_key: fieldKey,
            content_type: fieldDef.type,
            value,
          })
        }
      }
    }

    await saveContentMutation.mutateAsync({ pageKey, fields })
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }))
  }

  if (!pageKey || !pageDef) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Page Not Found" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Page &quot;{pageKey}&quot; is not in the registry.</p>
            <Link to="/content/pages" className="text-primary hover:underline">Back to Pages</Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title={`Edit: ${pageDef.label}`} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title={`Edit: ${pageDef.label}`} />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-3xl mx-auto">
          {/* Top bar: back link + actions */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/content/pages" className="text-sm text-primary hover:underline">
              &larr; Back to Pages
            </Link>
            <div className="flex items-center gap-3">
              <a
                href={pageDef.slug}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ExternalLink className="w-4 h-4" />
                View Page
              </a>
              <button
                onClick={handleSave}
                disabled={saveContentMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {saveContentMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saveSuccess ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saveSuccess ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {Object.entries(pageDef.sections).map(([sectionKey, section]) => (
              <div
                key={sectionKey}
                className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {section.label}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedSections[sectionKey] ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedSections[sectionKey] && (
                  <div className="px-6 pb-6 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    {Object.entries(section.fields).map(([fieldKey, fieldDef]) => {
                      const compositeKey = `${sectionKey}.${fieldKey}`
                      const value = formValues[compositeKey] ?? ''

                      return (
                        <div key={compositeKey}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {fieldDef.label}
                          </label>

                          {fieldDef.type === 'image_url' ? (
                            <ImageField
                              value={value}
                              onChange={(v) => handleFieldChange(compositeKey, v)}
                              onUpload={(file) => handleImageUpload(compositeKey, file)}
                              placeholder={fieldDef.placeholder}
                            />
                          ) : fieldDef.type === 'rich_text' ? (
                            <textarea
                              value={value}
                              onChange={(e) => handleFieldChange(compositeKey, e.target.value)}
                              placeholder={fieldDef.placeholder}
                              rows={4}
                              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                            />
                          ) : (
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => handleFieldChange(compositeKey, e.target.value)}
                              placeholder={fieldDef.placeholder}
                              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Image field with preview and upload */
function ImageField({
  value,
  onChange,
  onUpload,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  onUpload: (file: File) => Promise<void>
  placeholder?: string
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await onUpload(file)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="w-full max-h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? 'Image URL or upload'}
          className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin-web/src/pages/content/page-editor.tsx
git commit -m "feat: add CMS page editor with form fields and image upload"
```

---

### Task 5: Update Admin Pages List and Router

**Files:**
- Modify: `apps/admin-web/src/pages/content/pages.tsx`
- Modify: `apps/admin-web/src/App.tsx`

- [ ] **Step 1: Replace hardcoded pages list with registry-driven list**

Replace the entire content of `apps/admin-web/src/pages/content/pages.tsx`:

```tsx
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import Header from '@/components/header'
import { pageRegistry } from '@/lib/cms/page-registry'
import { useAllPagesLastUpdated } from '@/lib/api/site-content'

export default function ContentPagesPage() {
  const { data: lastUpdated } = useAllPagesLastUpdated()

  const pages = Object.entries(pageRegistry).map(([key, def]) => ({
    key,
    title: def.label,
    slug: def.slug,
    sectionCount: Object.keys(def.sections).length,
    fieldCount: Object.values(def.sections).reduce(
      (sum, s) => sum + Object.keys(s.fields).length,
      0
    ),
    lastModified: lastUpdated?.[key] ?? null,
  }))

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Content Pages" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="w-full">
          {/* Search */}
          <div className="flex items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search pages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3" scope="col">Page</th>
                  <th className="px-6 py-3" scope="col">URL</th>
                  <th className="px-6 py-3" scope="col">Sections</th>
                  <th className="px-6 py-3" scope="col">Fields</th>
                  <th className="px-6 py-3" scope="col">Last Modified</th>
                  <th className="px-6 py-3" scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr
                    key={page.key}
                    className="bg-white dark:bg-gray-800/50 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {page.title}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{page.slug}</td>
                    <td className="px-6 py-4">{page.sectionCount}</td>
                    <td className="px-6 py-4">{page.fieldCount}</td>
                    <td className="px-6 py-4">
                      {page.lastModified
                        ? format(new Date(page.lastModified), 'MMM d, yyyy')
                        : <span className="text-gray-400 italic">Not yet edited</span>
                      }
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/content/pages/${page.key}`}
                        className="font-medium text-primary hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add the page editor route to App.tsx**

In `apps/admin-web/src/App.tsx`, add the import at the top:

```ts
import PageEditorPage from '@/pages/content/page-editor'
```

And add this route inside the `<DashboardLayout>` protected routes, right after the `/content/pages/create` route:

```tsx
<Route path="/content/pages/:pageKey" element={<PageEditorPage />} />
```

- [ ] **Step 3: Verify the build**

Run: `pnpm build --filter=admin-web`
Expected: Build succeeds with no type errors

- [ ] **Step 4: Commit**

```bash
git add apps/admin-web/src/pages/content/pages.tsx apps/admin-web/src/App.tsx
git commit -m "feat: wire up CMS page list and editor routes in admin"
```

---

### Task 6: Client-Web CMS Helper

**Files:**
- Create: `apps/client-web/lib/cms.ts`

- [ ] **Step 1: Create the server-side content fetcher**

```ts
import { createServerSupabaseClient } from './supabase-server'

/**
 * Fetch all CMS content for a page.
 * Returns a lookup function: content('section.field', 'default value')
 *
 * Usage in RSC pages:
 *   const c = await getPageContent('home')
 *   <h1>{c('hero.title', 'Default Title')}</h1>
 */
export async function getPageContent(
  pageKey: string
): Promise<(key: string, fallback: string) => string> {
  let content: Record<string, string> = {}

  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('site_content')
      .select('section_key, field_key, value')
      .eq('page_key', pageKey)

    for (const row of data ?? []) {
      content[`${row.section_key}.${row.field_key}`] = row.value
    }
  } catch (error) {
    // If fetch fails, fall back to defaults silently
    console.error(`[CMS] Failed to fetch content for page "${pageKey}":`, error)
  }

  return (key: string, fallback: string) => content[key] || fallback
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/client-web/lib/cms.ts
git commit -m "feat: add getPageContent server helper for CMS integration"
```

---

### Task 7: Wire Up About Us Page with CMS

**Files:**
- Modify: `apps/client-web/app/about-us/page.tsx`

- [ ] **Step 1: Add CMS content to the About Us page**

At the top of the file, add the import:

```ts
import { getPageContent } from "@/lib/cms";
```

Make the component async and fetch content at the top of the function body:

```ts
export default async function AboutUsPage() {
  const c = await getPageContent('about-us')
```

Then replace the hardcoded text strings with CMS values + fallbacks:

- Line with `About Us` heading:
  ```tsx
  {c('hero.title', 'About Us')}
  ```

- Line with `Making life simpler...` heading:
  ```tsx
  {c('content.heading', 'Making life simpler, one neighborhood at a time.')}
  ```

- First paragraph (`We believe that the best help is local...`):
  ```tsx
  {c('content.paragraph_1', 'We believe that the best help is local. At the heart of 100 Handy is a simple but powerful idea: connecting people who need time with people who have skills.')}
  ```

- Second paragraph (`We know that for every overwhelming...`):
  ```tsx
  {c('content.paragraph_2', 'We know that for every overwhelming to-do list, there is a capable professional nearby ready to get to work. Whether it\u0027s hanging a crib for a new arrival, fixing a leaky faucet before the in-laws visit, or simply giving you back your Saturday afternoon, we are the bridge that makes it happen. We aren\u0027t just completing tasks; we are building stronger communities where neighbors help neighbors thrive.')}
  ```

- Leadership section title:
  ```tsx
  {c('leadership.title', 'Leadership Team')}
  ```

Note: The page must NOT have `"use client"` at the top since it needs to be a server component to use `await`. The existing page does not have it, so just make the function `async`.

- [ ] **Step 2: Verify build**

Run: `pnpm build --filter=client-web`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add apps/client-web/app/about-us/page.tsx
git commit -m "feat: wire About Us page to CMS with fallback defaults"
```

---

### Task 8: Wire Up Contact Page with CMS

**Files:**
- Modify: `apps/client-web/app/contact/page.tsx`

- [ ] **Step 1: Add CMS content to the Contact page**

At the top of the file, add:

```ts
import { getPageContent } from "@/lib/cms";
```

The Contact page has a `ContactUsContent` component that renders the main content. Since the outer page component needs to be a server component to fetch CMS data, restructure slightly:

Make the default export async and pass CMS values as props to `ContactUsContent`:

```tsx
export default async function ContactUsPage() {
  const c = await getPageContent('contact')

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <ContactUsContent
        breadcrumb={c('hero.breadcrumb', '100Handy Support / Submit a request')}
        title={c('hero.title', 'Contact Us')}
        card1Title={c('cards.card_1_title', 'Message us')}
        card1Text={c('cards.card_1_text', 'Click here to reach out!')}
        card2Title={c('cards.card_2_title', 'Send us an email')}
        card2Text={c('cards.card_2_text', 'Available every day')}
        card3Title={c('cards.card_3_title', 'Give us a call')}
        card3Text={c('cards.card_3_text', 'Toll free for US and Canada')}
        formTitle={c('form.title', 'Send us an email')}
        formSubtitle={c('form.subtitle', 'Please provide detailed information below and our agents will reply via email as soon as possible.')}
      />
      <Footer />
    </div>
  )
}
```

Update `ContactUsContent` to accept these as props instead of hardcoding them. Add the props interface and replace the hardcoded strings.

- [ ] **Step 2: Verify build**

Run: `pnpm build --filter=client-web`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add apps/client-web/app/contact/page.tsx
git commit -m "feat: wire Contact page to CMS with fallback defaults"
```

---

### Task 9: Final Verification

- [ ] **Step 1: Build both apps**

Run: `pnpm build --filter=admin-web && pnpm build --filter=client-web`
Expected: Both build successfully

- [ ] **Step 2: Grep for completeness**

Run: `grep -r "site_content" apps/admin-web/src/ apps/client-web/lib/` — verify all expected files reference the table.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: CMS content editing — admin editor + client-web integration for About Us and Contact pages"
```
