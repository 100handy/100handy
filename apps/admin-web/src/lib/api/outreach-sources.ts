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

/**
 * Reddit (customers) preset. Uses a Reddit scraper actor; the input searches the
 * service keywords and the mapping pulls the post body/title, author, and permalink.
 * Admins can tweak subreddits/searches in the editor.
 */
export const REDDIT_PRESET = {
  platform: 'Reddit',
  source_type: 'customer_finder' as OutreachSourceType,
  apify_actor_id: 'trudax/reddit-scraper-lite',
  apify_input: {
    searches: ['recommend a cleaner', 'need a handyman', 'looking for a plumber'],
    type: 'posts',
    sort: 'new',
    time: 'week',
    maxItems: 50,
  } as Json,
  field_mapping: {
    raw_text: 'body',
    profile_name: 'username',
    source_url: 'url',
    external_id: 'id',
    location: 'communityName',
  } as Json,
  default_service_type: 'Handyman',
}

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
