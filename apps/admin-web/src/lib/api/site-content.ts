import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireAdminPermissions } from '@/lib/api/admin-auth'
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

export interface SitePageRecord {
  id: string
  page_key: string
  title: string
  slug: string
  template_key: string
  status: 'draft' | 'published' | 'archived'
  is_system: boolean
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface SeoMetadataRecord {
  id: string
  surface_type: 'page' | 'blog_post' | 'service_category' | 'service_subcategory' | 'location_page' | 'location_service_page' | 'app_screen'
  surface_key: string
  meta_title: string | null
  meta_description: string | null
  og_title: string | null
  og_description: string | null
  og_image_url: string | null
  twitter_title: string | null
  twitter_description: string | null
  twitter_image_url: string | null
  canonical_url: string | null
  robots_index: boolean
  robots_follow: boolean
  schema_json: Record<string, unknown> | null
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface PageRevisionRecord {
  id: string
  page_key: string
  version_number: number
  revision_state: 'draft' | 'published'
  page_json: Record<string, unknown>
  seo_json: Record<string, unknown>
  content_json: Record<string, {
    section_key: string
    field_key: string
    content_type: FieldType
    value: string
  }>
  created_at: string
  updated_at: string
  created_by: string | null
  published_at: string | null
  published_by: string | null
}

/**
 * Fetch all content for a given page.
 * Returns a map of "section_key.field_key" -> value
 */
export function usePageContent(pageKey: string) {
  return useQuery({
    queryKey: ['admin', 'site-content', pageKey],
    queryFn: async (): Promise<Record<string, string>> => {
      await requireAdminPermissions(['content.manage'])
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

export function usePageRecord(pageKey: string) {
  return useQuery({
    queryKey: ['admin', 'site-pages', pageKey],
    queryFn: async (): Promise<SitePageRecord | null> => {
      await requireAdminPermissions(['content.manage'])
      const { data, error } = await supabase
        .from('site_pages')
        .select('*')
        .eq('page_key', pageKey)
        .maybeSingle()

      if (error) throw error
      return data
    },
    enabled: !!pageKey,
  })
}

export function usePageSeo(pageKey: string) {
  return useQuery({
    queryKey: ['admin', 'seo-metadata', 'page', pageKey],
    queryFn: async (): Promise<SeoMetadataRecord | null> => {
      await requireAdminPermissions(['content.manage', 'seo.manage'])
      const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('surface_type', 'page')
        .eq('surface_key', pageKey)
        .maybeSingle()

      if (error) throw error
      return data
    },
    enabled: !!pageKey,
  })
}

export function useLatestPageDraft(pageKey: string) {
  return useQuery({
    queryKey: ['admin', 'page-revisions', pageKey, 'latest-draft'],
    queryFn: async (): Promise<PageRevisionRecord | null> => {
      await requireAdminPermissions(['content.manage', 'seo.manage'])
      const { data, error } = await supabase
        .from('page_content_revisions')
        .select('*')
        .eq('page_key', pageKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      return data
    },
    enabled: !!pageKey,
  })
}

export function usePageRevisions(pageKey: string) {
  return useQuery({
    queryKey: ['admin', 'page-revisions', pageKey],
    queryFn: async (): Promise<PageRevisionRecord[]> => {
      await requireAdminPermissions(['content.manage', 'seo.manage'])
      const { data, error } = await supabase
        .from('page_content_revisions')
        .select('*')
        .eq('page_key', pageKey)
        .order('version_number', { ascending: false })

      if (error) throw error
      return data ?? []
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
      await requireAdminPermissions(['content.manage'])
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

interface SavePageSettingsParams {
  pageKey: string
  page: {
    title: string
    slug: string
    template_key: string
    status: 'draft' | 'published' | 'archived'
  }
  seo: {
    meta_title: string
    meta_description: string
    og_title: string
    og_description: string
    og_image_url: string
    twitter_title: string
    twitter_description: string
    twitter_image_url: string
    canonical_url: string
    robots_index: boolean
    robots_follow: boolean
  }
}

interface SavePageDraftParams extends SavePageSettingsParams {
  fields: Array<{
    section_key: string
    field_key: string
    content_type: FieldType
    value: string
  }>
}

function buildRevisionContentJson(
  fields: SavePageDraftParams['fields']
): PageRevisionRecord['content_json'] {
  const content: PageRevisionRecord['content_json'] = {}
  for (const field of fields) {
    if (field.value.trim() === '') continue
    const key = `${field.section_key}.${field.field_key}`
    content[key] = {
      section_key: field.section_key,
      field_key: field.field_key,
      content_type: field.content_type,
      value: field.value,
    }
  }
  return content
}

async function getNextPageRevisionVersion(pageKey: string) {
  const { data, error } = await supabase
    .from('page_content_revisions')
    .select('version_number')
    .eq('page_key', pageKey)
    .order('version_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return (data?.version_number ?? 0) + 1
}

/**
 * Save (upsert) all content fields for a page
 */
export function useSavePageContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageKey, fields }: SaveContentParams) => {
      const { user } = await requireAdminPermissions(['content.manage'])

      const { data: existingRows, error: existingError } = await supabase
        .from('site_content')
        .select('section_key, field_key')
        .eq('page_key', pageKey)

      if (existingError) throw existingError

      const existingKeys = new Set(
        (existingRows ?? []).map((row) => `${row.section_key}.${row.field_key}`)
      )

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

      const fieldsToDelete = fields.filter((field) => (
        field.value.trim() === '' &&
        existingKeys.has(`${field.section_key}.${field.field_key}`)
      ))

      if (rows.length > 0) {
        const { error } = await supabase
          .from('site_content')
          .upsert(rows, { onConflict: 'page_key,section_key,field_key' })

        if (error) throw error
      }

      for (const field of fieldsToDelete) {
        const { error } = await supabase
          .from('site_content')
          .delete()
          .eq('page_key', pageKey)
          .eq('section_key', field.section_key)
          .eq('field_key', field.field_key)

        if (error) throw error
      }

      await createAdminAuditLog({
        action: 'page.content.save',
        entityType: 'page',
        entityId: pageKey,
        summary: `Saved admin-managed page content for ${pageKey}.`,
        metadata: {
          pageKey,
          updatedFieldCount: rows.length,
          clearedFieldCount: fieldsToDelete.length,
          updatedBy: user.id,
        },
      })
    },
    onSuccess: (_, { pageKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-content', pageKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-content', 'last-updated'] })
    },
  })
}

export function useSavePageSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageKey, page, seo }: SavePageSettingsParams) => {
      const { user } = await requireAdminPermissions(['content.manage', 'seo.manage'])

      const normalizedSlug = page.slug.startsWith('/') ? page.slug : `/${page.slug}`
      const normalizedCanonical = seo.canonical_url.trim()

      const pageRow = {
        page_key: pageKey,
        title: page.title.trim(),
        slug: normalizedSlug,
        template_key: page.template_key.trim() || 'standard',
        status: page.status,
        updated_by: user.id,
      }

      const { error: pageError } = await supabase
        .from('site_pages')
        .upsert(pageRow, { onConflict: 'page_key' })

      if (pageError) throw pageError

      const seoRow = {
        surface_type: 'page' as const,
        surface_key: pageKey,
        meta_title: seo.meta_title.trim() || null,
        meta_description: seo.meta_description.trim() || null,
        og_title: seo.og_title.trim() || null,
        og_description: seo.og_description.trim() || null,
        og_image_url: seo.og_image_url.trim() || null,
        twitter_title: seo.twitter_title.trim() || null,
        twitter_description: seo.twitter_description.trim() || null,
        twitter_image_url: seo.twitter_image_url.trim() || null,
        canonical_url: normalizedCanonical ? normalizedCanonical : null,
        robots_index: seo.robots_index,
        robots_follow: seo.robots_follow,
        updated_by: user.id,
      }

      const hasSeoValues = Object.entries(seoRow).some(([key, value]) => {
        if (['surface_type', 'surface_key', 'updated_by', 'robots_index', 'robots_follow'].includes(key)) {
          return false
        }
        return value !== null && value !== ''
      })

      if (hasSeoValues || !seo.robots_index || !seo.robots_follow) {
        const { error: seoError } = await supabase
          .from('seo_metadata')
          .upsert(seoRow, { onConflict: 'surface_type,surface_key' })

        if (seoError) throw seoError
      } else {
        const { error: deleteError } = await supabase
          .from('seo_metadata')
          .delete()
          .eq('surface_type', 'page')
          .eq('surface_key', pageKey)

        if (deleteError) throw deleteError
      }

      await createAdminAuditLog({
        action: 'page.settings.save',
        entityType: 'page',
        entityId: pageKey,
        summary: `Updated page settings for ${pageKey}.`,
        metadata: {
          pageKey,
          slug: normalizedSlug,
          status: page.status,
          hasSeoValues,
          updatedBy: user.id,
        },
      })
    },
    onSuccess: (_, { pageKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-pages', pageKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'seo-metadata', 'page', pageKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-content', 'last-updated'] })
    },
  })
}

export function useSavePageDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageKey, page, seo, fields }: SavePageDraftParams) => {
      const { user } = await requireAdminPermissions(['content.manage', 'seo.manage'])

      const normalizedSlug = page.slug.startsWith('/') ? page.slug : `/${page.slug}`
      const pageJson = {
        title: page.title.trim(),
        slug: normalizedSlug,
        template_key: page.template_key.trim() || 'standard',
        status: page.status,
      }

      const seoJson = {
        meta_title: seo.meta_title,
        meta_description: seo.meta_description,
        og_title: seo.og_title,
        og_description: seo.og_description,
        og_image_url: seo.og_image_url,
        twitter_title: seo.twitter_title,
        twitter_description: seo.twitter_description,
        twitter_image_url: seo.twitter_image_url,
        canonical_url: seo.canonical_url.trim(),
        robots_index: seo.robots_index,
        robots_follow: seo.robots_follow,
      }

      const contentJson = buildRevisionContentJson(fields)

      const { data: latestDraft, error: draftError } = await supabase
        .from('page_content_revisions')
        .select('id')
        .eq('page_key', pageKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (draftError) throw draftError

      if (latestDraft?.id) {
        const { error } = await supabase
          .from('page_content_revisions')
          .update({
            page_json: pageJson,
            seo_json: seoJson,
            content_json: contentJson,
          })
          .eq('id', latestDraft.id)

        if (error) throw error
        await createAdminAuditLog({
          action: 'page.draft.save',
          entityType: 'page',
          entityId: pageKey,
          summary: `Updated draft revision for ${pageKey}.`,
          metadata: {
            pageKey,
            revisionId: latestDraft.id,
            mode: 'update',
            fieldCount: Object.keys(contentJson).length,
            updatedBy: user.id,
          },
        })
        return latestDraft.id
      }

      const versionNumber = await getNextPageRevisionVersion(pageKey)
      const { data: inserted, error } = await supabase
        .from('page_content_revisions')
        .insert({
          page_key: pageKey,
          version_number: versionNumber,
          revision_state: 'draft',
          page_json: pageJson,
          seo_json: seoJson,
          content_json: contentJson,
          created_by: user.id,
        })
        .select('id')
        .single()

      if (error) throw error
      await createAdminAuditLog({
        action: 'page.draft.save',
        entityType: 'page',
        entityId: pageKey,
        summary: `Created draft revision for ${pageKey}.`,
        metadata: {
          pageKey,
          revisionId: inserted.id,
          versionNumber,
          mode: 'create',
          fieldCount: Object.keys(contentJson).length,
          createdBy: user.id,
        },
      })
      return inserted.id
    },
    onSuccess: (_, { pageKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-revisions', pageKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-revisions', pageKey, 'latest-draft'] })
    },
  })
}

export function usePublishPageDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (pageKey: string) => {
      const { user } = await requireAdminPermissions(['content.manage', 'seo.manage'])

      const { data: draft, error: draftError } = await supabase
        .from('page_content_revisions')
        .select('*')
        .eq('page_key', pageKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (draftError) throw draftError
      if (!draft) throw new Error('No draft exists for this page')

      const page = draft.page_json as {
        title: string
        slug: string
        template_key: string
        status: 'draft' | 'published' | 'archived'
      }
      const seo = draft.seo_json as SavePageSettingsParams['seo']
      const contentRows = Object.values(draft.content_json as PageRevisionRecord['content_json'])

      const pageRow = {
        page_key: pageKey,
        title: page.title.trim(),
        slug: page.slug.startsWith('/') ? page.slug : `/${page.slug}`,
        template_key: page.template_key.trim() || 'standard',
        status: page.status === 'archived' ? 'archived' : 'published',
        updated_by: user.id,
      }

      const { error: pageError } = await supabase
        .from('site_pages')
        .upsert(pageRow, { onConflict: 'page_key' })
      if (pageError) throw pageError

      const seoRow = {
        surface_type: 'page' as const,
        surface_key: pageKey,
        meta_title: seo.meta_title?.trim() || null,
        meta_description: seo.meta_description?.trim() || null,
        og_title: seo.og_title?.trim() || null,
        og_description: seo.og_description?.trim() || null,
        og_image_url: seo.og_image_url?.trim() || null,
        twitter_title: seo.twitter_title?.trim() || null,
        twitter_description: seo.twitter_description?.trim() || null,
        twitter_image_url: seo.twitter_image_url?.trim() || null,
        canonical_url: seo.canonical_url?.trim() || null,
        robots_index: seo.robots_index,
        robots_follow: seo.robots_follow,
        updated_by: user.id,
      }

      const hasSeoValues = Object.entries(seoRow).some(([key, value]) => {
        if (['surface_type', 'surface_key', 'updated_by', 'robots_index', 'robots_follow'].includes(key)) {
          return false
        }
        return value !== null && value !== ''
      })

      if (hasSeoValues || !seo.robots_index || !seo.robots_follow) {
        const { error: seoError } = await supabase
          .from('seo_metadata')
          .upsert(seoRow, { onConflict: 'surface_type,surface_key' })
        if (seoError) throw seoError
      } else {
        const { error: deleteError } = await supabase
          .from('seo_metadata')
          .delete()
          .eq('surface_type', 'page')
          .eq('surface_key', pageKey)
        if (deleteError) throw deleteError
      }

      const { data: existingRows, error: existingError } = await supabase
        .from('site_content')
        .select('section_key, field_key')
        .eq('page_key', pageKey)
      if (existingError) throw existingError

      const existingKeys = new Set((existingRows ?? []).map((row) => `${row.section_key}.${row.field_key}`))
      const nextKeys = new Set(contentRows.map((row) => `${row.section_key}.${row.field_key}`))

      if (contentRows.length > 0) {
        const { error: contentError } = await supabase
          .from('site_content')
          .upsert(
            contentRows.map((row) => ({
              page_key: pageKey,
              section_key: row.section_key,
              field_key: row.field_key,
              content_type: row.content_type,
              value: row.value,
              updated_by: user.id,
            })),
            { onConflict: 'page_key,section_key,field_key' }
          )
        if (contentError) throw contentError
      }

      for (const compositeKey of existingKeys) {
        if (nextKeys.has(compositeKey)) continue
        const [section_key, field_key] = compositeKey.split('.')
        const { error } = await supabase
          .from('site_content')
          .delete()
          .eq('page_key', pageKey)
          .eq('section_key', section_key)
          .eq('field_key', field_key)
        if (error) throw error
      }

      const { error: publishError } = await supabase
        .from('page_content_revisions')
        .update({
          revision_state: 'published',
          published_at: new Date().toISOString(),
          published_by: user.id,
        })
        .eq('id', draft.id)
      if (publishError) throw publishError

      await createAdminAuditLog({
        action: 'page.publish',
        entityType: 'page',
        entityId: pageKey,
        summary: `Published page draft for ${pageKey}.`,
        metadata: {
          pageKey,
          revisionId: draft.id,
          publishedBy: user.id,
          contentFieldCount: contentRows.length,
          status: pageRow.status,
        },
      })
    },
    onSuccess: (_, pageKey) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-content', pageKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-pages', pageKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'seo-metadata', 'page', pageKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-content', 'last-updated'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-revisions', pageKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-revisions', pageKey, 'latest-draft'] })
    },
  })
}

export function useRestorePageRevision() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageKey, revisionId }: { pageKey: string; revisionId: string }) => {
      const { user } = await requireAdminPermissions(['content.manage', 'seo.manage'])

      const { data: revision, error } = await supabase
        .from('page_content_revisions')
        .select('*')
        .eq('id', revisionId)
        .maybeSingle()
      if (error) throw error
      if (!revision) throw new Error('Page revision not found')

      const { data: existingDraft, error: existingDraftError } = await supabase
        .from('page_content_revisions')
        .select('id')
        .eq('page_key', pageKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (existingDraftError) throw existingDraftError

      if (existingDraft?.id) {
        const { error: updateError } = await supabase
          .from('page_content_revisions')
          .update({
            page_json: revision.page_json,
            seo_json: revision.seo_json,
            content_json: revision.content_json,
          })
          .eq('id', existingDraft.id)
        if (updateError) throw updateError
        await createAdminAuditLog({
          action: 'page.revision.restore',
          entityType: 'page',
          entityId: pageKey,
          summary: `Restored revision ${revisionId} into existing draft for ${pageKey}.`,
          metadata: {
            pageKey,
            revisionId,
            targetDraftId: existingDraft.id,
            mode: 'update-existing-draft',
            restoredBy: user.id,
          },
        })
        return
      }

      const versionNumber = await getNextPageRevisionVersion(pageKey)
      const { error: insertError } = await supabase
        .from('page_content_revisions')
        .insert({
          page_key: pageKey,
          version_number: versionNumber,
          revision_state: 'draft',
          page_json: revision.page_json,
          seo_json: revision.seo_json,
          content_json: revision.content_json,
          created_by: user.id,
        })
      if (insertError) throw insertError
      await createAdminAuditLog({
        action: 'page.revision.restore',
        entityType: 'page',
        entityId: pageKey,
        summary: `Restored revision ${revisionId} into a new draft for ${pageKey}.`,
        metadata: {
          pageKey,
          revisionId,
          versionNumber,
          mode: 'create-draft',
          restoredBy: user.id,
        },
      })
    },
    onSuccess: (_, { pageKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-revisions', pageKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-revisions', pageKey, 'latest-draft'] })
    },
  })
}

/**
 * Upload an image to the site-content-images bucket.
 * Returns the public URL.
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
