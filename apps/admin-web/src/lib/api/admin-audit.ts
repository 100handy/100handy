import { useQuery } from '@tanstack/react-query'
import { requireActiveAdmin, requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'
import type { Database, Json } from '@/lib/database.types'

type AdminAuditRow = Database['public']['Tables']['admin_audit_logs']['Row']

export interface AdminAuditLogEntry extends AdminAuditRow {
  actor_name: string
  actor_email?: string
}

export interface CreateAdminAuditLogInput {
  action: string
  entityType: string
  entityId?: string | null
  summary: string
  metadata?: Json
}

export interface AdminAuditLogFilters {
  entityType?: string
  actorId?: string
  action?: string
  section?: string
  search?: string
  limit?: number
}

export interface AdminTimelineSummary {
  recentChanges: number
  activeAdmins: number
  sectionsTouched: number
  latestRevisionBackups: number
  latestRolloutPresets: number
  bySection: Array<{ section: string; count: number }>
  byActor: Array<{ actorId: string; actorName: string; count: number }>
}

function getAuditSection(entityType: string) {
  if (['page', 'blog', 'help_article', 'faq', 'navigation', 'site_setting', 'announcement', 'app_content'].includes(entityType)) return 'content'
  if (['task', 'category', 'pricing_rule'].includes(entityType)) return 'tasks'
  if (['service_area', 'location_area', 'payment_method'].includes(entityType)) return 'operations'
  if (['user', 'admin', 'provider', 'provider_availability'].includes(entityType)) return 'accounts'
  if (['email_campaign', 'push_campaign', 'popup'].includes(entityType)) return 'notifications'
  if (['refund', 'payout', 'payment'].includes(entityType)) return 'finance'
  return 'other'
}

export async function createAdminAuditLog(input: CreateAdminAuditLogInput) {
  const { user, profile } = await requireActiveAdmin()

  const { error } = await supabase.from('admin_audit_logs').insert({
    actor_id: user.id,
    actor_admin_role: profile.admin_role,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    summary: input.summary,
    metadata_json: input.metadata ?? {},
  })

  if (error) {
    throw error
  }
}

export function useAdminAuditLogs(filters: AdminAuditLogFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', filters],
    queryFn: async (): Promise<AdminAuditLogEntry[]> => {
      await requireAdminPermission('audit.view')

      let query = supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.entityType) {
        query = query.eq('entity_type', filters.entityType)
      }

      if (filters.actorId) {
        query = query.eq('actor_id', filters.actorId)
      }

      if (filters.action) {
        query = query.eq('action', filters.action)
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query
      if (error) throw error

      const rows = data ?? []
      if (rows.length === 0) {
        return []
      }

      const actorIds = [...new Set(rows.map((row) => row.actor_id))]

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', actorIds)

      if (profileError) throw profileError

      const profileMap = new Map(
        (profiles ?? []).map((profile) => [
          profile.user_id,
          `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown Admin',
        ]),
      )

      const emailMap = new Map<string, string>()
      for (const actorId of actorIds) {
        try {
          const { data: authData } = await supabase.auth.admin.getUserById(actorId)
          if (authData?.user?.email) {
            emailMap.set(actorId, authData.user.email)
          }
        } catch {
          // Email is a non-critical enhancement for the audit stream.
        }
      }

      return rows
        .map((row) => ({
          ...row,
          actor_name: profileMap.get(row.actor_id) ?? 'Unknown Admin',
          actor_email: emailMap.get(row.actor_id),
        }))
        .filter((row) => {
          if (filters.section && getAuditSection(row.entity_type) !== filters.section) return false
          if (!filters.search) return true
          const searchValue = filters.search.toLowerCase()
          return (
            row.summary.toLowerCase().includes(searchValue) ||
            row.action.toLowerCase().includes(searchValue) ||
            row.entity_type.toLowerCase().includes(searchValue) ||
            row.actor_name.toLowerCase().includes(searchValue) ||
            row.actor_email?.toLowerCase().includes(searchValue) === true
          )
        })
    },
    staleTime: 30 * 1000,
  })
}

export function useAdminTimelineSummary() {
  return useQuery({
    queryKey: ['admin', 'timeline-summary'],
    queryFn: async (): Promise<AdminTimelineSummary> => {
      await requireAdminPermission('audit.view')

      const since = new Date()
      since.setDate(since.getDate() - 30)

      const { data: logs, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false })
        .limit(500)

      if (error) throw error

      const rows = logs ?? []
      const actorIds = [...new Set(rows.map((row) => row.actor_id))]

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', actorIds)

      if (profileError) throw profileError

      const nameMap = new Map(
        (profiles ?? []).map((profile) => [profile.user_id, `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown Admin']),
      )

      const sectionCounts = new Map<string, number>()
      const actorCounts = new Map<string, number>()
      for (const row of rows) {
        const section = getAuditSection(row.entity_type)
        sectionCounts.set(section, (sectionCounts.get(section) ?? 0) + 1)
        actorCounts.set(row.actor_id, (actorCounts.get(row.actor_id) ?? 0) + 1)
      }

      const [{ count: pageRevisions }, { count: blogRevisions }, { count: helpRevisions }, { count: appRevisions }, { count: rolloutPresets }] = await Promise.all([
        supabase.from('page_content_revisions').select('id', { count: 'exact', head: true }),
        supabase.from('blog_post_revisions').select('id', { count: 'exact', head: true }),
        supabase.from('help_article_revisions').select('id', { count: 'exact', head: true }),
        supabase.from('app_content_screen_revisions').select('id', { count: 'exact', head: true }),
        supabase.from('rollout_presets').select('id', { count: 'exact', head: true }),
      ])

      return {
        recentChanges: rows.length,
        activeAdmins: actorIds.length,
        sectionsTouched: sectionCounts.size,
        latestRevisionBackups: (pageRevisions ?? 0) + (blogRevisions ?? 0) + (helpRevisions ?? 0) + (appRevisions ?? 0),
        latestRolloutPresets: rolloutPresets ?? 0,
        bySection: [...sectionCounts.entries()].map(([section, count]) => ({ section, count })).sort((a, b) => b.count - a.count),
        byActor: [...actorCounts.entries()].map(([actorId, count]) => ({ actorId, actorName: nameMap.get(actorId) ?? 'Unknown Admin', count })).sort((a, b) => b.count - a.count).slice(0, 8),
      }
    },
    staleTime: 30 * 1000,
  })
}
