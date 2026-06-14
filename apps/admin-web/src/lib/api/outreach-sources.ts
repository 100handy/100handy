import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'
import type { Database, Json } from '@/lib/database.types'

type OutreachSourceRow = Database['public']['Tables']['outreach_sources']['Row']
type OutreachSourceInsert = Database['public']['Tables']['outreach_sources']['Insert']
type OutreachSourceUpdate = Database['public']['Tables']['outreach_sources']['Update']
type DiscoveryRunRow = Database['public']['Tables']['outreach_discovery_runs']['Row']

export type OutreachSource = OutreachSourceRow
export type OutreachCadence = OutreachSourceRow['schedule_cadence']
export type OutreachSourceType = OutreachSourceRow['source_type']
export type DiscoveryRun = DiscoveryRunRow

export const CADENCE_OPTIONS: OutreachCadence[] = ['off', 'hourly', 'every_6h', 'every_12h', 'daily', 'weekly']

const CADENCE_LABELS: Record<OutreachCadence, string> = {
  off: 'Manual only',
  hourly: 'Every hour',
  every_6h: 'Every 6 hours',
  every_12h: 'Every 12 hours',
  daily: 'Daily',
  weekly: 'Weekly',
}

export function cadenceLabel(cadence: OutreachCadence): string {
  return CADENCE_LABELS[cadence] ?? cadence
}

/** Slugifies a source name into a stable, lowercased source_key. */
export function buildSourceKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export interface SourcePreset {
  key: string
  label: string
  platform: string
  source_type: OutreachSourceType
  apify_actor_id: string
  apify_input: Json
  field_mapping: Json
  default_service_type: string
  /** Notes shown in the editor — e.g. confirm the actor id against your Apify account. */
  note?: string
}

/**
 * Ready-to-use source presets. Each fills in a sensible Apify actor id, input shape,
 * and field mapping (the tedious part). Actor ids are best-known defaults and remain
 * editable — confirm them against your Apify account before the first run.
 */
export const SOURCE_PRESETS: SourcePreset[] = [
  {
    key: 'reddit',
    label: 'Reddit — service requests (customers)',
    platform: 'Reddit',
    source_type: 'customer_finder',
    apify_actor_id: 'trudax/reddit-scraper-lite',
    apify_input: {
      searches: ['recommend a cleaner', 'need a handyman', 'looking for a plumber'],
      type: 'posts',
      sort: 'new',
      time: 'week',
      maxItems: 50,
    } as Json,
    field_mapping: { raw_text: 'body', profile_name: 'username', source_url: 'url', external_id: 'id', location: 'communityName' } as Json,
    default_service_type: 'Handyman',
  },
  {
    key: 'facebook_groups',
    label: 'Facebook Groups — posts (customers)',
    platform: 'Facebook Groups',
    source_type: 'customer_finder',
    apify_actor_id: 'apify/facebook-groups-scraper',
    apify_input: { groupUrls: [], maxPosts: 50 } as Json,
    field_mapping: { raw_text: 'text', profile_name: 'user.name', source_url: 'url', external_id: 'postId' } as Json,
    default_service_type: 'Cleaning',
    note: 'Add the group URLs you have permission to monitor. Higher ToS sensitivity — keep approval gate on.',
  },
  {
    key: 'nextdoor',
    label: 'Nextdoor — posts (customers)',
    platform: 'Nextdoor',
    source_type: 'customer_finder',
    apify_actor_id: 'apify/nextdoor-scraper',
    apify_input: { searchQueries: ['cleaner', 'handyman', 'gardener'], maxItems: 50 } as Json,
    field_mapping: { raw_text: 'body', profile_name: 'authorName', source_url: 'url', external_id: 'id', location: 'neighborhood' } as Json,
    default_service_type: 'Gardening',
    note: 'Confirm the actor id against your Apify account.',
  },
  {
    key: 'x',
    label: 'X / Twitter — service requests (customers)',
    platform: 'X',
    source_type: 'customer_finder',
    apify_actor_id: 'apidojo/tweet-scraper',
    apify_input: { searchTerms: ['recommend a cleaner', 'need a handyman', 'looking for a plumber'], maxItems: 50, sort: 'Latest' } as Json,
    field_mapping: { raw_text: 'text', profile_name: 'author.userName', source_url: 'url', external_id: 'id', location: 'author.location' } as Json,
    default_service_type: 'Handyman',
    note: 'X is ToS-sensitive — keep volumes modest and the approval gate on. Confirm the actor id against your Apify account.',
  },
  {
    key: 'google_maps',
    label: 'Google Maps — local trades (workers)',
    platform: 'Google Business',
    source_type: 'worker_finder',
    apify_actor_id: 'compass/crawler-google-places',
    apify_input: { searchStringsArray: ['handyman', 'plumber', 'electrician'], locationQuery: 'Liverpool, UK', maxCrawledPlacesPerSearch: 50 } as Json,
    field_mapping: { raw_text: 'title', business_name: 'title', source_url: 'url', location: 'address', external_id: 'placeId' } as Json,
    default_service_type: 'Handyman',
    note: 'Best worker source for the email auto-send path — listings often include a public email/phone.',
  },
  {
    key: 'checkatrade',
    label: 'Checkatrade — trade listings (workers)',
    platform: 'Checkatrade',
    source_type: 'worker_finder',
    apify_actor_id: 'apify/web-scraper',
    apify_input: { startUrls: [], maxItems: 50 } as Json,
    field_mapping: { raw_text: 'description', business_name: 'name', source_url: 'url', location: 'area', external_id: 'id' } as Json,
    default_service_type: 'Handyman',
    note: 'Point startUrls at Checkatrade category/search pages. Verify the scraper output keys.',
  },
  {
    key: 'yell',
    label: 'Yell — directory listings (workers)',
    platform: 'Yell',
    source_type: 'worker_finder',
    apify_actor_id: 'apify/web-scraper',
    apify_input: { startUrls: [], maxItems: 50 } as Json,
    field_mapping: { raw_text: 'description', business_name: 'businessName', source_url: 'url', location: 'location', external_id: 'id' } as Json,
    default_service_type: 'Handyman',
    note: 'Point startUrls at Yell category/search pages. Verify the scraper output keys.',
  },
  {
    key: 'mybuilder',
    label: 'MyBuilder — trade listings (workers)',
    platform: 'MyBuilder',
    source_type: 'worker_finder',
    apify_actor_id: 'apify/web-scraper',
    apify_input: { startUrls: [], maxItems: 50 } as Json,
    field_mapping: { raw_text: 'description', business_name: 'name', source_url: 'url', location: 'area', external_id: 'id' } as Json,
    default_service_type: 'Handyman',
    note: 'Point startUrls at MyBuilder trade/search pages. Verify the scraper output keys.',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn — local providers (workers)',
    platform: 'LinkedIn',
    source_type: 'worker_finder',
    apify_actor_id: 'apify/linkedin-company-scraper',
    apify_input: { searchQueries: ['handyman services', 'cleaning services'], maxItems: 25 } as Json,
    field_mapping: { raw_text: 'description', business_name: 'name', profile_name: 'name', source_url: 'url', location: 'location', external_id: 'id' } as Json,
    default_service_type: 'Handyman',
    note: 'LinkedIn is ToS-sensitive — keep volumes low and the approval gate on.',
  },
]

/** Backwards-compatible alias for the Reddit preset. */
export const REDDIT_PRESET = SOURCE_PRESETS[0]

export interface OutreachSourceFormInput {
  name: string
  platform: string
  source_type: OutreachSourceType
  apify_actor_id: string
  apify_input: Json
  field_mapping: Json
  default_service_type: string | null
  location: string | null
  max_items: number
  schedule_cadence: OutreachCadence
  schedule_enabled: boolean
  active: boolean
  notes: string | null
}

export function useOutreachSources() {
  return useQuery({
    queryKey: ['outreach', 'sources'],
    queryFn: async (): Promise<OutreachSource[]> => {
      await requireAdminPermission('outreach.manage')
      const { data, error } = await supabase
        .from('outreach_sources')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    staleTime: 20 * 1000,
  })
}

export function useDiscoveryRuns(sourceId?: string) {
  return useQuery({
    queryKey: ['outreach', 'runs', sourceId ?? 'all'],
    queryFn: async (): Promise<DiscoveryRun[]> => {
      await requireAdminPermission('outreach.manage')
      let query = supabase
        .from('outreach_discovery_runs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (sourceId) query = query.eq('source_id', sourceId)
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    staleTime: 10 * 1000,
  })
}

export function useCreateOutreachSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: OutreachSourceFormInput) => {
      const { user } = await requireAdminPermission('outreach.manage')
      const payload: OutreachSourceInsert = {
        source_key: buildSourceKey(input.name) || `source-${Date.now()}`,
        name: input.name.trim(),
        platform: input.platform.trim(),
        source_type: input.source_type,
        apify_actor_id: input.apify_actor_id.trim() || null,
        apify_input: input.apify_input,
        field_mapping: input.field_mapping,
        default_service_type: input.default_service_type?.trim() || null,
        service_type: input.default_service_type?.trim() || null,
        location: input.location?.trim() || null,
        max_items: input.max_items,
        schedule_cadence: input.schedule_cadence,
        schedule_enabled: input.schedule_enabled,
        active: input.active,
        notes: input.notes?.trim() || null,
        created_by: user.id,
        updated_by: user.id,
      }
      const { data, error } = await supabase.from('outreach_sources').insert(payload).select('*').single()
      if (error) throw error

      await createAdminAuditLog({
        action: 'outreach.source.create',
        entityType: 'outreach_source',
        entityId: data.id,
        summary: `Created outreach source ${data.name}`,
        metadata: { platform: data.platform, sourceType: data.source_type, actor: data.apify_actor_id },
      })
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outreach'] }),
  })
}

export function useUpdateOutreachSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: OutreachSourceUpdate }) => {
      const { user } = await requireAdminPermission('outreach.manage')
      const { data, error } = await supabase
        .from('outreach_sources')
        .update({ ...updates, updated_by: user.id })
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error

      await createAdminAuditLog({
        action: 'outreach.source.update',
        entityType: 'outreach_source',
        entityId: data.id,
        summary: `Updated outreach source ${data.name}`,
        metadata: { updatedFields: Object.keys(updates), scheduleEnabled: data.schedule_enabled },
      })
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outreach'] }),
  })
}

export function useDeleteOutreachSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (source: Pick<OutreachSourceRow, 'id' | 'name'>) => {
      await requireAdminPermission('outreach.manage')
      const { error } = await supabase.from('outreach_sources').delete().eq('id', source.id)
      if (error) throw error

      await createAdminAuditLog({
        action: 'outreach.source.delete',
        entityType: 'outreach_source',
        entityId: source.id,
        summary: `Deleted outreach source ${source.name}`,
      })
      return source.id
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outreach'] }),
  })
}

export function useRunSourceNow() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (source: Pick<OutreachSourceRow, 'id' | 'name'>) => {
      await requireAdminPermission('outreach.manage')
      const { data, error } = await supabase.functions.invoke('outreach-discovery-trigger', {
        body: { source_id: source.id },
      })
      if (error) throw error

      await createAdminAuditLog({
        action: 'outreach.source.run',
        entityType: 'outreach_source',
        entityId: source.id,
        summary: `Triggered discovery run for ${source.name}`,
        metadata: { function: 'outreach-discovery-trigger' },
      })
      return data as { success: boolean; run: DiscoveryRun }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outreach'] }),
  })
}
