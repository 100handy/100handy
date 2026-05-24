import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { requireAdminPermission, requireAdminPermissions } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'

export type SeoSurfaceType = 'page' | 'blog_post'

export interface BlogPostInput {
  id?: string
  slug: string
  title: string
  excerpt: string
  body: string
  cover_image_url: string
  category: string
  author_name: string
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
}

export interface NavigationItemInput {
  id?: string
  nav_key: string
  parent_id: string | null
  label: string
  href: string
  item_type: 'internal' | 'external'
  location: 'header' | 'footer' | 'support' | 'account'
  audience: 'public' | 'client' | 'professional' | 'admin'
  sort_order: number
  visible: boolean
}

export interface SiteSettingInput {
  setting_group: string
  setting_key: string
  value_json: Record<string, unknown>
}

export interface MediaAssetInput {
  id?: string
  asset_key: string
  asset_type: 'image' | 'video' | 'document'
  url: string
  title: string
  alt_text: string
  tags: string[]
  usage_scope: 'shared' | 'web' | 'mobile' | 'admin'
  active: boolean
}

export interface FaqItemInput {
  id?: string
  faq_group: string
  question: string
  answer: string
  sort_order: number
  visible: boolean
}

export interface EmailTemplateInput {
  id?: string
  template_key: string
  title: string
  template_kind: 'template' | 'campaign_draft'
  recipient_group: string
  subject: string
  preview_text: string
  body: string
  active: boolean
}

export interface EmailDeliveryJobRecord {
  id: string
  template_id: string | null
  template_key: string
  title: string
  recipient_group: string
  subject: string
  preview_text: string | null
  body: string
  delivery_status: 'queued' | 'processing' | 'sent' | 'failed'
  recipient_count: number
  sent_count: number
  failed_count: number
  error_message: string | null
  triggered_by: string | null
  triggered_at: string
  completed_at: string | null
}

export interface PushNotificationCampaignInput {
  id?: string
  campaign_key: string
  title: string
  campaign_kind: 'template' | 'campaign_draft'
  recipient_group: string
  message_title: string
  message_body: string
  route: string
  active: boolean
}

export interface PushDeliveryJobRecord {
  id: string
  campaign_id: string | null
  campaign_key: string
  title: string
  recipient_group: string
  message_title: string
  message_body: string
  route: string | null
  delivery_status: 'queued' | 'processing' | 'sent' | 'failed'
  recipient_count: number
  sent_count: number
  failed_count: number
  error_message: string | null
  triggered_by: string | null
  triggered_at: string
  completed_at: string | null
}

export interface NotificationAudienceFilters {
  postcode_prefix?: string
  require_marketing_opt_in?: boolean
  require_push_enabled?: boolean
  require_device_token?: boolean
}

export interface NotificationAudiencePreviewInput {
  channel: 'email' | 'push'
  recipientGroup: string
  filters?: NotificationAudienceFilters
}

export interface NotificationAuditEventRecord {
  id: string
  channel: 'email' | 'push' | 'announcement'
  action: string
  entity_type: string
  entity_id: string | null
  actor_id: string | null
  metadata_json: Record<string, unknown>
  created_at: string
}

export interface AnnouncementInput {
  id?: string
  audience: 'all' | 'client' | 'professional' | 'web'
  placement: 'banner' | 'dashboard' | 'modal' | 'support'
  title: string
  body: string
  cta_label: string
  cta_href: string
  starts_at: string | null
  ends_at: string | null
  active: boolean
}

export interface CategoryFormFieldInput {
  id?: string
  category_id: string
  field_key: string
  field_type: 'text' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'address' | 'date' | 'time'
  label: string
  description: string
  placeholder: string
  options: Array<Record<string, unknown>> | null
  required: boolean
  min_value: number | null
  max_value: number | null
  min_length: number | null
  max_length: number | null
  pattern: string
  show_if: Record<string, unknown> | null
  display_order: number
  section: string
}

export interface AppContentInput {
  id?: string
  platform: 'shared' | 'ios' | 'android'
  screen_key: string
  section_key: string
  field_key: string
  value: string
  status: 'draft' | 'published' | 'archived'
}

export interface HelpArticleInput {
  id?: string
  article_key: string
  slug: string
  title: string
  breadcrumb: string
  summary: string
  sidebar_links_json: Array<Record<string, unknown>>
  body_html: string
  related_links_json: Array<Record<string, unknown>>
  status: 'draft' | 'published' | 'archived'
}

export type RevisionState = 'draft' | 'published'

export interface BlogPostRevisionRecord {
  id: string
  slug: string
  version_number: number
  revision_state: RevisionState
  post_json: Record<string, unknown>
  seo_json: Record<string, unknown>
  created_at: string
  updated_at: string
  created_by: string | null
  published_at: string | null
  published_by: string | null
}

export interface HelpArticleRevisionRecord {
  id: string
  article_key: string
  version_number: number
  revision_state: RevisionState
  article_json: Record<string, unknown>
  created_at: string
  updated_at: string
  created_by: string | null
  published_at: string | null
  published_by: string | null
}

export interface AppContentScreenRevisionRecord {
  id: string
  platform: AppContentInput['platform']
  screen_key: string
  version_number: number
  revision_state: RevisionState
  content_json: Record<string, string>
  created_at: string
  updated_at: string
  created_by: string | null
  published_at: string | null
  published_by: string | null
}

export interface NavigationConfigRevisionRecord {
  id: string
  config_key: string
  version_number: number
  revision_state: RevisionState
  items_json: NavigationItemInput[]
  settings_json: Record<string, unknown>
  created_at: string
  updated_at: string
  created_by: string | null
  published_at: string | null
  published_by: string | null
}

export interface SiteSettingsRevisionRecord {
  id: string
  settings_key: string
  version_number: number
  revision_state: RevisionState
  settings_json: Record<string, unknown>
  created_at: string
  updated_at: string
  created_by: string | null
  published_at: string | null
  published_by: string | null
}

export interface AnnouncementRevisionRecord {
  id: string
  announcement_key: string
  announcement_id: string | null
  version_number: number
  revision_state: RevisionState
  announcement_json: Record<string, unknown>
  created_at: string
  updated_at: string
  created_by: string | null
  published_at: string | null
  published_by: string | null
}

async function getNextRevisionVersion(
  table:
    | 'blog_post_revisions'
    | 'help_article_revisions'
    | 'app_content_screen_revisions'
    | 'navigation_config_revisions'
    | 'site_settings_revisions'
    | 'announcement_revisions',
  filters: Record<string, string>
) {
  let query = supabase.from(table).select('version_number')
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value)
  }
  const { data, error } = await query.order('version_number', { ascending: false }).limit(1).maybeSingle()
  if (error) throw error
  return (data?.version_number ?? 0) + 1
}

function matchesNotificationRecipientGroup(role: string | null | undefined, recipientGroup: string) {
  switch (recipientGroup) {
    case 'client':
    case 'new_users':
      return role === 'client' || role === 'customer'
    case 'professional':
    case 'new_handys':
      return role === 'professional' || role === 'handy'
    case 'admin':
      return role === 'admin'
    case 'all':
    default:
      return role === 'client' || role === 'customer' || role === 'professional' || role === 'handy'
  }
}

async function createNotificationAuditEvent(
  userId: string,
  channel: NotificationAuditEventRecord['channel'],
  action: string,
  entityType: string,
  entityId: string | null,
  metadata: Record<string, unknown> = {},
) {
  const { error } = await supabase.from('notification_audit_events').insert({
    channel,
    action,
    entity_type: entityType,
    entity_id: entityId,
    actor_id: userId,
    metadata_json: metadata,
  })
  if (error) throw error
}

async function previewNotificationAudienceCount(input: NotificationAudiencePreviewInput) {
  await requireAdminPermission('notifications.manage')

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('user_id, role, postcode, account_status')
  if (profilesError) throw profilesError

  const matchingProfiles = (profiles ?? []).filter((profile) => {
    if (profile.account_status !== 'active') return false
    if (!matchesNotificationRecipientGroup(profile.role, input.recipientGroup)) return false
    const postcodePrefix = input.filters?.postcode_prefix?.trim().toLowerCase()
    if (postcodePrefix && !(profile.postcode ?? '').trim().toLowerCase().startsWith(postcodePrefix)) {
      return false
    }
    return true
  })

  let filteredUserIds = matchingProfiles.map((profile) => profile.user_id)

  if (input.channel === 'email' && input.filters?.require_marketing_opt_in) {
    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('user_id, marketing_emails')
      .in('user_id', filteredUserIds)
    if (settingsError) throw settingsError
    const allowed = new Set((settings ?? []).filter((row) => row.marketing_emails !== false).map((row) => row.user_id))
    filteredUserIds = filteredUserIds.filter((id) => allowed.has(id))
  }

  if (input.channel === 'push') {
    if (input.filters?.require_push_enabled) {
      const { data: settings, error: settingsError } = await supabase
        .from('notification_settings')
        .select('user_id, push_notifications')
        .in('user_id', filteredUserIds)
      if (settingsError) throw settingsError
      const allowed = new Set((settings ?? []).filter((row) => row.push_notifications !== false).map((row) => row.user_id))
      filteredUserIds = filteredUserIds.filter((id) => allowed.has(id))
    }

    if (input.filters?.require_device_token) {
      const { data: tokens, error: tokensError } = await supabase
        .from('device_push_tokens')
        .select('user_id')
        .in('user_id', filteredUserIds)
      if (tokensError) throw tokensError
      const allowed = new Set((tokens ?? []).map((row) => row.user_id))
      filteredUserIds = filteredUserIds.filter((id) => allowed.has(id))
    }
  }

  return {
    count: filteredUserIds.length,
    filters: input.filters ?? {},
  }
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ['admin', 'blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSaveBlogPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: BlogPostInput) => {
      const { user } = await requireAdminPermission('content.manage')

      const row = {
        ...input,
        excerpt: input.excerpt || null,
        cover_image_url: input.cover_image_url || null,
        category: input.category || null,
        author_name: input.author_name || null,
        published_at: input.published_at || null,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('blog_posts')
        .upsert(row, { onConflict: 'slug' })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog-posts'] })
    },
  })
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await requireAdminPermission('content.manage')
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog-posts'] })
    },
  })
}

export function useLatestBlogPostDraft(slug: string) {
  return useQuery({
    queryKey: ['admin', 'blog-post-revisions', slug, 'latest-draft'],
    queryFn: async (): Promise<BlogPostRevisionRecord | null> => {
      const { data, error } = await supabase
        .from('blog_post_revisions')
        .select('*')
        .eq('slug', slug)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!slug,
  })
}

export function useBlogPostRevisions(slug: string) {
  return useQuery({
    queryKey: ['admin', 'blog-post-revisions', slug],
    queryFn: async (): Promise<BlogPostRevisionRecord[]> => {
      const { data, error } = await supabase
        .from('blog_post_revisions')
        .select('*')
        .eq('slug', slug)
        .order('version_number', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    enabled: !!slug,
  })
}

export function useSaveBlogPostDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      post,
      seo,
    }: {
      post: BlogPostInput
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
    }) => {
      const { user } = await requireAdminPermission('content.manage')

      const slug = post.slug.trim()
      const { data: existingDraft, error: draftError } = await supabase
        .from('blog_post_revisions')
        .select('id')
        .eq('slug', slug)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (draftError) throw draftError

      if (existingDraft?.id) {
        const { error } = await supabase
          .from('blog_post_revisions')
          .update({
            post_json: post,
            seo_json: seo,
          })
          .eq('id', existingDraft.id)
        if (error) throw error
        return existingDraft.id
      }

      const versionNumber = await getNextRevisionVersion('blog_post_revisions', { slug })
      const { data, error } = await supabase
        .from('blog_post_revisions')
        .insert({
          slug,
          version_number: versionNumber,
          revision_state: 'draft',
          post_json: post,
          seo_json: seo,
          created_by: user.id,
        })
        .select('id')
        .single()
      if (error) throw error
      return data.id
    },
    onSuccess: (_, { post }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog-post-revisions', post.slug] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog-post-revisions', post.slug, 'latest-draft'] })
    },
  })
}

export function usePublishBlogPostDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (slug: string) => {
      const { user } = await requireAdminPermission('content.manage')

      const { data: draft, error: draftError } = await supabase
        .from('blog_post_revisions')
        .select('*')
        .eq('slug', slug)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (draftError) throw draftError
      if (!draft) throw new Error('No draft exists for this blog post')

      const post = draft.post_json as BlogPostInput
      const seo = draft.seo_json as {
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

      const row = {
        ...post,
        excerpt: post.excerpt || null,
        cover_image_url: post.cover_image_url || null,
        category: post.category || null,
        author_name: post.author_name || null,
        published_at: post.published_at || null,
        status: post.status === 'archived' ? 'archived' : 'published',
        updated_by: user.id,
      }
      const { error: postError } = await supabase
        .from('blog_posts')
        .upsert(row, { onConflict: 'slug' })
      if (postError) throw postError

      const seoRow = {
        surface_type: 'blog_post' as const,
        surface_key: slug,
        meta_title: seo.meta_title || null,
        meta_description: seo.meta_description || null,
        og_title: seo.og_title || null,
        og_description: seo.og_description || null,
        og_image_url: seo.og_image_url || null,
        twitter_title: seo.twitter_title || null,
        twitter_description: seo.twitter_description || null,
        twitter_image_url: seo.twitter_image_url || null,
        canonical_url: seo.canonical_url || null,
        robots_index: seo.robots_index,
        robots_follow: seo.robots_follow,
        updated_by: user.id,
      }
      const { error: seoError } = await supabase
        .from('seo_metadata')
        .upsert(seoRow, { onConflict: 'surface_type,surface_key' })
      if (seoError) throw seoError

      const { error: publishError } = await supabase
        .from('blog_post_revisions')
        .update({
          revision_state: 'published',
          published_at: new Date().toISOString(),
          published_by: user.id,
        })
        .eq('id', draft.id)
      if (publishError) throw publishError
    },
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog-posts'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'seo', 'blog_post', slug] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog-post-revisions', slug] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog-post-revisions', slug, 'latest-draft'] })
    },
  })
}

export function useRestoreBlogPostRevision() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ slug, revisionId }: { slug: string; revisionId: string }) => {
      const { user } = await requireAdminPermission('content.manage')

      const { data: revision, error } = await supabase
        .from('blog_post_revisions')
        .select('*')
        .eq('id', revisionId)
        .single()
      if (error) throw error

      const { data: existingDraft, error: existingDraftError } = await supabase
        .from('blog_post_revisions')
        .select('id')
        .eq('slug', slug)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (existingDraftError) throw existingDraftError

      if (existingDraft?.id) {
        const { error: updateError } = await supabase
          .from('blog_post_revisions')
          .update({
            post_json: revision.post_json,
            seo_json: revision.seo_json,
          })
          .eq('id', existingDraft.id)
        if (updateError) throw updateError
        return
      }

      const versionNumber = await getNextRevisionVersion('blog_post_revisions', { slug })
      const { error: insertError } = await supabase
        .from('blog_post_revisions')
        .insert({
          slug,
          version_number: versionNumber,
          revision_state: 'draft',
          post_json: revision.post_json,
          seo_json: revision.seo_json,
          created_by: user.id,
        })
      if (insertError) throw insertError
    },
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog-post-revisions', slug] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog-post-revisions', slug, 'latest-draft'] })
    },
  })
}

export function useNavigationItems() {
  return useQuery({
    queryKey: ['admin', 'navigation-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('location', { ascending: true })
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSaveNavigationItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: NavigationItemInput) => {
      const { user } = await requireAdminPermission('content.manage')

      const { error } = await supabase
        .from('navigation_items')
        .upsert({ ...input, updated_by: user.id }, { onConflict: 'nav_key,location,audience' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'navigation-items'] })
    },
  })
}

export function useDeleteNavigationItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await requireAdminPermission('content.manage')
      const { error } = await supabase.from('navigation_items').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'navigation-items'] })
    },
  })
}

export function useLatestNavigationConfigDraft(configKey: string) {
  return useQuery({
    queryKey: ['admin', 'navigation-config-revisions', configKey, 'latest-draft'],
    queryFn: async (): Promise<NavigationConfigRevisionRecord | null> => {
      const { data, error } = await supabase
        .from('navigation_config_revisions')
        .select('*')
        .eq('config_key', configKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!configKey,
  })
}

export function useNavigationConfigRevisions(configKey: string) {
  return useQuery({
    queryKey: ['admin', 'navigation-config-revisions', configKey],
    queryFn: async (): Promise<NavigationConfigRevisionRecord[]> => {
      const { data, error } = await supabase
        .from('navigation_config_revisions')
        .select('*')
        .eq('config_key', configKey)
        .order('version_number', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    enabled: !!configKey,
  })
}

export function useSaveNavigationConfigDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      configKey,
      items,
      settings,
    }: {
      configKey: string
      items: NavigationItemInput[]
      settings: Record<string, unknown>
    }) => {
      const { user } = await requireAdminPermission('content.manage')

      const { data: existingDraft, error: draftError } = await supabase
        .from('navigation_config_revisions')
        .select('id')
        .eq('config_key', configKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (draftError) throw draftError

      if (existingDraft?.id) {
        const { error } = await supabase
          .from('navigation_config_revisions')
          .update({
            items_json: items,
            settings_json: settings,
          })
          .eq('id', existingDraft.id)
        if (error) throw error
        return existingDraft.id
      }

      const versionNumber = await getNextRevisionVersion('navigation_config_revisions', { config_key: configKey })
      const { data, error } = await supabase
        .from('navigation_config_revisions')
        .insert({
          config_key: configKey,
          version_number: versionNumber,
          revision_state: 'draft',
          items_json: items,
          settings_json: settings,
          created_by: user.id,
        })
        .select('id')
        .single()
      if (error) throw error
      return data.id
    },
    onSuccess: (_, { configKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'navigation-config-revisions', configKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'navigation-config-revisions', configKey, 'latest-draft'] })
    },
  })
}

export function usePublishNavigationConfigDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (configKey: string) => {
      const { user } = await requireAdminPermission('content.manage')

      const { data: draft, error: draftError } = await supabase
        .from('navigation_config_revisions')
        .select('*')
        .eq('config_key', configKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (draftError) throw draftError
      if (!draft) throw new Error('No navigation draft exists')

      const items = (draft.items_json as NavigationItemInput[]) ?? []
      const settings = (draft.settings_json as Record<string, unknown>) ?? {}

      const { error: deleteItemsError } = await supabase
        .from('navigation_items')
        .delete()
        .in('location', ['header', 'footer', 'support', 'account'])
      if (deleteItemsError) throw deleteItemsError

      if (items.length > 0) {
        const { error: itemsError } = await supabase
          .from('navigation_items')
          .upsert(items.map((item) => ({ ...item, updated_by: user.id })), { onConflict: 'nav_key,location,audience' })
        if (itemsError) throw itemsError
      }

      for (const [settingKey, valueJson] of Object.entries(settings)) {
        const settingGroup = settingKey.split('.')[0] ?? 'shared'
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            setting_group: settingGroup,
            setting_key: settingKey,
            value_json: valueJson as Record<string, unknown>,
            updated_by: user.id,
          }, { onConflict: 'setting_key' })
        if (error) throw error
      }

      const { error: publishError } = await supabase
        .from('navigation_config_revisions')
        .update({
          revision_state: 'published',
          published_at: new Date().toISOString(),
          published_by: user.id,
        })
        .eq('id', draft.id)
      if (publishError) throw publishError
    },
    onSuccess: (_, configKey) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'navigation-items'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-settings'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'navigation-config-revisions', configKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'navigation-config-revisions', configKey, 'latest-draft'] })
    },
  })
}

export function useRestoreNavigationConfigRevision() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ configKey, revisionId }: { configKey: string; revisionId: string }) => {
      const { user } = await requireAdminPermission('content.manage')

      const { data: revision, error } = await supabase
        .from('navigation_config_revisions')
        .select('*')
        .eq('id', revisionId)
        .single()
      if (error) throw error

      const { data: existingDraft, error: existingDraftError } = await supabase
        .from('navigation_config_revisions')
        .select('id')
        .eq('config_key', configKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (existingDraftError) throw existingDraftError

      if (existingDraft?.id) {
        const { error: updateError } = await supabase
          .from('navigation_config_revisions')
          .update({
            items_json: revision.items_json,
            settings_json: revision.settings_json,
          })
          .eq('id', existingDraft.id)
        if (updateError) throw updateError
        return
      }

      const versionNumber = await getNextRevisionVersion('navigation_config_revisions', { config_key: configKey })
      const { error: insertError } = await supabase
        .from('navigation_config_revisions')
        .insert({
          config_key: configKey,
          version_number: versionNumber,
          revision_state: 'draft',
          items_json: revision.items_json,
          settings_json: revision.settings_json,
          created_by: user.id,
        })
      if (insertError) throw insertError
    },
    onSuccess: (_, { configKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'navigation-config-revisions', configKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'navigation-config-revisions', configKey, 'latest-draft'] })
    },
  })
}

export function useSiteSettings(settingKeys?: string[]) {
  return useQuery({
    queryKey: ['admin', 'site-settings', settingKeys?.join(',') ?? 'all'],
    queryFn: async () => {
      let query = supabase.from('site_settings').select('*').order('setting_key', { ascending: true })
      if (settingKeys && settingKeys.length > 0) {
        query = query.in('setting_key', settingKeys)
      }
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSaveSiteSetting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: SiteSettingInput) => {
      const { user } = await requireAdminPermissions(['content.manage', 'seo.manage'])

      const { error } = await supabase
        .from('site_settings')
        .upsert({ ...input, updated_by: user.id }, { onConflict: 'setting_key' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-settings'] })
    },
  })
}

export function useLatestSiteSettingsDraft(settingsKey: string) {
  return useQuery({
    queryKey: ['admin', 'site-settings-revisions', settingsKey, 'latest-draft'],
    queryFn: async (): Promise<SiteSettingsRevisionRecord | null> => {
      const { data, error } = await supabase
        .from('site_settings_revisions')
        .select('*')
        .eq('settings_key', settingsKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!settingsKey,
  })
}

export function useSiteSettingsRevisions(settingsKey: string) {
  return useQuery({
    queryKey: ['admin', 'site-settings-revisions', settingsKey],
    queryFn: async (): Promise<SiteSettingsRevisionRecord[]> => {
      const { data, error } = await supabase
        .from('site_settings_revisions')
        .select('*')
        .eq('settings_key', settingsKey)
        .order('version_number', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    enabled: !!settingsKey,
  })
}

export function useSaveSiteSettingsDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      settingsKey,
      settings,
    }: {
      settingsKey: string
      settings: Record<string, unknown>
    }) => {
      const { user } = await requireAdminPermissions(['content.manage', 'seo.manage'])

      const { data: existingDraft, error: draftError } = await supabase
        .from('site_settings_revisions')
        .select('id')
        .eq('settings_key', settingsKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (draftError) throw draftError

      if (existingDraft?.id) {
        const { error } = await supabase
          .from('site_settings_revisions')
          .update({ settings_json: settings })
          .eq('id', existingDraft.id)
        if (error) throw error
        return existingDraft.id
      }

      const versionNumber = await getNextRevisionVersion('site_settings_revisions', { settings_key: settingsKey })
      const { data, error } = await supabase
        .from('site_settings_revisions')
        .insert({
          settings_key: settingsKey,
          version_number: versionNumber,
          revision_state: 'draft',
          settings_json: settings,
          created_by: user.id,
        })
        .select('id')
        .single()
      if (error) throw error
      return data.id
    },
    onSuccess: (_, { settingsKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-settings-revisions', settingsKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-settings-revisions', settingsKey, 'latest-draft'] })
    },
  })
}

export function usePublishSiteSettingsDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (settingsKey: string) => {
      const { user } = await requireAdminPermissions(['content.manage', 'seo.manage'])

      const { data: draft, error: draftError } = await supabase
        .from('site_settings_revisions')
        .select('*')
        .eq('settings_key', settingsKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (draftError) throw draftError
      if (!draft) throw new Error('No site settings draft exists')

      const settings = (draft.settings_json as Record<string, unknown>) ?? {}
      for (const [settingKey, valueJson] of Object.entries(settings)) {
        const settingGroup = settingKey.split('.')[0] ?? 'shared'
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            setting_group: settingGroup,
            setting_key: settingKey,
            value_json: valueJson as Record<string, unknown>,
            updated_by: user.id,
          }, { onConflict: 'setting_key' })
        if (error) throw error
      }

      const { error: publishError } = await supabase
        .from('site_settings_revisions')
        .update({
          revision_state: 'published',
          published_at: new Date().toISOString(),
          published_by: user.id,
        })
        .eq('id', draft.id)
      if (publishError) throw publishError
    },
    onSuccess: (_, settingsKey) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-settings'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-settings-revisions', settingsKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-settings-revisions', settingsKey, 'latest-draft'] })
    },
  })
}

export function useRestoreSiteSettingsRevision() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ settingsKey, revisionId }: { settingsKey: string; revisionId: string }) => {
      const { user } = await requireAdminPermissions(['content.manage', 'seo.manage'])

      const { data: revision, error } = await supabase
        .from('site_settings_revisions')
        .select('*')
        .eq('id', revisionId)
        .single()
      if (error) throw error

      const { data: existingDraft, error: existingDraftError } = await supabase
        .from('site_settings_revisions')
        .select('id')
        .eq('settings_key', settingsKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (existingDraftError) throw existingDraftError

      if (existingDraft?.id) {
        const { error: updateError } = await supabase
          .from('site_settings_revisions')
          .update({ settings_json: revision.settings_json })
          .eq('id', existingDraft.id)
        if (updateError) throw updateError
        return
      }

      const versionNumber = await getNextRevisionVersion('site_settings_revisions', { settings_key: settingsKey })
      const { error: insertError } = await supabase
        .from('site_settings_revisions')
        .insert({
          settings_key: settingsKey,
          version_number: versionNumber,
          revision_state: 'draft',
          settings_json: revision.settings_json,
          created_by: user.id,
        })
      if (insertError) throw insertError
    },
    onSuccess: (_, { settingsKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-settings-revisions', settingsKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-settings-revisions', settingsKey, 'latest-draft'] })
    },
  })
}

export function useMediaAssets() {
  return useQuery({
    queryKey: ['admin', 'media-assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useFaqItems() {
  return useQuery({
    queryKey: ['admin', 'faq-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .order('faq_group', { ascending: true })
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSaveFaqItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: FaqItemInput) => {
      const { user } = await requireAdminPermission('content.manage')

      const row = {
        ...input,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('faq_items')
        .upsert(row, { onConflict: 'id' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'faq-items'] })
    },
  })
}

export function useDeleteFaqItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await requireAdminPermission('content.manage')
      const { error } = await supabase.from('faq_items').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'faq-items'] })
    },
  })
}

export function useSaveMediaAsset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: MediaAssetInput) => {
      const { user } = await requireAdminPermission('content.manage')

      const row = {
        ...input,
        title: input.title || null,
        alt_text: input.alt_text || null,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('media_assets')
        .upsert(row, { onConflict: 'asset_key' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media-assets'] })
    },
  })
}

export function useDeleteMediaAsset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await requireAdminPermission('content.manage')
      const { error } = await supabase.from('media_assets').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media-assets'] })
    },
  })
}

export function useSurfaceSeo(surfaceType: SeoSurfaceType, surfaceKey: string) {
  return useQuery({
    queryKey: ['admin', 'seo', surfaceType, surfaceKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('surface_type', surfaceType)
        .eq('surface_key', surfaceKey)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!surfaceKey,
  })
}

export function useSaveSurfaceSeo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      surfaceType,
      surfaceKey,
      values,
    }: {
      surfaceType: SeoSurfaceType
      surfaceKey: string
      values: {
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
    }) => {
      const { user } = await requireAdminPermission('seo.manage')

      const row = {
        surface_type: surfaceType,
        surface_key: surfaceKey,
        meta_title: values.meta_title || null,
        meta_description: values.meta_description || null,
        og_title: values.og_title || null,
        og_description: values.og_description || null,
        og_image_url: values.og_image_url || null,
        twitter_title: values.twitter_title || null,
        twitter_description: values.twitter_description || null,
        twitter_image_url: values.twitter_image_url || null,
        canonical_url: values.canonical_url || null,
        robots_index: values.robots_index,
        robots_follow: values.robots_follow,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('seo_metadata')
        .upsert(row, { onConflict: 'surface_type,surface_key' })
      if (error) throw error
    },
    onSuccess: (_, { surfaceType, surfaceKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'seo', surfaceType, surfaceKey] })
    },
  })
}

export function useEmailTemplates() {
  return useQuery({
    queryKey: ['admin', 'email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('template_kind', { ascending: true })
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSaveEmailTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: EmailTemplateInput) => {
      const { user } = await requireAdminPermission('notifications.manage')

      const row = {
        ...input,
        preview_text: input.preview_text || null,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('email_templates')
        .upsert(row, { onConflict: 'template_key' })
      if (error) throw error

      await createNotificationAuditEvent(user.id, 'email', input.id ? 'update_template' : 'create_template', 'email_template', input.id ?? input.template_key, {
        template_key: input.template_key,
        template_kind: input.template_kind,
        recipient_group: input.recipient_group,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'email-templates'] })
    },
  })
}

export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { user } = await requireAdminPermission('notifications.manage')
      const { error } = await supabase.from('email_templates').delete().eq('id', id)
      if (error) throw error
      await createNotificationAuditEvent(user.id, 'email', 'delete_template', 'email_template', id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'email-templates'] })
    },
  })
}

export function useEmailDeliveryJobs() {
  return useQuery({
    queryKey: ['admin', 'email-delivery-jobs'],
    queryFn: async (): Promise<EmailDeliveryJobRecord[]> => {
      const { data, error } = await supabase
        .from('email_delivery_jobs')
        .select('*')
        .order('triggered_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useNotificationAudiencePreview(input: NotificationAudiencePreviewInput) {
  return useQuery({
    queryKey: ['admin', 'notification-audience-preview', input.channel, input.recipientGroup, input.filters ?? {}],
    queryFn: async () => previewNotificationAudienceCount(input),
    enabled: !!input.recipientGroup,
    staleTime: 15 * 1000,
  })
}

export function useNotificationAuditEvents(channel?: NotificationAuditEventRecord['channel']) {
  return useQuery({
    queryKey: ['admin', 'notification-audit-events', channel ?? 'all'],
    queryFn: async (): Promise<NotificationAuditEventRecord[]> => {
      let query = supabase
        .from('notification_audit_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25)
      if (channel) query = query.eq('channel', channel)
      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as NotificationAuditEventRecord[]
    },
  })
}

export function usePushNotificationCampaigns() {
  return useQuery({
    queryKey: ['admin', 'push-notification-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('push_notification_campaigns')
        .select('*')
        .order('campaign_kind', { ascending: true })
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSavePushNotificationCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: PushNotificationCampaignInput) => {
      const { user } = await requireAdminPermission('notifications.manage')

      const row = {
        ...input,
        route: input.route || null,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('push_notification_campaigns')
        .upsert(row, { onConflict: 'campaign_key' })
      if (error) throw error

      await createNotificationAuditEvent(user.id, 'push', input.id ? 'update_campaign' : 'create_campaign', 'push_campaign', input.id ?? input.campaign_key, {
        campaign_key: input.campaign_key,
        campaign_kind: input.campaign_kind,
        recipient_group: input.recipient_group,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'push-notification-campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications-summary'] })
    },
  })
}

export function useDeletePushNotificationCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { user } = await requireAdminPermission('notifications.manage')
      const { error } = await supabase.from('push_notification_campaigns').delete().eq('id', id)
      if (error) throw error
      await createNotificationAuditEvent(user.id, 'push', 'delete_campaign', 'push_campaign', id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'push-notification-campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications-summary'] })
    },
  })
}

export function usePushDeliveryJobs() {
  return useQuery({
    queryKey: ['admin', 'push-delivery-jobs'],
    queryFn: async (): Promise<PushDeliveryJobRecord[]> => {
      const { data, error } = await supabase
        .from('push_delivery_jobs')
        .select('*')
        .order('triggered_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSendPushCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      campaignId?: string
      campaignKey: string
      title: string
      recipientGroup: string
      messageTitle: string
      messageBody: string
      route: string
      audienceFilters?: NotificationAudienceFilters
      scheduledFor?: string | null
    }) => {
      const { user } = await requireAdminPermission('notifications.manage')
      const isScheduled = Boolean(input.scheduledFor && new Date(input.scheduledFor).getTime() > Date.now())

      const { data: job, error: jobError } = await supabase
        .from('push_delivery_jobs')
        .insert({
          campaign_id: input.campaignId ?? null,
          campaign_key: input.campaignKey,
          title: input.title,
          recipient_group: input.recipientGroup,
          message_title: input.messageTitle,
          message_body: input.messageBody,
          route: input.route || null,
          delivery_status: 'queued',
          audience_filters: input.audienceFilters ?? {},
          scheduled_for: input.scheduledFor ?? null,
          triggered_by: user.id,
        })
        .select('*')
        .single()
      if (jobError) throw jobError

      if (!isScheduled) {
        const { error: invokeError } = await supabase.functions.invoke('send-push-notification', {
          body: { event: 'admin_campaign', delivery_job_id: job.id },
        })
        if (invokeError) throw invokeError
      }

      await createNotificationAuditEvent(user.id, 'push', isScheduled ? 'schedule_campaign' : 'send_campaign', 'push_delivery_job', job.id, {
        recipient_group: input.recipientGroup,
        scheduled_for: input.scheduledFor ?? null,
        audience_filters: input.audienceFilters ?? {},
      })

      return job
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'push-delivery-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'notification-audit-events'] })
    },
  })
}

export function useSendEmailCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      templateId?: string
      templateKey: string
      title: string
      recipientGroup: string
      subject: string
      previewText: string
      body: string
      audienceFilters?: NotificationAudienceFilters
      scheduledFor?: string | null
    }) => {
      const { user } = await requireAdminPermission('notifications.manage')
      const isScheduled = Boolean(input.scheduledFor && new Date(input.scheduledFor).getTime() > Date.now())

      const { data: job, error: jobError } = await supabase
        .from('email_delivery_jobs')
        .insert({
          template_id: input.templateId ?? null,
          template_key: input.templateKey,
          title: input.title,
          recipient_group: input.recipientGroup,
          subject: input.subject,
          preview_text: input.previewText || null,
          body: input.body,
          delivery_status: 'queued',
          audience_filters: input.audienceFilters ?? {},
          scheduled_for: input.scheduledFor ?? null,
          triggered_by: user.id,
        })
        .select('*')
        .single()
      if (jobError) throw jobError

      if (!isScheduled) {
        const { error: invokeError } = await supabase.functions.invoke('send-admin-email-campaign', {
          body: { delivery_job_id: job.id },
        })
        if (invokeError) throw invokeError
      }

      await createNotificationAuditEvent(user.id, 'email', isScheduled ? 'schedule_campaign' : 'send_campaign', 'email_delivery_job', job.id, {
        recipient_group: input.recipientGroup,
        scheduled_for: input.scheduledFor ?? null,
        audience_filters: input.audienceFilters ?? {},
      })

      return job
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'email-delivery-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'notification-audit-events'] })
    },
  })
}

export function useSendTestEmailCampaign() {
  return useMutation({
    mutationFn: async (input: { testEmail: string; subject: string; body: string }) => {
      const { user } = await requireAdminPermission('notifications.manage')
      const { error } = await supabase.functions.invoke('send-admin-email-campaign', {
        body: {
          test_email: input.testEmail,
          subject: input.subject,
          body: input.body,
        },
      })
      if (error) throw error
      await createNotificationAuditEvent(user.id, 'email', 'send_test', 'email_test', input.testEmail, {
        subject: input.subject,
      })
      return true
    },
  })
}

export function useSendTestPushCampaign() {
  return useMutation({
    mutationFn: async (input: { recipientEmail: string; title: string; body: string; route: string }) => {
      const { user } = await requireAdminPermission('notifications.manage')
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          event: 'admin_test',
          recipient_email: input.recipientEmail,
          title: input.title,
          body: input.body,
          route: input.route,
        },
      })
      if (error) throw error
      await createNotificationAuditEvent(user.id, 'push', 'send_test', 'push_test', input.recipientEmail, {
        route: input.route,
      })
      return true
    },
  })
}

export function useRunScheduledEmailJobs() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { user } = await requireAdminPermission('notifications.manage')
      const now = new Date().toISOString()
      const { data: jobs, error } = await supabase
        .from('email_delivery_jobs')
        .select('id')
        .eq('delivery_status', 'queued')
        .not('scheduled_for', 'is', null)
        .lte('scheduled_for', now)
      if (error) throw error
      let processed = 0
      for (const job of jobs ?? []) {
        const { error: invokeError } = await supabase.functions.invoke('send-admin-email-campaign', {
          body: { delivery_job_id: job.id },
        })
        if (!invokeError) processed += 1
      }
      await createNotificationAuditEvent(user.id, 'email', 'run_scheduled', 'email_delivery_jobs', null, { processed })
      return processed
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'email-delivery-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'notification-audit-events'] })
    },
  })
}

export function useRunScheduledPushJobs() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { user } = await requireAdminPermission('notifications.manage')
      const now = new Date().toISOString()
      const { data: jobs, error } = await supabase
        .from('push_delivery_jobs')
        .select('id')
        .eq('delivery_status', 'queued')
        .not('scheduled_for', 'is', null)
        .lte('scheduled_for', now)
      if (error) throw error
      let processed = 0
      for (const job of jobs ?? []) {
        const { error: invokeError } = await supabase.functions.invoke('send-push-notification', {
          body: { event: 'admin_campaign', delivery_job_id: job.id },
        })
        if (!invokeError) processed += 1
      }
      await createNotificationAuditEvent(user.id, 'push', 'run_scheduled', 'push_delivery_jobs', null, { processed })
      return processed
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'push-delivery-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'notification-audit-events'] })
    },
  })
}

export function useAnnouncements(placement?: AnnouncementInput['placement']) {
  return useQuery({
    queryKey: ['admin', 'announcements', placement ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('announcements')
        .select('*')
        .order('updated_at', { ascending: false })
      if (placement) {
        query = query.eq('placement', placement)
      }
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  })
}

export function useNotificationsSummary() {
  return useQuery({
    queryKey: ['admin', 'notifications-summary'],
    queryFn: async () => {
      const [
        { data: templates, error: templatesError },
        { data: announcements, error: announcementsError },
        { data: pushCampaigns, error: pushCampaignsError },
        { data: emailJobs, error: emailJobsError },
        { data: pushJobs, error: pushJobsError },
      ] =
        await Promise.all([
          supabase.from('email_templates').select('template_kind, active'),
          supabase.from('announcements').select('placement, active'),
          supabase.from('push_notification_campaigns').select('campaign_kind, active'),
          supabase.from('email_delivery_jobs').select('delivery_status'),
          supabase.from('push_delivery_jobs').select('delivery_status'),
        ])

      if (templatesError) throw templatesError
      if (announcementsError) throw announcementsError
      if (pushCampaignsError) throw pushCampaignsError
      if (emailJobsError) throw emailJobsError
      if (pushJobsError) throw pushJobsError

      const emailTemplates = (templates ?? []).filter((row) => row.template_kind === 'template')
      const campaignDrafts = (templates ?? []).filter((row) => row.template_kind === 'campaign_draft')
      const pushTemplates = (pushCampaigns ?? []).filter((row) => row.campaign_kind === 'template')
      const pushDrafts = (pushCampaigns ?? []).filter((row) => row.campaign_kind === 'campaign_draft')
      const activeAnnouncements = (announcements ?? []).filter((row) => row.active)
      const activeBannersAndModals = activeAnnouncements.filter(
        (row) => row.placement === 'banner' || row.placement === 'modal',
      )
      const failedEmailJobs = (emailJobs ?? []).filter((row) => row.delivery_status === 'failed')
      const failedPushJobs = (pushJobs ?? []).filter((row) => row.delivery_status === 'failed')

      return {
        emailTemplates: emailTemplates.length,
        activeEmailTemplates: emailTemplates.filter((row) => row.active).length,
        campaignDrafts: campaignDrafts.length,
        pushTemplates: pushTemplates.length,
        activePushTemplates: pushTemplates.filter((row) => row.active).length,
        pushDrafts: pushDrafts.length,
        failedEmailJobs: failedEmailJobs.length,
        failedPushJobs: failedPushJobs.length,
        activeAnnouncements: activeAnnouncements.length,
        activeBannersAndModals: activeBannersAndModals.length,
      }
    },
    staleTime: 30 * 1000,
  })
}

export function useSaveAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: AnnouncementInput) => {
      const { user } = await requireAdminPermission('notifications.manage')

      const row = {
        ...input,
        cta_label: input.cta_label || null,
        cta_href: input.cta_href || null,
        starts_at: input.starts_at || null,
        ends_at: input.ends_at || null,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('announcements')
        .upsert(row, { onConflict: 'id' })
      if (error) throw error
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements', input.placement] })
    },
  })
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await requireAdminPermission('notifications.manage')
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
    },
  })
}

export function useLatestAnnouncementDraft(announcementKey: string) {
  return useQuery({
    queryKey: ['admin', 'announcement-revisions', announcementKey, 'latest-draft'],
    queryFn: async (): Promise<AnnouncementRevisionRecord | null> => {
      const { data, error } = await supabase
        .from('announcement_revisions')
        .select('*')
        .eq('announcement_key', announcementKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!announcementKey,
  })
}

export function useAnnouncementRevisions(announcementKey: string) {
  return useQuery({
    queryKey: ['admin', 'announcement-revisions', announcementKey],
    queryFn: async (): Promise<AnnouncementRevisionRecord[]> => {
      const { data, error } = await supabase
        .from('announcement_revisions')
        .select('*')
        .eq('announcement_key', announcementKey)
        .order('version_number', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    enabled: !!announcementKey,
  })
}

export function useSaveAnnouncementDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      announcementKey,
      announcementId,
      announcement,
    }: {
      announcementKey: string
      announcementId?: string | null
      announcement: AnnouncementInput
    }) => {
      const { user } = await requireAdminPermission('notifications.manage')

      const { data: existingDraft, error: draftError } = await supabase
        .from('announcement_revisions')
        .select('id')
        .eq('announcement_key', announcementKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (draftError) throw draftError

      if (existingDraft?.id) {
        const { error } = await supabase
          .from('announcement_revisions')
          .update({
            announcement_id: announcementId ?? null,
            announcement_json: announcement,
          })
          .eq('id', existingDraft.id)
        if (error) throw error
        return existingDraft.id
      }

      const versionNumber = await getNextRevisionVersion('announcement_revisions', { announcement_key: announcementKey })
      const { data, error } = await supabase
        .from('announcement_revisions')
        .insert({
          announcement_key: announcementKey,
          announcement_id: announcementId ?? null,
          version_number: versionNumber,
          revision_state: 'draft',
          announcement_json: announcement,
          created_by: user.id,
        })
        .select('id')
        .single()
      if (error) throw error
      return data.id
    },
    onSuccess: (_, { announcementKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcement-revisions', announcementKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcement-revisions', announcementKey, 'latest-draft'] })
    },
  })
}

export function usePublishAnnouncementDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (announcementKey: string) => {
      const { user } = await requireAdminPermission('notifications.manage')

      const { data: draft, error: draftError } = await supabase
        .from('announcement_revisions')
        .select('*')
        .eq('announcement_key', announcementKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (draftError) throw draftError
      if (!draft) throw new Error('No announcement draft exists')

      const announcement = draft.announcement_json as AnnouncementInput
      const row = {
        id: draft.announcement_id ?? announcement.id ?? undefined,
        audience: announcement.audience,
        placement: announcement.placement,
        title: announcement.title,
        body: announcement.body,
        cta_label: announcement.cta_label || null,
        cta_href: announcement.cta_href || null,
        starts_at: announcement.starts_at || null,
        ends_at: announcement.ends_at || null,
        active: announcement.active,
        updated_by: user.id,
      }

      const { data, error: upsertError } = await supabase
        .from('announcements')
        .upsert(row, { onConflict: 'id' })
        .select('id')
        .single()
      if (upsertError) throw upsertError

      const { error: publishError } = await supabase
        .from('announcement_revisions')
        .update({
          announcement_id: data.id,
          revision_state: 'published',
          published_at: new Date().toISOString(),
          published_by: user.id,
        })
        .eq('id', draft.id)
      if (publishError) throw publishError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications-summary'] })
    },
  })
}

export function useRestoreAnnouncementRevision() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ announcementKey, revisionId }: { announcementKey: string; revisionId: string }) => {
      const { user } = await requireAdminPermission('notifications.manage')

      const { data: revision, error } = await supabase
        .from('announcement_revisions')
        .select('*')
        .eq('id', revisionId)
        .single()
      if (error) throw error

      const { data: existingDraft, error: existingDraftError } = await supabase
        .from('announcement_revisions')
        .select('id')
        .eq('announcement_key', announcementKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (existingDraftError) throw existingDraftError

      if (existingDraft?.id) {
        const { error: updateError } = await supabase
          .from('announcement_revisions')
          .update({
            announcement_id: revision.announcement_id,
            announcement_json: revision.announcement_json,
          })
          .eq('id', existingDraft.id)
        if (updateError) throw updateError
        return
      }

      const versionNumber = await getNextRevisionVersion('announcement_revisions', { announcement_key: announcementKey })
      const { error: insertError } = await supabase
        .from('announcement_revisions')
        .insert({
          announcement_key: announcementKey,
          announcement_id: revision.announcement_id,
          version_number: versionNumber,
          revision_state: 'draft',
          announcement_json: revision.announcement_json,
          created_by: user.id,
        })
      if (insertError) throw insertError
    },
    onSuccess: (_, { announcementKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcement-revisions', announcementKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcement-revisions', announcementKey, 'latest-draft'] })
    },
  })
}

export function useAppContentEntries(platform?: AppContentInput['platform'], screenKey?: string) {
  return useQuery({
    queryKey: ['admin', 'app-content', platform ?? 'all', screenKey ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('app_content')
        .select('*')
        .order('platform', { ascending: true })
        .order('screen_key', { ascending: true })
        .order('section_key', { ascending: true })
        .order('field_key', { ascending: true })

      if (platform) query = query.eq('platform', platform)
      if (screenKey) query = query.eq('screen_key', screenKey)

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSaveAppContentEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: AppContentInput) => {
      const { user } = await requireAdminPermission('content.manage')

      const row = {
        ...input,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('app_content')
        .upsert(row, { onConflict: 'platform,screen_key,section_key,field_key' })

      if (error) throw error
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content', input.platform] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content', input.platform, input.screen_key] })
    },
  })
}

export function useLatestAppContentScreenDraft(platform: AppContentInput['platform'], screenKey: string) {
  return useQuery({
    queryKey: ['admin', 'app-content-screen-revisions', platform, screenKey, 'latest-draft'],
    queryFn: async (): Promise<AppContentScreenRevisionRecord | null> => {
      const { data, error } = await supabase
        .from('app_content_screen_revisions')
        .select('*')
        .eq('platform', platform)
        .eq('screen_key', screenKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!platform && !!screenKey,
  })
}

export function useAppContentScreenRevisions(platform: AppContentInput['platform'], screenKey: string) {
  return useQuery({
    queryKey: ['admin', 'app-content-screen-revisions', platform, screenKey],
    queryFn: async (): Promise<AppContentScreenRevisionRecord[]> => {
      const { data, error } = await supabase
        .from('app_content_screen_revisions')
        .select('*')
        .eq('platform', platform)
        .eq('screen_key', screenKey)
        .order('version_number', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    enabled: !!platform && !!screenKey,
  })
}

export function useSaveAppContentScreenDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      platform,
      screenKey,
      content,
    }: {
      platform: AppContentInput['platform']
      screenKey: string
      content: Record<string, string>
    }) => {
      const { user } = await requireAdminPermission('content.manage')

      const { data: existingDraft, error: draftError } = await supabase
        .from('app_content_screen_revisions')
        .select('id')
        .eq('platform', platform)
        .eq('screen_key', screenKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (draftError) throw draftError

      if (existingDraft?.id) {
        const { error } = await supabase
          .from('app_content_screen_revisions')
          .update({ content_json: content })
          .eq('id', existingDraft.id)
        if (error) throw error
        return existingDraft.id
      }

      const versionNumber = await getNextRevisionVersion('app_content_screen_revisions', { platform, screen_key: screenKey })
      const { data, error } = await supabase
        .from('app_content_screen_revisions')
        .insert({
          platform,
          screen_key: screenKey,
          version_number: versionNumber,
          revision_state: 'draft',
          content_json: content,
          created_by: user.id,
        })
        .select('id')
        .single()
      if (error) throw error
      return data.id
    },
    onSuccess: (_, { platform, screenKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content-screen-revisions', platform, screenKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content-screen-revisions', platform, screenKey, 'latest-draft'] })
    },
  })
}

export function usePublishAppContentScreenDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      platform,
      screenKey,
    }: {
      platform: AppContentInput['platform']
      screenKey: string
    }) => {
      const { user } = await requireAdminPermission('content.manage')

      const { data: draft, error: draftError } = await supabase
        .from('app_content_screen_revisions')
        .select('*')
        .eq('platform', platform)
        .eq('screen_key', screenKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (draftError) throw draftError
      if (!draft) throw new Error('No draft exists for this app content screen')

      const content = draft.content_json as Record<string, string>
      const { data: existingRows, error: existingError } = await supabase
        .from('app_content')
        .select('section_key, field_key')
        .eq('platform', platform)
        .eq('screen_key', screenKey)
      if (existingError) throw existingError

      const existingKeys = new Set((existingRows ?? []).map((row) => `${row.section_key}.${row.field_key}`))
      const nextKeys = new Set(Object.keys(content))

      const rows = Object.entries(content).map(([key, value]) => {
        const [section_key, field_key] = key.split('.')
        return {
          platform,
          screen_key: screenKey,
          section_key,
          field_key,
          value,
          status: 'published' as const,
          updated_by: user.id,
        }
      })

      if (rows.length > 0) {
        const { error } = await supabase
          .from('app_content')
          .upsert(rows, { onConflict: 'platform,screen_key,section_key,field_key' })
        if (error) throw error
      }

      for (const compositeKey of existingKeys) {
        if (nextKeys.has(compositeKey)) continue
        const [section_key, field_key] = compositeKey.split('.')
        const { error } = await supabase
          .from('app_content')
          .delete()
          .eq('platform', platform)
          .eq('screen_key', screenKey)
          .eq('section_key', section_key)
          .eq('field_key', field_key)
        if (error) throw error
      }

      const { error: publishError } = await supabase
        .from('app_content_screen_revisions')
        .update({
          revision_state: 'published',
          published_at: new Date().toISOString(),
          published_by: user.id,
        })
        .eq('id', draft.id)
      if (publishError) throw publishError
    },
    onSuccess: (_, { platform, screenKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content', platform] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content', platform, screenKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content-screen-revisions', platform, screenKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content-screen-revisions', platform, screenKey, 'latest-draft'] })
    },
  })
}

export function useRestoreAppContentScreenRevision() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      platform,
      screenKey,
      revisionId,
    }: {
      platform: AppContentInput['platform']
      screenKey: string
      revisionId: string
    }) => {
      const { user } = await requireAdminPermission('content.manage')

      const { data: revision, error } = await supabase
        .from('app_content_screen_revisions')
        .select('*')
        .eq('id', revisionId)
        .single()
      if (error) throw error

      const { data: existingDraft, error: existingDraftError } = await supabase
        .from('app_content_screen_revisions')
        .select('id')
        .eq('platform', platform)
        .eq('screen_key', screenKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (existingDraftError) throw existingDraftError

      if (existingDraft?.id) {
        const { error: updateError } = await supabase
          .from('app_content_screen_revisions')
          .update({ content_json: revision.content_json })
          .eq('id', existingDraft.id)
        if (updateError) throw updateError
        return
      }

      const versionNumber = await getNextRevisionVersion('app_content_screen_revisions', { platform, screen_key: screenKey })
      const { error: insertError } = await supabase
        .from('app_content_screen_revisions')
        .insert({
          platform,
          screen_key: screenKey,
          version_number: versionNumber,
          revision_state: 'draft',
          content_json: revision.content_json,
          created_by: user.id,
        })
      if (insertError) throw insertError
    },
    onSuccess: (_, { platform, screenKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content-screen-revisions', platform, screenKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content-screen-revisions', platform, screenKey, 'latest-draft'] })
    },
  })
}

export function useHelpArticles() {
  return useQuery({
    queryKey: ['admin', 'help-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('help_articles')
        .select('*')
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSaveHelpArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: HelpArticleInput) => {
      const { user } = await requireAdminPermission('content.manage')

      const row = {
        ...input,
        summary: input.summary || null,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('help_articles')
        .upsert(row, { onConflict: 'article_key' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'help-articles'] })
    },
  })
}

export function useDeleteHelpArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await requireAdminPermission('content.manage')
      const { error } = await supabase.from('help_articles').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'help-articles'] })
    },
  })
}

export function useLatestHelpArticleDraft(articleKey: string) {
  return useQuery({
    queryKey: ['admin', 'help-article-revisions', articleKey, 'latest-draft'],
    queryFn: async (): Promise<HelpArticleRevisionRecord | null> => {
      const { data, error } = await supabase
        .from('help_article_revisions')
        .select('*')
        .eq('article_key', articleKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!articleKey,
  })
}

export function useHelpArticleRevisions(articleKey: string) {
  return useQuery({
    queryKey: ['admin', 'help-article-revisions', articleKey],
    queryFn: async (): Promise<HelpArticleRevisionRecord[]> => {
      const { data, error } = await supabase
        .from('help_article_revisions')
        .select('*')
        .eq('article_key', articleKey)
        .order('version_number', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    enabled: !!articleKey,
  })
}

export function useSaveHelpArticleDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: HelpArticleInput) => {
      const { user } = await requireAdminPermission('content.manage')

      const articleKey = input.article_key.trim()
      const payload = {
        ...input,
        summary: input.summary || null,
      }

      const { data: existingDraft, error: draftError } = await supabase
        .from('help_article_revisions')
        .select('id')
        .eq('article_key', articleKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (draftError) throw draftError

      if (existingDraft?.id) {
        const { error } = await supabase
          .from('help_article_revisions')
          .update({ article_json: payload })
          .eq('id', existingDraft.id)
        if (error) throw error
        return existingDraft.id
      }

      const versionNumber = await getNextRevisionVersion('help_article_revisions', { article_key: articleKey })
      const { data, error } = await supabase
        .from('help_article_revisions')
        .insert({
          article_key: articleKey,
          version_number: versionNumber,
          revision_state: 'draft',
          article_json: payload,
          created_by: user.id,
        })
        .select('id')
        .single()
      if (error) throw error
      return data.id
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'help-article-revisions', input.article_key] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'help-article-revisions', input.article_key, 'latest-draft'] })
    },
  })
}

export function usePublishHelpArticleDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (articleKey: string) => {
      const { user } = await requireAdminPermission('content.manage')

      const { data: draft, error: draftError } = await supabase
        .from('help_article_revisions')
        .select('*')
        .eq('article_key', articleKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (draftError) throw draftError
      if (!draft) throw new Error('No draft exists for this help article')

      const article = draft.article_json as HelpArticleInput
      const row = {
        ...article,
        summary: article.summary || null,
        status: article.status === 'archived' ? 'archived' : 'published',
        updated_by: user.id,
      }
      const { error: articleError } = await supabase
        .from('help_articles')
        .upsert(row, { onConflict: 'article_key' })
      if (articleError) throw articleError

      const { error: publishError } = await supabase
        .from('help_article_revisions')
        .update({
          revision_state: 'published',
          published_at: new Date().toISOString(),
          published_by: user.id,
        })
        .eq('id', draft.id)
      if (publishError) throw publishError
    },
    onSuccess: (_, articleKey) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'help-articles'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'help-article-revisions', articleKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'help-article-revisions', articleKey, 'latest-draft'] })
    },
  })
}

export function useRestoreHelpArticleRevision() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ articleKey, revisionId }: { articleKey: string; revisionId: string }) => {
      const { user } = await requireAdminPermission('content.manage')

      const { data: revision, error } = await supabase
        .from('help_article_revisions')
        .select('*')
        .eq('id', revisionId)
        .single()
      if (error) throw error

      const { data: existingDraft, error: existingDraftError } = await supabase
        .from('help_article_revisions')
        .select('id')
        .eq('article_key', articleKey)
        .eq('revision_state', 'draft')
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (existingDraftError) throw existingDraftError

      if (existingDraft?.id) {
        const { error: updateError } = await supabase
          .from('help_article_revisions')
          .update({ article_json: revision.article_json })
          .eq('id', existingDraft.id)
        if (updateError) throw updateError
        return
      }

      const versionNumber = await getNextRevisionVersion('help_article_revisions', { article_key: articleKey })
      const { error: insertError } = await supabase
        .from('help_article_revisions')
        .insert({
          article_key: articleKey,
          version_number: versionNumber,
          revision_state: 'draft',
          article_json: revision.article_json,
          created_by: user.id,
        })
      if (insertError) throw insertError
    },
    onSuccess: (_, { articleKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'help-article-revisions', articleKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'help-article-revisions', articleKey, 'latest-draft'] })
    },
  })
}

export function useTaskCategories() {
  return useQuery({
    queryKey: ['admin', 'task-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id,name')
        .order('name', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useCategoryFormFields(categoryId?: string) {
  return useQuery({
    queryKey: ['admin', 'category-form-fields', categoryId ?? 'none'],
    queryFn: async () => {
      if (!categoryId) return []
      const { data, error } = await supabase
        .from('category_form_fields')
        .select('*')
        .eq('category_id', categoryId)
        .order('display_order', { ascending: true })
      if (error) throw error
      return data ?? []
    },
    enabled: !!categoryId,
  })
}

export function useSaveCategoryFormField() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CategoryFormFieldInput) => {
      await requireAdminPermission('tasks.manage')
      const row = {
        ...input,
        description: input.description || null,
        placeholder: input.placeholder || null,
        options: input.options,
        min_value: input.min_value,
        max_value: input.max_value,
        min_length: input.min_length,
        max_length: input.max_length,
        pattern: input.pattern || null,
        show_if: input.show_if,
        section: input.section || null,
      }

      const { error } = await supabase
        .from('category_form_fields')
        .upsert(row, { onConflict: 'id' })
      if (error) throw error
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'category-form-fields', input.category_id] })
    },
  })
}

export function useDeleteCategoryFormField() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, categoryId }: { id: string; categoryId: string }) => {
      await requireAdminPermission('tasks.manage')
      const { error } = await supabase.from('category_form_fields').delete().eq('id', id)
      if (error) throw error
      return categoryId
    },
    onSuccess: (categoryId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'category-form-fields', categoryId] })
    },
  })
}
